import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {AuthService} from '../../../services/auth/auth.service';
import {UserAddressListComponent} from '../user-address-list/user-address-list.component';
import {CardModule} from 'primeng/card';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    UserAddressListComponent,
    CardModule,
    Button
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
  private authService = inject(AuthService);
  showAddressList = signal(false);
  userName = this.authService.getUserName();
  userEmail = this.authService.getUserEmail();

  public toggleAddressList() {
    this.showAddressList.set(!this.showAddressList());
  }
}
