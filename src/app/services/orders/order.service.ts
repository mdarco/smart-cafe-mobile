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

  updateOrder(id, model) {
    const url = this.apiUrl + this.rootUrl + '/' + id;
    return this.http.put(url, model).toPromise();
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

  deleteOrderItemFromCurrentSubOrder(item) {
    this.getCurrentSubOrder().orderItems = this.getCurrentSubOrder().orderItems.filter(orderItem => orderItem.productId !== item.productId);
  }

  placeCurrentSubOrder() {
    const promise = new Promise(async (resolve, reject) => {
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
            resolve(order);
          } catch (error) {
            reject(new Error('Narudžbina se ne može kreirati.'));
          }
        } else {
          // update existing order with current sub-order
          const oldCurrentOrder = { ...this.currentOrder };
          so.orderItems.forEach(item => {
            console.log('CURRENT ORDER ITEMS', this.currentOrder.orderItems);
            const existingOrderItem = this.currentOrder.orderItems.find({ productId: item.productId });
            if (!existingOrderItem) {
              this.currentOrder.orderItems.push(item);
            } else {
              existingOrderItem.quantity += item.quantity;
            }
          });

          try {
            const order = await this.updateOrder(this.currentOrder._id, { ...this.currentOrder });
            if (order) {
              this.currentOrder = order;
              so.isOrdered = true;
            }
            resolve(order);
          } catch(error) {
            this.currentOrder = oldCurrentOrder;
            reject(new Error('Došlo je do greške prilikom ažuriranja narudžbine.'));
          }
        }
      }
    });

    return promise;
  }
}
