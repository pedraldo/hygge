import { Module } from '@nestjs/common';
import { StorageModule } from 'src/storage/storage.module';
import { MediasService } from '../medias/medias.service';
import { UsersService } from '../users/users.service';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [StorageModule],
  controllers: [EventsController],
  providers: [EventsService, UsersService, MediasService],
})
export class EventsModule {}
