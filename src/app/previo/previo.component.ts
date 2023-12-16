import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';

declare var $: any;
declare var toastr: any;
declare var Swal: any;
declare var FormValidation: any;
declare var Dropzone: any;
// declare var servicioValidator: any;
@Component({
  selector: 'app-previo',
  templateUrl: './previo.component.html',
  styleUrls: ['./previo.component.css']
})
export class PrevioComponent implements OnInit, AfterViewInit {
  serverhostAPIURL = 'https://clasificacion.acromntec.com/api/';
  serverNETURL = 'https://localhost:44356/api/';
  private servicioValidator: any; // ajusta el tipo según corresponda
  previo: string;
  selectedFraccion = [];
  dataPrevio: any = [];
  listaPartidas: any = [];
  listaUmc: any = [];
  listaPaises: any = [];
  listaZonas: any = [];
  listaEstados: any = [];
  localPartidas: any = [];
  currentIdentificador: any = [];
  currentPermiso: any = [];
  currentPartida: any = [];
  currentCliente = null;
  tableIdentificadores;
  tablePermisos;
  tableFracciones;
  tablePartes;
  drawerFraccion;
  drawerPartes;
  isSelected = false;
  //#region HTML Elements
  @ViewChild('noParteDrawerSave', { static: false })
  private noParteDrawerSave: ElementRef<HTMLButtonElement>;
  @ViewChild('sctnImagenes', { static: false })
  private sctnImagenes: ElementRef<HTMLDivElement>;
  @ViewChild('frmNgPartida', { static: false })
  private frmNgPartida: ElementRef<HTMLFormElement>;
  @ViewChild('detalleParteNumero', { static: false })
  private detalleParteNumero: ElementRef<HTMLInputElement>;
  @ViewChild('detalleParteFraccion', { static: false })
  private detalleParteFraccion: ElementRef<HTMLInputElement>;
  @ViewChild('detalleParteUMF', { static: false })
  private detalleParteUMF: ElementRef<HTMLSelectElement>;
  @ViewChild('detalleUmt', { static: false })
  private detalleUmt: ElementRef<HTMLSelectElement>;
  @ViewChild('detalleCantidadTarifa', { static: false })
  private detalleCantidadTarifa: ElementRef<HTMLInputElement>;
  @ViewChild('detalleParteDescripcion', { static: false })
  private detalleParteDescripcion: ElementRef<HTMLInputElement>;
  @ViewChild('PartidaCantidadFactura', { static: false })
  private PartidaCantidadFactura: ElementRef<HTMLInputElement>;
  @ViewChild('PartidaCantidadComercial', { static: false })
  private PartidaCantidadComercial: ElementRef<HTMLInputElement>;
  @ViewChild('PartidaCantidadPeso', { static: false })
  private PartidaCantidadPeso: ElementRef<HTMLInputElement>;
  @ViewChild('PartidaNotas', { static: false })
  private PartidaNotas: ElementRef<HTMLTextAreaElement>;

  @ViewChild('detalleCaso', { static: false })
  private detalleCaso: ElementRef<HTMLSelectElement>;
  @ViewChild('detalleComplemento', { static: false })
  private detalleComplemento: ElementRef<HTMLInputElement>;
  @ViewChild('detalleComplemento2', { static: false })
  private detalleComplemento2: ElementRef<HTMLInputElement>;
  @ViewChild('detalleComplemento3', { static: false })
  private detalleComplemento3: ElementRef<HTMLInputElement>;
  @ViewChild('detallePermisoClave', { static: false })
  private detallePermisoClave: ElementRef<HTMLSelectElement>;
  @ViewChild('detallePermisoNumero', { static: false })
  private detallePermisoNumero: ElementRef<HTMLInputElement>;
  @ViewChild('detallePermisoFirma', { static: false })
  private detallePermisoFirma: ElementRef<HTMLInputElement>;
  @ViewChild('detallePermisoValorComercial', { static: false })
  private detallePermisoValorComercial: ElementRef<HTMLInputElement>;
  @ViewChild('detallePermisoCantidadTarifa', { static: false })
  private detallePermisoCantidadTarifa: ElementRef<HTMLInputElement>;
  // comentarios: Botones para tabla identificador
  @ViewChild('btn_add_identificador', { static: false })
  private btnAddIdentificador: ElementRef<HTMLButtonElement>;
  @ViewChild('btn_update_identificador', { static: false })
  private btnUpdateIdentificador: ElementRef<HTMLButtonElement>;
  @ViewChild('btn_cancel_identificador', { static: false })
  private btnCancelIdentificador: ElementRef<HTMLButtonElement>;
  // comentarios: Botones para tabla permisos
  @ViewChild('btn_add_permiso', { static: false })
  private btnAddPermiso: ElementRef<HTMLButtonElement>;
  @ViewChild('btn_update_permiso', { static: false })
  private btnUpdatePermiso: ElementRef<HTMLButtonElement>;
  @ViewChild('btn_cancel_permiso', { static: false })
  private btnCancelPermiso: ElementRef<HTMLButtonElement>;
  @ViewChild('btnPallet', { static: false })
  private btnPallet: ElementRef<HTMLButtonElement>;
  @ViewChild('btnSubmitPartida', { static: false })
  private btnSubmitPartida: ElementRef<HTMLButtonElement>;

  @ViewChild('PartidaUMC', { static: false })
  private PartidaUMC: ElementRef<HTMLSelectElement>;
  @ViewChild('PartidaOrigen', { static: false })
  private PartidaOrigen: ElementRef<HTMLSelectElement>;
  @ViewChild('PartidaVendedor', { static: false })
  private PartidaVendedor: ElementRef<HTMLSelectElement>;

  // comentario:Elementos de la nueva partida.
  @ViewChild('frmNgPartidaNueva', { static: false }) private frmNgPartidaNueva: ElementRef<HTMLFormElement>;
  @ViewChild('partidaDescripcion', { static: false }) private partidaDescripcion: ElementRef<HTMLInputElement>;
  @ViewChild('partidaFraccion', { static: false }) private partidaFraccion: ElementRef<HTMLInputElement>;
  @ViewChild('partidaUmt', { static: false }) private partidaUmt: ElementRef<HTMLSelectElement>;
  @ViewChild('btnAddPartida', { static: false }) private btnAddPartida: ElementRef<HTMLButtonElement>;
  @ViewChild('btnUpdatePartida', { static: false }) private btnUpdatePartida: ElementRef<HTMLButtonElement>;
  @ViewChild('btnCancelPartida', { static: false }) private btnCancelPartida: ElementRef<HTMLButtonElement>;
  // comentario:Elementos del drawer fracciones.

  @ViewChild('btnNewPrevio', { static: false }) private btnNewPrevio: ElementRef<HTMLButtonElement>;

