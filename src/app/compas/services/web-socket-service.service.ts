import { Injectable } from '@angular/core';
import * as SockJs from 'sockjs-client';
import * as Stomp from 'stompjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketServiceService {

  constructor() { }

  public connect() {
    const socket = new SockJs('https://localhost:8444/greenbitSocket');

    const stompClient = Stomp.over(socket);

    return stompClient;
  }
}
