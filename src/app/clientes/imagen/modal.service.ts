import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  modal: boolean = false;
  private _notificaUpload = new EventEmitter<any>();

  constructor() { }

  get notificaUpload(): EventEmitter<any> {
    return this._notificaUpload;
  }

  abrirModal(){
    this.modal = true;
  }

  cerrarModal(){
    this.modal = false;
  }
}
