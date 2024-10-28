import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ThemeSelectorComponent} from '../../theme-selector/theme-selector.component';
import {CardModule} from 'primeng/card';

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [
    RouterLink,
    ThemeSelectorComponent,
    CardModule
  ],
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationBarComponent {

}
