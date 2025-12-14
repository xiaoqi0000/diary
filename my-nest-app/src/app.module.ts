import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiaryModule } from './diary/diary.module';
import { DiariesModule } from './diaries/diaries.module';

@Module({
  imports: [DiaryModule, DiariesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
