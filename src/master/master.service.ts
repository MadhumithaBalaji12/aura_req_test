import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class MasterService 
{
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,){}
  //constructor(private readonly entityManager:EntityManager) {}

  // Create a new plan
  async createPlan(plan_name: string) {
    const result = await this.dataSource.query(
      `INSERT INTO plans (plan_name) VALUES (?)`,
      [plan_name],
    );
    return result;
  }

  // Get all plans or a specific plan by plan_id
  async getPlans(planId?: number) {
    if (planId) {
      return await this.dataSource.query(
        `SELECT * FROM plans WHERE plan_id = ?`,
        [planId],
      );
    }
    return await this.dataSource.query(`SELECT * FROM plans`);
  }

  // Get a single plan by plan_id
  async getPlan(planId: number) {
    return await this.dataSource.query(
      `SELECT * FROM plans WHERE plan_id = ?`,
      [planId],
    );
  }

  // Update a plan by plan_id
  async updatePlan(plan_id: number, plan_name: string) {
    const result = await this.dataSource.query(
      `UPDATE plans SET plan_name = ? WHERE plan_id = ?`,
      [plan_name, plan_id],
    );
    return result;
  }

  // Delete a plan by plan_id
  async deletePlan(plan_id: number) {
    const result = await this.dataSource.query(
      `DELETE FROM plans WHERE plan_id = ?`,
      [plan_id],
    );
    return result;
  }

  // Get premium by plan_id, gender, and age
  async getPremiumByPlanId(planId: number, gender: string, age: number) {
    return await this.dataSource.query(
      `SELECT * FROM premiums WHERE plan_id = ? AND gender = ? AND ? BETWEEN from_age AND to_age`,
      [planId, gender, age],
    );
  }

  // Get benefits by plan_id
  async getBenefitByPlanId(plan_id: number) {
    let queryResponse =  await this.dataSource.query(
      `SELECT * FROM benefits WHERE plan_id = ?`,
      [plan_id],
    );
    console.log(queryResponse);
    return queryResponse;
  }

  // Get plan details based on user input
  async getPlanDetails(name: string, age: number, gender: string, marital_status: string) {
    // Get the applicable plan based on age, gender, and marital status
    const plans = await this.dataSource.query(`
      SELECT p.plan_id, p.plan_name
      FROM plans p
      JOIN premiums pr ON p.plan_id = pr.plan_id
      WHERE pr.gender = ? AND ? BETWEEN pr.from_age AND pr.to_age
      AND pr.marital_status = ?
    `, [gender, age, marital_status]);

    // If no plans found, return an empty result
    if (plans.length === 0) {
      return { plan_id: null, premium: null, benefits: [] };
    }

    const plan_id = plans[0].plan_id;

    // Get the premium for the found plan
    const premium = await this.dataSource.query(`
      SELECT premium
      FROM premiums
      WHERE plan_id = ? AND gender = ? AND ? BETWEEN from_age AND to_age AND marital_status = ?
    `, [plan_id, gender, age, marital_status]);

    // Get benefits for the found plan
    const benefits = await this.dataSource.query(`
      SELECT description
      FROM benefits
      WHERE plan_id = ?
    `, [plan_id]);

    return {
      plan_id: plan_id,
      premium: premium[0] ? premium[0].premium : null,
      benefits: benefits.map(benefit => benefit.description),
    };

  }
  async createUser(userDetails: { name: string; age: number; gender: string; maritalStatus: string }): Promise<any> {
    try {
      const { name, age, gender, maritalStatus } = userDetails;
      const query = `
        INSERT INTO users (name, age, gender, marital_status)
        VALUES (?, ?, ?, ?)
      `;
      const result = await this.dataSource.query(query, [name, age, gender, maritalStatus]);
      return result;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Unable to create user.');
    }
  }
}


/* 
// src/master/master.service.ts

import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class MasterService {
  getPlanDetails(name: string, age: number, gender: string, marital_status: string) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  // Create a new plan
  async createPlan(plan_name: string) {
    const result = await this.dataSource.query(
      `INSERT INTO plans (plan_name) VALUES (?)`,
      [plan_name],
    );
    return result;
  }

  // Get all plans or a specific plan by plan_id
  async getPlans(planId?: number) {
    if (planId) {
      return await this.dataSource.query(
        `SELECT * FROM plans WHERE plan_id = ?`,
        [planId],
      );
    }
    return await this.dataSource.query(`SELECT * FROM plans`);
  }

  // Update a plan by plan_id
  async updatePlan(plan_id: number, plan_name: string) {
    const result = await this.dataSource.query(
      `UPDATE plans SET plan_name = ? WHERE plan_id = ?`,
      [plan_name, plan_id],
    );
    return result;
  }

  // Delete a plan by plan_id
  async deletePlan(plan_id: number) {
    const result = await this.dataSource.query(
      `DELETE FROM plans WHERE plan_id = ?`,
      [plan_id],
    );
    return result;
  }

  // Get premium by plan_id, gender, and age
  async getPremiumByPlanId(planId: number, gender: string, age: number) {
    return await this.dataSource.query(
      `SELECT * FROM premiums WHERE plan_id = ? AND gender = ? AND ? BETWEEN from_age AND to_age`,
      [planId, gender, age],
    );
  }

  // Get benefits by plan_id
  async getBenefitByPlanId(plan_id: number) {
    return await this.dataSource.query(
      `SELECT * FROM benefits WHERE plan_id = ?`,
      [plan_id],
    );
  }

  // Get plan details based on user input
  /*async getPlanDetails(name: string, age: number, gender: string, marital_status: string) {
    const premiumQuery = `
      SELECT pl.plan_id, pl.plan_name, pr.premium_cost
      FROM plans pl
      JOIN premium_lookup pr ON pl.plan_id = pr.plan_id
      WHERE pr.gender = ? AND pr.marital_status = ? AND ? BETWEEN pr.from_age AND pr.to_age
    `;
    
    const premiumResult = await this.dataSource.query(premiumQuery, [gender, marital_status, age]);

    if (premiumResult.length === 0) {
      return { message: 'No matching plan found for the provided details.' };
    }

    const { plan_id, plan_name, premium_cost } = premiumResult[0];

    const benefitsQuery = `
      SELECT header, benefit_value
      FROM benefits
      WHERE plan_id = ?
    `;
    
    const benefits = await this.dataSource.query(benefitsQuery, [plan_id]);

    return {
      plan_id,
      plan_name,
      premium_cost,
      benefits,
    };
  }
}

async getPlanDetails(name: string, age: number, gender: string, marital_status: string) {
  try {
    const premiumQuery = `
      SELECT pl.plan_id, pl.plan_name, pr.premium_cost
      FROM plans pl
      JOIN premium_lookup pr ON pl.plan_id = pr.plan_id
      WHERE pr.gender = ? AND pr.marital_status = ? AND ? BETWEEN pr.from_age AND pr.to_age
    `;

    const premiumResult = await this.dataSource.query(premiumQuery, [gender, marital_status, age]);

    if (premiumResult.length === 0) {
      return { message: 'No matching plan found for the provided details.' };
    }

    const { plan_id, plan_name, premium_cost } = premiumResult[0];

    const benefitsQuery = `
      SELECT header, benefit_value
      FROM benefits
      WHERE plan_id = ?
    `;

    const benefits = await this.dataSource.query(benefitsQuery, [plan_id]);

    return {
      plan_id,
      plan_name,
      premium_cost,
      benefits,
    };
  } catch (error) {
    console.error('Error fetching plan details:', error.message);
    throw new Error('Error fetching plan details');
  }
}
}
*/