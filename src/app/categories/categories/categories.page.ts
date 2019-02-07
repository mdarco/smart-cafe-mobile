import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';

import { ProductService } from '../../services/products/product.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  productList$: any;
  productList: Array<any> = [];

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
        // console.log('RESPONSE', response);
        if (response && response.length > 0) {
          this.productList = response;
        }
      },
      error => {
        // console.log('MEMBERS ERROR', error);
        this.productList = [];
        this.showAlert('Došlo je do greške prilikom preuzimanja liste artikala.');
      },
      () => {
        loading.dismiss();
      }
    );
  }

  showAlert(msg: string) {
    const alert = this.alertController.create({
      message: msg,
      header: 'Greška',
      buttons: ['OK']
    });
    alert.then(a => a.present());
  }
}
