import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection: signalR.HubConnection;

  constructor() { }

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.signalrHubUrl)
      .build();

    this.hubConnection.start()
      .then(() => console.log('SignalR connection started.'))
      .catch(error => console.log('Error while starting SignalR connection: %s', error));
  };

  // TODO: add listeners for server to client communication
  public someListener = () => {
    this.hubConnection.on('someEvent', data => {
      console.log(data);
    });
  };

  // TODO: add invokers for client to server communication
  public someInvoker = () => {
    const hubData = 'someHubData';
    this.hubConnection.invoke('someHubEndpoint', hubData);
  };
}
