import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-block-element',
  styles: [`
    :host {
      display: block;
      width: 80%;
      margin: 15px auto;
      padding: 20px;
      min-height: 180px;
      background-color: #1976D2;
      background: -webkit-linear-gradient(145deg,#9175c5,#42A5F5);
      background: linear-gradient(145deg,#9175c5,#42A5F5);
      color: #fff;
      text-align: center;
    }

    :host h1 {
      font-size: 35px;
      margin: 70px 0 0 0;
    }
  `],
  template: `<h1>Element {{index}}</h1>`,
})
export class BlockElementComponent {
  @Input() index;

  constructor() { }

}
