import { Module } from '@nestjs/common';
import { StorageModule } from 'src/storage/storage.module';
import { MediasController } from './medias.controller';
import { MediasService } from './medias.service';

@Module({
  imports: [StorageModule],
  controllers: [MediasController],
  providers: [MediasService],
})
export class MediasModule {}
