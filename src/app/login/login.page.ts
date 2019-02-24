import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';

import { AuthService } from '../services/auth/auth.service';
import { environment } from '../../environments/environment';

import { TableService } from '../services/tables/table.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  username: string;
  password: string;

  private login$: any;

  private tables$: any;
  tables: Array<any> = [];

  constructor(
    private authService: AuthService,
    private tableService: TableService,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.getTables();
  }

  ngOnDestroy() {
    this.login$.unsubscribe();
    this.tables$.unsubscribe();
  }

  async getTables() {
    const loading = await this.loadingController.create({
      spinner: 'circles',
      message: 'Molim Vas sačekajte, stolovi se učitavaju...'
    });

    await loading.present();

    this.tableService.getTables().subscribe(
      (response: any) => {
        console.log('TABLES', response);
        if (response) {
          this.tables = response;
        }
      },
      error => {
        // console.log('TABLES ERROR', error);
        this.tables = [];
        this.showAlert('Došlo je do greške prilikom preuzimanja spiska stolova.');
      },
      () => {
        loading.dismiss();
      }
    );
  }

  async login() {
    const loading = await this.loadingController.create({
      spinner: 'circles',
      message: 'Prijava u toku...'
    });

    await loading.present();

    this.login$ = this.authService.login({
      username: this.username,
      password: btoa(this.password)
    }).subscribe(
      result => {},
      error => {
        // console.log('LOGIN ERROR', error);
        console.log('API url:', environment.apiUrl);
        loading.dismiss();
        this.username = undefined;
        this.password = undefined;
        this.showAlert(error.message);
      },
      () => {
        // console.log('LOGIN FINALLY');
        loading.dismiss();
        this.username = undefined;
        this.password = undefined;
    });
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
