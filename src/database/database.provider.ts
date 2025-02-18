import { DataSource } from 'typeorm';
import { databaseConfig } from './database.config';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource(databaseConfig);
      return dataSource.initialize();
    },
  },
];
