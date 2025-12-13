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
  allGoals: Goal[] = []; // Store all goals including completed
  loading = false;
  error: string | null = null;
  editingGoal: Goal | null = null;

  totalGoals = 0;
  completedGoals = 0;
  inProgressGoals = 0;

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
        this.allGoals = response.data || [];
        // Filter out completed goals from display
        this.goals = this.allGoals.filter(g => !g.isCompleted);
        this.calculateGoalStats();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load goals';
        this.loading = false;
        console.error(err);
      }
    });
  }

  private calculateGoalStats(): void {
    if (!this.allGoals) {
      this.totalGoals = 0;
      this.completedGoals = 0;
      this.inProgressGoals = 0;
      return;
    }
    this.totalGoals = this.allGoals.length;
    this.completedGoals = this.allGoals.filter(g => g.isCompleted === true).length;
    this.inProgressGoals = this.totalGoals - this.completedGoals;
  }

  saveGoal(): void {
    console.log('[GoalSetting] saveGoal() called');
    console.log('[GoalSetting] userId:', this.userId);
    console.log('[GoalSetting] goalName:', this.goalName);
    console.log('[GoalSetting] targetAmount:', this.targetAmount);
    console.log('[GoalSetting] deadline:', this.deadline);

    if (!this.validateInputs()) {
      console.log('[GoalSetting] Validation failed');
      return;
    }

    if (!this.userId) {
      this.error = 'User ID is missing. Please log in again.';
      console.error('[GoalSetting] userId is empty');
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

    console.log('[GoalSetting] Sending goalData:', goalData);

    if (this.editingGoal) {
      // Update existing goal
      console.log('[GoalSetting] Updating existing goal:', this.editingGoal.id);
      this.goalService.updateGoal(this.editingGoal.id, {
        name: this.goalName,
        targetAmount: this.targetAmount!,
        deadline: this.deadline
      }).subscribe({
        next: (response) => {
          console.log('[GoalSetting] Update success:', response);
          const index = this.allGoals.findIndex(g => g.id === this.editingGoal!.id);
          if (index !== -1) {
            this.allGoals[index] = response.data;
          }
          // Filter out completed goals from display
          this.goals = this.allGoals.filter(g => !g.isCompleted);
          this.calculateGoalStats();
          this.resetForm();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to update goal';
          this.loading = false;
          console.error('[GoalSetting] Update error:', err);
        }
      });
    } else {
      // Create new goal
      console.log('[GoalSetting] Creating new goal');
      this.goalService.createGoal(goalData).subscribe({
        next: (response) => {
          console.log('[GoalSetting] Create success:', response);
          if (response && response.data) {
            this.allGoals.push(response.data);
            // Filter out completed goals from display
            this.goals = this.allGoals.filter(g => !g.isCompleted);
            this.calculateGoalStats();
            this.resetForm();
            this.loading = false;
          } else {
            console.error('[GoalSetting] Invalid response structure:', response);
            this.error = 'Invalid response from server';
            this.loading = false;
          }
        },
        error: (err) => {
          this.error = err.error?.msg || 'Failed to create goal';
          this.loading = false;
          console.error('[GoalSetting] Create error:', err);
          if (err.error) {
            console.error('[GoalSetting] Error details:', err.error);
          }
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

  toggleComplete(goal: Goal): void {
    // When checkbox is checked, mark goal as completed (true)
    // Since we only show non-completed goals, checking will always set to true
    this.loading = true;
    this.error = null;

    this.goalService.updateGoal(goal.id, {
      isCompleted: true
    }).subscribe({
      next: (response) => {
        // Update the goal in allGoals array
        const index = this.allGoals.findIndex(g => g.id === goal.id);
        if (index !== -1) {
          this.allGoals[index] = response.data;
        }
        // Filter out completed goals from display
        this.goals = this.allGoals.filter(g => !g.isCompleted);
        this.calculateGoalStats();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to update goal completion status';
        this.loading = false;
        console.error('[GoalSetting] Toggle complete error:', err);
      }
    });
  }

  deleteGoal(goal: Goal): void {
    if (confirm('Are you sure you want to delete this goal?')) {
      this.goalService.deleteGoal(goal.id).subscribe({
        next: () => {
          this.allGoals = this.allGoals.filter(g => g.id !== goal.id);
          this.goals = this.allGoals.filter(g => !g.isCompleted);
          this.calculateGoalStats();
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
