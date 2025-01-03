import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {ErrorDTO} from '../../../../interfaces/http/api';
import {Button} from 'primeng/button';
import {CardModule} from 'primeng/card';

@Component({
  selector: 'app-error-item',
  standalone: true,
  imports: [
    Button,
    CardModule
  ],
  templateUrl: './error-item.component.html',
  styleUrl: './error-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorItemComponent {
  error = input.required<ErrorDTO>();
}
