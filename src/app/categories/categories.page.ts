import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';

import { AddToCartComponent } from '../add-to-cart/add-to-cart.component';

import { ProductService } from '../services/products/product.service';
import { OrderService } from '../services/orders/order.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit, OnDestroy {
  productList$: any;
  productList: Array<any> = [];

  openedCategoryIndex?: number = null;

  currentSubOrder_itemsCount: number = undefined;

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.loadProductList();
  }

  ngOnDestroy() {
    this.productList$.unsubscribe();
  }

  async loadProductList() {
    const loading = await this.loadingController.create({
      spinner: 'circles',
      message: 'Molim Vas, sačekajte...'
    });

    await loading.present();

    this.productList$ = this.productService.getProductList().subscribe(
      (response: any) => {
        console.log('RESPONSE', response);
        if (response) {
          this.productList = response;
        }
      },
      error => {
        // console.log('PRODUCT LIST ERROR', error);
        this.productList = [];
        this.showAlert('Došlo je do greške prilikom preuzimanja liste artikala.');
      },
      () => {
        loading.dismiss();
      }
    );
  }

  openCategory(index: number) {
    this.openedCategoryIndex = index;
  }

  isCategoryOpen(index: number) {
    if (!this.openedCategoryIndex && this.openedCategoryIndex !== 0) {
      return false;
    } else {
      return index === this.openedCategoryIndex;
    }
  }

  showCurrentOrder() {
    this.showAlert('Prikaz trenutne narudžbine..', 'SmartCafe');
  }

  deleteCurrentOrder() {
    this.showAlert('Brisanje trenutne narudžbine..', 'SmartCafe');
  }

  async orderProduct(id) {
    const modal = await this.modalController.create({
      component: AddToCartComponent
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data) {
      const orderItem = {
        productId: id,
        quantity: data.qty,
        note: data.note
      };

      this.orderService.addOrderItemToCurrentSubOrder(orderItem);
      
      if (this.orderService.getCurrentSubOrder()) {
        this.currentSubOrder_itemsCount = this.orderService.getCurrentSubOrder().orderItems.length > 0 ? this.orderService.getCurrentSubOrder().orderItems.length : undefined;
      }

      console.log('Current sub-order', this.orderService.getCurrentSubOrder());
    }
  }

  showAlert(message: string, header: string = 'Greška') {
    const alert = this.alertController.create({
      message,
      header,
      buttons: ['OK']
    });
    alert.then(a => a.present());
  }
}
