import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
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
    private router: Router
  ) {
    this.libroForm = this.fb.group({
      titulo: ['', Validators.required],
      autor: ['', Validators.required],
      anio_publicacion: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
      descripcion: ['', Validators.required],
      valoracion: ['', [Validators.required, Validators.min(1), Validators.max(10)]]
    });
  }

  ngOnInit() {}

  setLibro(libro: any) {
    if (libro) {
      this.isEdit = true;
      this.libroId = libro.id;
      this.libroForm.patchValue(libro);
    }
  }

  async cerrarModal() {

   
    this.router.navigate(['/libros']);
    await this.modalCtrl.dismiss();
  }

  guardarLibro() {
    if (this.isEdit) {
      // Editar libro existente
      this.librosService.editarLibro(this.libroId!, this.libroForm.value).subscribe(response => {
        this.modalCtrl.dismiss(response);
      });
    } else {
      // Agregar nuevo libro
      this.librosService.agregarLibro(this.libroForm.value).subscribe(response => {
        this.modalCtrl.dismiss(response);
      });
    }
  }
}