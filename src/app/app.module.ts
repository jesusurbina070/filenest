import { Module } from '@nestjs/common';
import { AppService } from './services/app.service';
import { AppController } from './controllers/app.controller';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { AwsS3Module } from 'src/aws-s3/aws-s3.module';
import { FilesModule } from 'src/files/files.module';
import { UnsplashModule } from 'src/unsplash/unsplash.module';

@Module({
  imports: [UsersModule, AuthModule, FilesModule, AwsS3Module, UnsplashModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
