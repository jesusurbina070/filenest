import { Module } from '@nestjs/common';
import { UnsplashService } from './services/unsplash.service';
import { UnsplashController } from './controllers/unsplash.controller';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [FilesModule],
  controllers: [UnsplashController],
  providers: [UnsplashService],
})
export class UnsplashModule {}
