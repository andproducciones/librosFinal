import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LibroPageRoutingModule } from './libro-routing.module';
import { LibroPage } from './libro.page';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LibroPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [LibroPage]
})
export class LibroPageModule {}
