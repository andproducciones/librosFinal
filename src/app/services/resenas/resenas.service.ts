import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResenasService {

  private API_URL = 'https://tuservidor.com/api.php';

  constructor(private http: HttpClient) {}

  obtenerResenas(libroId: number): Observable<any> {
    return this.http.post(this.API_URL, { accion: 'obtener_resenas', libro_id: libroId });
  }
  agregarResena(resenaData: any): Observable<any> {
    return this.http.post(this.API_URL, { accion: 'agregar_resena', ...resenaData });
  }

  editarResena(resenaId: number, resenaData: any): Observable<any> {
    return this.http.post(this.API_URL, { accion: 'editar_resena', resena_id: resenaId, ...resenaData });
  }

  eliminarResena(resenaId: number): Observable<any> {
    return this.http.post(this.API_URL, { accion: 'eliminar_resena', resena_id: resenaId });
  }
}
