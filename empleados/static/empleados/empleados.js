document.addEventListener("DOMContentLoaded", function(){
  const bg = document.getElementById("background_form");
  const agregarModal = document.getElementById("formulario_agregar");
  const editarModal = document.getElementById("formulario_editar");
  const eliminarModal = document.getElementById("formulario_eliminar");

  const btnAgregar = document.getElementsByName("button_agregar")[0];
  const btnsEditar = document.querySelectorAll(".edit-btn");
  const btnsEliminar = document.querySelectorAll(".delete-btn");

  const btnCancelar = document.querySelectorAll('button[name="cancelar"]');

  const empleadoIdEditar = document.getElementById("empleado_id_editar");
  const eliminarIdInput = document.getElementById("eliminar_id");

  const editarForm = editarModal.querySelector('form');
  const inputsEditar = editarForm.elements;

  // Abrir modal Agregar
  btnAgregar.addEventListener("click", () => {
    agregarModal.classList.add("activate");
    bg.classList.add("activate");
    agregarModal.querySelector("form").reset();
  });

  // Abrir modal Editar con datos del empleado
  btnsEditar.forEach(btn => {
    btn.addEventListener("click", () => {
      editarModal.classList.add("activate");
      bg.classList.add("activate");

      empleadoIdEditar.value = btn.dataset.id;
      inputsEditar['username'].value = btn.dataset.username;
      inputsEditar['email'].value = btn.dataset.email;
      inputsEditar['rol'].value = btn.dataset.rol;
    });
  });

  // Abrir modal Eliminar
  btnsEliminar.forEach(btn => {
    btn.addEventListener("click", () => {
      eliminarModal.classList.add("activate");
      bg.classList.add("activate");
      eliminarIdInput.value = btn.value;
    });
  });

  // Cancelar en todos los modales
  btnCancelar.forEach(btn => {
    btn.addEventListener("click", () => {
      agregarModal.classList.remove("activate");
      editarModal.classList.remove("activate");
      eliminarModal.classList.remove("activate");
      bg.classList.remove("activate");
      eliminarIdInput.value = "";
      empleadoIdEditar.value = "";
    });
  });

  // Cerrar modal haciendo clic fuera
  bg.addEventListener("click", () => {
    agregarModal.classList.remove("activate");
    editarModal.classList.remove("activate");
    eliminarModal.classList.remove("activate");
    bg.classList.remove("activate");
    eliminarIdInput.value = "";
    empleadoIdEditar.value = "";
  });


  // ------- Filtro modal empleados --------
  const filtroEmpleadosBtn = document.getElementById('filtro_empleados');
  const filtroEmpleadosModal = document.getElementById('formulario_filtro_empleados');
  const filtroEmpleadosBg = document.getElementById('background_filtro_empleados');
  const cancelarFiltroEmpleadosBtn = document.getElementById('cancelar_filtro_empleados');

  function abrirFiltroEmpleados() {
    filtroEmpleadosModal.classList.add('activate');
    filtroEmpleadosBg.classList.add('activate');
    // Autofocus al input para mejor UX
    setTimeout(() => {
      const inp = document.getElementById('buscador_empleados');
      if (inp) inp.focus();
    }, 60);
  }

  function cerrarFiltroEmpleados() {
    filtroEmpleadosModal.classList.remove('activate');
    filtroEmpleadosBg.classList.remove('activate');
  }

  if(filtroEmpleadosBtn) filtroEmpleadosBtn.addEventListener('click', abrirFiltroEmpleados);
  if(cancelarFiltroEmpleadosBtn) cancelarFiltroEmpleadosBtn.addEventListener('click', cerrarFiltroEmpleados);
  if(filtroEmpleadosBg) filtroEmpleadosBg.addEventListener('click', cerrarFiltroEmpleados);

  // Ocultar alertas automáticas después de 3 segundos
  setTimeout(() => {
    const alertas = document.getElementById("alertas");
    if(alertas) alertas.style.display = "none";
  }, 3000);

});
