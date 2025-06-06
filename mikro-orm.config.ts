import { defineConfig } from '@mikro-orm/postgresql';

export default defineConfig({
  host: 'localhost',
  port: 5432,
  user: 'haitipay',
  password: 'admin',
  dbName: 'e_wallet_db',
  entities: ['dist/**/**/**/*.entity.js'],
  entitiesTs: ['src/**/**/**/*.entity.ts'],
  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
  },
  debug: true,
});
