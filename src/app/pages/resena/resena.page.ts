import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { ResenasService } from 'src/app/services/resenas/resenas.service';

@Component({
  selector: 'app-resena',
  templateUrl: './resena.page.html',
  styleUrls: ['./resena.page.scss'],
  standalone: false
})
export class ResenaPage implements OnInit {
  resenaForm: FormGroup;
  isEdit = false;
  resenaId: number | null = null;
  @Input() resena: any;
  @Input() libroId!: number; // Se recibe el ID del libro para asociar la reseña

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private resenasService: ResenasService,
    private alertController: AlertController,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resenaForm = this.fb.group({
      valoracion: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
      comentario: ['', Validators.required]
    });
  }

  ngOnInit() {

    //console.log('ID del libro recibido:', this.resenaId); 
    if (this.resena) {

      //console.log(this.resena);
      this.isEdit = true;
      this.resenaId = this.resena.id;
      //console.log(this.resenaId);
      this.cargarResena();
    }
  }

  cargarResena() {
    if (this.resena) {
      this.resenaForm.patchValue(this.resena);
    } else {
      this.showAlert('Error', 'No se encontraron los datos de la reseña.');
    }
  }

  guardarResena() {
    if (this.resenaForm.invalid) {
      this.resenaForm.markAllAsTouched(); // Resalta los campos inválidos
      this.showAlert('Error', 'Completa todos los campos.');
      return;
    }

    const resenaData = this.resenaForm.value;
    resenaData.libro_id = this.libroId; // Asociar la reseña con el libro
    resenaData.resena_id = this.resenaId
    console.log(resenaData);

    if (this.isEdit) {
      // Actualizar reseña existente
      this.resenasService.editarResena(this.resenaId!, resenaData).subscribe(
        response => {
          console.log(response);
          if (response.estado) {
            this.showAlert('Éxito', 'Reseña actualizada correctamente.');
            this.modalCtrl.dismiss(true); // Se pasa `true` para recargar la lista de reseñas
          } else {
            this.showAlert('Error', 'No se pudo actualizar la reseña11.');
          }
        },
        error => this.showAlert('Error', 'No se pudo actualizar la reseña12.')
      );
    } else {
      // Agregar una nueva reseña
      this.resenasService.agregarResena(resenaData).subscribe(
        response => {
          console.log(response);
          if (response.estado) {
            this.showAlert('Éxito', 'Reseña agregada correctamente.');
            this.modalCtrl.dismiss(true); // Se pasa `true` para recargar la lista de reseñas
          } else {
            this.showAlert('Error', 'No se pudo agregar la reseña21.');
          }
        },
        () => this.showAlert('Error', 'No se pudo agregar la reseña22.')
      );
    }
  }

  async showAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async cerrarModal() {
    await this.modalCtrl.dismiss();
  }
}
