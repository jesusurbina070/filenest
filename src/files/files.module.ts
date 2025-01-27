import { Module } from '@nestjs/common';
import { FilesController } from './controllers/files.controller';
import { FilesService } from './services/files.service';
import { DatabaseModule } from 'src/database/database.module';
import { filesProviders } from './providers/files.provider';
import { AwsS3Module } from 'src/aws-s3/aws-s3.module';

@Module({
  imports: [DatabaseModule, AwsS3Module],
  controllers: [FilesController],
  providers: [FilesService, ...filesProviders],
  exports: [FilesService],
})
export class FilesModule {}
