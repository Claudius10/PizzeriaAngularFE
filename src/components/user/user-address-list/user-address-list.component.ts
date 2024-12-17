import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {AuthService} from '../../../services/auth/auth.service';
import {USER_ADDRESS_LIST} from '../../../utils/query-keys';
import {UserService} from '../../../services/http/user/user.service';
import {Button} from 'primeng/button';
import {UserAddressFormComponent} from '../../forms/user/address-form/user-address-form.component';
import {CardModule} from 'primeng/card';
import {UserAddressItemComponent} from '../user-address-item/user-address-item.component';

@Component({
  selector: 'app-user-address-list',
  standalone: true,
  imports: [
    Button,
    UserAddressFormComponent,
    CardModule,
    UserAddressItemComponent
  ],
  templateUrl: './user-address-list.component.html',
  styleUrl: './user-address-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserAddressListComponent {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  protected addressList = this.userService.findUserAddressList({
    queryKey: USER_ADDRESS_LIST,
    userId: this.authService.getUserId()
  });
  showAddressForm = signal(false);

  toggleAddressForm() {
    this.showAddressForm.set(!this.showAddressForm());
  }

  hideFormOnCancel() {
    this.showAddressForm.set(false);
  }
}
