import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Event } from '@prisma/client';
import {
  StorageProvider,
  StorageProviderClient,
} from 'src/storage/storage.provider';
import { StorageFactory } from '../../storage/storage.factory';
import { MediaCreateDto } from '../medias/media.dto';
import { MediasService } from '../medias/medias.service';
import { UsersService } from '../users/users.service';
import { EventAllData, EventCreateDto } from './events.dto';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  private storageProvider: StorageProvider<StorageProviderClient>;
  constructor(
    private usersService: UsersService,
    private eventsService: EventsService,
    private storageFactory: StorageFactory,
    private mediasService: MediasService,
  ) {
    this.storageProvider = this.storageFactory.getStorageService();
  }
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findById(@Param('id') id: string, @Query('short') short: string) {
    const isShortData = short === 'true';

    if (!isShortData) {
      const event: EventAllData = await this.eventsService.findById(id);
      event.cover = event.cover.startsWith('assets')
        ? await Promise.resolve(event.cover)
        : await this.storageProvider.getSignedUrl(event.cover);
      event.medias = await Promise.all(
        event.medias.map(async (m) => {
          m.url = await this.storageProvider.getSignedUrl(m.filename);
          return m;
        }),
      );
      return event;
    } else {
      const event = await this.eventsService.findNameById(id);
      return event;
    }
  }

  @Get(':id/medias')
  @UseGuards(AuthGuard('jwt'))
  findEventMedias(@Param('id') id: string) {
    return this.eventsService.findEventMedias(id);
  }

  @Get('')
  @UseGuards(AuthGuard('jwt'))
  async findByUserId(
    @Query('userId') userId: string,
    @Query('short') short: string,
  ) {
    if (!userId) {
      return Promise.resolve([] as Event[]);
    }
    const isShortData = short === 'true';
    const eventsObj = await this.usersService.findUserEvents(
      userId,
      isShortData,
    );
    if (!isShortData) {
      eventsObj.events = await Promise.all(
        eventsObj.events.map(async (event) => {
          event.cover = event.cover.startsWith('assets')
            ? await Promise.resolve(event.cover)
            : await this.storageProvider.getSignedUrl(event.cover);
          return event;
        }),
      );
    }
    return eventsObj.events;
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
    @Body() event: EventCreateDto,
  ) {
    const { name, description } = event;
    const start_date = new Date(+event.start_date);
    const end_date = new Date(+event.end_date);
    const users_ids = event.users_ids.split(',');
    const dateNow = Date.now();
    const cover = !!file
      ? `${dateNow}_${file.originalname}`
      : event.cover_default;

    const eventInput = {
      name,
      description,
      cover,
      start_date,
      end_date,
      users_ids,
    };
    const { id } = await this.eventsService.create(eventInput);

    if (!!file) {
      const event_id = id;
      const creator_id = users_ids[0];
      const data = await this.storageProvider.uploadFile(
        file,
        event_id,
        creator_id,
        dateNow.toString(),
      );
      const media: MediaCreateDto = {
        event_id,
        creator_id,
        filename: data.filename,
        etag: data.etag,
        is_cover: true,
      };
      await this.mediasService.create(media);
    }
    return { id };
  }

  @Post(':id/users-connections')
  @UseGuards(AuthGuard('jwt'))
  updateUsersConnections(
    @Body('usersIds') usersIds: string[],
    @Body('isConnection') isConnection: boolean,
    @Param('id') eventId,
  ) {
    // TODO : verify each id matches with a user id in database
    return this.eventsService.updateUsersConnectionsToEvent(
      eventId,
      usersIds,
      isConnection,
    );
  }
}
