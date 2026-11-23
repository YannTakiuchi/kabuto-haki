import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart';
import { ClienteService } from '../../services/cliente';
import { PedidoService } from '../../services/pedido';

@Component({
  selector: 'app-cesta',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './cesta.html'
})
export class CestaComponent {
  cart = inject(CartService);
  private clienteService = inject(ClienteService);
  private pedidoService = inject(PedidoService);
  private router = inject(Router);

  compraFinalizada = signal(false);
  carregando = signal(false);
  erroPedido = signal('');
  numeroPedido = signal(0);

  totalPedido = computed(() =>
    this.cart.itens().reduce((acc, item) => acc + item.preco * item.quantidade, 0)
  );

  finalizarCompra(): void {
    const cliente = this.clienteService.clienteLogado();
    if (!cliente || !cliente.codigo) {
      this.router.navigate(['/login']);
      return;
    }

    const itens = this.cart.itens();
    if (itens.length === 0) return;

    const resumoItens = itens
      .map(i => `${i.quantidade}x ${i.nome} (${i.tamanho})`)
      .join(', ');

    this.carregando.set(true);
    this.erroPedido.set('');

    this.pedidoService.criar({
      codigoCliente: cliente.codigo,
      dataPedido: new Date().toISOString().slice(0, 10),
      entrega: cliente.logradouro || 'Endereço cadastrado',
      obs: resumoItens,
      valorTotal: this.totalPedido()
    }).subscribe({
      next: () => {
        this.carregando.set(false);
        this.numeroPedido.set(Math.floor(10000 + Math.random() * 90000));
        this.cart.limpar();
        this.compraFinalizada.set(true);
      },
      error: (err) => {
        console.error('Erro ao gravar pedido:', err);
        this.carregando.set(false);
        this.erroPedido.set('Não foi possível registrar o pedido no servidor.');
      }
    });
  }
}