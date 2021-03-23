import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { HttpErrorFilter } from './interceptors/http-error.interceptor';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), TasksModule, AuthModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
  ],
})
export class AppModule {}
