import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { JwtHelperService } from '@auth0/angular-jwt';
import { tap, catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

import { environment } from '../../../environments/environment';

import { TableService } from '../tables/table.service';
import { RealTimeService } from '../real-time/real-time.service';

const TOKEN_KEY = 'sc_access_token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = environment.apiUrl;

  authenticationState = new BehaviorSubject(false);

  selectedTable: any;

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private storage: Storage,
    private alertController: AlertController,
    private tableService: TableService,
    private realTimeService: RealTimeService
  ) { }

  checkToken() {
    this.storage.get(TOKEN_KEY).then(token => {
      if (token) {
        const isExpired = this.jwtHelper.isTokenExpired(token);

        if (!isExpired) {
          // this.authenticationState.next(true);
        } else {
          this.logout();
        }
      }
    });
  }

  login(credentials) {
    // console.log('Credentials', credentials);
    return this.http.post(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          // console.log('Login service response', response);
          if (!response || !response['isAuthenticated']) {
            throw new Error('Korisničko ime i/ili lozinka nisu ispravni.');
          } else {
            this.storage.set(TOKEN_KEY, response['Token']);
            // TODO: extract user data from token or send user data in response!

            // set selected table in use
            this.tableService.updateTable(credentials.table._id, { isInUse: true })
              .then(result => {
                this.selectedTable = credentials.table;
                this.authenticationState.next(true);
              })
              .catch(error => {
                throw new Error('Došlo je do greške prilikom rezervacije stola.');
              });
          }
        }),
        catchError(e => {
          // console.log('Error', e);
          throw new Error('Korisničko ime i/ili lozinka nisu ispravni.');
        })
      );
  }

  logout() {
    // release selected table
    this.tableService.updateTable(this.selectedTable._id, { isInUse: false })
      .then(() => {
        this.storage.remove(TOKEN_KEY).then(() => {
          this.realTimeService.emitEvent('logout', null);
          this.authenticationState.next(false);
        });
      })
      .catch(error => {
        throw new Error('Došlo je do greške prilikom oslobađanja stola.');
      });
  }

  setAuthState(newState: boolean) {
    this.authenticationState.next(newState);
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }

  getCurrentTable() {
    return this.selectedTable;
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
