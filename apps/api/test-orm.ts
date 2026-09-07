import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { PrismaService } from './src/prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);
  const res = prisma.db.orm.public.Comment.where({});
  console.log('Methods:', Object.keys(res).concat(Object.getOwnPropertyNames(Object.getPrototypeOf(res))));
  const resArray = await prisma.db.orm.public.Comment.where({});
  console.log('Is Array?', Array.isArray(resArray));
  console.log('Await keys:', Object.keys(resArray).concat(Object.getOwnPropertyNames(Object.getPrototypeOf(resArray))));
  await app.close();
}
bootstrap();
