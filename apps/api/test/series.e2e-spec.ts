import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { HttpService } from '@nestjs/axios';
import { jest, describe, beforeAll, afterAll, it, expect } from '@jest/globals';
import { of } from 'rxjs';

describe('SeriesModule (e2e)', () => {
  let app: INestApplication;
  let httpService: HttpService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    httpService = moduleFixture.get<HttpService>(HttpService);
    await app.init();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it('/series (GET)', async () => {
    jest.spyOn(httpService, 'get').mockImplementationOnce(() => of({
      data: { data: [{
        id: '123',
        attributes: { title: { en: 'Manga e2e' }, availableTranslatedLanguages: ['es'] },
        relationships: []
      }], total: 1, limit: 10, offset: 0 },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: {} as any },
    } as any));

    jest.spyOn(httpService, 'get').mockImplementationOnce(() => of({
      data: { volumes: { "1": {} } },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: {} as any },
    } as any));

    const response = await request(app.getHttpServer())
      .get('/series')
      .expect(200);

    expect(response.body.series).toBeDefined();
    expect(response.body.series[0].title).toBe('Manga e2e');
  });

  it('/series/:id (GET)', async () => {
    jest.spyOn(httpService, 'get').mockImplementation(() => of({
      data: { data: {
        id: '123',
        attributes: { title: { en: 'Manga e2e detail' } },
        relationships: []
      } },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: {} as any },
    } as any));

    const response = await request(app.getHttpServer())
      .get('/series/123')
      .expect(200);

    expect(response.body.title).toBe('Manga e2e detail');
  });
});
