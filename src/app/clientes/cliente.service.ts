import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
//import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente';
import { Region } from './region';
import { of, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { map, tap, catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '../usuarios/auth.service';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private urlEndPoint: string = 'http://localhost:9090/api/clientes';
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  private agregarAuthorizationHeader(){
    let token = this.authService.token;
    
    if(token != null){
      return this.httpHeaders.append('Authorization','Bearer ' + token);
    }

    return this.httpHeaders;
  }

  private isNotAuthorized(e): boolean{ // 401 => Unauthorized (No autorizado), 403 => Forbidden (Prohibido)
    if(e.status==401){

      if(this.authService.isAuthenticated()){
        this.authService.logout();
      }

      this.router.navigate(['/login']);
      return true;
    }
    else if(e.status==403){
      swal('Acceso denegado', `Usuario: ${this.authService.usuario.username} sin acceso a este recurso`, 'warning');
      this.router.navigate(['/clientes']);
      return true;
    }    

    return false;
  }

  getRegiones(): Observable<Region[]>{
    return this.http.get<Region[]>(this.urlEndPoint + '/regiones', {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(e => {
        this.isNotAuthorized(e);
        return throwError(e);
      })
    );
  }

  getClientes(page: number): Observable<any>{
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) => {
        console .log('ClienteService: tap 1');
        (response.content as Cliente[]).forEach(cliente => {
          //console.log(cliente.nombre);
        });
      }),
      map( (response: any) => {
        (response.content as Cliente[]).map(cliente => {
          //cliente.nombre = cliente.nombre.toUpperCase();
          //cliente.fecha = formatDate(cliente.fecha,'dd/MM/yyyy','es-MX');
          return cliente;
        });
        return response;
      }),
      tap(response => {
        console.log('ClienteService: tap 2');
        (response.content as Cliente[]).forEach(cliente => {
          //console.log(cliente.nombre);
        });
      })
    );
  }

  getCliente(id): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(e => {
        if(this.isNotAuthorized(e)){
          return throwError(e);
        }

        this.router.navigate(['/clientes']);
        swal('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    )
  }

  crear(cliente: Cliente):  Observable<Cliente>{
    return this.http.post(this.urlEndPoint, cliente, {headers: this.agregarAuthorizationHeader()}).pipe(
      map( (response: any) => response.cliente as Cliente ),
      catchError(e =>{
        if(this.isNotAuthorized(e)){
          return throwError(e);
        }

        if(e.status==400){
          return throwError(e); 
        }
        swal('Error al crear', e.error.mensaje, 'error');
        return throwError(e);        
      })
    );
  }

  actualizar(cliente: Cliente): Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(e =>{
        if(this.isNotAuthorized(e)){
          return throwError(e);
        }

        if(e.status==400){
          return throwError(e); 
        }
        swal('Error al actualizar', e.error.mensaje, 'error');
        return throwError(e);        
      })
    );
  }

  eliminar(id: number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(e =>{
        if(this.isNotAuthorized(e)){
          return throwError(e);
        }

        swal('Error al eliminar', e.error.mensaje, 'error');
        return throwError(e);        
      })
    );
  } 

  subirImagen(archivo: File, id): Observable<HttpEvent<{}>> {   // Observable<Cliente> {
    let formData = new FormData();

    formData.append("archivo", archivo);
    formData.append("id", id);

    let httpHeaders = new HttpHeaders();
    let token = this.authService.token;

    if(token != null){
      this.httpHeaders = httpHeaders.append('Authorization','Bearer ' + token);
    }

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true,
      headers: this.httpHeaders
    });

    return this.http.request(req).pipe(
      catchError(e => {
        this.isNotAuthorized(e);
        return throwError(e);
      })
    );

    /*return this.http.request(`${this.urlEndPoint}/upload`, formData).pipe(
      map( (response: any) => response.cliente as Cliente ),
      catchError(e =>{
        swal(e.error.mensaje, e.error.error, 'error');
        return throwError(e);        
      })
    );*/
  }

}
