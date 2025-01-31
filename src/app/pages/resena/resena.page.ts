import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
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

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private resenasService: ResenasService
  ) {
    this.resenaForm = this.fb.group({
      calificacion: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
      comentario: ['', Validators.required]
    });
  }

  ngOnInit() {}

  setResena(resena: any) {
    if (resena) {
      this.isEdit = true;
      this.resenaId = resena.id;
      this.resenaForm.patchValue(resena);
    }
  }

  cerrarModal() {
    this.modalCtrl.dismiss();
  }

  guardarResena() {
    if (this.isEdit) {
      this.resenasService.editarResena(this.resenaId!, this.resenaForm.value).subscribe(response => {
        this.modalCtrl.dismiss(response);
      });
    } else {
      this.resenasService.agregarResena(this.resenaForm.value).subscribe(response => {
        this.modalCtrl.dismiss(response);
      });
    }
  }
}