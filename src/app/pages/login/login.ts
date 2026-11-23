import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ClienteService } from '../../services/cliente';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private clienteService = inject(ClienteService);

  enviado = false;
  carregando = signal(false);
  erroLogin = signal('');

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]]
  });

  get email() { return this.form.controls.email; }
  get senha() { return this.form.controls.senha; }

  entrar(): void {
    this.enviado = true;
    this.erroLogin.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.carregando.set(true);
    const emailVal = this.email.value ?? '';
    const senhaVal = this.senha.value ?? '';

    this.clienteService.login(emailVal, senhaVal).subscribe({
      next: (cliente) => {
        this.carregando.set(false);
        if (cliente && cliente.codigo && cliente.codigo > 0) {
          this.router.navigate(['/']);
        } else {
          this.erroLogin.set('E-mail ou senha inválidos.');
        }
      },
      error: (err) => {
        console.error('Erro ao realizar login:', err);
        this.carregando.set(false);
        this.erroLogin.set('Não foi possível conectar ao servidor. Tente novamente.');
      }
    });
  }
}