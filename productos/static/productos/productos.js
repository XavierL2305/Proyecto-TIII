document.addEventListener("DOMContentLoaded", () => {
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

  if (button_agregar) {
    button_agregar.addEventListener('click', () => {
      agregar.classList.add('activate');
      bg.classList.add('activate');
      agregar.querySelectorAll('input[type=text], textarea, input[type=number]').forEach(i => i.value = '');
      const fileInput = agregar.querySelector('input[type=file]');
      if (fileInput) fileInput.value = '';
    });
  }

  if (button_editar.length > 0) {
    button_editar.forEach(btn => {
      btn.addEventListener('click', () => {
        editar.classList.add('activate');
        bg.classList.add('activate');
        const datos = {...btn.dataset};
        document.getElementById('producto_id_editar').value = datos.id || '';
        document.getElementById('nombre_editar').value = datos.nombre || '';
        document.getElementById('descripcion_editar').value = datos.descripcion || '';
        document.getElementById('precio_editar').value = datos.precio || '';
        const imgPreview = document.getElementById('img_preview_editar');
        if (datos.imagen) {
          imgPreview.src = datos.imagen;
          imgPreview.style.display = 'block';
        } else {
          imgPreview.style.display = 'none';
          imgPreview.removeAttribute('src');
        }
        const fileInput = editar.querySelector('input[type=file]');
        if (fileInput) fileInput.value = '';
      });
    });
  }

  if (button_eliminar.length > 0) {
    button_eliminar.forEach(btn => {
      btn.addEventListener('click', () => {
        eliminar.classList.add('activate');
        bg.classList.add('activate');
        const eliminarInput = document.getElementById('eliminar_id_input');
        if (eliminarInput) eliminarInput.value = btn.value || '';
      });
    });
  }

  if (button_cancelar.length > 0) {
    Array.from(button_cancelar).forEach(btn => {
      btn.addEventListener('click', () => {
        agregar.classList.remove('activate');
        editar.classList.remove('activate');
        eliminar.classList.remove('activate');
        formularioFiltro.classList.remove('activate');
        bg.classList.remove('activate');
      });
    });
  }

  if (filtroBtn) {
    filtroBtn.addEventListener('click', () => {
      formularioFiltro.classList.add('activate');
      bg.classList.add('activate');
      if (inputBuscar) inputBuscar.value = '';
      if (selectCampo) selectCampo.value = '';
      mostrarTodasFilas();
    });
  }

  if (botonAceptarFiltro) {
    botonAceptarFiltro.addEventListener('click', () => {
      formularioFiltro.classList.remove('activate');
      bg.classList.remove('activate');
      if (inputBuscar.value.trim() !== '' && selectCampo.value !== '') {
        filtrarProductos();
      }
    });
  }

  if (bg) {
    bg.addEventListener('click', () => {
      agregar.classList.remove('activate');
      editar.classList.remove('activate');
      eliminar.classList.remove('activate');
      formularioFiltro.classList.remove('activate');
      bg.classList.remove('activate');
    });
  }

  function mostrarTodasFilas() {
    const filas = document.querySelectorAll('.fila-producto');
    filas.forEach(fila => {
      fila.style.display = '';
    });
  }

  function filtrarProductos() {
    const campo = selectCampo.value;
    const filtro = inputBuscar.value.trim().toLowerCase();

    if (!campo || filtro === '') {
      mostrarTodasFilas();
      return;
    }

    const filas = document.querySelectorAll('.fila-producto');

    filas.forEach(fila => {
      let textoBusqueda = '';
      switch (campo) {
        case 'id_producto_PK':
          textoBusqueda = fila.children[0].textContent.toLowerCase();
          break;
        case 'nombre':
          textoBusqueda = fila.children[2].textContent.toLowerCase();
          break;
        case 'descripcion':
          textoBusqueda = fila.children[3].textContent.toLowerCase();
          break;
        case 'precio':
          textoBusqueda = fila.children[4].textContent.toLowerCase();
          break;
        case 'categoria':
          textoBusqueda = fila.children[5].textContent.toLowerCase();
          break;
        default:
          textoBusqueda = '';
      }

      if (textoBusqueda.includes(filtro)) {
        fila.style.display = '';
      } else {
        fila.style.display = 'none';
      }
    });
  }

  if (inputBuscar && selectCampo) {
    inputBuscar.addEventListener('input', filtrarProductos);
    selectCampo.addEventListener('change', filtrarProductos);
  }

  setTimeout(() => {
    const alertas = document.getElementById('alertas');
    if (alertas) alertas.style.display = 'none';
  }, 3000);
});
