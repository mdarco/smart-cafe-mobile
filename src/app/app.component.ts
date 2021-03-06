import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, MenuController } from '@ionic/angular';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AuthService } from './services/auth/auth.service';
import { SignalrService } from './services/signalr/signalr.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  hideMenu = true;

  public appPages = [
    {
      title: 'Meni',
      url: '/categories',
      icon: 'list'
    },
    {
      title: 'Admin',
      url: '/admin',
      icon: 'settings'
    }
  ];

  constructor(
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private menuController: MenuController,
    private authService: AuthService,
    public signalrService: SignalrService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.authService.checkToken();

      this.authService.authenticationState.subscribe(state => {
        this.hideMenu = !this.authService.isAuthenticated();
        if (state) {
          this.router.navigate(['categories']);
        } else {
          this.router.navigate(['login']);
        }
      });

      this.signalrService.startConnection();

      // TODO: init listeners
      this.signalrService.someListener();

      // this event fires when the native platform pulls the app
      // from the background - it is fired only with the Cordova apps,
      // it wouldn't fire on a standard web browser
      this.platform.resume.subscribe(result => {
        this.authService.checkToken();
      });
    });
  }

  logout() {
    this.authService.logout();
    this.menuController.close();
  }
}
