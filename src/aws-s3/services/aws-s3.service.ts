import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';

@Injectable()
export class AwsS3Service {
  private s3Client: S3Client;
  private readonly bucketName = process.env.BUCKET_NAME;
  constructor() {
    this.s3Client = new S3Client({
      region: 'us-east-2',
      credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID, // Tu Key
        secretAccessKey: process.env.SECRET_ACCESS_KEY, // Tu Secret
      },
    });
  }
  async uploadFile(
    key: string,
    fileBuffer: Buffer,
    contentType: string,
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType,
      });

      await this.s3Client.send(command);
      return `File uploaded successfully with key: ${key}`;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async downloadFile(key: string): Promise<Readable> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const response = await this.s3Client.send(command);

      if (!response.Body) {
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      }

      const stream = response.Body as Readable;
      return stream;
    } catch (err) {
      throw new HttpException(
        `Error downloading file: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getFileUrl(key: string) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      return await getSignedUrl(this.s3Client, command);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async delateFile(key: string) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      await this.s3Client.send(command);
      return `File deleted successfully with key: ${key}`;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
