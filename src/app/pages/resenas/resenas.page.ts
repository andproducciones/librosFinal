import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResenasService } from 'src/app/services/resenas/resenas.service';
import { ResenaPage } from '../resena/resena.page';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-resenas',
  templateUrl: './resenas.page.html',
  styleUrls: ['./resenas.page.scss'],
  standalone: false
})
export class ResenasPage implements OnInit {
  resenas: any[] = [{
    id: 1,
    libro_id: 1,
    usuario_id: 1,
    calificacion: 9,
    comentario: "Una obra maestra que me transportó a Macondo. La narrativa de Gabriel García Márquez es única.",
    fecha: "2025-01-01 14:30:00",
  },
  {
    id: 2,
    libro_id: 1,
    usuario_id: 2,
    calificacion: 8,
    comentario: "Muy buen libro, aunque algunos pasajes se sienten un poco densos.",
    fecha: "2025-01-03 10:15:00",
  },
  {
    id: 3,
    libro_id: 2,
    usuario_id: 3,
    calificacion: 10,
    comentario: "Impactante y visionario. Orwell describe un futuro que se siente más cercano cada día.",
    fecha: "2025-01-05 16:45:00",
  },
  {
    id: 4,
    libro_id: 2,
    usuario_id: 4,
    calificacion: 7,
    comentario: "Me gustó la historia, pero algunas partes fueron difíciles de seguir.",
    fecha: "2025-01-07 09:20:00",
  },
  {
    id: 5,
    libro_id: 3,
    usuario_id: 5,
    calificacion: 10,
    comentario: "Un clásico imprescindible. La locura de Don Quijote y la lealtad de Sancho Panza me hicieron reír y reflexionar.",
    fecha: "2025-01-10 13:10:00",
  },
  {
    id: 6,
    libro_id: 3,
    usuario_id: 6,
    calificacion: 8,
    comentario: "La obra es excelente, pero se necesita paciencia para disfrutarla por completo.",
    fecha: "2025-01-12 11:00:00",
  },
  {
    id: 7,
    libro_id: 4,
    usuario_id: 7,
    calificacion: 9,
    comentario: "Jane Austen muestra de manera brillante las tensiones sociales y los matices del amor.",
    fecha: "2025-01-14 15:30:00",
  },
  {
    id: 8,
    libro_id: 4,
    usuario_id: 8,
    calificacion: 6,
    comentario: "No fue lo que esperaba, aunque los personajes están bien desarrollados.",
    fecha: "2025-01-15 18:45:00",
  },
  {
    id: 9,
    libro_id: 5,
    usuario_id: 9,
    calificacion: 10,
    comentario: "La Tierra Media de Tolkien es un mundo mágico que me cautivó por completo. ¡Impresionante!",
    fecha: "2025-01-18 20:00:00",
  },
  {
    id: 10,
    libro_id: 5,
    usuario_id: 10,
    calificacion: 9,
    comentario: "Un viaje épico lleno de aventuras y personajes inolvidables. Altamente recomendado.",
    fecha: "2025-01-19 09:50:00",
  }];
  libroId: any;
  libroTitulo: string = '';


  constructor(
    private route: ActivatedRoute,
    private resenasService: ResenasService,
    private router: Router,
    private modalCtrl: ModalController, 
  ) {}

  ngOnInit() {
    // Obtener el ID del libro desde la URL
    this.libroId = +this.route.snapshot.paramMap.get('id')!;
    this.libroTitulo = this.route.snapshot.queryParamMap.get('titulo') || 'Libro';
    this.obtenerResenas();
  }

  obtenerResenas() {
    this.resenasService.obtenerResenas(this.libroId).subscribe(response => {
      this.resenas = response;
    }, error => {
      console.error('Error al obtener las reseñas', error);
    });
  }

  
  async abrirModalNuevaResena() {
    const modal = await this.modalCtrl.create({
      component: ResenaPage,
      cssClass: 'modal-bottom',
      backdropDismiss: false
    });

    modal.onDidDismiss().then(() => this.obtenerResenas());
    return modal.present();
  }

  async abrirModalEditarResena(resena: any) {
    const modal = await this.modalCtrl.create({
      component: ResenaPage,
      componentProps: { resena },
      cssClass: 'modal-bottom',
      backdropDismiss: false
    });

    modal.onDidDismiss().then(() => this.obtenerResenas());
    return modal.present();
  }

  eliminarResena(resenaId: number) {
    this.resenasService.eliminarResena(resenaId).subscribe(response => {
      if (response.estado) {
        this.resenas = this.resenas.filter(resena => resena.id !== resenaId);
        alert('Reseña eliminada correctamente.');
      } else {
        alert('No se pudo eliminar la reseña.');
      }
    });
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