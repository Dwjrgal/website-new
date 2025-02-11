import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Survey } from './entities/surveyEntity';
import { SurveyService } from './service';

@Controller('survey')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Get()
  findAll(): Promise<Survey[]> {
    return this.surveyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Survey> {
    return this.surveyService.findOne(id);
  }

  @Post(':id/submit')
  submitAnswers(
    @Param('id') id: string,
    @Body('answers') answers: Record<string, string | string[]>,
  ) {
    return this.surveyService.submitAnswers(id, answers);
  }

  @Get(':id/results')
  getResult(@Param('id') id: string) {
    return this.surveyService.getResults(id);
  }

  @Post()
  create(@Body() surveyData: Survey): Promise<Survey> {
    return this.surveyService.create(surveyData);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() survey: Survey): Promise<void> {
    return this.surveyService.update(id, survey);
  }
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.surveyService.remove(id);
  }
}
