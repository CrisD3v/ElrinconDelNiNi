import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { SeriesController } from './series.controller.js';
import { SeriesService } from './series.service.js';

@Module({
  imports: [HttpModule, CacheModule.register()],
  controllers: [SeriesController],
  providers: [SeriesService],
  exports: [SeriesService],
})
export class SeriesModule {}
