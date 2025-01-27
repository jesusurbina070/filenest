import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFileDto } from '../dto/create-file.dto';
import { UpdateFileDto } from '../dto/update-file.dto';
import { File } from '../entities/file.entity';
import { Repository } from 'typeorm';
import { AwsS3Service } from 'src/aws-s3/services/aws-s3.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class FilesService {
  constructor(
    @Inject('FILES_REPOSITORY')
    private fileRepository: Repository<File>,
    private awsS3Services: AwsS3Service,
  ) {}

  async create(file: CreateFileDto, fileData: any, user: CreateUserDto) {
    const key = `${Date.now()}-${fileData.originalname.split(' ').join('')}`;
    const downloadUrl = `http://localhost:3000/aws-s3/download/${key}`;
    const size = fileData?.size.toString();
    const contentType = fileData.mimetype;

    try {
      await this.awsS3Services.uploadFile(key, fileData.buffer, contentType);
      const viewUrl = await this.awsS3Services.getFileUrl(key);

      const url = {
        view: viewUrl,
        download: downloadUrl,
      };

      return await this.fileRepository.save({
        ...file,
        key,
        url,
        size,
        contentType,
        user,
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    return await this.fileRepository.find();
  }

  async findOne(id: string) {
    const file = await this.fileRepository.findOne({ where: { id } });
    if (!file) {
      throw new NotFoundException('This file does not exist');
    }
    return file;
  }

  async update(id: string, file: UpdateFileDto) {
    try {
      return await this.fileRepository.update({ id }, file);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string) {
    try {
      const { key } = await this.fileRepository.findOne({ where: { id } });
      await this.awsS3Services.delateFile(key);
      return await this.fileRepository.delete(id);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
