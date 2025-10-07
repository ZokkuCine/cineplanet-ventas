// =======================================================
// 1. VARIABLES GLOBALES Y CONTACTO
// =======================================================
let carrito = []; // El array donde guardaremos los productos seleccionados
const totalCarritoSpan = document.getElementById('total-carrito');
const listaCarritoUL = document.getElementById('lista-carrito');
const procederPagoBoton = document.getElementById('proceder-pago');
const metodosPagoContenedor = document.getElementById('metodos-pago-contenedor');

// Variables de Contacto
const infoContacto = {
    numeroTelefono: '+51977875869', 
    email: 'mundocine10.cp@gmail.com',
    whatsappMensaje: 'Hola, estoy interesado en comprar entradas y combos de Cineplanet. ¿Me puedes dar información?' 
};


// =======================================================
// 2. FUNCIÓN PARA CARGAR LA INFORMACIÓN DE CONTACTO
// =======================================================
function cargarContacto() {
    const whatsappLink = document.getElementById('whatsappLink');
    const whatsappText = document.getElementById('whatsappText');
    const waURL = `https://wa.me/${infoContacto.numeroTelefono.replace('+', '')}?text=${encodeURIComponent(infoContacto.whatsappMensaje)}`;
    whatsappLink.href = waURL;
    whatsappText.textContent = `${infoContacto.numeroTelefono} (Clic para Chatear)`;

    const phoneLink = document.getElementById('phoneLink');
    const phoneText = document.getElementById('phoneText');
    phoneLink.href = `tel:${infoContacto.numeroTelefono}`;
    phoneText.textContent = infoContacto.numeroTelefono;
    
    const emailLink = document.getElementById('emailLink');
    const emailText = document.getElementById('emailText');
    emailLink.href = `mailto:${infoContacto.email}`;
    emailText.textContent = infoContacto.email;
}


// =======================================================
// 3. INFORMACIÓN DE PRODUCTOS
// =======================================================
const productosCine = [
    { nombre: "Entrada 2D General", precio: "S/ 9.99", descripcion: "Válida de Lunes a Domingo.", imagenURL: "imagenes/entrada2d.jpg", categoria: "Entrada" },
    { nombre: "Entrada Prime", precio: "S/ 14.99", descripcion: "Butaca reclinable, sujeto a sala Prime.", imagenURL: "imagenes/entrada_prime.jpg", categoria: "Entrada" },
    { nombre: "Combo Black Gigante", precio: "S/ 29.99", descripcion: "Popcorn Gigante + 2 Gaseosas Grandes + Hot Dog o Nachos.", imagenURL: "imagenes/combo_gigante.jpg", destacado: true, categoria: "Combo" },
    { nombre: "Combo Black Gigante + 2 Entradas General", precio: "S/ 39.99", descripcion: "Popcorn Gigante + 2 Gaseosas Grandes + Hot Dog o Nachos + 2 Entradas General.", imagenURL: "imagenes/combo_2gigante.jpg", destacado: true, categoria: "Combo" },
    { nombre: "Combo Hot Dog", precio: "S/ 19.99", descripcion: "Hot Dog Grande + Gaseosa Mediana.", imagenURL: "imagenes/combo_hot.jpg", categoria: "Combo" }
];
const listaProductosUL = document.getElementById('lista-productos');

// NUEVA FUNCIÓN: Muestra los botones de filtro sobre la lista
function mostrarBotonesFiltro() {
    const contenedorFiltros = document.createElement('div');
    contenedorFiltros.className = 'filtro-botones';
    contenedorFiltros.innerHTML = `
        <button class="btn-filtro active" data-categoria="Todos">Todos</button>
        <button class="btn-filtro" data-categoria="Entrada">Entradas</button>
        <button class="btn-filtro" data-categoria="Combo">Combos</button>
    `;
    // Insertamos los botones antes de la lista de productos
    listaProductosUL.parentNode.insertBefore(contenedorFiltros, listaProductosUL);
}

// NUEVA FUNCIÓN: Filtra y vuelve a dibujar la lista
function filtrarPorCategoria(categoria) {
    let productosFiltrados;

    if (categoria === 'Todos') {
        productosFiltrados = productosCine;
    } else {
        // Filtra el array original según la categoría
        productosFiltrados = productosCine.filter(producto => producto.categoria === categoria);
    }

    mostrarProductos(productosFiltrados);
}
function mostrarProductos(productosAMostrar) {
    listaProductosUL.innerHTML = '';
    
    productosAMostrar.forEach(producto => {
        const li = document.createElement('li');
        
        if (producto.destacado) {
            li.classList.add('producto-destacado'); 
        }

        li.innerHTML = `
            <div class="producto-info">
                <h3>${producto.nombre} - <span>${producto.precio}</span></h3>
                <p>${producto.descripcion}</p>
                <button data-nombre="${producto.nombre}" class="btn-agregar">Añadir al Carrito</button> 
            </div>
            <img src="${producto.imagenURL}" alt="Imagen de ${producto.nombre}" class="producto-imagen">
        `;
        
        listaProductosUL.appendChild(li);
    });
}


