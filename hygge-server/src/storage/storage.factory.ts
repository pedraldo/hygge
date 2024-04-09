import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MinioService } from './minio/minio.service';
import { StorageProvider, StorageProviderClient } from './storage.provider';
import { StorjService } from './storj/storj.service';

@Injectable()
export class StorageFactory {
  constructor(private readonly configService: ConfigService) {}

  getStorageService(): StorageProvider<StorageProviderClient> {
    if (
      this.configService.get('STORJ_ACCESS_KEY') &&
      this.configService.get('STORJ_SECRET_KEY') &&
      this.configService.get('STORJ_ENDPOINT') &&
      this.configService.get('STORJ_BUCKET_NAME')
    ) {
      return new StorjService(this.configService);
    } else {
      return new MinioService(this.configService);
    }
  }
}
