import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PedidoPayload {
  codigoPedido?: number;
  codigoCliente: number;
  dataPedido: string;
  entrega: string;
  obs: string;
  valorTotal: number;
}

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8081/api/pedido';

  criar(pedido: PedidoPayload): Observable<string> {
    return this.http.post(this.baseUrl, pedido, { responseType: 'text' });
  }

  buscarPorCodigo(codigo: number): Observable<PedidoPayload> {
    return this.http.get<PedidoPayload>(`${this.baseUrl}/${codigo}`);
  }
}