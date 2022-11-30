import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SsiModule } from './ssi/ssi.module';

@Module({
  imports: [SsiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
