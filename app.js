// =======================================================
// 1. VARIABLES GLOBALES Y CONTACTO
// =======================================================
let carrito = []; 
const totalCarritoSpan = document.getElementById('total-carrito');
const listaCarritoUL = document.getElementById('lista-carrito');
const procederPagoBoton = document.getElementById('proceder-pago');
const metodosPagoContenedor = document.getElementById('metodos-pago-contenedor');
const infoPagoDetalleDiv = document.getElementById('info-pago-detalle'); 
const qrImageUrl = 'imagenes/qr_izipay_yape_plin.jpg'; 

const infoContacto = {
    numeroTelefono: '+51977875869', 
    email: 'mundocine10.cp@gmail.com',
    whatsappMensaje: 'Hola, estoy interesado en comprar entradas y combos de Cineplanet. ¿Me puedes dar información?' 
};
const urlPasarelaIzipay = 'https://link.izipay.pe/tu-link-de-pago';


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

function mostrarBotonesFiltro() {
    const contenedorFiltros = document.createElement('div');
    contenedorFiltros.className = 'filtro-botones';
    contenedorFiltros.innerHTML = `<button class="btn-filtro active" data-categoria="Todos">Todos</button><button class="btn-filtro" data-categoria="Entrada">Entradas</button><button class="btn-filtro" data-categoria="Combo">Combos</button>`;
    listaProductosUL.parentNode.insertBefore(contenedorFiltros, listaProductosUL);
}

function filtrarPorCategoria(categoria) {
    let productosFiltrados;
    if (categoria === 'Todos') { productosFiltrados = productosCine; } 
    else { productosFiltrados = productosCine.filter(producto => producto.categoria === categoria); }
    mostrarProductos(productosFiltrados);
}

function mostrarProductos(productosAMostrar) {
    listaProductosUL.innerHTML = '';
    productosAMostrar.forEach(producto => {
        const li = document.createElement('li');
        if (producto.destacado) { li.classList.add('producto-destacado'); }
        li.innerHTML = `<div class="producto-info"><h3>${producto.nombre} - <span>${producto.precio}</span></h3><p>${producto.descripcion}</p><button data-nombre="${producto.nombre}" class="btn-agregar">Añadir al Carrito</button></div><img src="${producto.imagenURL}" alt="Imagen de ${producto.nombre}" class="producto-imagen">`;
        listaProductosUL.appendChild(li);
    });
}


// =======================================================
// 4. FUNCIÓN PARA FILTRAR (BÚSQUEDA Y ORDENAR)
// =======================================================
function filtrarProductos() {
    const textoBusqueda = document.getElementById('searchInput').value.toLowerCase().trim();
    const productosFiltrados = productosCine.filter(producto => {
        const contenidoProducto = (producto.nombre + " " + producto.descripcion).toLowerCase();
        return contenidoProducto.includes(textoBusqueda);
    });
    mostrarProductos(productosFiltrados);
    if (productosFiltrados.length === 0) { listaProductosUL.innerHTML = '<li style="border: none; background: none; color: #e50914;">No se encontraron productos que coincidan con la búsqueda.</li>'; }
}

function ordenarProductos(criterio) {
    const productosOrdenados = [...productosCine]; 
    switch (criterio) {
        case 'precio_asc':
            productosOrdenados.sort((a, b) => parseFloat(a.precio.replace('S/ ', '').replace(',', '.')) - parseFloat(b.precio.replace('S/ ', '').replace(',', '.')));
            break;
        case 'precio_desc':
            productosOrdenados.sort((a, b) => parseFloat(b.precio.replace('S/ ', '').replace(',', '.')) - parseFloat(a.precio.replace('S/ ', '').replace(',', '.')));
            break;
        case 'nombre_asc':
            productosOrdenados.sort((a, b) => a.nombre.localeCompare(b.nombre));
            break;
        default: break;
    }
    mostrarProductos(productosOrdenados);
}


// =======================================================
// 5. LÓGICA DEL CARRITO
// =======================================================

function agregarAlCarrito(nombreProducto) {
    const productoBase = productosCine.find(p => p.nombre === nombreProducto);
    if (!productoBase) { console.error("Error: Producto no encontrado:", nombreProducto); return; }
    const precioLimpio = productoBase.precio.replace('S/ ', '').replace(',', '.');
    const precioNumerico = parseFloat(precioLimpio);
    if (isNaN(precioNumerico)) { console.error("Error: El precio no es un número válido para:", nombreProducto); return; }
    const itemExistente = carrito.find(item => item.nombre === nombreProducto);

    if (itemExistente) { itemExistente.cantidad++; } 
    else { carrito.push({ nombre: productoBase.nombre, precio: precioNumerico, cantidad: 1 }); }

    actualizarCarritoVisual();
    guardarCarrito(); 
}

function eliminarDelCarrito(nombreProducto) {
    const index = carrito.findIndex(item => item.nombre === nombreProducto);
    if (index !== -1) {
        const item = carrito[index];
        if (item.cantidad > 1) { item.cantidad--; } 
        else { carrito.splice(index, 1); }
    }
    actualizarCarritoVisual();
    guardarCarrito(); 
}

