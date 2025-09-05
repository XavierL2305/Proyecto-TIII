document.addEventListener("DOMContentLoaded", () => {
  const bg = document.getElementById("backgraund_form");
  const agregar = document.getElementById("formulario_agregar");
  const editar = document.getElementById("formulario_editar");
  const eliminar = document.getElementById("formulario_eliminar");

  const button_agregar = document.getElementById("button_agregar");
  const button_editar = document.querySelectorAll('.edit-btn');
  const button_eliminar = document.querySelectorAll('.delete-btn');
  const button_cancelar = document.getElementsByName("cancelar");

  if (button_agregar) {
    button_agregar.addEventListener('click', () => {
      agregar.classList.add('activate');
      bg.classList.add('activate');
      agregar.querySelector('input[type=text]').value = '';
    });
  }

  if (button_editar.length > 0) {
    button_editar.forEach(btn => {
      btn.addEventListener('click', () => {
        editar.classList.add('activate');
        bg.classList.add('activate');
        document.getElementById('categoria_id_editar').value = btn.dataset.id || '';
        document.getElementById('descripcion_editar').value = btn.dataset.descripcion || '';
      });
    });
  }

  if (button_eliminar.length > 0) {
    button_eliminar.forEach(btn => {
      btn.addEventListener('click', () => {
        eliminar.classList.add('activate');
        bg.classList.add('activate');
        const eliminarInput = document.getElementById('eliminar_id_input');
        eliminarInput.value = btn.value || '';
      });
    });
  }

  if (button_cancelar.length > 0) {
    Array.from(button_cancelar).forEach(btn => {
      btn.addEventListener('click', () => {
        agregar.classList.remove('activate');
        editar.classList.remove('activate');
        eliminar.classList.remove('activate');
        bg.classList.remove('activate');
      });
    });
  }

  if (bg) {
    bg.addEventListener('click', () => {
      agregar.classList.remove('activate');
      editar.classList.remove('activate');
      eliminar.classList.remove('activate');
      bg.classList.remove('activate');
    });
  }
});
