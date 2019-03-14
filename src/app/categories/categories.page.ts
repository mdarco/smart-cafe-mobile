import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';

import { AddToCartComponent } from '../add-to-cart/add-to-cart.component';
import { ShowCartComponent } from '../show-cart/show-cart.component';

import { ProductService } from '../services/products/product.service';
import { OrderService } from '../services/orders/order.service';
import { RealTimeService } from '../services/real-time/real-time.service';

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
    private realTimeService: RealTimeService,
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

  async showCurrentOrder() {
    const modal = await this.modalController.create({
      component: ShowCartComponent
    });
    await modal.present();

    await modal.onDidDismiss();

    this.setCurrentSubOrder_ItemsCount();
  }

  async deleteCurrentOrder() {
    const alert = await this.alertController.create({
      header: 'SmartCafe',
      message: 'Da li ste sigurni?',
      buttons: [
        {
          text: 'Ne',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Da',
          handler: async () => {
            try {
              await this.orderService.deleteCurrentSubOrder();
              this.setCurrentSubOrder_ItemsCount();
            } catch (error) {
              this.showAlert(error.message);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async orderProduct(product) {
    const modal = await this.modalController.create({
      component: AddToCartComponent
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data) {
      const orderItem = {
        productId: product._id,
        name: product.name,
        quantity: data.qty,
        note: data.note
      };

      this.orderService.addOrderItemToCurrentSubOrder(orderItem);

      this.setCurrentSubOrder_ItemsCount();

      // console.log('Current sub-order', this.orderService.getCurrentSubOrder());
    }
  }

  setCurrentSubOrder_ItemsCount() {
    if (this.orderService.getCurrentSubOrder()) {
      this.currentSubOrder_itemsCount =
        this.orderService.getCurrentSubOrder().orderItems.length > 0 ?
          this.orderService.getCurrentSubOrder().orderItems.length : undefined;
    } else {
      this.currentSubOrder_itemsCount = undefined;
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