function actualizarCarritoVisual() {
    listaCarritoUL.innerHTML = '';
    let total = 0;
    
    if (carrito.length === 0) {
        listaCarritoUL.innerHTML = '<li class="carrito-vacio">El carrito está vacío.</li>';
        procederPagoBoton.disabled = true; 
        metodosPagoContenedor.classList.add('hidden'); 
    } else {
        carrito.forEach(item => {
            const subtotal = item.precio * item.cantidad;
            total += subtotal; 
            const li = document.createElement('li');
            li.innerHTML = `${item.nombre} x ${item.cantidad} <span class="carrito-subtotal">S/ ${subtotal.toFixed(2)}</span><button class="btn-eliminar" data-nombre="${item.nombre}">❌</button>`;
            listaCarritoUL.appendChild(li);
        });
        procederPagoBoton.disabled = false;
    }
    totalCarritoSpan.textContent = `S/ ${total.toFixed(2)}`;
}


// =======================================================
// 5B. LÓGICA DE LOCALSTORAGE
// =======================================================
function guardarCarrito() { localStorage.setItem('carritoCineplanet', JSON.stringify(carrito)); }
function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carritoCineplanet');
    if (carritoGuardado) { carrito = JSON.parse(carritoGuardado); }
    actualizarCarritoVisual();
}


// =======================================================
// 6. LÓGICA DE SELECCIÓN DE PAGO Y MENSAJERÍA
// =======================================================

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

function generarEnlaceWhatsApp(mensaje) {
    const numero = infoContacto.numeroTelefono.replace('+', ''); 
    return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

function confirmarPagoWhatsApp() {
    let mensaje = generarMensajePedido();
    mensaje += "\n\n— MÉTODO DE PAGO: YA PAGUÉ POR QR. Aquí está el screenshot. —";
    const enlaceWA = generarEnlaceWhatsApp(mensaje);
    window.open(enlaceWA, '_blank');
}

function redirigirIzipay() {
    confirmarPagoWhatsApp(); 
    window.open(urlPasarelaIzipay, '_blank');
    alert('¡Serás redirigido a Izipay! Tu pedido ha sido enviado a nuestro WhatsApp para seguimiento.');
}


// Lógica que ejecuta la acción de pago (MUESTRA QR / BOTONES)
function manejarPago(metodo) {
    const totalActual = totalCarritoSpan.textContent; 
    let contenidoHTML = '';

    switch(metodo) {
        case 'whatsapp':
            const mensajeBaseWA = generarMensajePedido();
            const enlaceWA = generarEnlaceWhatsApp(mensajeBaseWA + "\n\n— MÉTODO DE PAGO ELEGIDO: COORDINAR POR CHAT (YAPE/EFECTIVO/CONTRA-ENTREGA) —");
            
            contenidoHTML = `<p>✅ **¡Pedido Enviado!** Haz clic en el botón para coordinar el pago por WhatsApp.</p><a href="${enlaceWA}" target="_blank" class="btn-pago btn-pago-final">Enviar Pedido y Coordinar Pago</a>`;
            window.open(enlaceWA, '_blank'); 
            break;

        case 'yape_plin_qr':
            contenidoHTML = `<div class="qr-container"><h4>Paga escaneando nuestro QR Izipay con Yape o Plin (${totalActual})</h4><img src="${qrImageUrl}" alt="Código QR de Pago Izipay" class="qr-image"><p>1. Escanea el código QR de ${totalActual} usando la app de Yape o Plin.</p><p>2. **¡Importante!** Envíanos el *screenshot* del pago por WhatsApp para confirmar tu pedido.</p><button class="btn-pago btn-pago-final" data-metodo="whatsapp_confirm">✅ Ya pagué, confirmar por WhatsApp</button></div>`;
            break;

        case 'tarjeta':
            contenidoHTML = `<h4>Pagar con Tarjeta Izipay (${totalActual})</h4><div class="tarjeta-container"><p>Serás redirigido a la plataforma segura de Izipay para ingresar tus datos.</p><button class="btn-pago btn-pago-final" data-metodo="izipay_redirigir">Pagar ${totalActual} con Tarjeta</button></div>`;
            break;
    }
    
    infoPagoDetalleDiv.innerHTML = contenidoHTML;
    infoPagoDetalleDiv.classList.remove('hidden'); 
}


// =======================================================
// 7. EJECUCIÓN INICIAL Y ASIGNACIÓN DE EVENTOS
// =======================================================

// 1. Carga el carrito guardado antes de mostrar los productos
cargarCarrito(); 

// 2. Ejecución Inicial de funciones que muestran datos
mostrarProductos(productosCine);
cargarContacto(); 
mostrarBotonesFiltro(); 

// 3. Escuchador Global de Clicks para manejar TODOS los botones
document.addEventListener('click', function(event) {
    
    if (event.target.classList.contains('btn-agregar')) {
        const nombreProducto = event.target.dataset.nombre;
        agregarAlCarrito(nombreProducto);
    } 
    
    else if (event.target.classList.contains('btn-eliminar')) {
        const nombreProducto = event.target.dataset.nombre;
        eliminarDelCarrito(nombreProducto);
    }
    
    else if (event.target.classList.contains('btn-filtro')) {
        const categoria = event.target.dataset.categoria;
        filtrarPorCategoria(categoria);

        document.querySelectorAll('.btn-filtro').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
    }
    
    // 4. Manejar Clic en botón "Proceder al Pago" (ABRE LAS OPCIONES)
    else if (event.target.id === 'proceder-pago') {
        metodosPagoContenedor.classList.toggle('hidden');
    }

    // 5. Manejar Clic en botones de "Método de Pago" (Incluye botones finales)
    else if (event.target.classList.contains('btn-pago')) {
        const metodo = event.target.dataset.metodo;
        
        if (metodo === 'whatsapp_confirm') {
            confirmarPagoWhatsApp();
        } 
        else if (metodo === 'izipay_redirigir') {
            redirigirIzipay();
        }
        else {
            manejarPago(metodo);
        }
    }
});
