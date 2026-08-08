import { Component, inject, signal, effect } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { ToastrService } from 'ngx-toastr';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { AvatarModule } from 'primeng/avatar';
import { MessageModule } from 'primeng/message';

import { ClienteState } from '../../state/cliente.state';
import { BuscarCliente, ResetClienteState } from '../../state/cliente.actions';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { ClienteResponse } from '../../../../core/models/cliente.model';

@Component({
  selector: 'app-buscar-cliente',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule, InputTextModule, CardModule,
    DialogModule, TagModule, DividerModule,
    AvatarModule, MessageModule,
    SpinnerComponent
  ],
  templateUrl: './buscar-cliente.component.html',
  styleUrl: './buscar-cliente.component.scss'
})
export class BuscarClienteComponent {
  private readonly store = inject(Store);
  private readonly toastr = inject(ToastrService);

  // RxJS observables del store NGXS → Angular Signals via rxjs-interop
  readonly cliente = toSignal<ClienteResponse | null>(
    this.store.select(ClienteState.cliente), { initialValue: null }
  );
  readonly loading = toSignal<boolean>(
    this.store.select(ClienteState.loading), { initialValue: false }
  );
  readonly error = toSignal<string | null>(
    this.store.select(ClienteState.error), { initialValue: null }
  );
  readonly errorStatus = toSignal<number | null>(
    this.store.select(ClienteState.errorStatus), { initialValue: null }
  );
  readonly found = toSignal<boolean>(
    this.store.select(ClienteState.found), { initialValue: false }
  );

  readonly showModal = signal(false);

  readonly searchForm = new FormGroup({
    identificacion: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20)
    ])
  });

  constructor() {
    // Effect: éxito → abrir modal + toastr verde
    effect(() => {
      if (this.found() && this.cliente()) {
        this.toastr.success('Cliente encontrado exitosamente.', 'Éxito');
        this.showModal.set(true);
      }
    });

    // Effect: error → toastr rojo según tipo
    effect(() => {
      const err = this.error();
      if (err) {
        const title = this.errorStatus() === 404 ? 'Cliente no encontrado' : 'Error de conexión';
        this.toastr.error(err, title);
      }
    });
  }

  buscar(): void {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }
    const id = this.searchForm.value.identificacion!.trim();
    this.store.dispatch(new BuscarCliente(id));
  }

  cerrarModal(): void {
    this.showModal.set(false);
    this.store.dispatch(new ResetClienteState());
    this.searchForm.reset();
  }

  get iniciales(): string {
    const c = this.cliente();
    return c ? `${c.nombre[0]}${c.apellido[0]}`.toUpperCase() : '';
  }

  formatDate(dateStr: string | null): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('es-CO', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  }
}
