import { Component, OnInit } from '@angular/core';
import { Goal } from '../../models/goal.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-goal-setting',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './goal-setting.component.html',
  styleUrl: './goal-setting.component.css',
})
export class GoalSettingComponent implements OnInit {
  goalName = '';
  targetAmount: number | null = null;
  deadline = '';

  goals: Goal[] = [];
  ngOnInit(): void {
    this.loadGoals();
  }

  loadGoals(): void {
    // fake data 
    this.goals = [
      {
        id: 'g1',
        name: 'Buy a Laptop',
        targetAmount: 1200,
        savedAmount: 600,
        deadline: '2026-01-20',
        createdAt: '2025-12-01',
      },
      {
        id: 'g2',
        name: 'Vacation Trip',
        targetAmount: 3000,
        savedAmount: 1200,
        deadline: '2026-06-05',
        createdAt: '2025-11-15',
      },
      {
        id: 'g3',
        name: 'Emergency Fund',
        targetAmount: 5000,
        savedAmount: 4100,
        deadline: '2026-12-31',
        createdAt: '2025-10-10',
      },
    ];
  }
  saveGoal(): void {
    // backend post request body
    /**
  goalName = '';
  targetAmount: number | null = null;
  deadline = '';
  token
     */
  }

}
