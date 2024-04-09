import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageFactory } from 'src/storage/storage.factory';
import {
  StorageProvider,
  StorageProviderClient,
} from 'src/storage/storage.provider';
import { MediaCreateDto, MediaMetadata } from './media.dto';
import { MediasService } from './medias.service';

@Controller('medias')
export class MediasController {
  private storageProvider: StorageProvider<StorageProviderClient>;

  constructor(
    private mediasService: MediasService,
    private storageFactory: StorageFactory,
  ) {
    this.storageProvider = this.storageFactory.getStorageService();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('file', {
      // storage: diskStorage({
      //   destination: 'public/images',
      //   filename: (req, file, cb) => {
      //     const randomId = Date.now() + '__' + randomUUID();
      //     const split = file.originalname.split('.');
      //     const filename = split.reduce((acc, part, index) => {
      //       if (index === split.length - 1) {
      //         return acc + '__' + randomId + '.' + part;
      //       }
      //       return acc + part;
      //     }, '');
      //     cb(null, filename);
      //   },
      // }),
    }),
  )
  async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() MediaMetadata: MediaMetadata,
  ) {
    // const filename = await this.minioService.uploadFile(file);
    // const url = await this.minioService.getFileUrl(filename);
    // const media: MediaCreateDto = {
    //   ...MediaMetadata,
    //   filename,
    //   url,
    // };

    const { creator_id, event_id } = MediaMetadata;
    const data = await this.storageProvider.uploadFile(
      file,
      event_id,
      creator_id,
    );
    const media: MediaCreateDto = {
      ...MediaMetadata,
      filename: data.filename,
      etag: data.etag,
    };
    return this.mediasService.create(media);
  }
}