  //#endregion HTML Elements
  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private renderer: Renderer2) {
    $('.modal-backdrop').remove();
  }
  ngOnInit() {
    const currentUrl = this.router.url;
    if (currentUrl.includes('previo')) {
      $('#btnNewPrevio').css('display', 'none');
      $('#btnPrevioList').css('display', 'inline');
      $('#btnPrevioStatus').css('display', 'inline');
      $('#estado-previo-lbl').css('display', 'inline');
    }
    this.route.queryParams.subscribe(params => {
      this.previo = params.previo;
      this.getRevision(this.previo);
    });
    const self = this; // Guarda el contexto actual
    const tablaIdentificadores = document.querySelector('#tabla-identificadores');

    this.tableIdentificadores = $(tablaIdentificadores).DataTable({
      info: false,
      paging: false,
      processing: false,
      serverSide: false,
      accentNeutralise: true,
      columns: [
        { data: 'Id', visible: false, searchable: false },
        { data: 'IdClasificacionPartida', visible: false, searchable: false },
        { data: 'Clave', title: 'Caso', visible: true, searchable: false },
        { data: 'Complemento1', title: 'Complemento 1', visible: true, searchable: false, className: 'w-100px' },
        { data: 'Complemento2', title: 'Complemento 2', visible: true, searchable: false, className: 'w-100px' },
        { data: 'Complemento3', title: 'Complemento 3', visible: true, searchable: false, className: 'w-100px' },
        {
          defaultContent: `<button type="button" class="eliminar btn btn-sm btn-icon btn-light btn-active-light-danger me-3">
            <i class="bi bi-trash"></i>
            <button type="button" class="actualizar btn btn-sm btn-icon btn-light btn-active-light-warning">
            <i class="bi bi-pencil-square"></i></button>`,
          orderable: false,
          searchable: false,
          className: 'w-100px text-center pt-3 pb-2',
        }
      ],
    });
    $(tablaIdentificadores).on('click', '.actualizar', function()  {
      const fila = $(this).closest('tr');
      const datosFila = self.tableIdentificadores.row(fila).data();
      const indexFila = self.tableIdentificadores.row(fila).index();
      $('#detalle_caso').val(datosFila.Clave).trigger('change');
      $('#detalle_complemento').val(datosFila.Complemento1);
      $('#detalle_complemento2').val(datosFila.Complemento2);
      $('#detalle_complemento3').val(datosFila.Complemento3);
      $('#btnAddIdentificador').css('display', 'none');
      $('#btnUpdateIdentificador').css('display', 'inline');
      $('#btnCancelIdentificador').css('display', 'inline');
      $('#colIdentificador').data('index', indexFila);
      self.currentIdentificador = datosFila;
      console.log(datosFila);
    });
    $(tablaIdentificadores).on('click', '.eliminar', function()  {
      const fila = $(this).closest('tr');
      const datosFila = self.tableIdentificadores.row(fila).data();
      Swal.fire({
        text: 'Desea eliminar el identificador?',
        icon: 'warning',
        showCancelButton: !0,
        buttonsStyling: !1,
        confirmButtonText: 'Si, Eliminar!',
        cancelButtonText: 'Cancelar',
        customClass: {confirmButton: 'btn btn-danger', cancelButton: 'btn btn-active-light'}
      }).then(((t) => {
        if (t.isConfirmed) {
          if (datosFila.Id) {
            self.eliminarIdentificador(datosFila.Id);
          } else {
            self.limpiarIdentificador();
            self.tableIdentificadores.row(fila).remove().draw();
          }
        }
      }));
    });

    const tablaPermisos = document.querySelector('#tabla-permisos');
    this.tablePermisos = $(tablaPermisos).DataTable({
      info: false,
      paging: false,
      processing: false,
      serverSide: false,
      accentNeutralise: true,
      columns: [
        { data: 'Id', visible: false, searchable: false },
        { data: 'IdClasificacionPartida', visible: false, searchable: false },
        { data: 'IdPedimento', visible: false, searchable: false },
        { data: 'Clave', title: 'Clave', visible: true, searchable: true, className: 'w-100px' },
        { data: 'FirmaDescargo', title: 'FirmaDescargo', visible: true, searchable: true, className: 'w-100px' },
        { data: 'NumeroPermiso', visible: false, searchable: false },
        { data: 'ValorComercialDolares', title: 'ValorComercialDolares', visible: true, searchable: true, className: 'w-100px' },
        { data: 'CantidadMercancia', title: 'CantidadMercancia', visible: true, searchable: true, className: 'w-100px' },

        {
          defaultContent: `<button type="button" class="eliminar btn btn-sm btn-icon btn-light btn-active-light-danger me-3">
<i class="bi bi-trash"></i>
<button type="button" class="actualizar btn btn-sm btn-icon btn-light btn-active-light-warning">
<i class="bi bi-pencil-square"></i></button>`,
          orderable: false,
          searchable: false,
          className: 'w-70px text-center pt-3 pb-2',
        }
      ],
    });
    $(tablaPermisos).on('click', '.actualizar', function()  {
      const fila = $(this).closest('tr');
      const datosFila = self.tablePermisos.row(fila).data();
      const indexFila = self.tablePermisos.row(fila).index();
      $('#detalle_permiso_clave').val(datosFila.detallePermisoClave).trigger('change');
      $('#detalle_permiso_numero').val(datosFila.detallePermisoNumero);
      $('#detalle_permiso_firma').val(datosFila.detallePermisoFirma);
      $('#detalle_permiso_valor_comercial').val(datosFila.detallePermisoValorComercial);
      $('#detalle_permiso_cantidad_tarifa').val(datosFila.detallePermisoCantidadTarifa);
      $('#btnAddPermisos').css('display', 'none');
      $('#btnUpdatePermisos').css('display', 'inline');
      $('#btnCancelPermisos').css('display', 'inline');
      self.currentPermiso = datosFila;
      $('#colPermisos').data('index', indexFila);
    });
    $(tablaPermisos).on('click', '.eliminar', function()  {
      const fila = $(this).closest('tr');
      const datosFila = self.tablePermisos.row(fila).data();
      Swal.fire({
        text: 'Desea eliminar el permiso?',
        icon: 'warning',
        showCancelButton: !0,
        buttonsStyling: !1,
        confirmButtonText: 'Si, Eliminar!',
        cancelButtonText: 'Cancelar',
        customClass: {confirmButton: 'btn btn-danger', cancelButton: 'btn btn-active-light'}
      }).then(((t) => {
        if (t.isConfirmed) {

          if (datosFila.Id) {
            self.eliminarPermiso(datosFila.Id);
          } else {
            self.limpiarPermisos();
            self.tablePermisos.row(fila).remove().draw();
          }

        }
      }));
    });

    toastr.options = {
      closeButton: false,
      debug: false,
      newestOnTop: false,
      progressBar: false,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      onclick: null,
      showDuration: '300',
      hideDuration: '1000',
      timeOut: '5000',
      extendedTimeOut: '1000',
      showEasing: 'swing',
      hideEasing: 'linear',
      showMethod: 'fadeIn',
      hideMethod: 'fadeOut'
    };
    this.getCatalogos();

    const tablaFracciones = document.querySelector('#tabla-fracciones');
    this.tableFracciones = $(tablaFracciones).DataTable({
      select: { items: 'row', style: 'single' },
      searching: true,
      info: true,
      paging: true,
      processing: true,
      serverSide: true,
      accentNeutralise: true,
      lengthChange: true,
      pageLength: 10,
      columns: [
        { data: 'idFraccion', title: 'idFraccion', visible: false, searchable: false },
        { data: 'Fraccion', title: 'Fracción', visible: true, searchable: true, className: 'min-w-90px' },
        { data: 'DescEspanol', title: 'Descripción', visible: true, searchable: true, className: 'min-w-100px' },
        { data: 'UMT', title: 'UMT', visible: true, searchable: true, className: 'min-w-20px' },
      ],
      ajax: {
        url: `${this.serverNETURL}Fracciones`,
        type: 'GET',
        dataType: 'json',
      },
    });
    // tslint:disable-next-line:only-arrow-functions
    self.tableFracciones.on( 'select', function( e, dt, type, indexes ) {
      if ( type === 'row' ) {
        const x = self.tableFracciones.rows(indexes).data()[0];
        console.log('Fraccion', x);
        self.detalleParteFraccion.nativeElement.value = x.Fraccion;
        // self.detalleParteDescripcion.nativeElement.value = x.DescEspanol;
        self.selectedFraccion = x;

        let opcionSeleccionada = self.listaUmc.find(function(option) {
          return option.Unidad === x.UMT;
        });
        if (opcionSeleccionada) {
          self.detalleUmt.nativeElement.value = opcionSeleccionada.Id;
          $(self.detalleUmt.nativeElement).trigger('change');
        }
        self.drawerFraccion.hide();
      }
    });
    $('input[name="fraccion_numero"]').on('keyup', (e) => {
      self.tableFracciones.column(1).search(e.target.value).draw();
    });
    $('input[name="fraccion_descripcion"]').on('keyup', (e) => {
      self.tableFracciones.column(2).search(e.target.value).draw();
    });
    $('select[name="fraccion_umt"]').on('change', (e) => {
      console.log(e.target.value);
      self.tableFracciones.column(3).search(e.target.value).draw();
    });
    const tablaPartes = document.querySelector('#tabla-partes');
    this.tablePartes = $(tablaPartes).DataTable({
      select: { items: 'row', style: 'single' },
      searching: true,
      info: true,
      paging: true,
      processing: false,
      serverSide: false,
      accentNeutralise: false,
      lengthChange: true,
      pageLength: 10,
      columns: [
        { data: 'parte_id', title: 'id', visible: false, searchable: false },
        { data: 'cliente_id', title: 'cliente', visible: false, searchable: false },
        { data: 'parte_numero', title: 'Numero de parte', visible: true, searchable: true, className: 'min-w-100px' },
        { data: 'parte_descripcion', title: 'Descripción', visible: true, searchable: true, className: 'min-w-20px' },
        {
          data: 'fraccion_numero',
          title: 'Fracción',
          visible: true,
          searchable: true,
          className: 'min-w-20px',
          render: (data, type, row, meta) => {
            // tslint:disable-next-line:max-line-length
            const dataDesc = (data === '' || data === null ? `<span class="text-muted fst-italic">NO DISPONIBLE</span>` : data);
            return dataDesc;
          }
        },
        {
          data: 'parte_unidad_medida_descripcion',
          title: 'Unidad de medida',
          visible: true,
          searchable: false,
          className: 'min-w-20px',
          render: (data, type, row, meta) => {
            // tslint:disable-next-line:max-line-length
            const dataUnidad = (row.parte_unidad_medida_unidad === '' || row.parte_unidad_medida_unidad === null ? `<span class="text-muted fst-italic">ND</span>` : row.parte_unidad_medida_unidad);
            const dataDesc = (data === '' || data === null ? `<span class="text-muted fst-italic">NO DISPONIBLE</span>` : data);
            return `<p class="m-0">${dataUnidad} - ${dataDesc}</p>`;
          }
        },
      ],
      ajax: {
        url: `${this.serverNETURL}Partes`,
        type: 'GET',
        dataType: 'json',
        data(d) {
          d.cliente_id = self.currentCliente || 0;
        }
      },
    });
    $('input[name="parteNumeroFiltro"]').on('keyup', (e) => {
      self.tablePartes.column(2).search(e.target.value).draw();
    });
    $('input[name="parteDescripcionFiltro"]').on('keyup', (e) => {
      self.tablePartes.column(3).search(e.target.value).draw();
    });
    $('input[name="parteFraccionFiltro"]').on('keyup', (e) => {
      self.tablePartes.column(4).search(e.target.value).draw();
    });
    // tslint:disable-next-line:only-arrow-functions
    self.tablePartes.on( 'select', function( e, dt, type, indexes ) {
      if ( type === 'row' ) {
        const dataParte = self.tablePartes.rows(indexes).data()[0];
        console.log('No Parte', dataParte);
        self.detalleParteNumero.nativeElement.value = dataParte.parte_numero;
        if (self.detalleParteDescripcion.nativeElement.value.trim() === '') {
          self.detalleParteDescripcion.nativeElement.value = dataParte.parte_descripcion;
        }
        if (dataParte.fraccion_numero) {
          self.detalleParteFraccion.nativeElement.value = dataParte.fraccion_numero;
        }
        $(self.PartidaOrigen.nativeElement).val(dataParte.pais_origen_id).trigger('change');
        $(self.PartidaVendedor.nativeElement).val(dataParte.pais_vendedor_id).trigger('change');
        self.drawerPartes.hide();
      }
    });
    $('#previo-buscar-partida').on('input', (e) => {
      console.log(e.target.value);
      self.tableFracciones.column(3).search(e.target.value).draw();
    });
    $('#btn-eliminar-partida').on('click', (e) => {
      Swal.fire({
        text: 'Desea eliminar la partida?',
        icon: 'warning',
        showCancelButton: !0,
        buttonsStyling: !1,
        confirmButtonText: 'Si, Eliminar!',
        cancelButtonText: 'Cancelar',
        customClass: {confirmButton: 'btn btn-danger', cancelButton: 'btn btn-active-light'}
      }).then(((t) => {
        if (t.isConfirmed) {
          const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json'
            })
          };
          this.http.delete(`${this.serverNETURL}Partida/${this.currentPartida.id}`)
            .subscribe(
              response => {
                // this.eliminarPartida(self.currentPartida.id);
                console.log(response);
                // @ts-ignore
                if (response.status === 'ok') {
                  self.getPartidas(this.dataPrevio.id);
                  this.currentPartida = [];
                  const drawerElement = document.querySelector('#kt_drawer_example_basic');
                  // @ts-ignore
                  const drawer = KTDrawer.getInstance(drawerElement);
                  this.frmNgPartida.nativeElement.reset();
                  $(this.detalleUmt.nativeElement).trigger('change');
                  this.servicioValidator.resetForm();
                  this.tableIdentificadores.clear().draw();
                  this.tablePermisos.clear().draw();
                  drawer.hide();
                }
              },
              error => {
                console.error('Error al enviar el JSON:', error);
              }
            );
        }
      }));
    });
    // @ts-ignore
    const mdlAgregarImagenes = new bootstrap.Modal(document.getElementById('mdl-agregar-imagenes'), {
      keyboard: false
    });
    $('#btn-agregar-imagenes').on('click', (e) => {
      console.log(this.currentPartida);
      mdlAgregarImagenes.show();
    });

    const id = "#kt_dropzonejs_example_2";
    const dropzone = document.querySelector(id);
    var previewNode = dropzone.querySelector(".dropzone-item");
    previewNode.id = "";
    // @ts-ignore
    var previewTemplate = previewNode.parentNode.innerHTML;
    previewNode.parentNode.removeChild(previewNode);
    // @ts-ignore
    var myDropzone = new Dropzone(id, {
      method: 'POST',
      url: `${this.serverhostAPIURL}imagenes`,
      parallelUploads: 20,
      previewTemplate: previewTemplate,
      maxFilesize: 5,
      uploadMultiple: true,
      autoQueue: true,
      previewsContainer: id + " .dropzone-items",
      clickable: id + " .dropzone-select"
    });
    myDropzone.on("addedfile", function (file) {
      file.previewElement.querySelector(id + " .dropzone-start").onclick = function () { myDropzone.enqueueFile(file); };
      const dropzoneItems = dropzone.querySelectorAll('.dropzone-item');
      dropzoneItems.forEach(dropzoneItem => {
        // @ts-ignore
        dropzoneItem.style.display = '';
      });
      // @ts-ignore
      dropzone.querySelector('.dropzone-upload').style.display = "inline-block";
      // @ts-ignore
      dropzone.querySelector('.dropzone-remove-all').style.display = "inline-block";
    });
    myDropzone.on("totaluploadprogress", function (progress) {
      const progressBars = dropzone.querySelectorAll('.progress-bar');
      progressBars.forEach(progressBar => {
        // @ts-ignore
        progressBar.style.width = progress + "%";
      });
    });
    myDropzone.on("sending", function (file, xhr, formData) {
      formData.append("partida", self.currentPartida.partida_id);
      formData.append("numparte", self.currentPartida.partida_parte_numero);
      formData.append("token", "302af6d1e3b16319a274260806b006a7");
      formData.append("archivo", file);
      const progressBars = dropzone.querySelectorAll('.progress-bar');
      progressBars.forEach(progressBar => {
        // @ts-ignore
        progressBar.style.opacity = "1";
      });
      file.previewElement.querySelector(id + " .dropzone-start").setAttribute("disabled", "disabled");
    });
    myDropzone.on("complete", function (progress) {
      const progressBars = dropzone.querySelectorAll('.dz-complete');

      setTimeout(function () {
        progressBars.forEach(progressBar => {
          // @ts-ignore
          progressBar.querySelector('.progress-bar').style.opacity = "0";
          // @ts-ignore
          progressBar.querySelector('.progress').style.opacity = "0";
          // @ts-ignore
          progressBar.querySelector('.dropzone-start').style.opacity = "0";
        });
      }, 300);
    });
    dropzone.querySelector(".dropzone-upload").addEventListener('click', function () {
      myDropzone.enqueueFiles(myDropzone.getFilesWithStatus(Dropzone.ADDED));
    });
    dropzone.querySelector(".dropzone-remove-all").addEventListener('click', function () {
      // @ts-ignore
      dropzone.querySelector('.dropzone-upload').style.display = "none"
      // @ts-ignore
      dropzone.querySelector('.dropzone-remove-all').style.display = "none";
      myDropzone.removeAllFiles(true);
    });
    myDropzone.on("queuecomplete", function (progress) {
      const uploadIcons = dropzone.querySelectorAll('.dropzone-upload');
      uploadIcons.forEach(uploadIcon => {
        // @ts-ignore
        uploadIcon.style.display = "none";
      });
    });
    myDropzone.on("removedfile", function (file) {
      if (myDropzone.files.length < 1) {
        // @ts-ignore
        dropzone.querySelector('.dropzone-upload').style.display = "none";
        // @ts-ignore
        dropzone.querySelector('.dropzone-remove-all').style.display = "none";
      }
    });
    myDropzone.on('error', function (file, errorMessage) {
      console.log('Error al subir archivo:', errorMessage);
    });


    // @ts-ignore
    const mdlCambioEstado = new bootstrap.Modal(document.getElementById('mdlCambioEstado'), {
      keyboard: false
    })
    $('#btnPrevioStatus').on('click', (e) => {
      console.log('ESTADO', this.dataPrevio);
      $('#select-change-status').val(this.dataPrevio.estatusId).trigger('change');
      mdlCambioEstado.show();
    });
    $('#save-change-status').on('click', (e) => {
      const newStatus = $('#select-change-status').val();
      if (newStatus === '') {
        Swal.fire({
          title: 'Debe seleccionar un estado.',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Entendido',
          buttonsStyling: !1,
          customClass: { confirmButton: 'btn btn-primary' }
        });
      } else {
        const dataClasificacion = {
          id: this.dataPrevio.id,
          estado: $('#select-change-status').val()
        };
        console.log('ESTADO', dataClasificacion);
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          })
        };
        const nuevoEstadoId = $('#select-change-status').val();
        const data = { nuevoEstadoId: nuevoEstadoId };

        this.http.put(`${this.serverNETURL}Clasificacion/ActualizarEstado/${this.dataPrevio.id}/${parseInt(nuevoEstadoId)}`, httpOptions)
          .subscribe(
            response => {
              console.log('RESPONSE', response);
              // @ts-ignore
              if (response.status === 'ok') {
                Swal.fire({
                  title: 'Estado actualizado correctamente.',
                  icon: 'info',
                  showCancelButton: false,
                  confirmButtonText: 'Entendido',
                  buttonsStyling: !1,
                  customClass: {confirmButton: 'btn btn-success'}
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.router.navigate(['']);
                  }
                });
              }
            },
            error => {
              console.error('Error al enviar el JSON:', error);
            }
          );
      }
    });
  }
  ngAfterViewInit(): void {
    // @ts-ignore
    KTDrawer.createInstances();
    const drawerFraccionEl = document.querySelector('#fraccion_drawer');
    // @ts-ignore
    this.drawerFraccion = KTDrawer.getInstance(drawerFraccionEl);
    const drawerPartesEl = document.querySelector('#noParte_drawer');
    // @ts-ignore
    this.drawerPartes = KTDrawer.getInstance(drawerPartesEl);
    const self = this; // Guarda el contexto actual
    this.renderer.listen(this.btnPallet.nativeElement, 'click', () => {
      // this.detalleComplemento.nativeElement.value = 'MA';
      this.agregarIdentificadorMadera();
    });
    this.servicioValidator = FormValidation.formValidation(
      this.frmNgPartida.nativeElement,
      {
        fields: {
          // detalle_parte_numero: { validators: { notEmpty: { message: 'Numero de parte requerido.' } } },
          detalle_parte_fraccion: { validators: { notEmpty: { message: 'Fracción arancelaria requerida.' } } },
          detalle_umt: { validators: { notEmpty: { message: 'UMT es requerido.' } } },
          // detalle_cantidad_tarifa: { validators: { notEmpty: { message: 'Cant. tarifa es requerida.' } } },
          // detalle_descripcion: { validators: { notEmpty: { message: 'Descripción es requerida.' } } },
          // detalle_umf: { validators: { notEmpty: { message: 'UMF es requerido.' } } },
          // detalle_umc: { validators: { notEmpty: { message: 'UMC es requerido.' } } },
          // detalle_origen: { validators: { notEmpty: { message: 'Origen es requerido.' } } },
          // detalle_vendedor: { validators: { notEmpty: { message: 'Destino es requerido.' } } },
          // detalle_uso: { validators: { notEmpty: { message: 'Uso es requerido.' } } },
          // detalle_estado: { validators: { notEmpty: { message: 'Estado es requerido.' } } },
          // detalle_metodo: { validators: { notEmpty: { message: 'Método es requerido.' } } },
          // detalle_vinculacion: { validators: { notEmpty: { message: 'Vinculación es requerido.' } } },
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
    $(this.frmNgPartida.nativeElement.querySelector('[name="detalle_umt"]')).on('change', () => {
      this.servicioValidator.revalidateField('detalle_umt');
    });
    this.renderer.listen(this.btnSubmitPartida.nativeElement, 'click', (e) => {
      e.preventDefault();
      this.servicioValidator.validate().then((status) => {
        if (status === 'Valid') {
          this.obtenerValoresElementosFormulario();
          const auxPartida = this.localPartidas[0];
          const dataPartida = {
            Id: (this.currentPartida.length === 0 ? null : this.currentPartida.id),
            IdClasificacion: this.dataPrevio.id,
            IdFuentePartida: (this.currentPartida.length === 0 ? null : this.currentPartida.partida_id),
            Fuente: (this.currentPartida.length === 0 ? 'MANUAL' : 'PREVIO'),
            Fraccion: auxPartida.detalle_parte_fraccion.replace(/\./g, ''),
            UMT: auxPartida.detalle_umt,
            // @ts-ignore
            IdFraccion: this.selectedFraccion.idFraccion ? this.selectedFraccion.idFraccion : null,
            Descripcion: this.detalleParteDescripcion.nativeElement.value,
            // token: '302af6d1e3b16319a274260806b006a7'
          };
          const datosTablaIdentificadores = this.tableIdentificadores.data().toArray();
          const datosTablaPermisos = this.tablePermisos.data().toArray();
          let respuesta;
          const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json'
            })
          };
          if (this.currentPartida.id) {
            console.log('EDITANDO');
            this.http.put(`${this.serverNETURL}Partida/ActualizarPartida/${dataPartida.Id}`, dataPartida, httpOptions)
              .subscribe(
                response => {

                  if (datosTablaIdentificadores.length > 0) {
                    datosTablaIdentificadores.forEach((identificador: { Id: number; Clave: string; Complemento1: string; Complemento2: string; Complemento3: string; }) => {
                      const dataID = {
                        // @ts-ignore
                        Id: identificador.Id,
                        // @ts-ignore
                        IdClasificacionPartida: dataPartida.Id,
                        Clave: identificador.Clave,
                        Complemento1: identificador.Complemento1 === "" ? null : identificador.Complemento1,
                        Complemento2: identificador.Complemento2 === "" ? null : identificador.Complemento2,
                        Complemento3: identificador.Complemento3 === "" ? null : identificador.Complemento3
                      };
                      if (dataID.Id === null) {
                        delete dataID.Id;
                        this.http.post(`${this.serverNETURL}ClasificacionPartidaIdentificadores`, dataID, httpOptions)
                          .subscribe(
                            response => {
                              console.log('RESPONSE ID', response);
                            },
                            error => {
                              console.error('Error al enviar el JSON:', error);
                            }
                          );
                      } else {
                        this.http.put(`${this.serverNETURL}ClasificacionPartidaIdentificadores/${dataID.Id}`, dataID, httpOptions)
                          .subscribe(
                            response => {
                              console.log('RESPONSE ID', response);
                            },
                            error => {
                              console.error('Error al enviar el JSON:', error);
                            }
                          );
                      }
                    });
                  }
                  if (datosTablaPermisos.length > 0) {
                    datosTablaPermisos.forEach((permiso: { Id: number; IdPedimento: string; Clave: string; FirmaDescargo: string; NumeroPermiso: string; ValorComercialDolares: string; CantidadMercancia: string; }) => {
                      const dataID = {
                        // @ts-ignore
                        Id: permiso.Id,
                        // @ts-ignore
                        IdClasificacionPartida: response.partidaId,
                        IdPedimento: null,
                        Clave: permiso.Clave,
                        FirmaDescargo: permiso.FirmaDescargo,
                        NumeroPermiso: permiso.NumeroPermiso,
                        ValorComercialDolares: permiso.ValorComercialDolares,
                        CantidadMercancia: permiso.CantidadMercancia
                      };
                      if (dataID.Id === null) {
                        delete dataID.Id;
                        this.http.post(`${this.serverNETURL}ClasificacionPartidaPermisos`, dataID, httpOptions)
                          .subscribe(
                            response => {
                              console.log('RESPONSE ID', response);
                            },
                            error => {
                              console.error('Error al enviar el JSON:', error);
                            }
                          );
                      } else {
                        this.http.put(`${this.serverNETURL}ClasificacionPartidaPermisos/${dataID.Id}`, dataID, httpOptions)
                          .subscribe(
                            response => {
                              console.log('RESPONSE ID', response);
                            },
                            error => {
                              console.error('Error al enviar el JSON:', error);
                            }
                          );
                      }
                    });
                  }

                  // @ts-ignore
                  if (response.status === 'ok') {
                    self.getPartidas(this.dataPrevio.id);
                    this.currentPartida = [];
                    const drawerElement = document.querySelector('#kt_drawer_example_basic');
                    // @ts-ignore
                    const drawer = KTDrawer.getInstance(drawerElement);
                    this.frmNgPartida.nativeElement.reset();
                    $(this.detalleUmt.nativeElement).trigger('change');
                    this.servicioValidator.resetForm();
                    this.tableIdentificadores.clear().draw();
                    this.tablePermisos.clear().draw();
                    drawer.hide();
                    toastr.success('Partida actualizada correctamente');
                  } else {
                    // @ts-ignore
                    toastr.warning(response.result.message);
                  }

                },
                error => {
                  toastr.error('Ocurrió un error inesperado, intente más tarde');
                }
              );
          } else {
            console.log('REGISTRANDO');
            delete dataPartida.Id;
            this.http.post(`${this.serverNETURL}Partida/InsertarPartida`, dataPartida, httpOptions)
              .subscribe(
                response => {
                  console.log('REGISTRANDO', response);
                  if (datosTablaIdentificadores.length > 0) {
                    datosTablaIdentificadores.forEach((identificador: { Id: number; Clave: string; Complemento1: string; Complemento2: string; Complemento3: string; }) => {
                      const dataID = {
                        // @ts-ignore
                        Id: identificador.Id,
                        // @ts-ignore
                        IdClasificacionPartida: response.partidaId,
                        Clave: identificador.Clave,
                        Complemento1: identificador.Complemento1 === "" ? null : identificador.Complemento1,
                        Complemento2: identificador.Complemento2 === "" ? null : identificador.Complemento2,
                        Complemento3: identificador.Complemento3 === "" ? null : identificador.Complemento3
                      };
                      if (dataID.Id === null) {
                        delete dataID.Id;
                        this.http.post(`${this.serverNETURL}ClasificacionPartidaIdentificadores`, dataID, httpOptions)
                          .subscribe(
                            response => {
                              console.log('RESPONSE ID', response);
                            },
                            error => {
                              console.error('Error al enviar el JSON:', error);
                            }
                          );
                      } else {
                        this.http.put(`${this.serverNETURL}ClasificacionPartidaIdentificadores/${dataID.Id}`, dataID, httpOptions)
                          .subscribe(
                            response => {
                              console.log('RESPONSE ID', response);
                            },
                            error => {
                              console.error('Error al enviar el JSON:', error);
                            }
                          );
                      }
                    });
                  }
                  if (datosTablaPermisos.length > 0) {
                    datosTablaPermisos.forEach((permiso: { Id: number; IdPedimento: string; Clave: string; FirmaDescargo: string; NumeroPermiso: string; ValorComercialDolares: string; CantidadMercancia: string; }) => {
                      const dataID = {
                        // @ts-ignore
                        Id: permiso.Id,
                        // @ts-ignore
                        IdClasificacionPartida: response.partidaId,
                        IdPedimento: null,
                        Clave: permiso.Clave,
                        FirmaDescargo: permiso.FirmaDescargo,
                        NumeroPermiso: permiso.NumeroPermiso,
                        ValorComercialDolares: permiso.ValorComercialDolares,
                        CantidadMercancia: permiso.CantidadMercancia
                      };
                      if (dataID.Id === null) {
                        delete dataID.Id;
                        this.http.post(`${this.serverNETURL}ClasificacionPartidaPermisos`, dataID, httpOptions)
                          .subscribe(
                            response => {
                              console.log('RESPONSE ID', response);
                            },
                            error => {
                              console.error('Error al enviar el JSON:', error);
                            }
                          );
                      } else {
                        this.http.put(`${this.serverNETURL}ClasificacionPartidaPermisos/${dataID.Id}`, dataID, httpOptions)
                          .subscribe(
                            response => {
                              console.log('RESPONSE ID', response);
                            },
                            error => {
                              console.error('Error al enviar el JSON:', error);
                            }
                          );
                      }

                    });
                  }
                  // @ts-ignore
                  if (response.status === 'ok') {
                    self.getPartidas( this.dataPrevio.id);
                    this.currentPartida = [];
                    const drawerElement = document.querySelector('#kt_drawer_example_basic');
                    // @ts-ignore
                    const drawer = KTDrawer.getInstance(drawerElement);
                    this.frmNgPartida.nativeElement.reset();
                    $(this.detalleUmt.nativeElement).trigger('change');
                    this.servicioValidator.resetForm();
                    this.tableIdentificadores.clear().draw();
                    this.tablePermisos.clear().draw();
                    drawer.hide();
                    toastr.success('Partida guardada correctamente');
                  } else {
                    // @ts-ignore
                    toastr.warning(response.result.message);
                  }
                },
                error => {
                  toastr.error('Ocurrió un error inesperado, intente más tarde');
                }
              );
          }
        }
      });
    });
    // @ts-ignore
    Inputmask({
      mask: '9999.99.99.99'
    }).mask('#detalle_parte_fraccion');
    this.renderer.listen(this.noParteDrawerSave.nativeElement, 'click', () => {
      Swal.fire({
        title: 'Desea guardar la información del numero de parte?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Si, Guardar',
        cancelButtonText: `Cancelar`,
        customClass: {confirmButton: 'btn btn-sm btn-primary', cancelButton: 'btn btn-sm btn-active-light'}
      }).then((result) => {
        if (result.isConfirmed) {
          console.log('Guardado');
        }
      });
    });
    $(document).on('focus', '.select2-selection.select2-selection--single', (e) => {
      // Abre el menú desplegable de Select2 cuando se hace clic en el área de selección
      $(e.target).closest('.select2-container').siblings('select:enabled').select2('open');
    });

    $('select.select2').on('select2:closing', (e) => {
      // Evita que el menú desplegable de Select2 se cierre automáticamente al hacer clic en otro lugar
      // tslint:disable-next-line:no-shadowed-variable
      $(e.target).data('select2').$selection.one('focus focusin', (e) => {
        e.stopPropagation();
      });
    });

    $(document).on('select2:open', () => {
      // Enfoca el campo de búsqueda de Select2 automáticamente cuando se abre el menú desplegable.
      // @ts-ignore
      document.querySelector('.select2-search__field').focus();
    });
    this.renderer.listen(this.btnNewPrevio.nativeElement, 'click', () => {
      $('#btn-eliminar-partida').css('display', 'none');
    });
    $(this.detalleUmt.nativeElement).select2({
      placeholder: 'Seleccionar UMT'
    });
    $(this.detalleUmt.nativeElement).on('change', (event) => {
      const selectedValue = $(event.target).val();
      if (selectedValue === '74') {
        console.log('Entre')
        this.detalleCantidadTarifa.nativeElement.value = this.PartidaCantidadPeso.nativeElement.value;
      }
    });
  }
  getRevision(previo) {
    fetch(`${this.serverNETURL}Clasificacion/${previo}`)
      .then(response => response.json())
      .then(data => {
        console.log('DATA PREVIO', data)
        this.dataPrevio = data;
        // tslint:disable-next-line:radix
        this.currentCliente = parseInt(this.dataPrevio.clienteId);
        this.getPartidas( this.dataPrevio.id);

        const divs = document.querySelectorAll('.div-manual');
        if (this.dataPrevio.fuente === 'PREVIO') {
          this.btnNewPrevio.nativeElement.style.display = 'none';
        } else {
          this.btnNewPrevio.nativeElement.style.display = 'inline';
          divs.forEach(function(div) {
            // @ts-ignore
            div.style.display = 'none';
          });
        }
        $('#estado-previo-lbl').text(this.dataPrevio.estatusDescripcion);
        this.tablePartes.ajax.reload();
      })
      .catch(error => console.error('Error en la solicitud:', error));
  }
  getPartidas(clasificacion) {
    fetch(`${this.serverNETURL}Partida/${clasificacion}`)
      .then(response => response.json())
      .then(data => {
        this.listaPartidas = data;
        // $("#navegacion-partida-counter").data('counter', data.length);
        document.getElementById('navegacion-partida-counter').setAttribute('data-counter', data.length);
      })
      .catch(error => console.error('Error en la solicitud:', error));
  }
  eliminarPartida(id: number) {
    this.listaPartidas = this.listaPartidas.filter(partida => partida.id !== id);
  }
  getIDPartidas(clasificacion) {
    this.tableIdentificadores.clear().draw();
    fetch(`${this.serverNETURL}ClasificacionPartidaIdentificadores/${clasificacion}`)
      .then(response => response.json())
      .then(data => {
        this.tableIdentificadores.rows.add(data).draw();
      })
      .catch(error => console.error('Error en la solicitud:', error));
  }
  getPermisosPartidas(clasificacion) {
    this.tablePermisos.clear().draw();
    fetch(`${this.serverNETURL}ClasificacionPartidaPermisos/${clasificacion}`)
      .then(response => response.json())
      .then(data => {
        this.tablePermisos.rows.add(data).draw();
      })
      .catch(error => console.error('Error en la solicitud:', error));
  }
  getCatalogos() {
    fetch(`${this.serverNETURL}Catalogo/GetUMC`)
      .then(response => response.json())
      .then(data => {
        this.listaUmc = data;
      })
      .catch(error => console.error('Error en la solicitud:', error));
    fetch(`${this.serverNETURL}Catalogo/GetPaises`)
      .then(response => response.json())
      .then(data => {
        this.listaPaises = data;
      })
      .catch(error => console.error('Error en la solicitud:', error));
    fetch(`${this.serverNETURL}Catalogo/GetZonas`)
      .then(response => response.json())
      .then(data => {
        this.listaZonas = data;
      })
      .catch(error => console.error('Error en la solicitud:', error));
    fetch(`${this.serverNETURL}Catalogo?status=CDCESTATUS`)
      .then(response => response.json())
      .then(data => {
        const newDataEstados = data.map(objeto => {
          return { ...objeto, text: objeto.ValorTexto, id: objeto.Id };
        });
        this.listaEstados = newDataEstados;
        $('#select-change-status').select2({
          placeholder: 'Seleccionar estado',
          dropdownParent: $('#mdlCambioEstado'),
          data: this.listaEstados
        });
      })
      .catch(error => console.error('Error en la solicitud:', error));
  }
  openDrawerPartida(partida: string, index?: number) {
    const drawerElement = document.querySelector('#kt_drawer_example_basic');
    // @ts-ignore
    const drawer = KTDrawer.getInstance(drawerElement);
    fetch(`${this.serverNETURL}Partida/GetPartidaPorId/${partida}`)
      .then(response => response.json())
      .then(data => {
        this.currentPartida = data;
        console.log('PARTIDA', this.currentPartida)
        if (this.currentPartida.clasificacion_fuente === 'MANUAL') {
          $('#btn-eliminar-partida').css('display', 'inline');
        } else {
          $('#btn-eliminar-partida').css('display', 'none');
        }
        // tslint:disable-next-line:no-shadowed-variable
        const partidaExistente = this.localPartidas.find((partida: any) => partida.partida === this.currentPartida.id);
        this.detalleParteNumero.nativeElement.value = this.currentPartida.partida_parte_numero;
        if (this.currentPartida.clasificacion_fraccion_numero) {
          this.detalleParteFraccion.nativeElement.value = this.currentPartida.clasificacion_fraccion_numero;
        }
        if (this.currentPartida.clasificacion_descripcion) {
          this.detalleParteDescripcion.nativeElement.value = this.currentPartida.clasificacion_descripcion;
        }
        if (this.currentPartida.partida_umf_id) {
          this.detalleParteUMF.nativeElement.value = this.currentPartida.partida_umf_id;
          $(this.detalleParteUMF.nativeElement).trigger('change');
        }
        if (this.currentPartida.umt_codigo) {
          this.detalleUmt.nativeElement.value = this.currentPartida.umt_codigo;
          $(this.detalleUmt.nativeElement).trigger('change');
        }
        if (this.currentPartida.partida_umc_id) {
          this.PartidaUMC.nativeElement.value = this.currentPartida.partida_umc_id;
          $(this.PartidaUMC.nativeElement).trigger('change');
        }
        this.detalleCantidadTarifa.nativeElement.value = this.currentPartida.partida_cantidad_tarifa;
        this.PartidaCantidadFactura.nativeElement.value = this.currentPartida.partida_cantidad_factura;
        this.PartidaCantidadComercial.nativeElement.value = this.currentPartida.partida_cantidad_comercial;
        this.PartidaCantidadPeso.nativeElement.value = this.currentPartida.partida_peso_neto;
        if (this.currentPartida.partida_pais_origen_id) {
          this.PartidaOrigen.nativeElement.value = this.currentPartida.partida_pais_origen_id;
          $(this.PartidaOrigen.nativeElement).trigger('change');
        }
        if (this.currentPartida.partida_pais_vendedor_id) {
          this.PartidaVendedor.nativeElement.value = this.currentPartida.partida_pais_vendedor_id;
          $(this.PartidaVendedor.nativeElement).trigger('change');
        }
        this.PartidaNotas.nativeElement.value = this.currentPartida.partida_notas;
        fetch(this.serverhostAPIURL + `imagenes?parte=${this.currentPartida.partida_parte_numero}`)
          .then(response => response.json())
          .then(imagenResponse => {
            this.sctnImagenes.nativeElement.innerHTML = ''; // Limpia el contenido HTML existente
            if (imagenResponse.length === 0) {
              console.warn('No tiene imágenes');
              this.sctnImagenes.nativeElement.innerHTML = `
                  <div class="alert alert-light text-muted text-center" role="alert">
                    No hay imágenes registradas.
                  </div>
                `;
            } else {
              console.warn('Si tiene imágenes');
              imagenResponse.forEach(imagen => {
                const html = `
<a class="d-block overlay mb-3 w-200px" data-lightbox="lightbox-basic" href="${imagen.Ruta}">
    <div class="overlay-wrapper bgi-no-repeat bgi-position-center bgi-size-cover card-rounded min-h-175px"
        style="background-image:url('${imagen.Ruta}')">
    </div>
    <div class="overlay-layer card-rounded bg-dark bg-opacity-25 shadow">
        <i class="bi bi-eye-fill text-white fs-3x"></i>
    </div>
</a>
                  `;
                const lightHtml = `<a href="${imagen.Ruta}" data-lightbox="image-1" data-title="My caption">Image #1</a>`
                this.sctnImagenes.nativeElement.insertAdjacentHTML('beforeend', html);
              });
            }
          })
          .catch(error => console.error('Error en la solicitud:', error));

        this.getIDPartidas(this.currentPartida.id);
        this.getPermisosPartidas(this.currentPartida.id);
        $('#navegacion-partida-numero').text(index);

      })
      .catch(error => console.error('Error en la solicitud:', error));
    if (!drawer.isShown()) {
      drawer.show();
    }
  }

  //#region Identificadores
  agregarDatosIdentificador(): void {
    const Clave = this.detalleCaso.nativeElement.value;
    const Complemento1 = this.detalleComplemento.nativeElement.value;
    const Complemento2 = this.detalleComplemento2.nativeElement.value;
    const Complemento3 = this.detalleComplemento3.nativeElement.value;
    if (!Clave) {
      toastr.error('Error: Caso es requerido.');
      return;
    }

    const obj = {
      Id: null,
      IdClasificacionPartida: (this.currentPartida.clasificacion_id ? this.currentPartida.clasificacion_id : null),
      Clave,
      Complemento1,
      Complemento2,
      Complemento3,
    };

    this.tableIdentificadores.row.add(obj).draw();
    // Restablecer los valores de los campos a una cadena vacía
    this.detalleCaso.nativeElement.value = '';
    this.detalleComplemento.nativeElement.value = '';
    this.detalleComplemento2.nativeElement.value = '';
    this.detalleComplemento3.nativeElement.value = '';

    // Activar el evento 'change' en el elemento detalleCaso para restablecer el valor seleccionado
    this.detalleCaso.nativeElement.dispatchEvent(new Event('change'));
  }
  agregarIdentificadorMadera(): void {

    const existeMA = this.tableIdentificadores.rows().data().toArray().some(row => row.Clave === 'MA');
    if (existeMA) {
      Swal.fire({
        title: 'La clave "MA" ya esta agregada en los identificadores.',
        icon: 'info',
        showCancelButton: false,
        confirmButtonText: 'Entendido',
        cancelButtonText: `Cancelar`,
        customClass: {confirmButton: 'btn btn-sm btn-primary', cancelButton: 'btn btn-sm btn-active-light'}
      });
      return;
    }

    const Clave = 'MA';
    const Complemento1 = this.detalleComplemento.nativeElement.value;
    const Complemento2 = this.detalleComplemento2.nativeElement.value;
    const Complemento3 = this.detalleComplemento3.nativeElement.value;

    if (!Clave) {
      toastr.error('Error: Caso es requerido.');
      return;
    }

    const obj = {
      Id: null,
      IdClasificacionPartida: (this.currentPartida.clasificacion_id ? this.currentPartida.clasificacion_id : null),
      Clave,
      Complemento1,
      Complemento2,
      Complemento3,
    };

    this.tableIdentificadores.row.add(obj).draw();
    // Restablecer los valores de los campos a una cadena vacía
    this.detalleCaso.nativeElement.value = '';
    this.detalleComplemento.nativeElement.value = '';
    this.detalleComplemento2.nativeElement.value = '';
    this.detalleComplemento3.nativeElement.value = '';

    // Activar el evento 'change' en el elemento detalleCaso para restablecer el valor seleccionado
    this.detalleCaso.nativeElement.dispatchEvent(new Event('change'));
  }
  limpiarIdentificador(): void {
    // Restablecer los valores de los campos a una cadena vacía
    this.detalleCaso.nativeElement.value = '';
    this.detalleComplemento.nativeElement.value = '';
    this.detalleComplemento2.nativeElement.value = '';
    this.detalleComplemento3.nativeElement.value = '';

    // Activar el evento 'change' en el elemento detalleCaso para restablecer el valor seleccionado
    this.detalleCaso.nativeElement.dispatchEvent(new Event('change'));

    this.btnAddIdentificador.nativeElement.style.display = 'inline';
    this.btnUpdateIdentificador.nativeElement.style.display = 'none';
    this.btnCancelIdentificador.nativeElement.style.display = 'none';
  }
  eliminarIdentificador(identificador) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        id: identificador,
        token: '302af6d1e3b16319a274260806b006a7'
      },
    };
    this.http.delete(`${this.serverNETURL}ClasificacionPartidaIdentificadores/${identificador}`)
      .subscribe(
        response => {
          this.tableIdentificadores.rows().every(function() {
            if (this.data().Id === identificador) {
              this.remove();
            }
          });
          this.tableIdentificadores.draw();
          // this.tableIdentificadores.clear().draw();
        },
        error => {
          console.error('Error al enviar el JSON:', error);
        }
      );
  }
  actualizarDatosIdentificador(): void {
    const Clave = this.detalleCaso.nativeElement.value;
    const opcionSeleccionada = this.detalleCaso.nativeElement.selectedOptions[0];
    const casoTexto = opcionSeleccionada.textContent.trim();
    const Complemento1 = this.detalleComplemento.nativeElement.value;
    const Complemento2 = this.detalleComplemento2.nativeElement.value;
    const Complemento3 = this.detalleComplemento3.nativeElement.value;

    if (!Clave) {
      toastr.error('Error: Caso es requerido.');
      return;
    }

    const obj = {
      Id: this.currentIdentificador.Id,
      IdClasificacionPartida: this.currentIdentificador.IdClasificacionPartida,
      Clave,
      Complemento1,
      Complemento2,
      Complemento3,
    };
    const index = $('#colIdentificador').data('index');
    $('#tabla-identificadores').dataTable().fnUpdate(obj, index, undefined, false);
    // Restablecer los valores de los campos a una cadena vacía
    this.detalleCaso.nativeElement.value = '';
    this.detalleComplemento.nativeElement.value = '';
    this.detalleComplemento2.nativeElement.value = '';
    this.detalleComplemento3.nativeElement.value = '';

    // Activar el evento 'change' en el elemento detalleCaso para restablecer el valor seleccionado
    this.detalleCaso.nativeElement.dispatchEvent(new Event('change'));
    this.btnAddIdentificador.nativeElement.style.display = 'inline';
    this.btnUpdateIdentificador.nativeElement.style.display = 'none';
    this.btnCancelIdentificador.nativeElement.style.display = 'none';

    this.currentIdentificador = [];
  }
  //#endregion

  //#region Permisos
  agregarDatosPermisos(): void {
    const permisoClave = this.detallePermisoClave.nativeElement.value;
    const opcionSeleccionada = this.detallePermisoClave.nativeElement.selectedOptions[0];
    const permisoClaveTexto = opcionSeleccionada.textContent.trim();
    const permisoNumero = this.detallePermisoNumero.nativeElement.value;
    const permisoFirma = this.detallePermisoFirma.nativeElement.value;
    const permisoValorComercial = this.detallePermisoValorComercial.nativeElement.value;
    const permisoCantidadTarifa = this.detallePermisoCantidadTarifa.nativeElement.value;

    if (!permisoClave) {
      toastr.error('Error: Clave es requerido.');
      return;
    }

    const obj = {
      Id: null,
      IdClasificacionPartida: (this.currentPartida.clasificacion_id ? this.currentPartida.clasificacion_id : null),
      IdPedimento: null,
      Clave: permisoClave,
      FirmaDescargo: permisoNumero,
      NumeroPermiso: permisoFirma,
      ValorComercialDolares: permisoValorComercial,
      CantidadMercancia: permisoCantidadTarifa,
    };

    this.tablePermisos.row.add(obj).draw();
    // Restablecer los valores de los campos a una cadena vacía
    this.detallePermisoClave.nativeElement.value = '';
    this.detallePermisoNumero.nativeElement.value = '';
    this.detallePermisoFirma.nativeElement.value = '';
    this.detallePermisoValorComercial.nativeElement.value = '';
    this.detallePermisoCantidadTarifa.nativeElement.value = '';

    // Activar el evento 'change' en el elemento detalleCaso para restablecer el valor seleccionado
    this.detallePermisoClave.nativeElement.dispatchEvent(new Event('change'));
  }
  limpiarPermisos(): void {
    // Restablecer los valores de los campos a una cadena vacía
    this.detallePermisoClave.nativeElement.value = '';
    this.detallePermisoNumero.nativeElement.value = '';
    this.detallePermisoFirma.nativeElement.value = '';
    this.detallePermisoValorComercial.nativeElement.value = '';
    this.detallePermisoCantidadTarifa.nativeElement.value = '';
    // Activar el evento 'change' en el elemento detalleCaso para restablecer el valor seleccionado
    this.detallePermisoClave.nativeElement.dispatchEvent(new Event('change'));
    this.btnAddPermiso.nativeElement.style.display = 'inline';
    this.btnUpdatePermiso.nativeElement.style.display = 'none';
    this.btnCancelPermiso.nativeElement.style.display = 'none';
  }
  eliminarPermiso(permiso) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        id: permiso,
        token: '302af6d1e3b16319a274260806b006a7'
      },
    };
    this.http.delete(`${this.serverNETURL}ClasificacionPartidaPermisos/${permiso}`)
      .subscribe(
        response => {
          this.tablePermisos.rows().every(function() {
            if (this.data().Id === permiso) {
              this.remove();
            }
          });
          this.tablePermisos.draw();
        },
        error => {
          console.error('Error al enviar el JSON:', error);
        }
      );
  }
  actualizarDatosPermisos(): void {
    const permisoClave = this.detallePermisoClave.nativeElement.value;
    const opcionSeleccionada = this.detallePermisoClave.nativeElement.selectedOptions[0];
    const permisoClaveTexto = opcionSeleccionada.textContent.trim();
    const permisoNumero = this.detallePermisoNumero.nativeElement.value;
    const permisoFirma = this.detallePermisoFirma.nativeElement.value;
    const permisoValorComercial = this.detallePermisoValorComercial.nativeElement.value;
    const permisoCantidadTarifa = this.detallePermisoCantidadTarifa.nativeElement.value;

    if (!permisoClave) {
      toastr.error('Error: Clave es requerido.');
      return;
    }

    const obj = {
      Id: this.currentPermiso.Id,
      IdClasificacionPartida: this.currentPermiso.IdClasificacionPartida,
      IdPedimento: null,
      Clave: permisoClave,
      FirmaDescargo: permisoFirma,
      NumeroPermiso: permisoNumero,
      ValorComercialDolares: permisoValorComercial,
      CantidadMercancia: permisoCantidadTarifa,
    };

    const index = $('#colPermisos').data('index');
    $('#tabla-permisos').dataTable().fnUpdate(obj, index, undefined, false);
    // Restablecer los valores de los campos a una cadena vacía
    this.detallePermisoClave.nativeElement.value = '';
    this.detallePermisoNumero.nativeElement.value = '';
    this.detallePermisoFirma.nativeElement.value = '';
    this.detallePermisoValorComercial.nativeElement.value = '';
    this.detallePermisoCantidadTarifa.nativeElement.value = '';
    // Activar el evento 'change' en el elemento detalleCaso para restablecer el valor seleccionado
    this.detallePermisoClave.nativeElement.dispatchEvent(new Event('change'));
    this.btnAddPermiso.nativeElement.style.display = 'inline';
    this.btnUpdatePermiso.nativeElement.style.display = 'none';
    this.btnCancelPermiso.nativeElement.style.display = 'none';
  }
  //#endregion
  obtenerValoresElementosFormulario() {
    const elementos = this.frmNgPartida.nativeElement.querySelectorAll('input, select, textarea');
    const valores = {};

    elementos.forEach((elemento: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
      valores[elemento.name] = elemento.value;
    });
    const datosTablaIdentificadores = this.tableIdentificadores.data().toArray();
    const datosTablaPermisos = this.tablePermisos.data().toArray();
    // @ts-ignore
    valores.partida = this.currentPartida.id;
    // @ts-ignore
    valores.identificadores = datosTablaIdentificadores;
    // @ts-ignore
    valores.permisos = datosTablaPermisos;
    const indexPartidaExistente = this.localPartidas.findIndex((partida: any) => partida.partida === this.currentPartida.id);
    if (indexPartidaExistente !== -1) {
      this.localPartidas.splice(indexPartidaExistente, 1); // Eliminar partida existente
    }
    this.localPartidas.push(valores); // Agregar nueva partida
  }

