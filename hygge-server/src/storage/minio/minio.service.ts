import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { StorageProvider } from '../storage.provider';

@Injectable()
export class MinioService extends StorageProvider<Client> {
  constructor(private readonly configService: ConfigService) {
    super();
    this.client = new Client({
      endPoint: this.configService.get('MINIO_ENDPOINT'),
      port: Number(this.configService.get('MINIO_PORT')),
      useSSL: this.configService.get('MINIO_USE_SSL') === 'true',
      accessKey: this.configService.get('MINIO_ACCESS_KEY'),
      secretKey: this.configService.get('MINIO_SECRET_KEY'),
    });
    this.bucketName = this.configService.get('MINIO_BUCKET_NAME');
  }

  async createBucketIfNotExists() {
    const bucketExists = await this.client.bucketExists(this.bucketName);
    if (!bucketExists) {
      await this.client.makeBucket(this.bucketName, 'eu-west-1');
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    event_id: string,
    creator_id: string,
    namePrefix?: string,
  ) {
    await this.createBucketIfNotExists();
    const filename = `${namePrefix || Date.now()}_${file.originalname}`;
    const data = await this.client.putObject(
      this.bucketName,
      filename,
      file.buffer,
      file.size,
      {
        event_id,
        creator_id,
      },
    );
    return { filename, etag: data.etag };
  }

  getSignedUrl(fileName: string) {
    return this.client.presignedUrl('GET', this.bucketName, fileName);
  }

  async deleteFiles(filenames: string[]) {
    await this.client.removeObjects(this.bucketName, filenames);
    return true;
  }
}
