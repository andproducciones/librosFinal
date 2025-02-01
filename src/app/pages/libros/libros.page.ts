import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import { LibrosService } from 'src/app/services/libros/libros.service';
import { LibroPage } from '../libro/libro.page';
import { ModalController } from '@ionic/angular'; // Asegúrate de importar ModalController
import { ResenasService } from 'src/app/services/resenas/resenas.service';
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
  resenas: any[] = [];
  promediosValoracion: { [key: number]: number } = {};

  constructor(
    private router: Router,
    private librosService: LibrosService,
    private resenasService: ResenasService,
    private modalCtrl: ModalController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    if (!this.verificarUsuario()) {
      return; // ✅ Detener la ejecución si el usuario no está autenticado
    }
    this.cargarUsuario();
    this.obtenerLibros();
  }

  verificarUsuario(): boolean {
    const userData = localStorage.getItem('userData');
  
    if (!userData) {
      this.router.navigate(['/login']); // ✅ Redirigir si no hay usuario autenticado
      return false; // ✅ Devolver `false` para detener la ejecución
    }
  
    return true; // ✅ Usuario autenticado, continuar con el flujo normal
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
        this.libros.forEach(libro => this.obtenerResenasPromedio(libro.id));
        
        
        
        
        //console.log(response);
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

  obtenerResenasPromedio(libroId: number) {
    this.resenasService.obtenerResenasValoracion(libroId).subscribe(
      response => {
        if (response.estado) {
          this.promediosValoracion[libroId] = response.promedio; // ✅ Guardar el promedio del backend
        } else {
          this.promediosValoracion[libroId] = 0; // Si no hay reseñas, el promedio es 0
        }
      },
      error => {
        console.error('Error al obtener las reseñas', error);
        this.promediosValoracion[libroId] = 0; // Si hay error, mostrar 0
      }
    );
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
