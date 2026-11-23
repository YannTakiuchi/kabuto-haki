import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CartService } from './services/cart';
import { ClienteService } from './services/cliente';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html'
})
export class App implements OnInit {
  cart = inject(CartService);
  clienteService = inject(ClienteService);
  private router = inject(Router);

  ngOnInit(): void {
    this.clienteService.sincronizarSessao();
  }

  get primeiroNome(): string {
    const nome = this.clienteService.clienteLogado()?.nome ?? '';
    return nome.trim().split(/\s+/)[0];
  }

  buscar(termo: string): void {
    this.router.navigate(['/busca'], { queryParams: { q: termo.trim() } });
  }

  sair(): void {
    this.clienteService.logout();
    this.router.navigate(['/']);
  }
}