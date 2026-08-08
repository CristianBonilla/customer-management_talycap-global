import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly isDarkMode = signal<boolean>(false);

  constructor() {
    this.initTheme();
  }

  toggleTheme(): void {
    this.isDarkMode.update(v => !v);
    this.applyTheme();
  }

  private initTheme(): void {
    const saved = localStorage.getItem('theme');
    this.isDarkMode.set(saved === 'dark');
    this.applyTheme();
  }

  private applyTheme(): void {
    if (this.isDarkMode()) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
    localStorage.setItem('theme', this.isDarkMode() ? 'dark' : 'light');
  }
}
