let carrito = []; // <-- array para los productos

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
    imagen_carrito.addEventListener("click", function() {
        modal_carrito.classList.toggle("active");
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
})
function agregarProductos() {
    document.querySelectorAll('.btn-agregar-carrito').forEach(function(boton) {
        boton.addEventListener('click', function() {
            let id = this.getAttribute('data-id');
            let nombre = this.getAttribute('data-nombre');
            let precio = parseFloat(this.getAttribute('data-precio'));

            // Busca si el producto ya está en el carrito
            let producto = carrito.find(p => p.id === id);
            if (producto) {
                producto.cantidad += 1;
            } else {
                carrito.push({id, nombre, precio, cantidad: 1});
            }
            actualizarCarrito();
        });
    });
}

function actualizarCarrito() {
    let tbody = document.getElementById('tbody_carrito');
    let total = 0;
    tbody.innerHTML = '';
    if (carrito.length === 0) {
        tbody.innerHTML = '<span class="sin_productos">No tienes productos por comprar</span>';
    } else {
        carrito.forEach(function(producto) {
            let subtotal = producto.precio * producto.cantidad;
            total += subtotal;
            tbody.innerHTML += `
                <div class="fila_carrito">
                    <span>${producto.nombre}</span>
                    <span>${producto.cantidad}</span>
                    <span>${producto.precio.toFixed(2)}$</span>
                    <span>${subtotal.toFixed(2)}$</span>
                    <div class="acciones_carrito">
                        <button class="btn-quitar" data-id="${producto.id}"><img src="/static/img/home/minus.png" width="30px" height="30px"></button>
                        <button class="btn-agregar" data-id="${producto.id}"><img src="/static/img/home/plus.png" width="30px" height="30px"></button>
                    </div>
                </div>
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