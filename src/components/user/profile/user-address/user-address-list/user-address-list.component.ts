import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {AuthService} from '../../../../../services/auth/auth.service';
import {USER_ADDRESS_LIST} from '../../../../../utils/query-keys';
import {UserService} from '../../../../../services/http/user/user.service';
import {Button} from 'primeng/button';
import {UserAddressFormComponent} from '../../../../forms/user/address-form/user-address-form.component';
import {UserAddressItemComponent} from '../user-address-item/user-address-item.component';
import {LoadingAnimationService} from '../../../../../services/navigation/loading-animation.service';
import {toObservable} from '@angular/core/rxjs-interop';
import {ERROR, PENDING, SUCCESS} from '../../../../../utils/constants';
import {QueryResult} from '../../../../../interfaces/query';
import {ServerErrorComponent} from '../../../../app/error/server-no-response/server-error.component';
import {ErrorService} from '../../../../../services/error/error.service';
import {TranslatePipe} from '@ngx-translate/core';
import {ResponseDTO} from '../../../../../interfaces/http/api';

@Component({
  selector: 'app-user-address-list',
  standalone: true,
  imports: [
    UserAddressItemComponent,
    ServerErrorComponent,
    Button,
    UserAddressFormComponent,
    TranslatePipe
  ],
  templateUrl: './user-address-list.component.html',
  styleUrl: './user-address-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserAddressListComponent implements OnInit {
  private loadingAnimationService = inject(LoadingAnimationService);
  private errorService = inject(ErrorService);
  private destroyRef = inject(DestroyRef);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  protected addressList: QueryResult = this.userService.findUserAddressList({
    queryKey: USER_ADDRESS_LIST,
    id: this.authService.getUserId()!
  });
  addressListStatus = toObservable(this.addressList.status);
  showAddressForm = signal(false);

  ngOnInit(): void {
    const subscription = this.addressListStatus.subscribe({
      next: status => {
        if (status === PENDING) {
          this.loadingAnimationService.startLoading();
        }

        if (status === ERROR) {
          this.loadingAnimationService.stopLoading();
        }

        if (status === SUCCESS) {
          this.loadingAnimationService.stopLoading();
          const response: ResponseDTO = this.addressList.data()!;

          if (response.status.error) {
            this.errorService.handleError(response);
          }
        }
      }
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
      this.loadingAnimationService.stopLoading();
    });
  }

  toggleAddressForm() {
    this.showAddressForm.set(!this.showAddressForm());
  }

  hideFormOnCancel() {
    this.showAddressForm.set(false);
  }
}
