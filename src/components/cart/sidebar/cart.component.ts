import {ChangeDetectionStrategy, Component, inject, output} from '@angular/core';
import {CartService} from '../../../services/cart/cart.service';
import {CartItemComponent} from '../cart-item/cart-item.component';
import {ActivatedRoute, Router} from '@angular/router';
import {TotalsComponent} from '../totals/totals.component';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CartItemComponent,
    TotalsComponent,
    Button,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent {
  onNewOrderClick = output<boolean>();
  protected cartService: CartService = inject(CartService);
  private router = inject(Router);
  private activeRoute = inject(ActivatedRoute);
  items = this.cartService.cartItems;
  quantity = this.cartService.cartQuantity;
  total = this.cartService.cartTotal;
  totalAfterOffers = this.cartService.cartTotalAfterOffers;
  threeForTwoOffers = this.cartService.cartThreeForTwoOffers;
  secondForHalfPriceOffer = this.cartService.cartSecondHalfPriceOffer;

  newOrderOnLick() {
    this.router.navigate(['order', 'new', 'step-one']);
    console.log(this.activeRoute.snapshot.url);
    this.onNewOrderClick.emit(false);
  }
}
