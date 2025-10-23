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

    // Search toggle and AJAX
    const busqueda = document.querySelector('.busqueda');
    if (busqueda) {
        const img = busqueda.querySelector('img');
        const input = busqueda.querySelector('input[name="producto"]');

        // Helper to render search results into the .cards container
        function renderSearchResults(results) {
            const cardsContainer = document.querySelector('.cards');
            if (!cardsContainer) return;
            // Clear existing cards
            cardsContainer.innerHTML = '';
            if (!results || results.length === 0) {
                cardsContainer.innerHTML = '<p style="padding:24px">No se encontraron productos.</p>';
                return;
            }
            // Render products
            results.forEach(p => {
                const card = document.createElement('div');
                card.className = 'card';
                card.id = `producto-${p.id}`;
                card.innerHTML = `
                            <div class="imagen-card imagen">
                                <img src="${p.imagen || '/static/img/home/no-image.svg'}" alt="${p.nombre}">
                            </div>
                            <div class="contenido">
                                <h2 class="nombre">${p.nombre}</h2>
                                <p class="descripcion">${p.descripcion}</p>
                                <p class="precio">Precio: $${p.precio}</p>
                                <p class="cantidad">Cantidad: ${p.cantidad}</p>
                                <button class="btn-agregar-carrito" data-id="${p.id}" data-nombre="${p.nombre}" data-precio="${p.precio}">
                                    <div class="acciones"><span>Agregar al carrito</span><img src="/static/img/home/compraCarrito.png" width="30" height="30"></div>
                                </button>
                            </div>
                        `;
                cardsContainer.appendChild(card);
            });
        }

        img.addEventListener('click', function(e){
            e.preventDefault();
            busqueda.classList.toggle('expanded');
            if (busqueda.classList.contains('expanded')) input.focus();
        });

        busqueda.addEventListener('submit', function(ev){
            ev.preventDefault();
            const q = input.value.trim();
            if (!q) return;
            // Perform AJAX search
            fetch(`/search-products/?q=${encodeURIComponent(q)}`)
                .then(r => r.json())
                .then(json => {
                    if (!json.ok) return;
                    const results = json.results || [];
                    renderSearchResults(results);
                }).catch(err => {
                    console.error('Search fetch error', err);
                });
        });

        // Delegación: manejar clicks sobre el dropdown de categorías que tengan data-cat-id
        document.addEventListener('click', function(e) {
            const catLink = e.target.closest('.dropdown-content a[data-cat-id]');
            if (!catLink) return;
            e.preventDefault();
            const catId = catLink.getAttribute('data-cat-id');
            if (typeof catId === 'undefined' || catId === null) return;
            // Fetch products by category (server-side category param takes priority)
            fetch(`/search-products/?category=${encodeURIComponent(catId)}`)
                .then(r => r.json())
                .then(json => {
                    if (!json.ok) return;
                    const results = json.results || [];
                    renderSearchResults(results);
                }).catch(err => {
                    console.error('Category search fetch error', err);
                });
        });
    }


    if (modal_carrito && modal_carrito.parentNode !== document.body) {
        document.body.appendChild(modal_carrito);
        // Asegurar un z-index alto desde JS como respaldo
        modal_carrito.style.zIndex = '4';
    }

    // Preparar referencias dentro del modal
    const contenidoCarrito = document.getElementById('contenido_carrito');
    // Reusar el nodo #sin_productos si ya existe en la plantilla, sino crearlo
    let emptyNode = document.getElementById('sin_productos');
    if (!emptyNode) {
        emptyNode = document.createElement('div');
        emptyNode.id = 'sin_productos';
        emptyNode.className = 'sin_productos';
        emptyNode.style.display = 'none';
        emptyNode.innerHTML = `
            <img src="/static/img/carritoBlanco.png" alt="">
            <span>Tu carro está vacío</span>
        `;
        const scrollCarrito = contenidoCarrito ? contenidoCarrito.querySelector('.scroll_carrito') : null;
        if (contenidoCarrito) {
            if (scrollCarrito) contenidoCarrito.insertBefore(emptyNode, scrollCarrito);
            else contenidoCarrito.appendChild(emptyNode);
        } else {
            // fallback: append to modal_carrito
            if (modal_carrito) modal_carrito.appendChild(emptyNode);
        }
    }

    // Helper: mostrar/ocultar secciones según contador
    function updateEmptyState() {
        const productosContainer = contenidoCarrito ? contenidoCarrito.querySelector('.productos_carrito') : null;
        const productRows = productosContainer ? productosContainer.querySelectorAll('.producto') : [];
        const productCount = productRows.length;
        const scroll = contenidoCarrito ? contenidoCarrito.querySelector('.scroll_carrito') : null;
        const info = contenidoCarrito ? contenidoCarrito.querySelector('.info_carrito') : null;
        const acciones = contenidoCarrito ? contenidoCarrito.querySelector('.acciones_carrito') : null;
        const allEmptyNodes = contenidoCarrito ? contenidoCarrito.querySelectorAll('.sin_productos') : document.querySelectorAll('.sin_productos');
        console.debug('updateEmptyState -> productCount:', productCount, 'productosContainer?', !!productosContainer, 'emptyNodes?', allEmptyNodes.length);

        if (productCount === 0) {
            if (scroll) scroll.style.display = 'none';
            if (info) info.style.display = 'none';
            if (acciones) acciones.style.display = 'none';
            if (allEmptyNodes && allEmptyNodes.length) {
                allEmptyNodes.forEach(node => {
                    node.style.display = 'flex';
                    node.style.flexDirection = 'column';
                    node.style.alignItems = 'center';
                    node.style.justifyContent = 'center';
                });
            }
            // actualizar totales a 0
            if (totalAmountEl) totalAmountEl.textContent = 'Total: $0';
            if (totalElementosEl) totalElementosEl.textContent = 'Elemento: 0';
            // actualizar contador visual si existe
            const contador = document.getElementById('contador_carrito');
            if (contador) contador.textContent = '0';
        } else {
            if (scroll) scroll.style.display = '';
            if (info) info.style.display = '';
            if (acciones) acciones.style.display = '';
            if (allEmptyNodes && allEmptyNodes.length) {
                allEmptyNodes.forEach(node => node.style.display = 'none');
            }
            // sync contador visual
            const contador = document.getElementById('contador_carrito');
            if (contador) contador.textContent = String(productCount);
        }
    }

    // Ejecutar al inicio para sincronizar estado
    updateEmptyState();

    // Helper: actualizar la sección info_carrito (total y cantidad) usando el total del servidor
    function updateInfoCarrito(total) {
        // asegurar el nodo info_carrito
        let infoCarritoEl = contenidoCarrito ? contenidoCarrito.querySelector('.info_carrito') : document.querySelector('.info_carrito');
        const productRows = contenidoCarrito ? (contenidoCarrito.querySelectorAll('.productos_carrito .producto')) : document.querySelectorAll('.productos_carrito .producto');
        const count = (productRows && productRows.length) ? productRows.length : 0;

        if (!infoCarritoEl && contenidoCarrito) {
            infoCarritoEl = document.createElement('div');
            infoCarritoEl.className = 'info_carrito';
            contenidoCarrito.appendChild(infoCarritoEl);
        }

        if (infoCarritoEl) {
            const totalNode = infoCarritoEl.querySelector('#total_amount') || document.getElementById('total_amount');
            const elementosNode = infoCarritoEl.querySelector('#total_elementos') || document.getElementById('total_elementos');
            if (totalNode) totalNode.textContent = 'Total: $' + (total || '0');
            if (elementosNode) elementosNode.textContent = (count === 1 ? 'Producto: ' : 'Productos: ') + count;
        }

        // también sincronizar el contador en el header
        const contador = document.getElementById('contador_carrito');
        if (contador) contador.textContent = String(count);
    }

    // mostrar y cerrar el carrito de compras
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
    // Cuando se presione el background hace que se cierre el carrito
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
                console.debug('add-to-cart success, server data:', data);

                // Ocultar todos los mensajes de "sin_productos" tanto en el modal como globalmente
                const allEmptyNow = document.querySelectorAll('.sin_productos');
                if (allEmptyNow && allEmptyNow.length) {
                    allEmptyNow.forEach(n => n.style.display = 'none');
                }

                // Añadir/asegurar contenedores
                let productosContainer = contenidoCarrito ? contenidoCarrito.querySelector('.productos_carrito') : document.querySelector('.productos_carrito');
                if (!productosContainer) {
                    const scrollDiv = document.createElement('div');
                    scrollDiv.className = 'scroll_carrito';

                    const productosDiv = document.createElement('div');
                    productosDiv.className = 'productos_carrito';
                    productosDiv.innerHTML = '<h2>Tu orden</h2>';

                    scrollDiv.appendChild(productosDiv);
                    if (contenidoCarrito) {
                        const infoCarritoExisting = contenidoCarrito.querySelector('.info_carrito');
                        if (infoCarritoExisting) contenidoCarrito.insertBefore(scrollDiv, infoCarritoExisting);
                        else contenidoCarrito.appendChild(scrollDiv);
                    } else if (modal_carrito) {
                        modal_carrito.appendChild(scrollDiv);
                    }

                    productosContainer = document.querySelector('.productos_carrito');
                }

                // Crear fila y anexarla
                if (productosContainer) {
                    const fila = document.createElement('div');
                    fila.className = 'producto';
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

                    // Asegurar y actualizar info_carrito (total y cantidad) ANTES de insertar acciones_carrito
                    let infoCarritoEl = contenidoCarrito ? contenidoCarrito.querySelector('.info_carrito') : document.querySelector('.info_carrito');
                    const newCountPreview = (function(){
                        const contador = document.getElementById('contador_carrito');
                        let c = 1;
                        if (contador) {
                            let current = parseInt(contador.textContent) || 0;
                            c = current + 1;
                        }
                        return c;
                    })();
                    if (!infoCarritoEl && contenidoCarrito) {
                        infoCarritoEl = document.createElement('div');
                        infoCarritoEl.className = 'info_carrito';
                        infoCarritoEl.innerHTML = `<span id="total_amount">Total: $${data.total || '0'}</span><span id="total_elementos">Productos: ${newCountPreview}</span>`;
                        const scroll = contenidoCarrito.querySelector('.scroll_carrito');
                        if (scroll) scroll.appendChild(infoCarritoEl);
                        else contenidoCarrito.appendChild(infoCarritoEl);
                    } else if (infoCarritoEl) {
                        const totalAmountNode = infoCarritoEl.querySelector('#total_amount') || document.getElementById('total_amount');
                        const totalElementosNode = infoCarritoEl.querySelector('#total_elementos') || document.getElementById('total_elementos');
                        if (totalAmountNode) totalAmountNode.textContent = 'Total: $' + (data.total || '0');
                        if (totalElementosNode) totalElementosNode.textContent = (newCountPreview === 1 ? 'Producto: ' : 'Productos: ') + newCountPreview;
                    }

                    // Asegurar que exista acciones_carrito (contenedor del formulario) incluso si productosContainer ya existía
                    const accionesExistingNow = contenidoCarrito ? contenidoCarrito.querySelector('.acciones_carrito') : document.querySelector('.acciones_carrito');
                    if (!accionesExistingNow && contenidoCarrito) {
                        const accionesDivNow = document.createElement('div');
                        accionesDivNow.className = 'acciones_carrito';
                        const csrfTokenNow = getCookie('csrftoken') || '';
                        accionesDivNow.innerHTML = `
                            <h2>Detalles de la Orden</h2>
                            <form enctype="multipart/form-data" method="post" action="/comprar-carrito/">
                                <input type="hidden" name="csrfmiddlewaretoken" value="${csrfTokenNow}">
                                <div class="detalles_orden">
                                    <div class="quien">
                                        <h3>Para quien es el pedido</h3>
                                        <div class="nombre">
                                            <input name="quien" id="quien" type="text" placeholder=" " required>
                                            <label for="quien">Nombre</label>
                                        </div>
                                    </div>
                                    <div class="tipo_entrega">
                                        <h3>Tipo de entrega</h3>
                                        <div class="input_label">
                                            <input id="input_delivery" name="tipo_entrega" type="radio" value="delivery" required>
                                            <label for="input_delivery">Delivery</label>
                                        </div>
                                        <div class="input_label">
                                            <input id="input_agencia" name="tipo_entrega" type="radio" value="agencia" required>
                                            <label for="input_agencia">Envío por agencia</label>
                                        </div>
                                    </div>
                                    <div class="metodo_pago">
                                        <h3>Método de pago</h3>
                                        <div class="input_label">
                                            <input id="metodo_efectivo" name="metodo_pago" type="radio" value="efectivo" required>
                                            <label for="metodo_efectivo">Efectivo</label>
                                        </div>
                                        <div class="input_label">
                                            <input id="metodo_zelle" name="metodo_pago" type="radio" value="zelle" required>
                                            <label for="metodo_zelle">Zelle</label>
                                        </div>
                                        <div class="input_label">
                                            <input id="metodo_binance" name="metodo_pago" type="radio" value="binance" required>
                                            <label for="metodo_binance">Binance</label>
                                        </div>
                                        <div class="input_label">
                                            <input id="metodo_transferencia" name="metodo_pago" type="radio" value="transferencia" required>
                                            <label for="metodo_transferencia">Transferencia bancaria</label>
                                        </div>
                                    </div>
                                    <div class="total_elementos"></div>
                                    <div class="comprar">
                                        <button type="reset" class="">Limpiar</button>
                                        <button type="submit" class="">Comprar</button>
                                    </div>
                                </div>
                            </form>
                        `;
                        // Insertar acciones_carrito preferentemente dentro de .scroll_carrito (para que quede visible dentro del área desplazable)
                        const scrollNow = contenidoCarrito.querySelector('.scroll_carrito');
                        if (scrollNow) {
                            const afterNodeNow = scrollNow.querySelector('.info_carrito');
                            if (afterNodeNow) scrollNow.insertBefore(accionesDivNow, afterNodeNow.nextSibling);
                            else scrollNow.appendChild(accionesDivNow);
                        } else {
                            // fallback: insertar en contenidoCarrito
                            const afterNodeNow = contenidoCarrito.querySelector('.info_carrito');
                            if (afterNodeNow) contenidoCarrito.insertBefore(accionesDivNow, afterNodeNow.nextSibling);
                            else contenidoCarrito.appendChild(accionesDivNow);
                        }
                        console.debug('acciones_carrito creado dinámicamente (post append)');
                    }
                }

                // Actualizar contador visual
                const contador = document.getElementById('contador_carrito');
                let newCount = 1;
                if (contador) {
                    let current = parseInt(contador.textContent) || 0;
                    newCount = current + 1;
                    contador.textContent = newCount;
                } else {
                    const header = document.querySelector('.carrito-compras');
                    if (header) {
                        const span = document.createElement('span');
                        span.id = 'contador_carrito';
                        span.className = 'contador-carrito';
                        span.textContent = String(newCount);
                        header.appendChild(span);
                    }
                }                

                // Intento de ocultar cualquier nodo .sin_productos que pudiera quedar (doble verificación)
                const allEmptyCheck = contenidoCarrito ? contenidoCarrito.querySelectorAll('.sin_productos') : document.querySelectorAll('.sin_productos');
                if (allEmptyCheck && allEmptyCheck.length) allEmptyCheck.forEach(n => n.style.display = 'none');

                // Revisar estado vacío/ocupado
                updateEmptyState();

                // Actualizar info_carrito con total que devuelve el servidor
                if (typeof data.total !== 'undefined') updateInfoCarrito(data.total);

                showToast('Producto agregado al carrito');
            } else {
                // Manejar producto sin existencias o falta de stock suficiente
                if (data.error === 'out_of_stock' || data.message === 'Producto sin existencias') {
                    showToast('Producto sin existencias');
                } else if (data.error === 'insufficient_stock') {
                    const avail = data.available !== undefined ? data.available : '0';
                    showToast('No hay suficiente stock. Disponibles: ' + avail);
                } else if (data.error === 'exists' || data.message === 'Producto ya en el carrito') {
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
                console.log('Removing product row from DOM:', fila);
                if (fila) fila.remove();
                console.log(fila);

                // Actualizar contador
                const contador = document.getElementById('contador_carrito');
                if (contador) {
                    let current = parseInt(contador.textContent) || 0;
                    contador.textContent = Math.max(0, current - 1);
                }

                // Actualizar info_carrito (total y cantidad) usando total del servidor
                if (typeof data.total !== 'undefined') updateInfoCarrito(data.total);

                // Revisar si el carrito quedó vacío
                updateEmptyState();

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

                    // Actualizar info_carrito (total y cantidad)
                    if (typeof data.total !== 'undefined') updateInfoCarrito(data.total);

                    // Revisar si el carrito quedó vacío
                    updateEmptyState();

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


                    // Actualizar info_carrito (total y cantidad) usando el total retornado por el servidor
                    if (typeof data.total !== 'undefined') updateInfoCarrito(data.total);

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

