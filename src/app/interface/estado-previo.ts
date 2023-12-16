export class EstadoPrevio {
  private id: number;
  private tipo: string;
  private codigo: string;
  private valorTexto: string;
  private valorBooleano: boolean;
  private descripcion: string;
  private orden: number;
  private idBitacoraRegistro: number;
  private registros: EstadoPrevio[] = [];
  constructor() { }
  agregarRegistro(registro: EstadoPrevio): void {
    this.id = registro.id;
    this.tipo = registro.tipo;
    this.codigo = registro.codigo;
    this.valorTexto = registro.valorTexto;
    this.valorBooleano = registro.valorBooleano;
    this.descripcion = registro.descripcion;
    this.orden = registro.orden;
    this.idBitacoraRegistro = registro.idBitacoraRegistro;
    this.registros.push(registro);
  }
  obtenerRegistros(): EstadoPrevio[] {
    return this.registros;
  }
}
