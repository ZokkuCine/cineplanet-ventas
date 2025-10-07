// =======================================================
// 1. VARIABLES GLOBALES Y CONTACTO
// =======================================================
let carrito = []; 
const totalCarritoSpan = document.getElementById('total-carrito');
const listaCarritoUL = document.getElementById('lista-carrito');
const procederPagoBoton = document.getElementById('proceder-pago');
const metodosPagoContenedor = document.getElementById('metodos-pago-contenedor');
const infoPagoDetalleDiv = document.getElementById('info-pago-detalle'); // <-- Variable para el contenedor de QR
// URL de tu QR de negocio (¡REEMPLAZA ESTA URL CON TU IMAGEN REAL!)
const qrImageUrl = 'imagenes/qr_izipay_yape_plin.jpg'; 

// Variables de Contacto
const infoContacto = {
    numeroTelefono: '+51977875869', 
    email: 'mundocine10.cp@gmail.com',
    whatsappMensaje: 'Hola, estoy interesado en comprar entradas y combos de Cineplanet. ¿Me puedes dar información?' 
};
// URL de tu pasarela de Izipay (simulación)
const urlPasarelaIzipay = 'https://link.izipay.pe/tu-link-de-pago'; // ¡REEMPLAZA CON TU LINK REAL!


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

// Muestra los botones de filtro sobre la lista
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

// Filtra y vuelve a dibujar la lista
function filtrarPorCategoria(categoria) {
    let productosFiltrados;

    if (categoria === 'Todos') {
        productosFiltrados = productosCine;
    } else {
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
// 4. FUNCIÓN PARA FILTRAR (LÓGICA DE BÚSQUEDA Y ORDENAR)
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

function ordenarProductos(criterio) {
    const productosOrdenados = [...productosCine]; 

    switch (criterio) {
        case 'precio_asc':
            productosOrdenados.sort((a, b) => {
                const precioA = parseFloat(a.precio.replace('S/ ', '').replace(',', '.'));
                const precioB = parseFloat(b.precio.replace('S/ ', '').replace(',', '.'));
                return precioA - precioB;
            });
            break;
        
        case 'precio_desc':
            productosOrdenados.sort((a, b) => {
                const precioA = parseFloat(a.precio.replace('S/ ', '').replace(',', '.'));
                const precioB = parseFloat(b.precio.replace('S/ ', '').replace(',', '.'));
                return precioB - precioA; 
            });
            break;

        case 'nombre_asc':
            productosOrdenados.sort((a, b) => a.nombre.localeCompare(b.nombre));
            break;

        case 'default':
        default:
            break;
    }

    mostrarProductos(productosOrdenados);
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
    guardarCarrito(); 
}

// ELIMINA UN ÍTEM O REDUCE LA CANTIDAD
function eliminarDelCarrito(nombreProducto) {
    const index = carrito.findIndex(item => item.nombre === nombreProducto);

    if (index !== -1) {
        const item = carrito[index];

        if (item.cantidad > 1) {
            item.cantidad--;
        } else {
            carrito.splice(index, 1);
        }
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
// 5B. LÓGICA DE LOCALSTORAGE
// =======================================================

function guardarCarrito() {
    localStorage.setItem('carritoCineplanet', JSON.stringify(carrito));
}

function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carritoCineplanet');
    
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }
    
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

// FUNCIÓN PARA CONFIRMAR PAGO POR QR
function confirmarPagoWhatsApp() {
    let mensaje = generarMensajePedido();
    mensaje += "\n\n— MÉTODO DE PAGO: YA PAGUÉ POR QR. Aquí está el screenshot. —";
    const enlaceWA = generarEnlaceWhatsApp(mensaje);
    window.open(enlaceWA, '_blank');
}

// FUNCIÓN PARA REDIRECCIONAR A IZIPAY
function redirigirIzipay() {
    // 1. Envía el pedido final por WhatsApp para tu seguimiento
    confirmarPagoWhatsApp(); 
    
    // 2. Abre la pasarela de Izipay en una nueva pestaña
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
            
            contenidoHTML = `
                <p>✅ **¡Pedido Enviado!** Haz clic en el botón para coordinar el pago por WhatsApp.</p>
                <a href="${enlaceWA}" target="_blank" class="btn-pago btn-pago-final">Enviar Pedido y Coordinar Pago</a>
            `;
            // IMPORTANTE: Al ser WhatsApp directo, no necesitamos más pasos en la web
            window.open(enlaceWA, '_blank'); // Abrir inmediatamente
            break;

        case 'yape_plin_qr':
            // 2. Yape/Plin (Mostrar QR)
            contenidoHTML = `
                <div class="qr-container">
                    <h4>Paga escaneando nuestro QR Izipay con Yape o Plin (${totalActual})</h4>
                    <img src="${qrImageUrl}" alt="Código QR de Pago Izipay" class="qr-image">
                    <p>1. Escanea el código QR de ${totalActual} usando la app de Yape o Plin.</p>
                    <p>2. **¡Importante!** Envíanos el *screenshot* del pago por WhatsApp para confirmar tu pedido.</p>
                    <button class="btn-pago btn-pago-final" data-metodo="whatsapp_confirm">✅ Ya pagué, confirmar por WhatsApp</button>
                </div>
            `;
            break;

        case 'tarjeta':
            // 3. Tarjeta (Botón de Pasarela)
            contenidoHTML = `
                <h4>Pagar con Tarjeta Izipay (${totalActual})</h4>
                <div class="tarjeta-container">
                    <p>Serás redirigido a la plataforma segura de Izipay para ingresar tus datos.</p>
                    <button class="btn-pago btn-pago-final" data-metodo="izipay_redirigir">Pagar ${totalActual} con Tarjeta</button>
                </div>
            `;
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
mostrarBotonesFiltro(); // Muestra los botones de filtro

// 3. Escuchador Global de Clicks para manejar TODOS los botones
document.addEventListener('click', function(event) {
    
    // 1. Manejar Clic en botón "Añadir al Carrito"
    if (event.target.classList.contains('btn-agregar')) {
        const nombreProducto = event.target.dataset.nombre;
        agregarAlCarrito(nombreProducto);
    } 
    
    // 2. Manejar Clic en botón "Eliminar"
    else if (event.target.classList.contains('btn-eliminar')) {
        const nombreProducto = event.target.dataset.nombre;
        eliminarDelCarrito(nombreProducto);
    }
    
    // 3. Manejar Clic en botón de "Filtro"
    else if (event.target.classList.contains('btn-filtro')) {
        const categoria = event.target.dataset.categoria;
        filtrarPorCategoria(categoria);

        document.querySelectorAll('.btn-filtro').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
    }
    
    // 4. Manejar Clic en botón "Proceder al Pago"
    else if (event.target.id === 'proceder-pago') {
        metodosPagoContenedor.classList.toggle('hidden');
    }

    // 5. Manejar Clic en botones de "Método de Pago" (Incluye botones finales)
    else if (event.target.classList.contains('btn-pago')) {
        const metodo = event.target.dataset.metodo;
        
        // Maneja los botones de acción final (dentro del contenedor de QR/Tarjeta)
        if (metodo === 'whatsapp_confirm') {
            confirmarPagoWhatsApp();
        } 
        else if (metodo === 'izipay_redirigir') {
            redirigirIzipay();
        }
        // Maneja los botones iniciales (solo para expandir la sección de pago)
        else {
            manejarPago(metodo);
        }
    }
}); // <-- ¡ÚLTIMO CIERRE DE TODO EL ARCHIVO!
