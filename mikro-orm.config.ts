import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

const config: Options<PostgreSqlDriver> = {
  host: 'localhost',
  port: 5432,
  user: 'haitipay',
  password: 'admin',
  dbName: 'ewallet_db',
  entities: ['dist/entities'],     // Pour production (compilé)
  entitiesTs: ['src/entities'],    // Pour développement
  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
  },
  debug: true,
};
export default config;