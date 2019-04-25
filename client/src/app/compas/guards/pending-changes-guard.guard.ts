import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmDialogComponent } from '../compas-component/confirm-dialog/confirm-dialog.component';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable({
  providedIn: 'root'
})

export class PendingChangesGuard implements CanDeactivate<ComponentCanDeactivate> {
  modalRef: BsModalRef;

  constructor(private modalService: BsModalService) {}

  canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {
    return component.canDeactivate() ?
      true :
      this.openConfirmDialog();
  }

  openConfirmDialog() {
    this.modalRef = this.modalService.show(ConfirmDialogComponent);
    return this.modalRef.content.onClose.map(result => {
        return result;
    });
  }
}
