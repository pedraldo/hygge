import { Module } from '@nestjs/common';
import { MinioService } from './minio/minio.service';
import { StorageFactory } from './storage.factory';
import { StorjService } from './storj/storj.service';

@Module({
  providers: [MinioService, StorjService, StorageFactory],
  exports: [StorageFactory],
})
export class StorageModule {}
