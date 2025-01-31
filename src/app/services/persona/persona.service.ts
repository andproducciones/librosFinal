import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
private API_URL = 'http://localhost/libros/login.php'; // Cambia esto a la URL de tu backend

  constructor(private http: HttpClient) { }

  registrar(datos: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-type','application/json');
  
    var data = JSON.stringify({ accion: 'insertarPersona', ...datos });
    //console.log(data);
    return this.http.post(this.API_URL, data,{ headers:headers });
    //console.log(res);
    
  }

  
  
  recuperarPassword(correo: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post(this.API_URL, { accion: 'recover_pass', correo }, { headers });
  }

  perfil(codigo: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post(this.API_URL, { accion: 'dato', codigo }, { headers });
  }

}
