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

// Small toast notification helper
function showToast(message, timeout = 2500) {
    let toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.right = '20px';
    toast.style.bottom = '20px';
    toast.style.background = 'rgba(0,0,0,0.8)';
    toast.style.color = '#fff';
    toast.style.padding = '10px 14px';
    toast.style.borderRadius = '6px';
    toast.style.zIndex = '9999999';
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.transition = 'opacity 0.3s';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, timeout);
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

    document.getElementById("cerrar_carrito").addEventListener("click", function() {
        if(modal_carrito.classList.contains("active")){
            modal_carrito.classList.remove("active");
            background.classList.remove("active");
        }
    });
    background.addEventListener("click", function() {
        if(modal_carrito.classList.contains("active")){
            modal_carrito.classList.remove("active");
        }
    });

    // Delegación: manejar clicks en botones "Agregar al carrito"
    document.addEventListener('click', function(e) {
        let btn = e.target.closest('.btn-agregar-carrito');
        if (!btn) return;

        // Leer datos del botón
        let id = (btn.getAttribute('data-id') || btn.dataset.id || '').toString().trim();
        let nombre = (btn.getAttribute('data-nombre') || btn.dataset.nombre || '').toString().trim();
        let precio = parseFloat(btn.getAttribute('data-precio') || btn.dataset.precio) || 0;

        // Enviar al servidor para persistir en el carrito del usuario
        fetch('/add-to-cart/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: `product_id=${encodeURIComponent(id)}&cantidad=1`
        }).then(r => r.json()).then(data => {
            if (data.ok) {
                // Añadir el producto al DOM del modal carrito
                const productosContainer = document.querySelector('.productos_carrito');
                if (productosContainer) {
                    // crear fila simple para mostrar el producto
                    const fila = document.createElement('div');
                    fila.className = 'fila_carrito_item';
                    fila.setAttribute('data-id', data.producto.id);
                    fila.innerHTML = `
                        <div class="fila_nombre">${data.producto.nombre}</div>
                        <div class="fila_cantidad">${data.cantidad}</div>
                        <div class="fila_precio">${data.producto.precio}$</div>
                    `;
                    productosContainer.appendChild(fila);
                }

                // Actualizar contador visual
                const contador = document.getElementById('contador_carrito');
                if (contador) {
                    // incrementar contador en 1 (solo añadimos un producto nuevo)
                    let current = parseInt(contador.textContent) || 0;
                    contador.textContent = current + 1;
                }

                showToast('Producto agregado al carrito');
            } else {
                if (data.error === 'exists' || data.message === 'Producto ya en el carrito') {
                    showToast('El producto ya está en el carrito');
                } else {
                    console.error('Error al agregar al carrito', data);
                    showToast('Error al agregar al carrito');
                }
            }
        }).catch(err => {
            console.error('Fetch error', err);
            showToast('Error de red al agregar al carrito');
        });
    });

})
