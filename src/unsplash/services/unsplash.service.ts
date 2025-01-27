import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FilesService } from 'src/files/services/files.service';
import axios from 'axios';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CreateFileDto } from 'src/files/dto/create-file.dto';

@Injectable()
export class UnsplashService {
  private unsplashApiUrl = process.env.UNSPLASH_API_URL;
  private unsplashApiKey = process.env.UNSPLASH_API_KEY;
  constructor(private filesService: FilesService) {}

  async getImageList() {
    try {
      const response = await axios.get(this.unsplashApiUrl, {
        headers: {
          Authorization: `Client-ID ${this.unsplashApiKey}`,
        },
      });

      const imageList = response.data?.map((img) => ({
        id: img.id,
        imageUrl: img.urls.full,
        thumbUrl: img.urls.thumb,
      }));

      return imageList;
    } catch (err) {
      console.error('Error fetching images from Unsplash:', err);
      throw new HttpException(
        'Error fetching images from Unsplash',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async uploadImage(imageUrl: string, fileName: string, user: CreateUserDto) {
    try {
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
      });

      if (response.status !== 200) {
        throw new HttpException(
          'No se pudo descargar la imagen',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (response.headers['content-type'] !== 'image/jpeg') {
        throw new HttpException(
          'La URL no contiene una imagen JPEG válida',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Validar tamaño de la imagen
      const fileSize = response.data.byteLength;
      if (fileSize > 5 * 1024 * 1024) {
        throw new HttpException(
          'La imagen es demasiado grande',
          HttpStatus.BAD_REQUEST,
        );
      }

      const fileData = {
        originalname: fileName,
        mimetype: response?.headers['content-type'],
        size: response?.data.byteLength,
        buffer: Buffer.from(response?.data),
      };

      const file = new CreateFileDto();
      file.name = fileName;

      await this.filesService.create(file, fileData, user);
    } catch (err) {
      console.error('Error al subir la imagen:', err.message);
      throw new HttpException(
        'Error procesando la imagen',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
