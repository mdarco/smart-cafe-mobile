import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class RealTimeService {
  constructor(private socket: Socket) { }

  emitEvent(eventName, eventMessage) {
    this.socket.emit(eventName, eventMessage);
  }
}
