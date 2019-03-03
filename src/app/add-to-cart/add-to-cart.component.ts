import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.scss']
})
export class AddToCartComponent implements OnInit, OnDestroy {
  modalData = {
    qty: Number,
    note: String
  };

  constructor(
    private toastController: ToastController,
    private modalController: ModalController
  ) { }

  ngOnInit() {}

  ngOnDestroy() {}

  applyOrder() {
    this.modalController.dismiss(this.modalData);
  }

  cancel() {
    this.modalController.dismiss();
  }

  async showToast(message, color) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      color
    });
    await toast.present();
  }
}
