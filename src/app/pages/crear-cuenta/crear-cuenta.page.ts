import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { PersonaService } from '../../services/persona/persona.service';

@Component({
  selector: 'app-crear-cuenta',
  templateUrl: './crear-cuenta.page.html',
  styleUrls: ['./crear-cuenta.page.scss'],
  standalone: false
})
export class CrearCuentaPage {
  nombre: string = '';
  apellido: string = '';
  cedula: string = '';
  correo: string = '';
  password: string = '';
  confirmPassword: string = '';
  isLoading: boolean = false;

  constructor(
    private personaService: PersonaService,
    private router: Router,
    private alertController: AlertController
  ) { }

  async registrarUsuario() {
    // Evitar doble clic en el botón
    if (this.isLoading) return;
    this.isLoading = true;
  
    // Validar que todos los campos estén completos
    if (!this.nombre?.trim() || !this.apellido?.trim() || !this.cedula?.trim() || !this.correo?.trim() || !this.password?.trim() || !this.confirmPassword?.trim()) {
      this.showAlert('Error', 'Todos los campos son obligatorios.');
      this.isLoading = false;
      return;
    }
  
    // Validar coincidencia de contraseñas
    if (this.password !== this.confirmPassword) {
      this.showAlert('Error', 'Las contraseñas no coinciden.');
      this.isLoading = false;
      return;
    }
  
    // Llamar al servicio de registro
    this.personaService.registrar({
      nombre: this.nombre.trim(),
      apellido: this.apellido.trim(),
      cedula: this.cedula.trim(),
      correo: this.correo.trim(),
      password: this.password.trim()
    }).subscribe({
      next: async (response) => {
        if (response.estado) {
          this.showAlert('Éxito', 'Cuenta creada exitosamente. Ahora inicia sesión.');
          this.router.navigate(['/login']);
        } else {
          this.showAlert('Error', response.response);
        }
      },
      error: (error) => {
        console.error('Error en el registro:', error);
        const errorMsg = error.error?.response || 'No se pudo conectar con el servidor.';
        this.showAlert('Error', errorMsg);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
  


  async showAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  volverLogin() {
    this.router.navigate(['/login']);
  }
}

