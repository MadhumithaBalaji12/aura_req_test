import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { MasterService } from './master.service';

@Controller('master')
export class MasterController {
  constructor(private readonly masterService: MasterService) {}

  @Post('plan')
  async createPlan(@Body('plan_name') plan_name: string) {
    return await this.masterService.createPlan(plan_name);
  }

  @Get('plan')
  async getPlan(@Query('plan_id') plan_id?: number) {
    return await this.masterService.getPlan(plan_id);
  }

  @Get('plans')
  async getPlans(@Query('plan_id') plan_id?: number) {
    return await this.masterService.getPlans(plan_id);
  }

  @Put('plan/:id')
  async updatePlan(@Param('id') plan_id: number, @Body('plan_name') plan_name: string) {
    return await this.masterService.updatePlan(plan_id, plan_name);
  }

  @Delete('plan/:id')
  async deletePlan(@Param('id') plan_id: number) {
    return await this.masterService.deletePlan(plan_id);
  }

  @Get('premium')
  async getPremiumByPlanId(
    @Query('plan_id') plan_id: number,
    @Query('gender') gender: string,
    @Query('age') age: number,
  ) {
    return await this.masterService.getPremiumByPlanId(plan_id, gender, age);
  }

  @Get('benefits/:id')
  async getBenefitByPlanId(@Param('id') plan_id: number) {
    console.log("plan_id = ",plan_id)
    return await this.masterService.getBenefitByPlanId(plan_id);
  }
  //post
  async createQuote(
    @Body() request: { name: string; age: number; gender: string; maritalStatus: string }
  ) {
    const { name, age, gender, maritalStatus } = request;
    try {
      const plans = await this.masterService.getPlans();
      const response = await Promise.all(
        plans.map(async (plan: any) => {
          const premiums = await this.masterService.getPremiumByPlanId(plan.plan_id, gender, age);
          return {
            plan_id: plan.plan_id,
            plan_name: plan.plan_name,
            premium_cost: premiums && premiums.length > 0 ? premiums[0].premium : null,
          };
        })
      );
      return { name, age, gender, maritalStatus, availablePlans: response };
    } catch (error) {
      console.log('Error occurred', error);
      throw new Error('Unable to create quote.');
    }
  }
}

 
// src/master/master.controller.ts
/*
import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { MasterService } from './master.service';

@Controller('master')
export class MasterController {
  constructor(private readonly masterService: MasterService) {}

  @Post('plan')
  async createPlan(@Body('plan_name') plan_name: string) {
    return await this.masterService.createPlan(plan_name);
  }

  @Get('plan')
  async getPlan(@Query('plan_id') plan_id?: number) {
    return await this.masterService.getPlans(plan_id);
  }

  @Get('plans')
  async getPlans(@Query('plan_id') plan_id?: number) {
    return await this.masterService.getPlans(plan_id);
  }

  @Put('plan/:id')
  async updatePlan(@Param('id') plan_id: number, @Body('plan_name') plan_name: string) {
    return await this.masterService.updatePlan(plan_id, plan_name);
  }

  @Delete('plan/:id')
  async deletePlan(@Param('id') plan_id: number) {
    return await this.masterService.deletePlan(plan_id);
  }

  @Get('premium')
  async getPremiumByPlanId(
    @Query('plan_id') plan_id: number,
    @Query('gender') gender: string,
    @Query('age') age: number,
  ) {
    return await this.masterService.getPremiumByPlanId(plan_id, gender, age);
  }

  @Get('benefits')
  async getBenefitByPlanId(@Query('plan_id') plan_id: number) {
    return await this.masterService.getBenefitByPlanId(plan_id);
  }

  @Post('plan-details')
  async getPlanDetails(
    @Body('name') name: string,
    @Body('age') age: number,
    @Body('gender') gender: string,
    @Body('marital_status') marital_status: string
  ) {
    return await this.masterService.getPlanDetails(name, age, gender, marital_status);
  }
} */
//for post

