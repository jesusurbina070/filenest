import { DataSourceOptions } from 'typeorm';

export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: ['dist/database/migrations/*.js'], // Asegúrate de que estén en la carpeta correcta
  synchronize: process.env.NODE_ENV !== 'production', // Nunca en producción
  ssl: false,
};
