import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { LibrosService } from 'src/app/services/libros/libros.service';

@Component({
  selector: 'app-libro',
  templateUrl: './libro.page.html',
  styleUrls: ['./libro.page.scss'],
  standalone: false
})
export class LibroPage implements OnInit {
  libroForm: FormGroup;
  isEdit = false;
  libroId: number | null = null;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private librosService: LibrosService,
    private alertController: AlertController,
    private route: ActivatedRoute,
    private router: Router 
  ) {
    this.libroForm = this.fb.group({
      titulo: ['', Validators.required],
      autor: ['', Validators.required],
      descripcion: ['', Validators.required],
      portada: [null], // Para manejar archivos
      fecha_publicacion: [
        '',
        [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())],
      ],
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.libroId = id ? +id : null;
      if (this.libroId) {
        this.isEdit = true;
        this.cargarLibro();
      }
    });
  }

  cargarLibro() {
    if (this.libroId) {
      this.librosService.obtenerLibro(this.libroId).subscribe(
        response => {
          console.log('Respuesta del servicio:', response);
          
          if (response.estado && response.libro) { // Verifica que 'libro' existe en la respuesta
            this.libroForm.patchValue(response.libro);
          } else {
            this.showAlert('Error', 'No se encontraron los datos del libro.');
          }
        },
        () => this.showAlert('Error', 'No se pudieron cargar los datos del libro.')
      );
    }
  }

  guardarLibro() {
    if (this.libroForm.invalid) {
      this.libroForm.markAllAsTouched(); // Resalta los campos inválidos
      this.showAlert('Error', 'Completa todos los campos.');
      return;
    }
  
    // Obtener los datos directamente del formulario
    const libroData = this.libroForm.value;

    //console.log(libroData);
  
    // Asegurarse de que las fechas estén en el formato correcto
    if (libroData.fecha_publicacion) {
      libroData.fecha_publicacion = new Date(libroData.fecha_publicacion).toISOString().split('T')[0];
    }

    //console.log(libroData);
  
    if (this.isEdit) {
      // Actualizar libro existente
      this.librosService.editarLibro(this.libroId!, libroData).subscribe(
        response => {
          console.log('Respuesta del servicio:', response);
          if (response.estado) {
            this.showAlert('Exito', 'El libro se actualizó correctamente.');
            this.modalCtrl.dismiss();
            this.router.navigate(['/libros']);
            
          } else {
            this.showAlert('Error', 'No se pudo actualizar el libro.');
          }
          
        },
        () => this.showAlert('Error', 'No se pudo actualizar el libro.')
      );
    } else {
      // Agregar un nuevo libro
      this.librosService.agregarLibro(libroData).subscribe(
        response => {
          console.log('Respuesta del servicio:', response);
          if (response.estado) {
            this.showAlert('Exito', 'El libro se actualizó correctamente.');
            this.modalCtrl.dismiss();
            this.router.navigate(['/libros']);
            
          } else {
            this.showAlert('Error', 'No se pudo actualizar el libro.');
          }
        },
        () => this.showAlert('Error', 'No se pudo agregar el libro.')
      );
    }
  }
  

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.libroForm.patchValue({ portada: file });
    }
  }

  async showAlert(title: string, message: string) {
    const alert = await this.alertController.create({ header: title, message, buttons: ['OK'] });
    await alert.present();
  }

  async cerrarModal() {
    this.router.navigate(['/libros']); // Redirigir al menú después del login
    await this.modalCtrl.dismiss();
    this.libroForm.reset();
  }
}