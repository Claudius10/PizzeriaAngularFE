import {inject, Injectable, signal} from '@angular/core';
import {OrderDTO} from '../../../interfaces/dto/order';
import {injectMutation, injectQuery, injectQueryClient} from '@tanstack/angular-query-experimental';
import {USER_ORDER_SUMMARY_LIST} from '../../../utils/query-keys';
import {MutationRequest, MutationResult} from '../../../interfaces/mutation';
import {OrderHttpService} from './order-http.service';
import {lastValueFrom} from 'rxjs';
import {BaseQueryOptionsIdAndUser, QueryResult} from '../../../interfaces/query';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orderHttpService = inject(OrderHttpService);
  private queryClient = injectQueryClient();
  private pageNumber = signal(1);

  createUserOrder(): MutationResult {
    const mutation = injectMutation(() => ({
      mutationFn: (request: MutationRequest) => lastValueFrom(this.orderHttpService.createUserOrder(request.payload)),
      onSuccess: () => {
        this.queryClient.refetchQueries({queryKey: USER_ORDER_SUMMARY_LIST});
      }
    }));

    return {
      mutate: mutation.mutate,
      isSuccess: mutation.isSuccess,
      isError: mutation.isError,
      isPending: mutation.isPending
    };
  }

  createAnonOrder(): MutationResult {
    const mutation = injectMutation(() => ({
      mutationFn: (request: MutationRequest) => lastValueFrom(this.orderHttpService.createAnonOrder(request.payload))
    }));

    return {
      mutate: mutation.mutate,
      isSuccess: mutation.isSuccess,
      isError: mutation.isError,
      isPending: mutation.isPending
    };
  }

  findOrderSummaryList(userId: string | null): QueryResult {
    const query = injectQuery(() => ({
      queryKey: ["user", "order", "summary", this.pageNumber() - 1],
      queryFn: () => lastValueFrom(this.orderHttpService.findOrderSummaryList(userId, this.pageNumber() - 1, 4)),
    }));

    return {
      data: query.data,
      status: query.status,
      error: query.error,
    };
  }

  findUserOrder(options: BaseQueryOptionsIdAndUser): QueryResult {
    const query = injectQuery(() => ({
      // enabled: options.userId !== undefined,
      queryKey: options.queryKey,
      queryFn: () => lastValueFrom(this.orderHttpService.findUserOrder(options))
    }));

    return {
      data: query.data,
      status: query.status,
      error: query.error
    };
  }

  deleteUserOrder(): MutationResult {
    const mutation = injectMutation(() => ({
      mutationFn: (request: MutationRequest) => lastValueFrom(this.orderHttpService.deleteUserOrder(request.payload)),
      onSuccess: () => {
        this.queryClient.refetchQueries({queryKey: USER_ORDER_SUMMARY_LIST});
      }
    }));

    return {
      mutate: mutation.mutate,
      isSuccess: mutation.isSuccess,
      isError: mutation.isError,
      isPending: mutation.isPending
    };
  }

  setPageNumber = (pageNumber: number): void => {
    this.pageNumber.set(pageNumber);
  };

  getPageNumber() {
    return this.pageNumber.asReadonly();
  }
}

export function getEmptyOrder() {
  const empty: OrderDTO = {
    id: 0,
    address: {
      id: 0,
      number: 0,
      street: "",
      details: "",
    },
    cart: {
      cartItems: [],
      id: 0,
      totalCost: 0,
      totalCostOffers: 0,
      totalQuantity: 0
    },
    orderDetails: {
      id: 0,
      deliveryTime: "",
      paymentMethod: "",
      billToChange: null,
      changeToGive: null,
      comment: null
    },
    createdOn: "",
    updatedOn: "",
    formattedCreatedOn: "",
    formattedUpdatedOn: ""
  };
  return empty;
}
