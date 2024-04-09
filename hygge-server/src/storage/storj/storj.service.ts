import {
  DeleteObjectsCommand,
  GetObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageProvider } from '../storage.provider';

@Injectable()
export class StorjService extends StorageProvider<S3Client> {
  constructor(private readonly configService: ConfigService) {
    super();
    this.client = new S3Client({
      credentials: {
        accessKeyId: this.configService.get('STORJ_ACCESS_KEY'),
        secretAccessKey: this.configService.get('STORJ_SECRET_KEY'),
      },
      endpoint: this.configService.get('STORJ_ENDPOINT'),
      region: 'eu1',
    });
    this.bucketName = this.configService.get('STORJ_BUCKET_NAME');
  }

  async uploadFile(
    file: Express.Multer.File,
    event_id: string,
    creator_id: string,
    namePrefix?: string,
  ) {
    const filename = `${namePrefix || Date.now()}_${file.originalname}`;
    const data = await new Upload({
      client: this.client,
      params: {
        Bucket: this.bucketName,
        Key: filename,
        Body: file.buffer,
        Metadata: {
          creator_id,
          event_id,
        },
      },
    }).done();
    return { filename, etag: data.ETag };
  }

  getSignedUrl(filename: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: filename,
    });
    return getSignedUrl(this.client, command);
  }

  async deleteFiles(filenames: string[]) {
    const command = new DeleteObjectsCommand({
      Bucket: this.bucketName,
      Delete: {
        Objects: filenames.map((filename) => ({ Key: filename })),
      },
    });
    await this.client.send(command);
    return true;
  }
}
