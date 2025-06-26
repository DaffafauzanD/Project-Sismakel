import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { HealthController } from './modules/health/health.controller';

@Module({
  imports: [
    UsersModule, // ✅ tetap import modul lainnya di sini
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
