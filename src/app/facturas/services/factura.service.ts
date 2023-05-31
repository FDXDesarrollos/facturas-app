import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Factura } from '../models/factura';
import { Producto } from '../models/producto';


@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private urlEndPoint: string = 'http://localhost:9090/api/facturas';

  constructor(private http: HttpClient) { }

  getFactura(id: number): Observable<Factura>{
    return this.http.get<Factura>(`${this.urlEndPoint}/${id}`);
  }

  eliminaFac(id: number): Observable<void>{
    return this.http.delete<void>(`${this.urlEndPoint}/${id}`);
  }

  buscaProd(term: string): Observable<Producto[]>{
    return this.http.get<Producto[]>(`${this.urlEndPoint}/busca-prod/${term}`);
  }

  crearFactura(factura: Factura): Observable<Factura>{
    return this.http.post<Factura>(this.urlEndPoint, factura);
  }

}
