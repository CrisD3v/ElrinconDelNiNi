import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '#modules/auth/index.js';
import { UsersModule } from '#modules/users/index.js';
import { SeriesModule } from '#modules/series/index.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, UsersModule, SeriesModule],
})
export class AppModule {}
