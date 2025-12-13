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
  loading = false;
  error: string | null = null;
  editingGoal: Goal | null = null;

  get userId() { return this.sharedService.userId; }

  constructor(private goalService: GoalService, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.loadGoals();
  }

  loadGoals(): void {
    this.loading = true;
    this.error = null;
    this.goalService.getGoals(this.userId).subscribe({
      next: (response) => {
        this.goals = response.data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load goals';
        this.loading = false;
        console.error(err);
      }
    });
  }

  saveGoal(): void {
    if (!this.validateInputs()) {
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
      // Update existing goal
      this.goalService.updateGoal(this.editingGoal.id, {
        name: this.goalName,
        targetAmount: this.targetAmount!,
        deadline: this.deadline
      }).subscribe({
        next: (response) => {
          const index = this.goals.findIndex(g => g.id === this.editingGoal!.id);
          if (index !== -1) {
            this.goals[index] = response.data;
          }
          this.resetForm();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to update goal';
          this.loading = false;
          console.error(err);
        }
      });
    } else {
      // Create new goal
      this.goalService.createGoal(goalData).subscribe({
        next: (response) => {
          this.goals.push(response.data);
          this.resetForm();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to create goal';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }

  editGoal(goal: Goal): void {
    this.editingGoal = goal;
    this.goalName = goal.name;
    this.targetAmount = goal.targetAmount;
    this.deadline = goal.deadline.split('T')[0]; // Assuming deadline is ISO string
  }

  deleteGoal(goal: Goal): void {
    if (confirm('Are you sure you want to delete this goal?')) {
      this.goalService.deleteGoal(goal.id).subscribe({
        next: () => {
          this.goals = this.goals.filter(g => g.id !== goal.id);
        },
        error: (err) => {
          this.error = 'Failed to delete goal';
          console.error(err);
        }
      });
    }
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
    const deadlineDate = new Date(this.deadline);
    if (deadlineDate <= new Date()) {
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
