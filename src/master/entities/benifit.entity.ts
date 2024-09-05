import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Plan } from './plan.entity';

@Entity()
export class Benefit {
  @PrimaryGeneratedColumn()
  benefit_id: number;

  @Column()
  description: string;

  @ManyToOne(() => Plan, plan => plan.benefits)
  plan: Plan;
}
