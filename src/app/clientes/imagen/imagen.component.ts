import { Component, OnInit, Input } from '@angular/core';
import { Cliente } from '../cliente';
import { ModalService } from './modal.service';
import { ClienteService } from '../cliente.service';
import { HttpEventType } from '@angular/common/http';
import { AuthService } from '../../usuarios/auth.service';

import { FacturaService } from '../../facturas/services/factura.service';
import { Factura } from '../../facturas/models/factura';

import swal from 'sweetalert2'; 


@Component({
  selector: 'img-cliente',
  templateUrl: './imagen.component.html',
  styleUrls: ['./imagen.component.css']
})
export class ImagenComponent implements OnInit {
  @Input() cliente: Cliente;

  //cliente: Cliente;
  titulo: string = "Imagen del Cliente";
  nameFile: string = "Seleccionar imagen";
  imagenSelec: File;
  progreso: number = 0;

  constructor(private ClienteService: ClienteService,
              private facturaService: FacturaService,
              public authService: AuthService,
              public modalService: ModalService) { }

  ngOnInit(): void {
    /* this.activatedRoute.paramMap
    .subscribe(params =>{
      let id: number = Number(params.get('id'));

      if(id){
        this.ClienteService.getCliente(id)
        .subscribe(cliente => {
          this.cliente = cliente;
        });
      }

    }); */
  }

  selecImagen(event){
    this.progreso = 0;
    this.imagenSelec = event.target.files[0];
    this.nameFile = this.imagenSelec.name;
    
    //console.log('---> ' + this.imagenSelec);

    if(this.imagenSelec.type.indexOf('image') < 0){
      this.imagenSelec = null;
      swal('Error seleccionar archivo: ', 'El archivo debe ser del tipop imagen', 'error');
    }
  }

  subeImagen(){
    if(!this.imagenSelec){
      swal('Error Upload: ', 'Debe seleccionar una imagen', 'error');
    }
    else{
      this.ClienteService.subirImagen(this.imagenSelec, this.cliente.id)
      .subscribe(event => {
          if(event.type === HttpEventType.UploadProgress){
            this.progreso = Math.round((event.loaded / event.total) * 100);
          }
          else if(event.type === HttpEventType.Response){
            let response:any = event.body;
            this.cliente = response.cliente as Cliente;

            this.modalService.notificaUpload.emit(this.cliente);
            swal('Imagen se ha subido correctamente', response.mensaje, 'success');   // `${this.cliente.imagen}`
          }
          
      });
    }
  }

  cerrarModal(cliente: Cliente){
    this.progreso = 0;
    this.imagenSelec = null;
    this.modalService.cerrarModal();
  };  

  eliminaFac(factura:Factura): void{
    swal({
      title: 'Está seguro?',
      text: `Eliminar la Factura ${factura.descripcion}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar',
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false,
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.facturaService.eliminaFac(factura.id).subscribe(
          response => {
            this.cliente.facturas = this.cliente.facturas.filter(fac => fac !== factura)
            swal(
              'Factura Eliminada!',
              `Factura ${factura.descripcion} eliminada con éxito.`,
              'success'
            )
          }
        )
      }
    })
  }

}
