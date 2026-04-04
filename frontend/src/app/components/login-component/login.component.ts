import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginDTO } from '../../models/auth/login.dto';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AlertService } from '../../services/alert.service';


@Component({
  selector: 'app-login-component',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule]
})
  export class LoginComponent {
    dto = new LoginDTO(); // Usa el DTO
    error = '';
    mostrarPassword = false;

  constructor(private auth: AuthService, private router: Router, private alert: AlertService) {
    if (this.auth.getToken()) {
      this.router.navigate(['/admin']);
    }
  }

    login(): void {
    this.error = '';

    const correoVacio = this.dto.correo.trim() === '';
    const passwordVacio = this.dto.password.trim() === '';

    if (correoVacio && passwordVacio) return this.alert.datosIncompletos('ambos');
    if (correoVacio) return this.alert.datosIncompletos('correo');
    if (passwordVacio) return this.alert.datosIncompletos('password');

    this.alert.mostrarCargandoLogin();

    this.auth.login(this.dto).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        Swal.close();
        this.alert.mostrarExitoLogin();

        setTimeout(() => {
          this.router.navigate(['/admin']);
        }, 1600);
      },
      error: (err) => {
        Swal.close();
        this.alert.credencialesInvalidas();
      }
    });
  }

  volverAlInicio(): void {
    this.router.navigate(['/']);
  }

  togglePassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

}
