import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, Signal} from '@angular/core';
import {Button} from "primeng/button";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {StoreCheckoutComponent} from '../store/store-checkout.component';
import {AddressId, CheckoutFormService} from '../../../../../services/checkout/checkout-form.service';
import {esCharsAndNumbersRegex, esCharsRegex, numbersRegex} from '../../../../../regex';
import {ResourceService} from '../../../../../services/http/resources/resource.service';
import {RESOURCE_STORES} from '../../../../../utils/query-keys';
import {Router} from '@angular/router';
import {Option} from '../../../../../interfaces/forms/steps';
import {NgForOf, UpperCasePipe} from '@angular/common';
import {StoreDTO} from '../../../../../interfaces/dto/resources';
import {QueryResult} from '../../../../../interfaces/query';
import {AuthService} from '../../../../../services/auth/auth.service';
import {UserAddressListViewComponent} from '../user-address-list/user-address-list-view.component';
import {TranslatePipe} from '@ngx-translate/core';
import {ServerErrorComponent} from '../../../../app/error/server-no-response/server-error.component';
import {toObservable} from '@angular/core/rxjs-interop';
import {ErrorService} from '../../../../../services/error/error.service';
import {isFormValid} from '../../../../../utils/functions';
import {SUCCESS} from '../../../../../utils/constants';
import {ResponseDTO} from '../../../../../interfaces/http/api';
import {LoadingAnimationService} from '../../../../../services/navigation/loading-animation.service';

@Component({
  selector: 'app-checkout-step-two-where',
  standalone: true,
  imports: [
    Button,
    TranslatePipe,
    UpperCasePipe,
    IconFieldModule,
    ReactiveFormsModule,
    FormsModule,
    InputIconModule,
    UserAddressListViewComponent,
    ServerErrorComponent,
    StoreCheckoutComponent,
    InputTextModule,
    NgForOf
  ],
  templateUrl: './step-two-where.component.html',
  styleUrl: './step-two-where.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepTwoWhereComponent implements OnInit {
  private router = inject(Router);
  private errorService = inject(ErrorService);
  private destroyRef = inject(DestroyRef);
  protected checkoutFormService = inject(CheckoutFormService);
  private authService = inject(AuthService);
  private resourceService = inject(ResourceService);
  private loadingAnimationService = inject(LoadingAnimationService);
  isFetching: Signal<boolean> = this.loadingAnimationService.getIsLoading();
  isAuthenticated: Signal<boolean> = this.authService.getIsAuthenticated();
  stores: QueryResult = this.resourceService.findStores({queryKey: RESOURCE_STORES});
  status = toObservable(this.stores.status);
  options: Option[] = [
    {code: "0", description: "form.select.address.home"},
    {code: "1", description: "form.select.address.pickup"}
  ];
  selectedOption: Option = this.options[0];
  validSelection = true;

  form = new FormGroup({
    id: new FormControl<number | null>(null),
    street: new FormControl("", {
        nonNullable: true,
        updateOn: "blur"
      }
    ),
    number: new FormControl("", {
        nonNullable: true,
        updateOn: "blur"
      }
    ),
    details: new FormControl<string | null>(null, {
      validators: [Validators.pattern(esCharsAndNumbersRegex)],
      nonNullable: false,
      updateOn: "blur"
    }),
  });

  ngOnInit(): void {
    // --> validate store fetch query
    const subscription = this.status.pipe().subscribe({
      next: status => {
        if (status === SUCCESS) {
          const response: ResponseDTO = this.stores.data()!;

          if (response.status.error) {
            this.errorService.handleError(response);
          }
        }
      }
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });

    // --> set up component
    this.checkoutFormService.step.set(1);

    if (!this.isAuthenticated()) {
      this.setHomeDeliveryValidators(true);
    } else {
      // authed user has home address list to pick from
      // same validators has store pick up
      this.setPickUpValidators(true);
    }

    // if store or user home address was selected
    if (this.checkoutFormService.selectedId().id !== null) {
      // set validators
      this.setHomeDeliveryValidators(false);
      this.setPickUpValidators(true);

      // set store or user home address id
      this.form.patchValue({id: this.checkoutFormService.selectedId().id});

      if (!this.checkoutFormService.selectedId().isStore) {
        this.selectedOption = this.options[0];
      } else {
        this.checkoutFormService.homeDelivery.set(false);
        this.selectedOption = this.options[1];
      }

    } else {
      if (this.checkoutFormService.where() !== null) {
        this.form.patchValue({
          street: this.checkoutFormService.where()!.street!,
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

    this.checkoutFormService.selectedId.set({id: null, isStore: null});
    this.validSelection = true;

    // if home delivery selected
    if (selectElement.value === this.options[0].code) {
      this.checkoutFormService.homeDelivery.set(true);

      // if user is logged in
      if (this.isAuthenticated()) {
        this.setHomeDeliveryValidators(false);
        this.setPickUpValidators(true);
      } else {
        // if anon user
        this.setHomeDeliveryValidators(true);
        this.setPickUpValidators(false);
      }

    } else {
      // if store delivery selected
      this.setHomeDeliveryValidators(false);
      this.setPickUpValidators(true);
      this.checkoutFormService.homeDelivery.set(false);
    }

    this.form.reset();
  }

  setSelectedId(address: AddressId): void {
    this.checkoutFormService.selectedId.set({id: address.id, isStore: address.isStore});
    this.form.controls.id.setValue(address.id);
    this.validSelection = true;
  }

  saveFormValues() {
    if (this.checkoutFormService.selectedId().id !== null) {

      if (!this.checkoutFormService.selectedId().isStore) {
        // set user home address
        this.checkoutFormService.where.set({
          id: this.checkoutFormService.selectedId().id,
          street: null,
          number: null,
          details: null
        });

      } else {
        // set store id on 'where' if customer selected store pickup
        const payload = this.stores.data()!.payload as StoreDTO[];
        const selectedStoreId = payload.findIndex(store => store.id === this.checkoutFormService.selectedId().id);
        const selectedStore = payload[selectedStoreId];

        this.checkoutFormService.where.set({
          id: selectedStore.id,
          street: null,
          number: null,
          details: null
        });
      }

    } else {
      // else set home delivery values
      this.checkoutFormService.where.set({
        id: null,
        street: this.form.get("street")!.value,
        number: Number(this.form.get("number")!.value),
        details: this.form.get("details")!.value === null ? null : this.form.get("details")!.value,
      });
    }
  }

  previousStep() {
    this.router.navigate(['order', 'new', 'step-one']);
  }

  nextStep() {
    if (isFormValid(this.form)) {
      this.saveFormValues();
      this.router.navigate(['order', 'new', 'step-three']);
    } else {
      this.validSelection = false;
    }
  }

  cancel() {
    this.checkoutFormService.clear();
    this.router.navigate(['/']);
  }
}
