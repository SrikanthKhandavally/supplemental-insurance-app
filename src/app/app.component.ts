import { Component } from '@angular/core';
import { ModeService } from './services/mode.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'supplemental-insurance-app';
  selectedMode: string;

  constructor(private modeService: ModeService) {
    const stored = localStorage.getItem('selectedMode');
    this.selectedMode = (stored === 'ai' || stored === 'legacy') ? stored : 'legacy';
    this.modeService.setMode(this.selectedMode);
  }

  onModeChange(mode: string) {
    this.selectedMode = mode;
    this.modeService.setMode(mode);
  }
}
