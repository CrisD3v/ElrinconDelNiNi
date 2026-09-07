import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { UsersService } from './src/modules/users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  try {
    const user = await usersService.findOrCreate({ supabaseId: 'test-supa-id', email: 'test@example.com', displayName: 'Test User' });
    console.log('SUCCESS', user);
  } catch (e) {
    console.error('ERROR', e);
  }
  await app.close();
}
bootstrap();
