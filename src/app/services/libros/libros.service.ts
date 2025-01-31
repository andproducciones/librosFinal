import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LibrosService {
  private API_URL = 'http://localhost/libros/libros.php';
  private headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) {}

  // Obtener todos los libros
  obtenerLibros(): Observable<any> {
    const body = { 'accion': 'obtener_libros' };
    return this.http.post(this.API_URL, body, { headers: this.headers });
  }

  // Obtener un libro por su ID
  obtenerLibro(libroId: any): Observable<any> {
    const body = { 'accion': 'obtener_libro', 'libro_id': libroId };
    return this.http.post(this.API_URL, body, { headers: this.headers });
  }

  // Agregar un nuevo libro
  agregarLibro(libroData: any): Observable<any> {
    return this.http.post(this.API_URL, JSON.stringify({ accion: 'agregar_libro', ...libroData }), { headers: this.headers });
  }

  // Editar un libro existente
  editarLibro(libroId: number, libroData: any): Observable<any> {

    const body = { 'accion': 'editar_libro', libro_id: libroId, ...libroData };
    //console.log(body);

    return this.http.post(this.API_URL, body, { headers: this.headers });
  }

  // Eliminar un libro
  eliminarLibro(libroId: number): Observable<any> {
    return this.http.post(this.API_URL, JSON.stringify({ accion: 'eliminar_libro', libro_id: libroId }), { headers: this.headers });
  }
}
