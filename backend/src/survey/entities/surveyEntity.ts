import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { Question } from './questionEntity';

@Entity()
export class Survey {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @OneToMany(() => Question, (question) => question.survey, {
    cascade: true,
  })
  questions: Question[];

  @UpdateDateColumn()
  updatedAt: Date;
}

export { Question };
