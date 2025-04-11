import { DataSource } from 'typeorm';
import * as process from 'process';

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: parseInt(process.env.DATABASE_PORT ?? '5432'),
  database: process.env.DATABASE_NAME ?? 'codex_db',
  username: process.env.DATABASE_USER ?? 'codex',
  password: process.env.DATABASE_PASSWORD ?? 'codex',
  migrationsRun: false,
  logging: 'all',
  useUTC: true,
  migrations: ['src/database/migrations/*.ts'],
});
