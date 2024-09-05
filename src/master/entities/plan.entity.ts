import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Premium } from './premium.entity';
import { Benefit } from './benifit.entity';

@Entity()
export class Plan {
  @PrimaryGeneratedColumn()
  plan_id: number;

  @Column()
  plan_name: string;

  @OneToMany(() => Premium, premium => premium.plan)
  premiums: Premium[];

  @OneToMany(() => Benefit, benefit => benefit.plan)
  benefits: Benefit[];
}

