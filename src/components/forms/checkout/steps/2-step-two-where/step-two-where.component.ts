import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {StoreCheckoutComponent} from '../../store/store-checkout.component';
import {CheckoutFormService} from '../../../../../services/forms/checkout/checkout-form.service';
import {esCharsAndNumbersRegex, esCharsRegex, numbersRegex} from '../../../../../regex';
import {ResourceService} from '../../../../../services/http/resources/resource.service';
import {StoresQueryResult} from '../../../../../interfaces/query';
import {RESOURCE_STORES} from '../../../../../utils/query-keys';
import {Router} from '@angular/router';
import {isStepValid} from '../../../../../utils/functions';
import {Option} from '../../../../../interfaces/forms/steps';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-checkout-step-two-where',
  standalone: true,
  imports: [
    Button,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ReactiveFormsModule,
    StoreCheckoutComponent,
    FormsModule,
    NgForOf
  ],
  templateUrl: './step-two-where.component.html',
  styleUrl: './step-two-where.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepTwoWhereComponent implements OnInit {
  protected checkoutFormService = inject(CheckoutFormService);
  private resourceService = inject(ResourceService);
  private router = inject(Router);
  stores: StoresQueryResult = this.resourceService.findStores({queryKey: RESOURCE_STORES});
  options: Option[] = [{code: "0", description: "Home delivery"}, {code: "1", description: "Store pickup"}];
  selectedOption: Option = this.options[0];

  form = new FormGroup({
    id: new FormControl<number | null>(null),
    street: new FormControl("", {
        nonNullable: false,
        updateOn: "blur"
      }
    ),
    number: new FormControl("", {
        nonNullable: false,
        updateOn: "blur"
      }
    ),
    details: new FormControl("", {
      validators: [Validators.pattern(esCharsAndNumbersRegex)],
      nonNullable: false,
      updateOn: "blur"
    }),
  });

  ngOnInit(): void {
    this.setHomeDeliveryValidators(true);
    this.checkoutFormService.step.set(1);
    // if store was selected
    if (this.checkoutFormService.selectedStore() !== null) {
      // set store id
      this.form.patchValue({id: this.checkoutFormService.selectedStore()});
      // display stores
      this.checkoutFormService.homeDelivery.set(false);
      // select pickup option of HTMLSelectElement
      this.selectedOption = this.options[1];
      // remove validators
      this.setHomeDeliveryValidators(false);
      this.setPickUpValidators(true);
    } else {
      if (this.checkoutFormService.where() !== null) {
        this.form.patchValue({
          street: this.checkoutFormService.where()!.street,
          number: this.checkoutFormService.where()!.number!.toString(),
          details: this.checkoutFormService.where()!.details
        });
      }
    }
  }

  setPickUpValidators(add: boolean): void {
    if (add) {
      this.form.controls.id.addValidators([Validators.required]);
    } else {
      this.form.controls.id.removeValidators([Validators.required]);
    }
  }

  setHomeDeliveryValidators(add: boolean): void {
    if (add) {
      this.form.controls.street.addValidators([Validators.required, Validators.maxLength(52), Validators.pattern(esCharsRegex)]);
      this.form.controls.number.addValidators([Validators.required, Validators.maxLength(10), Validators.pattern(numbersRegex)]);
    } else {
      this.form.controls.street.removeValidators([Validators.required, Validators.maxLength(52), Validators.pattern(esCharsRegex)]);
      this.form.controls.number.removeValidators([Validators.required, Validators.maxLength(10), Validators.pattern(numbersRegex)]);
    }
  }

  selectDelivery(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    if (selectElement.value === this.options[0].code) {
      this.setHomeDeliveryValidators(true);
      this.setPickUpValidators(false);
      this.checkoutFormService.homeDelivery.set(true);
      this.checkoutFormService.selectedStore.set(null);
    } else {
      this.setHomeDeliveryValidators(false);
      this.setPickUpValidators(true);
      this.checkoutFormService.homeDelivery.set(false);
    }

    this.form.reset();
  }

  setSelectedStoreId(id: number) {
    this.checkoutFormService.selectedStore.set(id); // for border color change on select
    this.form.controls.id.setValue(id);
  }

  saveFormValues() {
    this.checkoutFormService.where.set({
      id: this.form.get("id")!.value === null ? null : this.form.get("id")!.value,
      street: this.form.get("street")!.value === null ? null : this.form.get("street")!.value,
      number: Number(this.form.get("number")!.value),
      details: this.form.get("details")!.value === null ? null : this.form.get("details")!.value,
    });
  }

  previousStep() {
    this.router.navigate(['/new-order/step-one']);
  }

  nextStep() {
    if (isStepValid(this.form)) {
      this.saveFormValues();
      this.router.navigate(['/new-order/step-three']);
    }
  }

  cancel() {
    this.checkoutFormService.cancel();
    this.router.navigate(['/']);
  }
}