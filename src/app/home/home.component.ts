import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {EstadoPrevio} from '../interface/estado-previo';

declare var $: any;
declare var toastr: any;
declare var Swal: any;
declare var FormValidation: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  serverhostURL = 'https://clasificacion.acromntec.com/api/';
  serverNETURL = 'https://localhost:44356/api/';
  currentPage = 1;
  listaPendiente = [];
  listaRevisiones = [];
  cargandoPendiente = false;
  noResultadosPendiente = true;
  listaClasificando = [];
  cargandoClasificando = false;
  noResultadosClasificando = true;
  listaPausa = [];
  cargandoPausa = false;
  noResultadosPausa = true;
  listaUmc: any = [];
  listaZonas: any = [];
  listaClavePedimento: any = [];
  listaFracciones: any = [];
  listaTerminado = [];
  cargandoTerminado = false;
  noResultadosTerminado = true;
  title = 'Listado de previos';
  statusInst = new EstadoPrevio();
  statusList = [];
  drawerPrevio;
  drawerSelectPrevio;
  private previoValidator: any;
  private partidaValidator: any;
  tablePermisos;
  tablePrevios;
  fraccionDrawer;
  @ViewChild('frmNgPrevio', { static: false })
  private frmNgPrevio: ElementRef<HTMLFormElement>;
  @ViewChild('previoId', { static: false })
  private previoId: ElementRef<HTMLInputElement>;
  @ViewChild('previoFuente', { static: false })
  private previoFuente: ElementRef<HTMLSelectElement>;
  @ViewChild('previoReferencia', { static: false })
  private previoReferencia: ElementRef<HTMLInputElement>;
  @ViewChild('previoEntradaSection', { static: false })
  private previoEntradaSection: ElementRef<HTMLDivElement>;
  @ViewChild('previoEntrada', { static: false })
  private previoEntrada: ElementRef<HTMLInputElement>;
  @ViewChild('previoOperacion', { static: false })
  private previoOperacion: ElementRef<HTMLSelectElement>;
  @ViewChild('previoClave', { static: false })
  private previoClave: ElementRef<HTMLSelectElement>;
  @ViewChild('previoZona', { static: false })
  private previoZona: ElementRef<HTMLSelectElement>;
  @ViewChild('btnAddPrevio', { static: false })
  private btnAddPrevio: ElementRef<HTMLButtonElement>;
  @ViewChild('previoFiltro', { static: false })
  private previoFiltro: ElementRef<HTMLInputElement>;
  @ViewChild('previoFiltroUrgente', { static: false })
  private previoFiltroUrgente: ElementRef<HTMLSelectElement>;
  @ViewChild('previoFiltroEstado', { static: false })
  private previoFiltroEstado: ElementRef<HTMLSelectElement>;
  @ViewChild('previoFiltroSucursal', { static: false })
  private previoFiltroSucursal: ElementRef<HTMLSelectElement>;
  @ViewChild('previoFiltroLimpiar', { static: false })
  private previoFiltroLimpiar: ElementRef<HTMLButtonElement>;

  constructor(private http: HttpClient, private router: Router, private renderer: Renderer2) {
    $('.modal-backdrop').remove();
  }
  ngOnInit() {
    const currentUrl = this.router.url;
    if (!currentUrl.includes('previo')) {
      $('#btnNewPrevio').css('display', 'inline');
      $('#btnPrevioList').css('display', 'none');
      $('#btnPrevioStatus').css('display', 'none');
      $('#estado-previo-lbl').css('display', 'none');
    }
    const self = this; // Guarda el contexto actual
    this.obtenerClasificaciones();
    // this.obtenerRevisiones();
    this.setAreas();
    // Agregar controlador de eventos para el input de búsqueda
    const input = document.getElementById('search') as HTMLInputElement;
    input.addEventListener('input', () => {
      this.filtrar_buscar();
    });
    const tablaPrevios = document.querySelector('#tabla-previos');
    this.tablePrevios = $(tablaPrevios).DataTable({
      select: { items: 'row', style: 'single' },
      searching: true,
      info: true,
      paging: true,
      processing: false,
      serverSide: false,
      accentNeutralise: true,
      lengthChange: true,
      pageLength: 10,
      columns: [
        { data: 'id', visible: false, searchable: false },
        { data: 'Folio', title: 'Folio/Referencia', visible: true, searchable: true, className: 'min-w-100px' },
        { data: 'sucursal_id', visible: false, searchable: true },
        { data: 'sucursal_codigo', title: 'Sucursal', visible: true, searchable: true, className: 'min-w-90px',
          render: ( data, type, row, meta) => {
            const dataAux = (data === '' || data === null ? `<span class="text-muted fst-italic">NO DISPONIBLE</span>` : data);
            // tslint:disable-next-line:max-line-length
            const descripcionAux = (row.sucursal_descripcion === '' || row.sucursal_descripcion === null ? `<span class="text-muted fst-italic">Sin descripción</span>` : row.sucursal_descripcion);
            return `<p class="m-0">${dataAux}</p><p class="m-0 small text-muted">${descripcionAux}</p>`;
          }
        },
        { data: 'cliente_nombre', title: 'Cliente', visible: true, searchable: true, className: 'min-w-20px',
          render: ( data, type, row, meta) => {
            const dataAux = (data === '' || data === null ? `<span class="text-muted fst-italic">NO DISPONIBLE</span>` : data);
            // tslint:disable-next-line:max-line-length
            const codigoAux = (row.cliente_codigo === '' || row.cliente_codigo === null ? `<span class="text-muted fst-italic">Sin código asignado</span>` : row.cliente_codigo);
            return `<p class="m-0">${dataAux}</p><p class="m-0 small">${codigoAux}</p>`;
          }
        },
        { data: 'NumeroEntrada', title: 'Entrada', visible: true, searchable: true, className: 'min-w-100px',
          render: ( data, type, row, meta) => {
            const dataAux = (data === '' || data === null ? `<span class="text-muted fst-italic">NO DISPONIBLE</span>` : data);
            return `<p class="m-0">${dataAux}</p>`;
          }
        },
        { data: 'Urgente', title: 'Urgente', visible: true, searchable: true, className: 'min-w-100px',
          render: ( data, type, row, meta) => {
            return (data === 1 ? `<span class="text-danger fst-italic">SI</span>` : `<span class="text-primary fst-italic">NO</span>`);
          }
        },
        { data: 'Estatus', title: 'Estado', visible: false, searchable: true, className: 'min-w-100px',
          render: ( data, type, row, meta) => {
            // tslint:disable-next-line:max-line-length
            return (data === 'REVISADO' ? `<span class="text-primary fst-italic">${data}</span>` : `<span class="text-info fst-italic">${data}</span>`);
          }
        },
        { data: 'FechaHora', title: 'Fecha de creación', visible: true, searchable: true, className: 'min-w-100px' },
        { data: 'FechaHoraEstatus', title: 'Ult. actualización', visible: false, searchable: false, className: 'min-w-100px' },
      ],
      ajax: {
        url: `${this.serverNETURL}Revisiones`,
        type: 'GET',
        dataType: 'json'
      }
    });
    this.tablePrevios.on( 'select', ( e, dt, type, indexes ) => {
      if ( type === 'row' ) {
        const x = self.tablePrevios.rows(indexes).data()[0];
        console.log(x);
        let auxTipo = '79';
        self.previoId.nativeElement.value = x.id;
        self.previoReferencia.nativeElement.value = x.Folio;
        self.previoEntrada.nativeElement.value = x.NumeroEntrada;
        if (x.Tipo !== 'IMP') {
          auxTipo = '80';
        }
        self.previoOperacion.nativeElement.value = auxTipo;
        $(self.previoOperacion.nativeElement).trigger('change');
        self.drawerSelectPrevio.hide();
      }
    });
    $('input[name="previo_filtro"]').on('keyup', (e) => {
      self.tablePrevios.search(e.target.value).draw();
    });
    $('select[name="previo_filtro_urgente"]').on('change', (e) => {
      self.tablePrevios.column(6).search(e.target.value).draw();
    });
    $('select[name="previo_filtro_estado"]').on('change', (e) => {
      self.tablePrevios.column(2).search(e.target.value).draw();
    });
  }
  ngAfterViewInit(): void {
    // @ts-ignore
    KTDrawer.createInstances();
    const drawerPrevioEl = document.querySelector('#nuevo_previo_drawer');
    // @ts-ignore
    this.drawerPrevio = KTDrawer.getInstance(drawerPrevioEl);
    const drawerSelectPrevioEl = document.querySelector('#drawer-seleccionar-previo');
    // @ts-ignore
    this.drawerSelectPrevio = KTDrawer.getInstance(drawerSelectPrevioEl);
    fetch(this.serverNETURL + `Catalogo/GetUMC`)
      .then(response => response.json())
      .then(data => {
        this.listaUmc = data;
      })
      .catch(error => console.error('Error en la solicitud:', error));
    $.ajax({
      type: 'get',
      dataType: 'json',
      url: this.serverNETURL + `Catalogo/GetOperaciones`,
    }).done((data) => {
      $(this.previoOperacion.nativeElement).select2({
        data,
        dropdownParent: $('#nuevo_previo_drawer'),
        placeholder: 'Tipo de operación',
      });
    });
    $.ajax({
      type: 'get',
      dataType: 'json',
      url: this.serverNETURL + `Catalogo/GetClaves`,
    }).done((data) => {
      $(this.previoClave.nativeElement).select2({
        data,
        dropdownParent: $('#nuevo_previo_drawer'),
        placeholder: 'Clave de pedimento',
      });
    });
    $.ajax({
      type: 'get',
      dataType: 'json',
      url: this.serverNETURL + `Catalogo/GetZonas`,
    }).done((data) => {
      $(this.previoZona.nativeElement).select2({
        data,
        dropdownParent: $('#nuevo_previo_drawer'),
        placeholder: 'Zona',
      });
    });
    $(this.previoFuente.nativeElement).select2({
      dropdownParent: $('#nuevo_previo_drawer'),
      minimumResultsForSearch: -1,
      placeholder: 'Seleccionar fuente',
    });
    $(this.previoZona.nativeElement).select2({
      dropdownParent: $('#nuevo_previo_drawer'),
      placeholder: 'Seleccionar zona',
    });
    $(this.previoFiltroUrgente.nativeElement).select2({
      dropdownParent: $('#drawer-seleccionar-previo'),
      allowClear: true,
      minimumResultsForSearch: -1,
      placeholder: 'Seleccionar urgencia',
    });
    $.ajax({
      type: 'get',
      dataType: 'json',
      url: this.serverNETURL + `Revisiones/GetSucursales`,
    }).done((data) => {
      $(this.previoFiltroEstado.nativeElement).select2({
        data,
        dropdownParent: $('#drawer-seleccionar-previo'),
        allowClear: true,
        minimumResultsForSearch: -1,
        placeholder: 'Seleccionar sucursal',
        templateResult: trailerTemplate
      });
      $(this.previoFiltroSucursal.nativeElement).select2({
        data,
        allowClear: true,
        minimumResultsForSearch: -1,
        placeholder: 'Seleccionar sucursal',
        templateResult: trailerTemplate
      });
    });

    function trailerTemplate(state) {
      if (!state.id) {
        return state.text;
      }
      // tslint:disable-next-line:max-line-length
      return $(`<div><p class="m-0">${state.text}</p><p class="m-0 small fst-italic text-muted text-truncate">${(state.descripcion ? state.descripcion : 'NO DISPONIBLE')}</p></div>`);
    }
    function trailerTemplateSelection(state) {
      if (!state.id) {
        return state.text;
      }
      // tslint:disable-next-line:max-line-length
      return $(`<div><p class="m-0">${state.text} <span class="fs-8 fst-italic d-block pe-5">${(state.descripcion ? state.descripcion : '')}</span></p></div>`);
    }
    this.previoValidator = FormValidation.formValidation(
      this.frmNgPrevio.nativeElement,
      {
        fields: {
          previo_general_referencia: { validators: { notEmpty: { message: 'Referencia requerida.' } } },
        },
        plugins: {
          trigger: new FormValidation.plugins.Trigger(),
          bootstrap: new FormValidation.plugins.Bootstrap5({
            rowSelector: '.fv-row',
            eleInvalidClass: '',
            eleValidClass: ''
          })
        }
      }
    );
    this.renderer.listen(this.btnAddPrevio.nativeElement, 'click', (e) => {
      e.preventDefault();
      this.previoValidator.validate().then((status) => {
        console.log('status', status);
        if (status === 'Valid') {
          this.addPrevio();
        }
      });
    });
    $(this.previoFuente.nativeElement).on('change', (event) => {
      // Acciones que deseas realizar cuando cambie el valor de previoFuente
      if (event.target.value === 'PREVIO') {
        this.previoEntrada.nativeElement.value = null;
        this.previoEntradaSection.nativeElement.style.display = 'block';
        this.drawerSelectPrevio.show();
      } else {
        this.previoReferencia.nativeElement.value = null;
        this.previoEntrada.nativeElement.value = null;
        this.previoEntradaSection.nativeElement.style.display = 'none';
        $(this.previoOperacion.nativeElement).val(null).trigger('change');
        $(this.previoClave.nativeElement).val(null).trigger('change');
        $(this.previoZona.nativeElement).val(null).trigger('change');
        this.tablePrevios.rows().deselect();
        this.drawerSelectPrevio.hide();
      }
    });
    $(this.previoFiltroSucursal.nativeElement).on('change', (event) => {
      const selectedValue = event.target.value;

      if (selectedValue !== '') {
        // Ocultar todas las tarjetas
        $('.filtrado_previo').hide();

        // Mostrar solo las tarjetas que cumplan con las condiciones
        $(`.filtrado_previo[data-sucursal="${selectedValue}"]`).show();
      } else {
        // Si el valor seleccionado es vacío, mostrar todas las tarjetas nuevamente
        $('.filtrado_previo').show();
      }
    });
    this.renderer.listen(this.previoFiltroLimpiar.nativeElement, 'click', (e) => {
      e.preventDefault();
      $(this.previoFiltroUrgente.nativeElement).val(null).trigger('change');
      $(this.previoFiltroEstado.nativeElement).val(null).trigger('change');
      $(this.previoFiltro.nativeElement).val(null).trigger('change');
    });

    // $(document).on('select2:open', () => {
    //  document.querySelector('.select2-search__field').focus();
    // });
  }
  getPreviosNET(tipo: string): Observable<any> {
    return this.http.get(this.serverNETURL + `Clasificacion?estatus=${tipo}`);
  }
  obtenerClasificaciones(): void {
    this.getPreviosNET("pendiente").subscribe(data => {
      this.listaPendiente = data;
      this.cargandoPendiente = false;
    });
    this.getPreviosNET("clasificando").subscribe(data => {
      this.listaClasificando = data;
      this.cargandoClasificando = false;
    });
    this.getPreviosNET("pausa").subscribe(data => {
      this.listaPausa = data;
      this.cargandoPausa = false;
    });
    this.getPreviosNET("terminada").subscribe(data => {
      this.listaTerminado = data;
      this.cargandoTerminado = false;
    });
  }
  getRevisiones(page: number): Observable<any> {
    // return this.http.get(this.serverhostURL + `revisiones?page=${page}`);
    return this.http.get(this.serverNETURL + `Revisiones`);
  }
  obtenerRevisiones(): void {
    this.getRevisiones(this.currentPage).subscribe(data => {
      console.log(data);
      this.listaRevisiones = data;
    });
  }
  cambiarPagina(nuevaPagina: number): void {
    console.log('pagina', nuevaPagina);
    this.currentPage = nuevaPagina;
    this.obtenerClasificaciones();
  }
  clasificar(previo: string, estado: string) {
    this.router.navigate(['/previo'], { queryParams: { previo } });
  }
  filtrar_buscar(): void {
    // tslint:disable-next-line:max-line-length one-variable-per-declaration
    let input: HTMLInputElement, filter: string, ul: HTMLElement, li: HTMLCollectionOf<HTMLElement>, i: number, txtValue: string;
    input = document.getElementById('search') as HTMLInputElement;
    filter = input.value.toUpperCase();
    ul = document.getElementById('sctn_filtro_estados') as HTMLElement;
    li = ul.getElementsByClassName('filtrado_previo') as HTMLCollectionOf<HTMLElement>;
    let resultadosEncontrados = false;
    for (i = 0; i < li.length; i++) {
      txtValue = li[i].textContent || li[i].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = '';
        resultadosEncontrados = true;
      } else {
        li[i].style.display = 'none';
      }
    }
    this.noResultadosPendiente = !resultadosEncontrados;
  }
  addPrevio() {
    let auxId = null;
    if (this.previoId.nativeElement.value !== '') {
      // tslint:disable-next-line:radix
      auxId = parseInt(this.previoId.nativeElement.value);
    }
    const dataPrevio = {
      // Id: null,
      Referencia: this.previoReferencia.nativeElement.value,
      IdFuente: auxId,
      Fuente: this.previoFuente.nativeElement.value,
      IdBitacoraRegistro: 1,
      IdEstatus: 3347,
      // tslint:disable-next-line:radix
      IdTipoOperacion: parseInt(this.previoOperacion.nativeElement.value),
      // tslint:disable-next-line:radix
      IdClavePedimento: parseInt(this.previoClave.nativeElement.value),
      IdZona: this.previoZona.nativeElement.value,
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    this.http.post(`${this.serverNETURL}Clasificacion`, dataPrevio, httpOptions)
      .subscribe(
        response => {
          if ('clasificacionId' in response) {
            console.log('Clasificación registrada con ID:', response['clasificacionId']);
            // @ts-ignore
            dataPrevio.id = response['clasificacionId'];
            // @ts-ignore
            const previo = response['clasificacionId'];
            if (dataPrevio.Fuente === 'PREVIO') {
              this.setPartidas(dataPrevio);
            }
            this.router.navigate(['/previo'], { queryParams: { previo } });
          } else {
            console.error('Error al registrar la clasificación:', response);
            if (typeof response === 'string') {
              const errorList = JSON.parse(response) as string[];
              errorList.forEach(error => {
                console.error('Error:', error);
                // Manejar los errores según sea necesario
              });
            }
          }
        },
        error => {
          console.error('Error al enviar el JSON:', error);
        }
      );
  }
  addPartida(partida) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    this.http.post(`${this.serverNETURL}ClasificacionPartida`, partida, httpOptions)
      .subscribe(
        response => {
          console.log(response);
        },
        error => {
          console.error('Error al enviar el JSON:', error);
        }
      );
  }
  getAreasNET(): Observable<any> {
    return this.http.get(this.serverNETURL + `Catalogo?status=CDCESTATUS`);
  }
  setAreas(): void {
    this.getAreasNET().subscribe(response => {
      response.forEach(status => {
        const newStatus: any = {
          Id: status.Id,
          Tipo: status.Tipo,
          Codigo: status.Codigo,
          ValorTexto: status.ValorTexto,
          ValorBoleano: status.ValorBoleano,
          Descripcion: status.Descripcion,
          Orden: status.Orden,
          IdBitacoraRegistro: status.IdBitacoraRegistro,
        };
        this.statusInst.agregarRegistro(newStatus);
      });
      this.statusList = this.statusInst.obtenerRegistros();
    });
  }
  getPartidasNET(revision): Observable<any> {
    console.log(revision);
    return this.http.get(this.serverNETURL + `Revisiones/GetFacturaItemsPorRevision/${revision}`);
  }
  setPartidas(revision): void {
    this.getPartidasNET(revision.IdFuente).subscribe(response => {
      response.forEach(partida => {
        const newPartida: any = {
          IdClasificacion: revision.id,
          IdFuentePartida: partida.id,
          Fuente: 'PREVIO',
          Fraccion: null,
          UMT: partida.IdUnidadMedidaTarifa,
          IdFraccion: partida.IdFraccionArancelaria,
          Descripcion: partida.Descripcion
        };
        this.addPartida(newPartida);
      });
    });
  }
}
