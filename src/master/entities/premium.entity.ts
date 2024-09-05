import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Plan } from './plan.entity';

@Entity()
export class Premium {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gender: string;

  @Column()
  from_age: number;

  @Column()
  to_age: number;

  @Column()
  premium: number;

  @ManyToOne(() => Plan, plan => plan.premiums)
  plan: Plan;
}
