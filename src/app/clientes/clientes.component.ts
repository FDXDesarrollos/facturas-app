import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { ModalService } from './imagen/modal.service';
import swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../usuarios/auth.service';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  paginador: any;
  clientes: Cliente[];
  clienteSelec:Cliente;

  constructor(private clienteService: ClienteService, 
              private modalService: ModalService,
              public authService: AuthService,
              private ActivatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.ActivatedRoute.paramMap.subscribe( params => {
      let page: number = 0;
      page = Number( params.get('page') );
      
      //if(!page){ page = 0; }
      this.clienteService.getClientes(page)
      .pipe(
        tap(response =>{
          console.log('ClientesComponent: tap 3');
          (response.content as Cliente[]).forEach(cliente => {
            //console.log(cliente.nombre);
          });
        })
      )
      .subscribe( response => {
        this.clientes = response.content as Cliente[],
        this.paginador = response;
      });      
    });

    this.modalService.notificaUpload.subscribe(cliente => {
      this.clientes = this.clientes.map(clienteOriginal => {
        if(cliente.id == clienteOriginal.id){
          clienteOriginal.imagen = cliente.imagen;
        }

        return clienteOriginal;
      })
    })


  }

  eliminar(cliente: Cliente): void{
    swal({
      title: 'Está seguro?',
      text: `Eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
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
        this.clienteService.eliminar(cliente.id).subscribe(
          response => {
            this.clientes = this.clientes.filter(cli => cli !== cliente)
            swal(
              'Cliente Eliminado!',
              `Cliente ${cliente.nombre} eliminado con éxito.`,
              'success'
            )
          }
        )
      }
    })
  }
  
  abrirModal(cliente: Cliente){
    this.clienteSelec = cliente;
    this.modalService.abrirModal();
  };

}
