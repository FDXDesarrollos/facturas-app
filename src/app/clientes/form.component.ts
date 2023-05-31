import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { Region } from './region';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  public titulo: string = "Nuevo Cliente";
  public cliente: Cliente = new Cliente();
  public errores: string[];
  public regiones: Region[];

  constructor(private clienteService: ClienteService, 
              private router: Router, 
              private activatedRouter: ActivatedRoute) { }

  ngOnInit(): void {
    this.mostrar()
  }

  mostrar(): void {
    this.activatedRouter.params.subscribe(params => {
      let id = Number(params['id']);

      if(id){
        this.titulo = "Editar Cliente";
        this.clienteService.getCliente(id).subscribe(
          (cliente) => this.cliente = cliente
        )
      }
    });

    this.clienteService.getRegiones().subscribe(regiones => this.regiones = regiones);
  }

  crear(): void {
    this.clienteService.crear(this.cliente).subscribe(
      cliente => {
        this.router.navigate(['/clientes'])
        swal('Nuevo Cliente', `Cliente: ${cliente.nombre} registrado exitosamente`, 'success')
      },
      err => {
        this.errores = err.error.errors as string[];
        //console.error('Error: ' + err.status);
        //console.error(err.error.errors);
      }
    );
  }

  actualizar(): void{
    this.cliente.facturas = null;
    
    this.clienteService.actualizar(this.cliente).subscribe(
      json => {
        this.router.navigate(['/clientes'])
        swal('Cliente Actualizado', `Cliente: ${json.cliente.nombre} actualizado con éxito!`, 'success')
      },
      err => {
        this.errores = err.error.errors as string[];
        //console.error('Error: ' + err.status);
        //console.error(err.error.errors);
      }
    );
  }

  comparaRegion(reg1:Region, reg2:Region): boolean {
    if(reg1 === undefined && reg2 === undefined){
      return true;
    }
    
    return reg1 === null || reg2 === null || reg1 === undefined || reg2 === undefined? false : reg1.id === reg2.id;
  }
   
}
