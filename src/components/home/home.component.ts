import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {ResourceService} from '../../services/http/resources/resource.service';
import {RESOURCE_OFFERS, RESOURCE_STORES} from '../../utils/query-keys';
import {toObservable} from '@angular/core/rxjs-interop';
import {merge} from 'rxjs';
import {LoadingAnimationService} from '../../services/navigation/loading-animation.service';
import {QueryResult} from '../../interfaces/query';
import {OfferItemComponent} from '../resources/offers/offer-item.component';
import {StoreItemComponent} from '../resources/stores/store-item.component';

@Component({
  selector: 'app-home',
  host: {
    class: 'upper-layout',
  },
  standalone: true,
  imports: [
    OfferItemComponent,
    StoreItemComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  private resourceService = inject(ResourceService);
  private loadingAnimationService = inject(LoadingAnimationService);
  private destroyRef = inject(DestroyRef);
  offers: QueryResult = this.resourceService.findOffers({queryKey: RESOURCE_OFFERS});
  stores: QueryResult = this.resourceService.findStores({queryKey: RESOURCE_STORES});
  offersStatus = toObservable(this.offers.status);
  storeStatus = toObservable(this.stores.status);
  status = merge(this.offersStatus, this.storeStatus);

  ngOnInit(): void {
    const subscription = this.status.pipe().subscribe({
      next: status => {
        if (status === "pending") {
          this.loadingAnimationService.startLoading();
        }

        if (status === "success" && this.offers.status() === "success" && this.stores.status() === "success") {
          this.loadingAnimationService.stopLoading();
        }

        if (status === "error") {
          this.loadingAnimationService.stopLoading();
          // did server respond?
          if (this.offers.data() || this.stores.data()) {

            // offers error
            if (this.offers.data() && this.offers.data()!.error!.fatal) {

            } else {
              // non fatal error

            }

            // stores error
            if (this.stores.data() && this.stores.data()!.error!.fatal) {

            } else {
              // non fatal error

            }
          } else {
            // unable to communicate with server
          }
        }

      },
      complete: () => {
        this.loadingAnimationService.stopLoading();
      }
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
      this.loadingAnimationService.stopLoading();
    });
  }
}
