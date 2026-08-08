export class BuscarCliente {
  static readonly type = '[Cliente] Buscar Por Identificacion';
  constructor(public readonly identificacion: string) {}
}

export class ResetClienteState {
  static readonly type = '[Cliente] Reset State';
}
