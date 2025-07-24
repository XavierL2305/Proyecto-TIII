document.addEventListener("DOMContentLoaded", function(){
  const bg = document.getElementById("backgraund_form");
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
  // Inputs dentro del formulario de editar
  const inputsEditar = editarForm.elements;

  // Abrir modal Agregar
  btnAgregar.addEventListener("click", () => {
    agregarModal.classList.add("activate");
    bg.classList.add("activate");
    // Reset formulario Agregar
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
      inputsEditar['is_cliente'].checked = (btn.dataset.is_cliente === 'True');
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

  // Cancelar en cualquiera de los modales
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

  // Cerrar modal clic fuera
  bg.addEventListener("click", () => {
    agregarModal.classList.remove("activate");
    editarModal.classList.remove("activate");
    eliminarModal.classList.remove("activate");
    bg.classList.remove("activate");
    eliminarIdInput.value = "";
    empleadoIdEditar.value = "";
  });

  // Opcional: auto ocultar alertas tras 3s
  setTimeout(() => {
    const alertas = document.getElementById("alertas");
    if(alertas) alertas.style.display = "none";
  }, 3000);

});
