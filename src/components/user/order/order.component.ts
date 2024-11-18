import {ChangeDetectionStrategy, Component, DestroyRef, inject} from '@angular/core';
import {AuthService} from '../../../services/auth/auth.service';
import {ActivatedRoute} from '@angular/router';
import {CartService} from '../../../services/cart/cart.service';
import {UserCheckoutFormComponent} from '../../forms/checkout/UserCheckoutForm/user-checkout-form.component';
import {OrderService} from '../../../services/order/order.service';
import {UserAddressItemComponent} from '../user-address-item/user-address-item.component';
import {UserDetailsComponent} from '../user-details/user-details.component';
import {OrderDetailsComponent} from '../order-details/order-details.component';
import {userOrderQueryKey} from '../../../interfaces/query-keys';
import {SUCCESS} from '../../../utils/constants';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    UserCheckoutFormComponent,
    UserAddressItemComponent,
    UserDetailsComponent,
    OrderDetailsComponent
  ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderComponent {
  private destroyRef = inject(DestroyRef);
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private activatedRoute = inject(ActivatedRoute);
  orderId = this.activatedRoute.snapshot.paramMap.get("orderId") === null ? "0" : this.activatedRoute.snapshot.paramMap.get("orderId")!;
  order = this.orderService.findUserOrder({
    orderId: this.orderId,
    userId: this.authService.getUserId(),
    queryKey: userOrderQueryKey(this.orderId)
  });
  orderToUpdateId = this.orderService.getOrderToUpdateId();
  userName = this.authService.getUserName();
  userEmail = this.authService.getUserEmail();
  userContactNumber = this.authService.getUserContactNumber();

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.orderService.cancelFindUserOrder(this.orderId);
    });
  }

  startUpdate() {
    if (this.order.status() === SUCCESS) {
      const cart = this.order.data()!.cart;
      this.cartService.setOrderCart(cart.cartItems, cart.totalQuantity, cart.totalCost, cart.totalCostOffers);
      this.orderService.setOrderToUpdateId(this.order.data()!.id.toString());
    }
  }

  finishUpdate() {
    this.orderService.setOrderToUpdateId(null);
  }
}
