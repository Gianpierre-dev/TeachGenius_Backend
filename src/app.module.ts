import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TeachersModule } from './teachers/teachers.module';
import { ActivitiesModule } from './activities/activities.module';
import { QuestionsModule } from './questions/questions.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    TeachersModule,
    ActivitiesModule,
    QuestionsModule,
    GameModule,
  ],
})
export class AppModule {}
