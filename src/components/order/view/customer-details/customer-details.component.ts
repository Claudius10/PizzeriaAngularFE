import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {CardModule} from 'primeng/card';
import {CustomerDTO} from '../../../../interfaces/dto/order';

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [
    CardModule
  ],
  templateUrl: './customer-details.component.html',
  styleUrl: './customer-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerDetailsComponent {
  customer = input.required<CustomerDTO>();
}
