import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Survey } from './entities/surveyEntity';
import { Repository } from 'typeorm';

@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(Survey)
    private surveyRepository: Repository<Survey>,
  ) {}

  findAll(): Promise<Survey[]> {
    return this.surveyRepository.find({ relations: ['questions'] });
  }
  async findOne(id: string): Promise<Survey> {
    const survey = await this.surveyRepository.findOne({
      where: { id },
      relations: ['questions'],
    });
    if (!survey) {
      throw new Error(`Survey with id ${id} not found`);
    }
    return survey;
  }
  create(surveyData: Survey): Promise<Survey> {
    return this.surveyRepository.save(surveyData);
  }

  async submitAnswers(id: string, answers: Record<string, string | string[]>) {
    const survey = await this.findOne(id);

    for (const questionId in answers) {
      const question = survey.questions.find((q) => q.id === questionId);
      if (question) {
        if (!question.responses) {
          question.responses = [];
        }
        const response = answers[questionId];
        if (Array.isArray(response)) {
          question.responses.push(...response);
        } else {
          question.responses.push(response);
        }
      }
    }
    return this.surveyRepository.save(survey);
  }

  async getResults(id: string) {
    const survey = await this.findOne(id);

    return {
      title: survey.title,
      questions: survey.questions.map((question) => {
        const questionResults = {};
        let totalResponses = 0;

        question.responses?.forEach((response) => {
          if (Array.isArray(response)) {
            response.forEach((answer) => {
              questionResults[answer] = questionResults[answer || 0] + 1;
              totalResponses++;
            });
          } else {
            questionResults[response] = (questionResults[response] || 0) + 1;
            totalResponses++;
          }
        });
        return {
          id: question.id,
          question: question.question,
          results: questionResults,
          totalResponses,
        };
      }),
    };
  }
  async update(id: string, survey: Survey): Promise<void> {
    await this.surveyRepository.update(id, survey);
  }

  async remove(id: string): Promise<void> {
    await this.surveyRepository.delete(id);
  }
}
