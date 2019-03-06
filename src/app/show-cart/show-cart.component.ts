import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';

import { OrderService } from '../services/orders/order.service';

@Component({
  selector: 'app-show-cart',
  templateUrl: './show-cart.component.html',
  styleUrls: ['./show-cart.component.scss']
})
export class ShowCartComponent implements OnInit {
  currentSubOrder: any;

  constructor(
    private orderService: OrderService,
    private modalController: ModalController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.currentSubOrder = this.orderService.getCurrentSubOrder();
  }

  async sendCurrentSubOrder() {
    const alert = await this.alertController.create({
      header: 'SmartCafe',
      message: 'Poslati narudžbinu u restoran?',
      buttons: [
        {
          text: 'Ne',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Da',
          handler: () => {
            this.orderService.placeCurrentSubOrder();
            this.cancel();
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteOrderItemFromCurrentSubOrder(item) {
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
          handler: () => {
            this.orderService.deleteOrderItemFromCurrentSubOrder(item);
          }
        }
      ]
    });
    await alert.present();
  }

  cancel() {
    this.modalController.dismiss();
  }
}
