document.addEventListener("DOMContentLoaded", function(){
  let bg = document.getElementById("backgraund_form")
  let agregar = document.getElementById("formulario_agregar")
  let button_agregar = document.getElementsByName("button_agregar")[0]
  let editar = document.getElementById("formulario_editar")
  let button_editar = document.querySelectorAll('.edit-btn')
  let eliminar = document.getElementById("formulario_eliminar")
  let button_eliminar = document.querySelectorAll('.delete-btn')
  let button_cancelar_1 = document.getElementsByName("cancelar")[0];
  let button_cancelar_2 = document.getElementsByName("cancelar")[1];
  let button_cancelar_3 = document.getElementsByName("cancelar")[2];
  let inputEliminar = document.getElementById("eliminar_id_input")
  let imgPreviewEditar = document.getElementById("img_preview_editar")

  // Mostrar/ocultar formularios modales
  bg.addEventListener('click', () => cancelarFormulario());
  button_agregar.addEventListener('click', () => {
    agregar.classList.add('activate')
    bg.classList.add('activate')
    // Limpia
    agregar.querySelectorAll('input[type=text], textarea, input[type=number]').forEach(i=>i.value='')
    agregar.querySelector('input[type=file]').value = ''
  })

  button_editar.forEach(function(btn) {
    btn.addEventListener('click', () => {
      editar.classList.add('activate')
      bg.classList.add('activate')
      // Llena los campos
      let datos = {...btn.dataset}
      document.getElementById('producto_id_editar').value = datos.id
      document.getElementById('nombre_editar').value = datos.nombre
      document.getElementById('descripcion_editar').value = datos.descripcion
      document.getElementById('precio_editar').value = datos.precio
      imgPreviewEditar.style.display = 'none'
      if(datos.imagen){
        imgPreviewEditar.src = datos.imagen
        imgPreviewEditar.style.display = 'block'
      } else {
        imgPreviewEditar.removeAttribute('src')
      }
      editar.querySelector('input[type="file"]').value = ''
    });
  });

  button_eliminar.forEach(function(btn) {
    btn.addEventListener('click', () => {
      eliminar.classList.add('activate')
      bg.classList.add('activate')
      inputEliminar.value = btn.value
    });
  });

  button_cancelar_1.addEventListener('click', () => cancelarFormulario())
  button_cancelar_2.addEventListener('click', () => cancelarFormulario())
  button_cancelar_3.addEventListener('click', () => cancelarFormulario())

  function cancelarFormulario() {
    agregar.classList.remove('activate')
    editar.classList.remove('activate')
    eliminar.classList.remove('activate')
    bg.classList.remove('activate')
    inputEliminar.value = ''
    imgPreviewEditar.style.display = 'none'
  }
  setTimeout(function() {
    var alertas = document.getElementById('alertas');
    if (alertas) {
      alertas.style.display = 'none'
    }
  }, 2800)
})
