import { Injectable, inject } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap, catchError, EMPTY } from 'rxjs';
import { ClienteResponse } from '../../../core/models/cliente.model';
import { ClienteService } from '../../../core/services/cliente.service';
import { BuscarCliente, ResetClienteState } from './cliente.actions';

export interface ClienteStateModel {
  cliente: ClienteResponse | null;
  loading: boolean;
  error: string | null;
  errorStatus: number | null;
  found: boolean;
}

const defaults: ClienteStateModel = {
  cliente: null,
  loading: false,
  error: null,
  errorStatus: null,
  found: false
};

@State<ClienteStateModel>({ name: 'cliente', defaults })
@Injectable()
export class ClienteState {
  private readonly clienteService = inject(ClienteService);

  @Selector()
  static cliente(state: ClienteStateModel): ClienteResponse | null { return state.cliente; }

  @Selector()
  static loading(state: ClienteStateModel): boolean { return state.loading; }

  @Selector()
  static error(state: ClienteStateModel): string | null { return state.error; }

  @Selector()
  static errorStatus(state: ClienteStateModel): number | null { return state.errorStatus; }

  @Selector()
  static found(state: ClienteStateModel): boolean { return state.found; }

  @Action(BuscarCliente)
  buscarCliente(ctx: StateContext<ClienteStateModel>, { identificacion }: BuscarCliente) {
    ctx.patchState({ loading: true, error: null, errorStatus: null, cliente: null, found: false });

    return this.clienteService.buscarPorIdentificacion(identificacion).pipe(
      tap(cliente => ctx.patchState({ cliente, loading: false, found: true })),
      catchError((err: { status: number }) => {
        const errorMsg = err.status === 404
          ? `No se encontró ningún cliente con la identificación '${identificacion}'.`
          : 'No se pudo conectar con el servidor. Verifique que la API esté disponible.';

        ctx.patchState({ loading: false, error: errorMsg, errorStatus: err.status, found: false });
        return EMPTY;
      })
    );
  }

  @Action(ResetClienteState)
  resetState(ctx: StateContext<ClienteStateModel>): void {
    ctx.setState({ ...defaults });
  }
}
