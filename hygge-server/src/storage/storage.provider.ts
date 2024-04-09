import { S3Client } from '@aws-sdk/client-s3';
import { Client } from 'minio';

type StorageProviderUploadResponse = {
  filename: string;
  etag: string;
};

export type StorageProviderClient = S3Client | Client;

export abstract class StorageProvider<StorageProviderClient> {
  protected client: StorageProviderClient;
  protected bucketName: string;

  abstract uploadFile(
    file: Express.Multer.File,
    event_id: string,
    creator_id: string,
    namePrefix?: string,
  ): Promise<StorageProviderUploadResponse>;

  abstract getSignedUrl(filename: string): Promise<string>;

  abstract deleteFiles(filenames: string[]): Promise<boolean>;
}
