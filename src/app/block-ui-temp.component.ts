import {Component} from '@angular/core';
@Component({
  selector: 'block-temp',
  styles: [`
    :host {
      text-align: center;
      color: #fff;
    }
  `],
  template: `
    <div class="block-ui-template">
<!--      <i class="fa fa-github-alt fa-4x" aria-hidden="true"></i>-->
      <img src="assets/images/logo.svg" height="50" width="100">
      <div><strong><h2>Kindly wait for process to finish...</h2></strong></div>
    </div>
  `
})
export class BlockUiTemplateComponent {
}