// =======================================================
// 4. FUNCIÓN PARA FILTRAR (LÓGICA DE BÚSQUEDA)
// =======================================================
function filtrarProductos() {
    const textoBusqueda = document.getElementById('searchInput').value.toLowerCase().trim();
    const productosFiltrados = productosCine.filter(producto => {
        const contenidoProducto = (producto.nombre + " " + producto.descripcion).toLowerCase();
        return contenidoProducto.includes(textoBusqueda);
    });

    mostrarProductos(productosFiltrados);
    if (productosFiltrados.length === 0) {
        listaProductosUL.innerHTML = '<li style="border: none; background: none; color: #e50914;">No se encontraron productos que coincidan con la búsqueda.</li>';
    }
}


// =======================================================
// 5. LÓGICA DEL CARRITO (FUNCIONES AÑADIR Y ACTUALIZAR)
// =======================================================

function agregarAlCarrito(nombreProducto) {
    const productoBase = productosCine.find(p => p.nombre === nombreProducto);
    
    if (!productoBase) {
        console.error("Error: Producto no encontrado:", nombreProducto);
        return; 
    }

    const precioLimpio = productoBase.precio.replace('S/ ', '').replace(',', '.');
    const precioNumerico = parseFloat(precioLimpio);
    
    if (isNaN(precioNumerico)) {
        console.error("Error: El precio no es un número válido para:", nombreProducto);
        return; 
    }

    const itemExistente = carrito.find(item => item.nombre === nombreProducto);

    if (itemExistente) {
        itemExistente.cantidad++; 
    } else {
        carrito.push({
            nombre: productoBase.nombre,
            precio: precioNumerico,
            cantidad: 1
        });
    }

    actualizarCarritoVisual();
    guardarCarrito(); // <-- ¡NUEVO! Guardar después de añadir
}

// NUEVA FUNCIÓN: ELIMINA UN ÍTEM O REDUCE LA CANTIDAD
function eliminarDelCarrito(nombreProducto) {
    // 1. Busca el índice del producto en el array 'carrito'
    const index = carrito.findIndex(item => item.nombre === nombreProducto);

    if (index !== -1) {
        // Si el producto existe:
        const item = carrito[index];

        if (item.cantidad > 1) {
            // Si hay más de uno, solo reduce la cantidad
            item.cantidad--;
        } else {
            // Si solo queda uno, elimina el producto completamente del array
            carrito.splice(index, 1);
        }
    }

    // Vuelve a dibujar el carrito con los cambios
    actualizarCarritoVisual();
    guardarCarrito(); // <-- ¡NUEVO! Guardar después de eliminar
}

function actualizarCarritoVisual() {
    listaCarritoUL.innerHTML = '';
    let total = 0;
    
    if (carrito.length === 0) {
        listaCarritoUL.innerHTML = '<li class="carrito-vacio">El carrito está vacío.</li>';
        procederPagoBoton.disabled = true; 
        metodosPagoContenedor.classList.add('hidden'); 
    } else {
        // Itera sobre los ítems del carrito para mostrarlos
        carrito.forEach(item => {
            const subtotal = item.precio * item.cantidad;
            total += subtotal; // Suma al total
            
            const li = document.createElement('li');
            li.innerHTML = `
                ${item.nombre} x ${item.cantidad} 
                <span class="carrito-subtotal">S/ ${subtotal.toFixed(2)}</span>
                
                <button class="btn-eliminar" data-nombre="${item.nombre}">❌</button>
            `;
            listaCarritoUL.appendChild(li);
        });
        procederPagoBoton.disabled = false;
    }

    totalCarritoSpan.textContent = `S/ ${total.toFixed(2)}`;
}


// =======================================================
// 5B. LÓGICA DE LOCALSTORAGE (NUEVO)
// =======================================================

function guardarCarrito() {
    // Convierte el array 'carrito' a formato de texto JSON y lo guarda
    localStorage.setItem('carritoCineplanet', JSON.stringify(carrito));
}

