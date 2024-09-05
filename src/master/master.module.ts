/* import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterService } from './master.service';
import { MasterController } from './master.controller';
import { Plan } from './entities/plan.entity';
import { Premium } from './entities/premium.entity';
import { Benefit } from './entities/benifit.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Plan, Premium, Benefit])],
  providers: [MasterService],
  controllers: [MasterController],
})
export class MasterModule {} 
//
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterService } from './master.service';
import { Plan } from './entities/plan.entity';
import { Premium } from './entities/premium.entity';
import { Benefit } from './entities/benifit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Plan, Premium, Benefit])],
  providers: [MasterService],
  exports: [MasterService],
})
export class MasterModule {}*/
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterService } from './master.service'; 
import { MasterController } from './master.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [MasterController],
  providers: [MasterService],
})
export class MasterModule {}
//


