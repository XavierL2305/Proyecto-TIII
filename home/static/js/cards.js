let carrito = []; // <-- array para los productos

// Helper para leer cookie CSRF
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
let background = document.getElementById("background_main");
let modal_carrito = document.querySelector(".modal-carrito");

document.addEventListener("DOMContentLoaded", function(){
    // Modal de las cards para ver detalles
    let card_modal = document.querySelector(".card-modal");
    let cards = document.getElementsByClassName("card");
    let background = document.getElementById("background_main");
    
    Array.from(cards).forEach(function(card) {
        let imagen = card.querySelector(".imagen-card");
        imagen.addEventListener("click", function() {
            // let id_producto = this.id.split("-")[1];
            card_modal.innerHTML = card.innerHTML;
            background.classList.add("active");
            card_modal.classList.add("active");
        });
        background.addEventListener("click", function() {
            let activeCard = document.querySelector(".card-modal.active");
            if (activeCard) {
                activeCard.classList.remove("active");
            }
            background.classList.remove("active");
        });
    });

    let imagen_carrito = document.getElementById("imagen-carrito");
    let modal_carrito = document.querySelector(".modal-carrito");


    if (modal_carrito && modal_carrito.parentNode !== document.body) {
        document.body.appendChild(modal_carrito);
        // Asegurar un z-index alto desde JS como respaldo
        modal_carrito.style.zIndex = '4';
    }

    imagen_carrito.addEventListener("click", function() {
        if(modal_carrito.classList.contains("active") && background.classList.contains("active")){
            modal_carrito.classList.remove("active");
            background.classList.remove("active");
        }else if(!modal_carrito.classList.contains("active") && !background.classList.contains("active")){
            modal_carrito.classList.add("active");
            background.classList.add("active");
        }
    });

    background.addEventListener("click", function() {
        if(modal_carrito.classList.contains("active")){
            modal_carrito.classList.remove("active");
        }
    });
    document.getElementById('tbody_carrito').addEventListener('click', function(e) {
        if (e.target.closest('.btn-quitar')) {
            let id = e.target.closest('.btn-quitar').dataset.id;
            quitarProducto(id);
        }
        if (e.target.closest('.btn-agregar')) {
            let id = e.target.closest('.btn-agregar').dataset.id;
            agregarProducto(id);
        }
    });
    // Usamos delegación de eventos para capturar clicks en botones
    // "Agregar al carrito", esto funciona también para botones que se
    // insertan dinámicamente dentro del modal de la card.
    document.addEventListener('click', function(e) {
        let btn = e.target.closest('.btn-agregar-carrito');
        if (!btn) return;
        // Si se hace click en un botón de agregar al carrito (ya sea en la card
        // principal o en el modal insertado), procesamos la adición.
        let id = (btn.getAttribute('data-id') || btn.dataset.id || '').toString().trim();
        let nombre = (btn.getAttribute('data-nombre') || btn.dataset.nombre || '').toString().trim();
        let precio = parseFloat(btn.getAttribute('data-precio') || btn.dataset.precio) || 0;
        // console.log('[carrito] click add:', {id, nombre, precio});

        // Enviar al servidor para persistir en el carrito del usuario si está autenticado
        fetch('add-to-cart/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: `product_id=${encodeURIComponent(id)}&cantidad=1`
        }).then(r => r.json()).then(data => {
            if (data.ok) {
                // Actualizar carrito localmente según la respuesta
                let productoLocal = carrito.find(p => p.id === id);
                if (productoLocal) {
                    productoLocal.cantidad = data.cantidad;
                } else {
                    carrito.push({id, nombre, precio, cantidad: data.cantidad});
                }
                actualizarCarrito();
            } else {
                console.error('Error al agregar al carrito', data);
            }
        }).catch(err => console.error('Fetch error', err));
    });
})
