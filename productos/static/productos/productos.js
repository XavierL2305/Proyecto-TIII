document.addEventListener("DOMContentLoaded", function() {
  const bg = document.getElementById("backgraund_form");

  const agregar = document.getElementById("formulario_agregar");
  const editar = document.getElementById("formulario_editar");
  const eliminar = document.getElementById("formulario_eliminar");

  const button_agregar = document.getElementById("button_agregar");
  const button_editar = document.querySelectorAll('.edit-btn');
  const button_eliminar = document.querySelectorAll('.delete-btn');
  const button_cancelar = document.getElementsByName("cancelar");

  const filtroBtn = document.getElementById('filtro_productos');
  const formularioFiltro = document.getElementById('formulario_filtro_productos');
  const inputBuscar = document.getElementById('buscador_productos');
  const selectCampo = document.getElementById('filtro_campos_producto');

  const botonAceptarFiltro = document.getElementById('boton_aceptar_filtro');

  // Listener botón agregar (si existe)
  if (button_agregar) {
    button_agregar.addEventListener('click', () => {
      if (!agregar) return;
      agregar.classList.add('activate');
      bg.classList.add('activate');
      // Limpiar inputs antes de abrir
      agregar.querySelectorAll('input[type=text], textarea, input[type=number]').forEach(i => i.value = '');
      const fileInput = agregar.querySelector('input[type=file]');
      if (fileInput) fileInput.value = '';
    });
  }

  // Listener botones editar (si existen)
  if (button_editar && button_editar.length > 0) {
    button_editar.forEach(btn => {
      btn.addEventListener('click', () => {
        if (!editar) return;
        editar.classList.add('activate');
        bg.classList.add('activate');
        const datos = {...btn.dataset};
        const idInput = document.getElementById('producto_id_editar');
        const nombreInput = document.getElementById('nombre_editar');
        const descripcionInput = document.getElementById('descripcion_editar');
        const precioInput = document.getElementById('precio_editar');
        if (idInput) idInput.value = datos.id || '';
        if (nombreInput) nombreInput.value = datos.nombre || '';
        if (descripcionInput) descripcionInput.value = datos.descripcion || '';
        if (precioInput) precioInput.value = datos.precio || '';
        const imgPreviewEditar = document.getElementById('img_preview_editar');
        if (imgPreviewEditar) {
          if (datos.imagen) {
            imgPreviewEditar.src = datos.imagen;
            imgPreviewEditar.style.display = 'block';
          } else {
            imgPreviewEditar.style.display = 'none';
            imgPreviewEditar.removeAttribute('src');
          }
        }
        const fileInput = editar.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
      });
    });
  }

  // Listener botones eliminar (si existen)
  if (button_eliminar && button_eliminar.length > 0) {
    button_eliminar.forEach(btn => {
      btn.addEventListener('click', () => {
        if (!eliminar) return;
        eliminar.classList.add('activate');
        bg.classList.add('activate');
        const eliminarInput = document.getElementById('eliminar_id_input');
        if (eliminarInput) eliminarInput.value = btn.value || '';
      });
    });
  }

  // Listener botones cancelar (si existen)
  if (button_cancelar && button_cancelar.length > 0) {
    Array.from(button_cancelar).forEach(btn => {
      btn.addEventListener('click', cancelarFormulario);
    });
  }

  // Listener filtro lupa (si existe)
  if (filtroBtn) {
    filtroBtn.addEventListener('click', () => {
      if (!formularioFiltro) return;
      formularioFiltro.classList.add('activate');
      bg.classList.add('activate');
      // Limpiamos inputs para nueva búsqueda
      if (inputBuscar) inputBuscar.value = '';
      if (selectCampo) selectCampo.value = '';
      mostrarTodasFilas();
    });
  }

  // Listener botón Aceptar del filtro
  if (botonAceptarFiltro) {
    botonAceptarFiltro.addEventListener('click', () => {
      // Solo ocultar el modal y fondo, sin limpiar filas
      if (formularioFiltro) formularioFiltro.classList.remove('activate');
      if (bg) bg.classList.remove('activate');

      // Aplicar filtro si hay texto y campo seleccionado
      if (inputBuscar && selectCampo) {
        if (inputBuscar.value.trim() !== '' && selectCampo.value !== '') {
          filtrarProductos();
        }
      }
    });
  }

  // Listener fondo modal para cerrar todo con cancelar (clic fuera)
  if (bg) {
    bg.addEventListener('click', cancelarFormulario);
  }

  function cancelarFormulario() {
    if (agregar) agregar.classList.remove('activate');
    if (editar) editar.classList.remove('activate');
    if (eliminar) eliminar.classList.remove('activate');
    if (formularioFiltro) formularioFiltro.classList.remove('activate');
    if (bg) bg.classList.remove('activate');

    const eliminarInput = document.getElementById('eliminar_id_input');
    if (eliminarInput) eliminarInput.value = '';

    const imgPreviewEditar = document.getElementById('img_preview_editar');
    if (imgPreviewEditar) imgPreviewEditar.style.display = 'none';

    // Limpiamos el filtro y mostramos todos los productos
    if (inputBuscar) inputBuscar.value = '';
    if (selectCampo) selectCampo.value = '';
    mostrarTodasFilas();
  }

  function mostrarTodasFilas() {
    const tbody = document.querySelector('.tabla .tbody');
    if (!tbody) return;
    Array.from(tbody.children).forEach(el => {
      if(el.style) el.style.display = '';
    });
  }

  function filtrarProductos() {
    if (!selectCampo || !inputBuscar) {
      return mostrarTodasFilas();
    }

    const campo = selectCampo.value;
    const filtro = inputBuscar.value.trim().toLowerCase();

    if (!campo || filtro === '') {
      mostrarTodasFilas();
      return;
    }

    const tbody = document.querySelector('.tabla .tbody');
    if (!tbody) return;
    const hijos = Array.from(tbody.children);

    // Cada producto ocupa 6 elementos consecutivos en la tabla
    for (let i = 0; i < hijos.length; i += 6) {
      const filaGrupo = hijos.slice(i, i + 6);
      let texto = '';

      switch (campo) {
        case 'id_producto_PK':
          texto = filaGrupo[0]?.textContent.toLowerCase() || '';
          break;
        case 'nombre':
          texto = filaGrupo[2]?.textContent.toLowerCase() || '';
          break;
        case 'descripcion':
          texto = filaGrupo[3]?.textContent.toLowerCase() || '';
          break;
        case 'precio':
          texto = filaGrupo[4]?.textContent.toLowerCase() || '';
          break;
        default:
          texto = '';
      }

      if (texto.includes(filtro)) {
        filaGrupo.forEach(el => el.style.display = '');
      } else {
        filaGrupo.forEach(el => el.style.display = 'none');
      }
    }
  }

  // Bindear eventos para filtro, solo si existen ambos inputs
  if (inputBuscar && selectCampo) {
    inputBuscar.addEventListener('input', filtrarProductos);
    selectCampo.addEventListener('change', filtrarProductos);
  }

  // Ocultar alertas después de 3 segundos
  setTimeout(() => {
    const alertas = document.getElementById('alertas');
    if (alertas) alertas.style.display = 'none';
  }, 3000);
});
