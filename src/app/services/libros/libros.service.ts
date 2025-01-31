import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LibrosService {
  private API_URL = 'https://tuservidor.com/api.php';

  constructor(private http: HttpClient) {}

  obtenerLibros(): Observable<any> {
    return this.http.post(this.API_URL, { accion: 'obtener_libros' });
  }

  agregarLibro(libroData: any): Observable<any> {
    return this.http.post(this.API_URL, { accion: 'agregar_libro', ...libroData });
  }

  editarLibro(libroId: number, libroData: any): Observable<any> {
    return this.http.post(this.API_URL, { accion: 'editar_libro', libro_id: libroId, ...libroData });
  }
  eliminarLibro(libroId: number): Observable<any> {
    return this.http.post(this.API_URL, { accion: 'eliminar_libro', libro_id: libroId });
  }
}
