import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResenasService } from 'src/app/services/resenas/resenas.service';
import { ResenaPage } from '../resena/resena.page';
import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-resenas',
  templateUrl: './resenas.page.html',
  styleUrls: ['./resenas.page.scss'],
  standalone: false
})
export class ResenasPage implements OnInit {
  resenas: any[] = [];
  libroId: number = 0;
  libroTitulo: string = '';

  constructor(
    private route: ActivatedRoute,
    private resenasService: ResenasService,
    private router: Router,
    private modalCtrl: ModalController,
    private toastController: ToastController // ✅ Se añade ToastController para notificaciones
  ) {}

  ngOnInit() {
    // Obtener el ID del libro desde la URL
    this.libroId = +this.route.snapshot.paramMap.get('id')!;
    7//console.log('ID del libro:', this.libroId);
    //this.libroTitulo = this.route.snapshot.queryParamMap.get('titulo') || 'Libro';
    this.obtenerResenas();
  }

  obtenerResenas() {
    this.resenasService.obtenerResenas(this.libroId).subscribe(response => {
      //console.log('Respuesta del servidor:', response);
      if (response.estado) {
        this.resenas = response.resenas;
      } else {
        console.error('No se encontraron reseñas.');
      }
    }, error => {
      console.error('Error al obtener las reseñas', error);
    });
  }

  async abrirModalNuevaResena() {
    const modal = await this.modalCtrl.create({
      component: ResenaPage,
      componentProps: { libroId: this.libroId },
      cssClass: 'modal-bottom',
      backdropDismiss: false
    });

    await modal.present();
    modal.onDidDismiss().then(() => this.obtenerResenas());
 
  }

  async abrirModalEditarResena(resena: any) {
    const modal = await this.modalCtrl.create({
      component: ResenaPage,
      componentProps: { resena, libroId: this.libroId },
      cssClass: 'modal-bottom',
      backdropDismiss: false
    });

    await modal.present();
    modal.onDidDismiss().then(() => this.obtenerResenas());

  }

  eliminarResena(resenaId: number) {
    this.resenasService.eliminarResena(resenaId).subscribe(response => {
      if (response.estado) {
        this.resenas = this.resenas.filter(resena => resena.id !== resenaId);
        this.mostrarToast('Reseña eliminada correctamente.', 'success');
      } else {
        this.mostrarToast('No se pudo eliminar la reseña.', 'danger');
      }
    }, error => {
      this.mostrarToast('Error en la conexión con el servidor.', 'danger');
    });
  }

  async mostrarToast(mensaje: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    toast.present();
  }

  /**
   * Genera un array de estrellas según la calificación.
   * Ejemplo: Si la calificación es 4.5, devuelve ['star', 'star', 'star', 'star', 'star-half'].
   */
  getStarArray(calificacion: number): string[] {
    const estrellas = [];
    const valorRedondeado = Math.round(calificacion * 2) / 2;

    for (let i = 1; i <= 5; i++) {
      if (i <= valorRedondeado) {
        estrellas.push('star'); // Estrella llena
      } else if (i - 0.5 === valorRedondeado) {
        estrellas.push('star-half'); // Media estrella
      } else {
        estrellas.push('star-outline'); // Estrella vacía
      }
    }
    return estrellas;
  }
}
