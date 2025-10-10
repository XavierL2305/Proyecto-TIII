let carrito = []; // <-- array para los productos
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

        let producto = carrito.find(p => p.id === id);
        if (producto) {
            producto.cantidad += 1;
        } else {
            carrito.push({id, nombre, precio, cantidad: 1});
        }
        actualizarCarrito();
    });
})

function actualizarCarrito() {
    let tbody = document.getElementById('tbody_carrito');
    let total = 0;
    tbody.innerHTML = '';

    if(carrito.length === 1) {
        modal_carrito.classList.add("active");
        background.classList.add("active");
    }

    if (carrito.length === 0) {
        tbody.innerHTML = '<span class="sin_productos">No tienes productos por comprar</span>';
        
    } else {
        carrito.forEach(function(producto) {
            let subtotal = producto.precio * producto.cantidad;
            total += subtotal;
            tbody.innerHTML += `
                <tr class="fila_carrito">
                    <td>${producto.nombre}</td>
                    <td>${producto.cantidad}</td>
                    <td>${producto.precio.toFixed(2)}$</td>
                    <td>${subtotal.toFixed(2)}$</td>
                    <td class="acciones_carrito">
                        <button class="btn-quitar" data-id="${producto.id}"><img src="/static/img/home/minus.png" width="30px" height="30px"></button>
                        <button class="btn-agregar" data-id="${producto.id}"><img src="/static/img/home/plus.png" width="30px" height="30px"></button>
                    </td>
                </tr>
            `;
        });
    }
    document.getElementById('total_carrito').textContent = 'Total: ' + total.toFixed(2) + '$';
    document.getElementById('contador_carrito').textContent = carrito.reduce((acc, p) => acc + p.cantidad, 0);
}

function quitarProducto(id) {
    let producto = carrito.find(p => p.id === id);
    if (producto) {
        producto.cantidad -= 1;
        if (producto.cantidad <= 0) {
            carrito = carrito.filter(p => p.id !== id);
        }
        actualizarCarrito();
    }
}

function agregarProducto(id) {
    let producto = carrito.find(p => p.id === id);
    if (producto) {
        producto.cantidad += 1;
        actualizarCarrito();
    }
}

function limpiarCarrito() {
    carrito = [];
    actualizarCarrito();
}