import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { AuthService } from '../auth/auth.service';

interface SubOrder {
  date: Date;
  orderItems: any[];
  isOrdered: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  subOrders: SubOrder[] = [];
  currentOrder = undefined;

  apiUrl = environment.apiUrl;
  rootUrl = '/orders';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getFilteredOrders(filter) {
    const url = this.apiUrl + this.rootUrl + '/filtered?nd=' + Date.now();
    return this.http.post(url, filter).toPromise();
  }

  getOrder(id) {
    const url = this.apiUrl + this.rootUrl + '/' + id + '?nd=' + Date.now();
    return this.http.get(url).toPromise();
  }

  createOrder(model) {
    const url = this.apiUrl + this.rootUrl;
    return this.http.post(url, model).toPromise();
  }

  getCurrentOrder() {
    return this.currentOrder;
  }

  getCurrentSubOrder() {
    if (this.subOrders && this.subOrders.length > 0) {
      return this.subOrders.find(so => !so.isOrdered);
    }
    return null;
  }

  addOrderItemToCurrentSubOrder(item) {
    let so = this.getCurrentSubOrder();
    if (!so) {
      this.subOrders.push({
        date: new Date(),
        orderItems: [],
        isOrdered: false
      });
      so = this.subOrders[0];
    }

    const existingItem = so.orderItems.find(e => e.productId === item.productId);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      so.orderItems.push({ ...item });
    }
  }

  async placeCurrentSubOrder() {
    const so = this.getCurrentSubOrder();
    if (so) {
      if (!this.currentOrder || !this.currentOrder._id) {
        const newOrder = {
          tableId: this.authService.getCurrentTable(),
          orderDate: new Date(),
          isClosed: false,
          orderItems: so.orderItems
        };

        try {
          const order = await this.createOrder(newOrder);
          if (order) {
            this.currentOrder = order;
            so.isOrdered = true;
          }
        } catch (error) {
          throw new Error('Narudžbina se ne može kreirati.');
        }
      }
    }
  }
}
