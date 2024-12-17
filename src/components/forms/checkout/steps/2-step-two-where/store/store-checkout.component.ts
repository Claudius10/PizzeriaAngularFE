import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {AccordionModule} from "primeng/accordion";
import {CardModule} from "primeng/card";
import {StoreDTO} from '../../../../../../interfaces/dto/resources';
import {NgClass} from '@angular/common';
import {AddressId} from '../../../../../../services/forms/checkout/checkout-form.service';

@Component({
  selector: 'app-store-checkout',
  standalone: true,
  imports: [
    AccordionModule,
    CardModule,
    NgClass
  ],
  templateUrl: './store-checkout.component.html',
  styleUrl: './store-checkout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoreCheckoutComponent {
  onStoreSelect = output<AddressId>();
  orientation = input<"horizontal" | "vertical">('horizontal');
  store = input.required<StoreDTO>();
  selected = input<number | null>(null);
  valid = input<boolean>();

  selectStore() {
    this.onStoreSelect.emit({id: this.store().id, isStore: true});
  }
}