import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import config = require('config');

const {
  type,
  host,
  port,
  username,
  password,
  database,
  autoLoadEntities,
  synchronize,
} = config.get('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
  type,
  host: process.env.RDS_HOSTNAME || host,
  port: process.env.RDS_PORT || port,
  username: process.env.RDS_USERNAME || username,
  password: process.env.RDS_PASSWORD || password,
  database: process.env.RDS_DB_NAME || database,
  autoLoadEntities,
  synchronize: process.env.TYPEORM_SYNC || synchronize,
};