// Función para mostrar la información del row seleccionado
  mostrarInformacion(rowData) {
    // Aquí puedes mostrar la información en algún lugar de tu interfaz, por ejemplo:
    console.log(rowData);
    // También puedes actualizar los elementos HTML con los datos del row seleccionado
  }
  navegar(direccion) {
    // Obtén la cantidad de elementos desde el atributo "data-counter"
    const cantidad = parseInt(document.getElementById('navegacion-partida-counter').getAttribute('data-counter'));

    // Asegúrate de que "cantidad" sea un número y que sea mayor que cero
    if (!isNaN(cantidad) && cantidad > 0) {
      // Obtén el índice actual desde el atributo "data-indice-actual"
      let indiceActual = parseInt(document.getElementById('navegacion-partida-counter').getAttribute('data-indice-actual'));

      // Asegúrate de que "indiceActual" sea un número
      if (isNaN(indiceActual)) {
        indiceActual = 0; // Si no se ha establecido, comienza desde el primer elemento
      }

      // Realiza la navegación en función de la dirección
      if (direccion === 'primera') {
        indiceActual = 0;
      } else if (direccion === 'anterior') {
        indiceActual = Math.max(0, indiceActual - 1);
      } else if (direccion === 'siguiente') {
        indiceActual = Math.min(cantidad - 1, indiceActual + 1);
      } else if (direccion === 'ultima') {
        indiceActual = cantidad - 1;
      }

      //@ts-ignore
      document.getElementById('navegacion-partida-counter').setAttribute('data-indice-actual', indiceActual);

      // Realiza la operación deseada en función del índice actual
      // Por ejemplo, puedes acceder a tu listaPartidas:

      this.openDrawerPartida(this.listaPartidas[indiceActual].id, indiceActual);

      // Actualiza el botón "Numero de partida" con el valor del índice actual
      document.getElementById('navegacion-partida-numero').textContent = (indiceActual + 1).toString();
    }
  }
}
