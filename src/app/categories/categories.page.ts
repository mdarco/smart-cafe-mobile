import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';

import { ProductService } from '../services/products/product.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit, OnDestroy {
  productList$: any;
  productList: Array<any> = [];

  openedCategoryIndex?: number = null;

  constructor(
    private productService: ProductService,
    private loadingController: LoadingController,
    private alertController: AlertController
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

  orderProduct(id) {
    this.showAlert('Naručivanje..', 'SmartCafe');
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
