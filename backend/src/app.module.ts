import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Question, Survey } from './survey/entities/surveyEntity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyController } from './survey/controller';
import { SurveyService } from './survey/service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        console.log(
          'Connecting to Db:',
          configService.get<string>('DATABASE_URL'),
        );
        return {
          type: 'postgres',
          url: configService.get<string>('DATABASE_URL'),
          autoLoadEntities: true,
          synchronize: true,
          ssl: { rejectUnauthorized: false },
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Survey, Question]),
  ],
  controllers: [SurveyController],
  providers: [SurveyService],
})
export class AppModule {}
