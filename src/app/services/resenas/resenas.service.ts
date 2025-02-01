import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResenasService {
  private API_URL = 'http://localhost/libros/resenas.php'; // URL del backend
  private headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) {}

  obtenerResenas(libroId: number): Observable<any> {
    return this.http.post(
      this.API_URL,
      { 'accion': 'obtener_resenas', libro_id: libroId },
      { headers: this.headers }
    );
  }

  agregarResena(resenaData: any): Observable<any> {
    console.log(resenaData);
    return this.http.post(
      this.API_URL,
      { 'accion': 'agregar_resena', ...resenaData },
      { headers: this.headers }
    );
  }

  editarResena(resenaId: number, resenaData: any): Observable<any> {

    const body = { accion: 'editar_resena', resena_id: resenaId, ...resenaData };

    console.log(body)
    return this.http.post(
      this.API_URL,
      body,
      { headers: this.headers }
    );
  }

  eliminarResena(resenaId: number): Observable<any> {
    return this.http.post(
      this.API_URL,
      { 'accion': 'eliminar_resena', resena_id: resenaId },
      { headers: this.headers }
    );
  }


  obtenerResenasValoracion(libroId: number): Observable<any> {
    return this.http.post(
      this.API_URL,
      { 'accion': 'obtener_resenas_valoracion', libro_id: libroId },
      { headers: this.headers }
    );
  }
}
