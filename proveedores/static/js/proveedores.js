document.addEventListener("DOMContentLoaded", function(){
    let background_formulario = document.getElementById("background_form")
    // Selecciona el formulario de agregar


    let agregar = document.getElementById("formulario_agregar")
    let button_agregar = document.getElementsByName("button_agregar")[0]

    let editar = document.getElementById("formulario_editar")
    let button_editar = document.querySelectorAll('.edit-btn')

    let eliminar = document.getElementById("formulario_eliminar")
    let button_eliminar = document.querySelectorAll('.delete-btn')

    let button_cancelar = document.getElementsByName("cancelar");

    // EVENTOS PARA LOS FORMULARIOS

    // Formulario Filtro
    let filtro = document.querySelector('.filtro')
    let contenedor_filtro = document.querySelector('.container-filtro')

    filtro.addEventListener('click', () => {
        if (contenedor_filtro.classList.contains('activate')) {
            contenedor_filtro.classList.remove('activate')
            background_formulario.classList.remove('activate')
        } else {
            contenedor_filtro.classList.add('activate')
            background_formulario.classList.add('activate')
        }
    })

    document.getElementById('buscador_proveedores').addEventListener('input', filtrarProveedores);
    document.getElementById('filtro_campos').addEventListener('change', filtrarProveedores);

    function filtrarProveedores() {
        let campo = document.getElementById('filtro_campos').value;
        let filtro = document.getElementById('buscador_proveedores').value.toLowerCase();
        let filas = document.querySelectorAll('.fila-proveedor');

        filas.forEach(function(fila) {
            if (!campo) {
                fila.style.display = '';
                return;
            }
            let celda = fila.querySelector('.' + campo);
            let texto = celda ? celda.textContent.toLowerCase() : '';
            if (texto.includes(filtro)) {
                fila.style.display = '';
            } else {
                fila.style.display = 'none';
            }
        });
    }

    // Formulario agregar
    background_formulario.addEventListener('click', () => {
        if (agregar.classList.contains('activate')) {
            agregar.classList.remove('activate')
            background_formulario.classList.remove('activate')
        }if (editar.classList.contains('activate')) {
            editar.classList.remove('activate')
            background_formulario.classList.remove('activate')
        }if (eliminar.classList.contains('activate')) {
            eliminar.classList.remove('activate')
            background_formulario.classList.remove('activate')
        }if (contenedor_filtro.classList.contains('activate')) {
            contenedor_filtro.classList.remove('activate')
            background_formulario.classList.remove('activate')
        }
    })
    button_agregar.addEventListener('click', () => {
        agregar.classList.add('activate')
        background_formulario.classList.add('activate')
        console.log(button_agregar.value)
    })

    // Llenar los inputs del formulario de editar
    button_editar.forEach(function(btn) {
        btn.addEventListener('click', () => {
            editar.classList.add('activate')
            background_formulario.classList.add('activate')

            let informacion = { ...btn.dataset }
            Object.entries(informacion).forEach(([key, value]) => {
                if (key === 'id') {
                    document.getElementById('proveedor_id_editar').value = informacion.id // Asigna el id al campo ocultonecesario
                }else{
                    let input = document.querySelector(`#formulario_editar input[name="${key}"]`).value = value
                }
            })
        });
    });

    button_eliminar.forEach(function(btn) {
        btn.addEventListener('click', () => {
            eliminar.classList.add('activate')
            background_formulario.classList.add('activate')
            document.getElementById('proveedor_id_eliminar').value = btn.value;
        });
    });

    button_cancelar.forEach(function(btn) {
        btn.addEventListener('click', () => {
            cancelarFormulario()
        });
    });

    function cancelarFormulario() {
        agregar.classList.remove('activate')
        editar.classList.remove('activate')
        eliminar.classList.remove('activate')
        filtro.classList.remove('activate')
        background_formulario.classList.remove('activate')
    }

    setTimeout(function() {
        var alertas = document.getElementById('alertas');
        if (alertas) {
            alertas.style.display = 'none'
        }
    }, 3000)

    // Fin de los eventos para los formularios
})