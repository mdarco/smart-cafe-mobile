import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { JwtHelperService } from '@auth0/angular-jwt';
import { tap, catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

import { environment } from '../../../environments/environment';

const TOKEN_KEY = 'sc_access_token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = environment.apiUrl;

  authenticationState = new BehaviorSubject(false);

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private storage: Storage,
    private alertController: AlertController
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
            // TODO: extract user data from token!
            this.authenticationState.next(true);
          }
        }),
        catchError(e => {
          // console.log('Error', e);
          throw new Error('Korisničko ime i/ili lozinka nisu ispravni.');
        })
      );
  }

  logout() {
    this.storage.remove(TOKEN_KEY).then(() => {
      this.authenticationState.next(false);
    });
  }

  setAuthState(newState: boolean) {
    this.authenticationState.next(newState);
  }

  isAuthenticated() {
    return this.authenticationState.value;
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
