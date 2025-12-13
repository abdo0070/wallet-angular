import { Component, OnInit } from '@angular/core';
import { Goal } from '../../models/goal.model';
import { FormsModule } from '@angular/forms';
import { GoalService } from '../../services/goal.service';
import { SharedService } from '../../shared.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-goal-setting',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './goal-setting.component.html',
  styleUrl: './goal-setting.component.css',
})
export class GoalSettingComponent implements OnInit {

  goalName = '';
  targetAmount: number | null = null;
  deadline = '';

  goals: Goal[] = [];
  allGoals: Goal[] = [];

  loading = false;
  error: string | null = null;
  editingGoal: Goal | null = null;

  totalGoals = 0;
  completedGoals = 0;
  inProgressGoals = 0;

  get userId() {
    return this.sharedService.userId;
  }

  constructor(
    private goalService: GoalService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.loadGoals();
  }

  loadGoals(): void {
    this.loading = true;
    this.error = null;

    this.goalService.getGoals(this.userId).subscribe({
      next: (response) => {
        this.allGoals = response.data || [];
        this.goals = this.allGoals.filter(g => !g.isCompleted);
        this.calculateGoalStats();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load goals';
        this.loading = false;
      }
    });
  }

  private calculateGoalStats(): void {
    this.totalGoals = this.allGoals.length;
    this.completedGoals = this.allGoals.filter(g => g.isCompleted).length;
    this.inProgressGoals = this.totalGoals - this.completedGoals;
  }

  saveGoal(): void {
    if (!this.validateInputs()) return;

    if (!this.userId) {
      this.error = 'User ID is missing. Please log in again.';
      return;
    }

    this.loading = true;
    this.error = null;

    const goalData = {
      user_id: this.userId,
      name: this.goalName,
      targetAmount: this.targetAmount!,
      deadline: this.deadline
    };

    if (this.editingGoal) {
      this.goalService.updateGoal(this.editingGoal.id, goalData).subscribe({
        next: (response) => {
          const index = this.allGoals.findIndex(g => g.id === this.editingGoal!.id);
          if (index !== -1) {
            this.allGoals[index] = response.data;
          }
          this.afterSave();
        },
        error: () => {
          this.error = 'Failed to update goal';
          this.loading = false;
        }
      });
    } else {
      this.goalService.createGoal(goalData).subscribe({
        next: (response) => {
          this.allGoals.push(response.data);
          this.afterSave();
        },
        error: (err) => {
          this.error = err.error?.msg || 'Failed to create goal';
          this.loading = false;
        }
      });
    }
  }

  private afterSave(): void {
    this.goals = this.allGoals.filter(g => !g.isCompleted);
    this.calculateGoalStats();
    this.resetForm();
    this.loading = false;
  }

  editGoal(goal: Goal): void {
    this.editingGoal = goal;
    this.goalName = goal.name;
    this.targetAmount = goal.targetAmount;
    this.deadline = goal.deadline.split('T')[0];
  }

  toggleComplete(goal: Goal): void {
    this.loading = true;
    this.error = null;

    this.goalService.updateGoal(goal.id, { isCompleted: true }).subscribe({
      next: (response) => {
        const index = this.allGoals.findIndex(g => g.id === goal.id);
        if (index !== -1) {
          this.allGoals[index] = response.data;
        }
        this.goals = this.allGoals.filter(g => !g.isCompleted);
        this.calculateGoalStats();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to update goal status';
        this.loading = false;
      }
    });
  }

  deleteGoal(goal: Goal): void {
    if (!confirm('Are you sure you want to delete this goal?')) return;

    this.goalService.deleteGoal(goal.id).subscribe({
      next: () => {
        this.allGoals = this.allGoals.filter(g => g.id !== goal.id);
        this.goals = this.allGoals.filter(g => !g.isCompleted);
        this.calculateGoalStats();
      },
      error: () => {
        this.error = 'Failed to delete goal';
      }
    });
  }

  private validateInputs(): boolean {
    if (!this.goalName.trim()) {
      this.error = 'Goal name is required';
      return false;
    }
    if (!this.targetAmount || this.targetAmount <= 0) {
      this.error = 'Target amount must be greater than 0';
      return false;
    }
    if (!this.deadline) {
      this.error = 'Deadline is required';
      return false;
    }
    if (new Date(this.deadline) <= new Date()) {
      this.error = 'Deadline must be in the future';
      return false;
    }
    return true;
  }

  private resetForm(): void {
    this.goalName = '';
    this.targetAmount = null;
    this.deadline = '';
    this.editingGoal = null;
    this.error = null;
  }
}
