document.addEventListener("DOMContentLoaded", function(){
    let backgraund_formulario = document.getElementById("backgraund_form")
    // Selecciona el formulario de agregar


    let agregar = document.getElementById("formulario_agregar")
    let button_agregar = document.getElementsByName("button_agregar")[0]

    let editar = document.getElementById("formulario_editar")
    let button_editar = document.querySelectorAll('.edit-btn')

    let eliminar = document.getElementById("formulario_eliminar")
    let button_eliminar = document.querySelectorAll('.delete-btn')

    let button_cancelar_1 = document.getElementsByName("cancelar")[0];
    let button_cancelar_2 = document.getElementsByName("cancelar")[1];
    let button_cancelar_3 = document.getElementsByName("cancelar")[2];

    // EVENTOS PARA LOS FORMULARIOS
    // Formulario agregar
    backgraund_formulario.addEventListener('click', () => {
        if (agregar.classList.contains('activate')) {
            agregar.classList.remove('activate')
            backgraund_formulario.classList.remove('activate')
        }if (editar.classList.contains('activate')) {
            editar.classList.remove('activate')
            backgraund_formulario.classList.remove('activate')
        }if (eliminar.classList.contains('activate')) {
            eliminar.classList.remove('activate')
            backgraund_formulario.classList.remove('activate')
        }
    })
    button_agregar.addEventListener('click', () => {
        agregar.classList.add('activate')
        backgraund_formulario.classList.add('activate')
        console.log(button_agregar.value)
    })

    button_editar.forEach(function(btn) {
        btn.addEventListener('click', () => {
            editar.classList.add('activate')
            backgraund_formulario.classList.add('activate')

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
            backgraund_formulario.classList.add('activate')
            // Puedes capturar el id así:
            console.log('Eliminar proveedor:', btn.value)
        });
    });

    button_cancelar_1.addEventListener('click', () => {
        cancelarFormulario()
    })
    button_cancelar_2.addEventListener('click', () => {
        cancelarFormulario()
    })
    button_cancelar_3.addEventListener('click', () => {
        cancelarFormulario()
    })

    function cancelarFormulario() {
        agregar.classList.remove('activate')
        editar.classList.remove('activate')
        eliminar.classList.remove('activate')
        backgraund_formulario.classList.remove('activate')
    }

    setTimeout(function() {
        var alertas = document.getElementById('alertas');
        if (alertas) {
            alertas.style.display = 'none'
        }
    }, 3000)

    // Fin de los eventos para los formularios
})