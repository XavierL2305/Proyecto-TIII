let carrito = []; // <-- array para los productos
const totalAmountEl = document.getElementById('total_amount');
const totalElementosEl = document.getElementById('total_elementos');

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
    toast.style.zIndex = '5';
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
        // console.log('Clicked add to cart button:', btn);
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
                    fila.className = 'producto';
                    // Guardar el id del detalle (PK de DetallesCarrito) para futuras acciones
                    fila.setAttribute('data-detalle-id', data.detalle_id);
                    fila.innerHTML = `
                        <div class="descripcion_producto">
                            <img src="${data.producto.imagen || '/static/img/home/no-image.svg'}" alt="Imagen del producto" width="50" height="50">
                            <div class="info_producto">
                                <span class="nombre_producto">${data.producto.nombre}</span>
                                <span class="cantidad_producto">1 elemento</span>
                                <span class="precio_producto">${data.producto.precio}$</span>
                            </div>
                        </div>
                        <div class="acciones_producto_carrito">
                            <button class="btn-disminuir" data-id="${data.detalle_id}"><img src="/static/img/home/minus.svg" alt="diminuir"></button>
                            <button class="btn-aumentar" data-id="${data.detalle_id}"><img src="/static/img/home/plus.svg" alt="aumentar"></button>
                            <button class="btn-eliminar" data-id="${data.detalle_id}"><img src="/static/img/home/trash.svg" alt="eliminar"></button>
                        </div>
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

                // Actualizar total mostrado en el modal (si existe)
                if (totalAmountEl && typeof data.total !== 'undefined') {
                    totalAmountEl.textContent = 'Total: $' + data.total;
                }
                if (totalElementosEl) {
                    // Sin valor exacto desde el servidor, usamos el contador visual como fuente de la verdad
                    const cnt = document.getElementById('contador_carrito');
                    totalElementosEl.textContent = 'Elemento: ' + (cnt ? cnt.textContent : (parseInt(data.cantidad) || 1));
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

    // Delegación: manejar clicks en botones "Eliminar" dentro del modal carrito
    document.addEventListener('click', function(e) {
        let btnDel = e.target.closest('.btn-eliminar');
        // Debug: mostrar el elemento objetivo y el botón resuelto
        // console.log('click target:', e.target);
        // console.log('Clicked trash to cart button (resolved):', btnDel);
        if (!btnDel) return;

        const detalleId = btnDel.dataset.id;
        if (!detalleId) return;

    fetch('/remove-from-cart/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: `detalle_id=${encodeURIComponent(detalleId)}`
        }).then(r => r.json()).then(data => {
            if (data.ok) {
                // Eliminar la fila del DOM
                const fila = btnDel.closest('.producto');
                if (fila) fila.remove();

                // Actualizar contador
                const contador = document.getElementById('contador_carrito');
                if (contador) {
                    let current = parseInt(contador.textContent) || 0;
                    contador.textContent = Math.max(0, current - 1);
                }

                    // Actualizar total mostrado en el modal
                    if (totalAmountEl && typeof data.total !== 'undefined') {
                        totalAmountEl.textContent = 'Total: $' + data.total;
                    }
                    if (totalElementosEl) {
                        const cnt = document.getElementById('contador_carrito');
                        totalElementosEl.textContent = 'Elemento: ' + (cnt ? cnt.textContent : '0');
                    }

                showToast('Producto eliminado del carrito');
            } else {
                console.error('Error al eliminar detalle', data);
                showToast('No se pudo eliminar el producto');
            }
        }).catch(err => {
            console.error('Fetch error', err);
            showToast('Error de red al eliminar');
        });
    });

    // Delegación: manejar clicks en botones "Aumentar" y "Disminuir" dentro del modal carrito
    document.addEventListener('click', function(e) {
        let btnInc = e.target.closest('.btn-aumentar');
        let btnDec = e.target.closest('.btn-disminuir');
        if (!btnInc && !btnDec) return;

        const btn = btnInc || btnDec;
        const action = btnInc ? 'increment' : 'decrement';
        const detalleId = btn.dataset.id;
        if (!detalleId) return;

        fetch('/update-cart-item/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: `detalle_id=${encodeURIComponent(detalleId)}&action=${action}`
        }).then(r => r.json()).then(data => {
            if (data.ok) {
                if (data.deleted) {
                    // fila eliminada por llegar a 0
                    const fila = btn.closest('.producto');
                    if (fila) fila.remove();

                    // Actualizar contador
                    const contador = document.getElementById('contador_carrito');
                    if (contador) {
                        let current = parseInt(contador.textContent) || 0;
                        contador.textContent = Math.max(0, current - 1);
                    }

                    // Actualizar total mostrado en el modal
                    if (totalAmountEl && typeof data.total !== 'undefined') {
                        totalAmountEl.textContent = 'Total: $' + data.total;
                    }
                    if (totalElementosEl) {
                        const cnt = document.getElementById('contador_carrito');
                        totalElementosEl.textContent = 'Elemento: ' + (cnt ? cnt.textContent : '0');
                    }

                    showToast('Producto eliminado del carrito');
                } else {
                    // Actualizar cantidad y subtotal en la fila
                    const fila = btn.closest('.producto');
                    if (fila) {
                        const cantidadSpan = fila.querySelector('.cantidad_producto');
                        if (cantidadSpan && typeof data.cantidad !== 'undefined') {
                            let qty = parseInt(data.cantidad) || 0;
                            cantidadSpan.textContent = qty + (qty === 1 ? ' elemento' : ' elementos');
                        }

                        const precioSpan = fila.querySelector('.precio_producto');
                        if (precioSpan && typeof data.subtotal !== 'undefined') {
                            // Mostrar subtotal si viene del servidor (formateado como string)
                            precioSpan.textContent = '$' + data.subtotal;
                        }
                    }


                    // Actualizar total mostrado en el modal usando el total retornado por el servidor
                    if (totalAmountEl && typeof data.total !== 'undefined') {
                        totalAmountEl.textContent = 'Total: $' + data.total;
                    }

                    showToast(action === 'increment' ? 'Cantidad aumentada' : 'Cantidad disminuida');
                }
            } else {
                console.error('Error al actualizar detalle', data);
                showToast('No se pudo actualizar la cantidad');
            }
        }).catch(err => {
            console.error('Fetch error', err);
            showToast('Error de red al actualizar');
        });
    });

})

