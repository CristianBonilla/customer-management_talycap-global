import { Component, inject, signal, computed, effect } from '@angular/core';
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
import { BuscarCliente } from '../../state/cliente.actions';
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

  readonly cliente = toSignal<ClienteResponse | null>(
    this.store.select(ClienteState.cliente), { initialValue: null }
  );
  readonly loading = toSignal(
    this.store.select(ClienteState.loading), { initialValue: false }
  );
  readonly error = toSignal<string | null>(
    this.store.select(ClienteState.error), { initialValue: null }
  );
  readonly errorStatus = toSignal<number | null>(
    this.store.select(ClienteState.errorStatus), { initialValue: null }
  );
  readonly found = toSignal(
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

  private readonly identificacionValue = toSignal(
    this.searchForm.controls.identificacion.valueChanges, { initialValue: this.searchForm.value.identificacion ?? '' }
  );
  private readonly identificacionStatus = toSignal(
    this.searchForm.controls.identificacion.statusChanges, { initialValue: this.searchForm.controls.identificacion.status }
  );
  private readonly lastSearchedId = signal<string | null>(null);

  readonly searchDisabled = computed(() => {
    if (this.identificacionStatus() !== 'VALID') return true;
    const value = (this.identificacionValue() ?? '').trim();
    return value === this.lastSearchedId();
  });

  constructor() {
    effect(() => {
      if (this.found() && this.cliente()) {
        this.toastr.success('Cliente encontrado exitosamente.', 'Éxito');
        this.showModal.set(true);
      }
    });

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
    this.lastSearchedId.set(id);
    this.store.dispatch(new BuscarCliente(id));
  }

  cerrarModal(): void {
    this.showModal.set(false);
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
