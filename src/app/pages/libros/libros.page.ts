import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
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
nombreUsuario: string = 'Usuario'; // Nombre por defecto
libros: any[] = [{
  id: 1,
  titulo: "Cien años de soledad",
  autor: "Gabriel García Márquez",
  anio_publicacion: 1967,
  descripcion: "Una obra maestra de la literatura latinoamericana que narra la historia de la familia Buendía en el pueblo ficticio de Macondo."
},
{
  id: 2,
  titulo: "1984",
  autor: "George Orwell",
  anio_publicacion: 1949,
  descripcion: "Una novela distópica que presenta un futuro totalitario bajo la vigilancia constante del Gran Hermano."
},
{
  id: 3,
  titulo: "Don Quijote de la Mancha",
  autor: "Miguel de Cervantes",
  anio_publicacion: 1605,
  descripcion: "La historia del caballero Don Quijote y su escudero Sancho Panza en su lucha por la justicia y la aventura."
},
{
  id: 4,
  titulo: "Orgullo y prejuicio",
  autor: "Jane Austen",
  anio_publicacion: 1813,
  descripcion: "Una novela romántica sobre el amor y el matrimonio en la sociedad inglesa del siglo XIX."
},
{
  id: 5,
  titulo: "El señor de los anillos",
  autor: "J.R.R. Tolkien",
  anio_publicacion: 1954,
  descripcion: "Una de las obras de fantasía más influyentes, que sigue la lucha entre el bien y el mal en la Tierra Media."
},
{
  id: 6,
  titulo: "Crimen y castigo",
  autor: "Fiódor Dostoyevski",
  anio_publicacion: 1866,
  descripcion: "Un thriller psicológico sobre un joven que comete un asesinato y lucha con su conciencia."
},
{
  id: 7,
  titulo: "El alquimista",
  autor: "Paulo Coelho",
  anio_publicacion: 1988,
  descripcion: "Una novela inspiradora sobre la importancia de seguir los sueños y encontrar el destino."
},
{
  id: 8,
  titulo: "Harry Potter y la piedra filosofal",
  autor: "J.K. Rowling",
  anio_publicacion: 1997,
  descripcion: "El comienzo de la historia de Harry Potter y su ingreso al mundo de la magia en Hogwarts."
},
{
  id: 9,
  titulo: "Los juegos del hambre",
  autor: "Suzanne Collins",
  anio_publicacion: 2008,
  descripcion: "Una novela de ciencia ficción donde jóvenes deben luchar por su supervivencia en una competencia mortal."
},
{
  id: 10,
  titulo: "Rayuela",
  autor: "Julio Cortázar",
  anio_publicacion: 1963,
  descripcion: "Una novela experimental que permite múltiples formas de lectura y aborda temas filosóficos y existenciales."
}
];

  constructor(private router: Router, private librosService: LibrosService,private modalCtrl: ModalController) {}

  ngOnInit() {
    // Obtener datos del usuario desde el localStorage
    const userData = localStorage.getItem('userData');
    if (userData) {
      const usuario = JSON.parse(userData);
      this.nombreUsuario = usuario.nombre || 'Usuario';
    }
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
    this.librosService.obtenerLibros().subscribe(response => {
      this.libros = response;
    }, error => {
      console.error('Error al obtener los libros', error);
    });
  }

  verResenas(libroId: number) {
    this.router.navigate(['/resenas', libroId]);
  }

  editarLibro(libroId: number) {
    this.router.navigate(['/libro', libroId]);
  }

  eliminarLibro(libroId: number) {
    // Lógica para eliminar un libro
    this.librosService.eliminarLibro(libroId).subscribe(response => {
      if (response.estado) {
        this.libros = this.libros.filter(libro => libro.id !== libroId);
        alert('Libro eliminado correctamente.');
      } else {
        alert('No se pudo eliminar el libro.');
      }
    });
  }

  async abrirModalAgregarLibro() {
    const modal = await this.modalCtrl.create({
      component: LibroPage,
      cssClass: 'modal-bottom',
      backdropDismiss: false
    });
  
    await modal.present(); // Asegurar que el modal se presente correctamente
  }
  
  async abrirModalEditarLibro(libro: any) {
    const modal = await this.modalCtrl.create({
      component: LibroPage,
      componentProps: { libro },
      cssClass: 'modal-bottom', // <-- Clase para abrir desde abajo
      backdropDismiss: false
    });
  
    modal.onDidDismiss().then(() => this.obtenerLibros());
    return modal.present();
  }

  getStarArray(valoracion: number): string[] {
    const estrellas = [];
    const valorRedondeado = Math.round(valoracion * 2) / 2; // Redondear a 0.5 más cercano

    for (let i = 1; i <= 5; i++) {
      if (i <= valorRedondeado) {
        estrellas.push('star'); // Estrella llena ⭐
      } else if (i - 0.5 === valorRedondeado) {
        estrellas.push('star-half'); // Media estrella ✰
      } else {
        estrellas.push('star-outline'); // Estrella vacía ☆
      }
    }
    return estrellas;
  }




  irPerfil() {
    this.router.navigate(['/perfil']); // Navegar a la página de perfil
  }

  irLibros() {
    this.router.navigate(['/libros']); // Navegar a la página de perfil
  }

  irResenas() {
    this.router.navigate(['/resenas']); // Navegar a la página de perfil
  }

  cerrarSesion() {
    localStorage.removeItem('userData'); // Eliminar datos de sesión
    this.router.navigate(['/login']); // Redirigir al login
  }
}