function cargarCarrito() {
    // Obtiene el texto guardado del LocalStorage
    const carritoGuardado = localStorage.getItem('carritoCineplanet');
    
    // Si hay algo guardado, lo convierte de nuevo a un array de JavaScript y lo asigna
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }
    
    // Asegura que el carrito se muestre al cargar la página
    actualizarCarritoVisual();
}


// =======================================================
// 6. LÓGICA DE SELECCIÓN DE PAGO Y MENSAJERÍA
// =======================================================

// FUNCIÓN DE UTILIDAD: Genera el cuerpo del mensaje de pedido
function generarMensajePedido() {
    let mensaje = "¡Hola! Quisiera realizar el siguiente pedido de Cineplanet:\n\n";
    let total = 0;

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        mensaje += `* ${item.nombre} x ${item.cantidad} (S/ ${subtotal.toFixed(2)})\n`;
    });
    
    mensaje += `\n*TOTAL DEL PEDIDO:* S/ ${total.toFixed(2)}`;
    return mensaje;
}

// FUNCIÓN DE UTILIDAD: Genera el enlace final de WhatsApp
function generarEnlaceWhatsApp(mensaje) {
    const numero = infoContacto.numeroTelefono.replace('+', ''); 
    return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

// Lógica que ejecuta la acción de pago (simulada)
function manejarPago(metodo) {
    let mensajeBase = generarMensajePedido();
    let enlaceFinal = '';
    
    switch(metodo) {
        case 'whatsapp':
            mensajeBase += "\n\n— MÉTODO DE PAGO ELEGIDO: COORDINAR POR CHAT (YAPE/EFECTIVO/CONTRA-ENTREGA) —";
            enlaceFinal = generarEnlaceWhatsApp(mensajeBase);
            break;

        case 'yape_plin_qr':
            alert("✅ Redirigiendo a Pasarela de QR (Yape/Plin/Pago Efectivo). Por favor, haz clic en 'Aceptar' para continuar.");
            mensajeBase += "\n\n— MÉTODO DE PAGO ELEGIDO: QR/PAGO EFECTIVO (ESPERANDO LINK) —";
            enlaceFinal = generarEnlaceWhatsApp(mensajeBase);
            break;

        case 'tarjeta':
            alert("✅ Redirigiendo a Pasarela de Tarjeta. Por favor, haz clic en 'Aceptar' para completar la compra.");
            mensajeBase += "\n\n— MÉTODO DE PAGO ELEGIDO: TARJETA DE CRÉDITO/DÉBITO —";
            enlaceFinal = generarEnlaceWhatsApp(mensajeBase);
            break;
    }
    
    window.open(enlaceFinal, '_blank');
}


// =======================================================
// 7. EJECUCIÓN INICIAL Y ASIGNACIÓN DE EVENTOS (CORREGIDO)
// =======================================================

// 1. Carga el carrito guardado antes de mostrar los productos
cargarCarrito(); 

// 2. Ejecución Inicial de funciones que muestran datos
mostrarProductos(productosCine);
cargarContacto(); 
mostrarBotonesFiltro(); // Muestra los botones de filtro

// 3. Evento para mostrar/ocultar los métodos de pago (Click en "Proceder al Pago")
procederPagoBoton.onclick = function() {
    metodosPagoContenedor.classList.toggle('hidden');
};

// 4. Escuchador Global de Clicks para manejar TODOS los botones
document.addEventListener('click', function(event) {
    
    // PRIORITY 1: Manejar Clic en botón "Añadir al Carrito" (el primer IF)
    if (event.target.classList.contains('btn-agregar')) {
        const nombreProducto = event.target.dataset.nombre;
        agregarAlCarrito(nombreProducto);
    } 
    
    // PRIORITY 2: Manejar Clic en botón "Eliminar"
    else if (event.target.classList.contains('btn-eliminar')) {
        const nombreProducto = event.target.dataset.nombre;
        eliminarDelCarrito(nombreProducto);
    }
    
    // PRIORITY 3: Manejar Clic en botón de "Filtro"
    else if (event.target.classList.contains('btn-filtro')) {
        const categoria = event.target.dataset.categoria;
        filtrarPorCategoria(categoria);

        // Opcional: Resaltar el botón activo
        document.querySelectorAll('.btn-filtro').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
    }
    
    // PRIORITY 4: Manejar Clic en botones de "Método de Pago"
    else if (event.target.classList.contains('btn-pago')) {
        const metodo = event.target.dataset.metodo;
        manejarPago(metodo);
    }
}); // <--- ¡ÚLTIMO CIERRE DE TODO EL ARCHIVO!