export interface ClienteResponse {
  idCliente: number;
  identificacion: string;
  nombre: string;
  apellido: string;
  email: string;
  fechaCreacion: string;
  fechaActualizacion: string | null;
}
