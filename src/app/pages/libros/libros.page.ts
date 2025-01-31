import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import { LibrosService } from 'src/app/services/libros/libros.service';
import { LibroPage } from '../libro/libro.page';
import { ModalController } from '@ionic/angular'; // Asegúrate de importar ModalController
@Component({
  selector: 'app-libros',
  templateUrl: './libros.page.html',
  styleUrls: ['./libros.page.scss'],
  standalone: true, // ✅ Define el componente como standalone
    imports: [IonicModule, CommonModule, FormsModule] // ✅ Se importa IonicModule en lugar de componentes individuales
  
})
export class LibrosPage implements OnInit {
  nombreUsuario: string = 'Usuario';
  libros: any[] = [];

  constructor(
    private router: Router,
    private librosService: LibrosService,
    private modalCtrl: ModalController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.cargarUsuario();
    this.obtenerLibros();
  }

  cargarUsuario() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const usuario = JSON.parse(userData);
      this.nombreUsuario = usuario.nombre || 'Usuario';
    }
  }

  obtenerLibros() {
    this.librosService.obtenerLibros().subscribe(
      response => {
        
        this.libros = response.libros;
        console.log(response);
      },
      error => {this.showAlert('Error', 'No se pudieron cargar los libros.')
      });
  }



  verResenas(libroId: number) {
    this.router.navigate(['/resenas', libroId]);
  }

  editarLibro(libroId: number) {
    this.router.navigate(['/libro', libroId]);
  }

  eliminarLibro(libroId: number) {
    this.librosService.eliminarLibro(libroId).subscribe(
      response => {
        if (response.estado) {
          this.obtenerLibros(); // Recargar libros en vez de filtrar manualmente
          this.showAlert('Éxito', 'Libro eliminado correctamente.');
        } else {
          this.showAlert('Error', 'No se pudo eliminar el libro.');
        }
      },
      error => this.showAlert('Error', 'Ocurrió un problema al eliminar el libro.')
    );
  }

  async abrirModalAgregarLibro() {
    const modal = await this.modalCtrl.create({
      component: LibroPage,
      cssClass: 'modal-bottom',
      backdropDismiss: false
    });

    modal.onDidDismiss().then(() => this.obtenerLibros()); // Recargar lista tras cerrar modal
    await modal.present();
  }

  async abrirModalEditarLibro(libro: any) {
    const modal = await this.modalCtrl.create({
      component: LibroPage,
      componentProps: { libro },
      cssClass: 'modal-bottom',
      backdropDismiss: false
    });

    modal.onDidDismiss().then(() => this.obtenerLibros());
    await modal.present();
  }

  getStarArray(valoracion: number): string[] {
    const estrellas = [];
    const valorRedondeado = Math.round(valoracion * 2) / 2;

    for (let i = 1; i <= 5; i++) {
      estrellas.push(i <= valorRedondeado ? 'star' : i - 0.5 === valorRedondeado ? 'star-half' : 'star-outline');
    }
    return estrellas;
  }

  irPerfil() {
    this.router.navigate(['/perfil']);
  }

  irLibros() {
    this.router.navigate(['/libros']);
  }

  irResenas() {
    this.router.navigate(['/resenas']);
  }

  cerrarSesion() {
    localStorage.removeItem('userData');
    this.router.navigate(['/login']);
  }

  async showAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
