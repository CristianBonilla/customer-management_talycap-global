import { Component } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [ProgressSpinnerModule],
  template: `
    <div class="spinner-wrapper">
      <p-progressspinner strokeWidth="4" animationDuration=".8s" class="custom-spinner" />
      <p class="spinner-label">Buscando cliente...</p>
    </div>
  `,
  styles: [`
    .spinner-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2.5rem 1rem;
      gap: 1rem;
    }
    .spinner-label {
      color: var(--text-color-secondary);
      font-size: 0.875rem;
    }
    :host ::ng-deep .custom-spinner {
      width: 52px;
      height: 52px;
    }
  `]
})
export class SpinnerComponent {}
