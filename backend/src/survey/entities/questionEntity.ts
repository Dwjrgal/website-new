import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { Survey } from './surveyEntity';

export enum QuestionType {
  TEXT = 'text',
  SINGLE = 'single',
  MULTIPLE = 'multiple',
}

@Entity()
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  question: string;

  @Column({
    type: 'enum',
    enum: QuestionType,
    default: QuestionType.TEXT,
  })
  type: QuestionType;

  @Column('jsonb', { nullable: true })
  options: string[];

  @ManyToOne(() => Survey, (survey) => survey.questions, {
    onDelete: 'CASCADE',
  })
  survey: Survey;

  @Column('simple-array', { nullable: true })
  responses: string[];

  @UpdateDateColumn()
  createdAt: Date;
}
