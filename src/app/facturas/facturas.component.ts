import { Component, OnInit } from '@angular/core';
import { Factura } from './models/factura';
import { ClienteService } from '../clientes/cliente.service';

import { ActivatedRoute, Router } from '@angular/router';

import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, flatMap} from 'rxjs/operators';

import {FacturaService} from './services/factura.service';
import {Producto} from './models/producto';
import { ItemFactura } from './models/item-factura';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import swal from 'sweetalert2'; 


@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit {

  titulo: string = 'Nueva Factura';
  factura: Factura = new Factura();

  autocompleteControl = new FormControl('');
  articulosFiltrados: Observable<Producto[]>;  

  constructor(private clienteService: ClienteService, 
              private activatedRoute: ActivatedRoute,
              private facturaService: FacturaService,
              private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let clienteId = Number(params.get('clienteId'));
      this.clienteService.getCliente(clienteId).subscribe(cliente => this.factura.cliente = cliente);
    });

    this.articulosFiltrados = this.autocompleteControl.valueChanges.pipe(
      map(value => typeof value === 'string' ? value : value),
      flatMap(value => value ? this._filter(value) : [])
    );
  }

  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toString().toLowerCase();

    return this.facturaService.buscaProd(filterValue);
  }

  mostrarNombre(producto?: Producto): string | undefined {
    return producto ? producto.nombre : undefined;
  }

  seleccionarArticulo(event: MatAutocompleteSelectedEvent): void {
    let producto = event.option.value as Producto;
    console.log(producto);

    if(this.existeItem(producto.id)){
      this.incrementaCantidad(producto.id);
    }
    else{
      let nuevoItem = new ItemFactura();
      nuevoItem.producto = producto;
      this.factura.items.push(nuevoItem);
    }

    this.autocompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();
  }

  actualizaCantidad(id: number, event: any): void {
    let cantidad:number = event.target.value as number;

    if(cantidad == 0){
      return this.eliminaItemFactura(id);
    }

    this.factura.items = this.factura.items.map((item:ItemFactura) => {
      if(id === item.producto.id) {
        item.cantidad = cantidad;
      }

      return item;
    });
  }

  existeItem(id: number): boolean {
    let existe = false;

    this.factura.items.forEach((item: ItemFactura) =>{
      if(id === item.producto.id){ existe = true; }
    });

    return existe;
  }

  incrementaCantidad(id: number): void {
    this.factura.items = this.factura.items.map((item:ItemFactura) => {
      if(id === item.producto.id){
        ++ item.cantidad;
      }

      return item;
    })
  }

  eliminaItemFactura(id: number): void {
    this.factura.items = this.factura.items.filter((item: ItemFactura) => id !== item.producto.id);
  }

  crearFactura(): void {
    console.log(this.factura);

    this.facturaService.crearFactura(this.factura).subscribe(factura => {
      swal(this.titulo, `Factura "${factura.descripcion}" registrada con éxito`, 'success');
      this.router.navigate(['/clientes']);
    });
  }

}
