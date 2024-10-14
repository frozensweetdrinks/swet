// Inicializamos el carrito y el total
let cartItems = {};
let totalAmount = 0;

// Función para mostrar la alerta personalizada
function showAlert(message) {
    const alertContainer = document.getElementById('alert-container');
    const alertMessage = document.getElementById('alert-message');
    alertMessage.textContent = message;
    alertContainer.classList.add('show');

    // Centrar la alerta en el medio de la pantalla
    alertContainer.style.position = 'fixed';
    alertContainer.style.top = '50%';
    alertContainer.style.left = '50%';
    alertContainer.style.transform = 'translate(-50%, -50%)';
    alertContainer.style.zIndex = '1000'; // Asegurarse de que la alerta esté por encima de otros elementos
}

// Función para ocultar la alerta
function hideAlert() {
    const alertContainer = document.getElementById('alert-container');
    alertContainer.classList.remove('show');
}

// Función para agregar productos al carrito
function addToCart(name, price) {
    if (cartItems[name]) {
        cartItems[name].quantity += 1;
    } else {
        cartItems[name] = { price: price, quantity: 1 };
    }
    updateCart(); // Actualizamos el carrito
}

// Función para eliminar un producto individualmente del carrito
function removeFromCart(name) {
    if (cartItems[name]) {
        cartItems[name].quantity -= 1;
        if (cartItems[name].quantity === 0) {
            delete cartItems[name]; // Eliminamos el producto si la cantidad llega a cero
        }
    }
    updateCart(); // Actualizamos el carrito
}

// Función para vaciar completamente el carrito
function clearCart() {
    cartItems = {}; // Reiniciamos los productos
    updateCart(); // Actualizamos el carrito
}

// Función para actualizar la interfaz del carrito
function updateCart() {
    const invoiceList = document.getElementById('invoice-items');
    const invoiceTotal = document.getElementById('invoice-total');
    invoiceList.innerHTML = ''; // Limpiamos los elementos actuales
    totalAmount = 0; // Reiniciamos el total

    for (let name in cartItems) {
        const item = cartItems[name];
        const listItem = document.createElement('li');
        listItem.innerHTML = `${name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)} <button onclick="removeFromCart('${name}')">Eliminar uno</button>`;
        invoiceList.appendChild(listItem);
        totalAmount += item.price * item.quantity;
    }

    invoiceTotal.textContent = totalAmount.toFixed(2);

    // Mostrar el formulario si hay productos, ocultarlo si no hay
    if (totalAmount > 0) {
        document.getElementById('invoice').style.display = 'block';
    } else {
        document.getElementById('invoice').style.display = 'none';
    }
}

// Función para limpiar los campos del formulario
function clearFormFields() {
    document.getElementById('invoice-customer-name').value = '';
    document.getElementById('invoice-customer-address').value = '';
    document.getElementById('to_email').value = '';
}

// Función para enviar la factura con EmailJS
function sendInvoice() {
    const name = document.getElementById('invoice-customer-name').value;
    const address = document.getElementById('invoice-customer-address').value;
    const email = document.getElementById('to_email').value;

    if (!name || !address || !email) {
        showAlert('Por favor, complete todos los campos antes de enviar la factura.');
        return;
    }

    const templateParams = {
        to_name: name,
        to_email: email,
        customer_address: address,
        total: totalAmount.toFixed(2)
    };

    let productCount = 1;
    for (let name in cartItems) {
        const item = cartItems[name];
        templateParams[`product_${productCount}`] = name;
        templateParams[`quantity_${productCount}`] = item.quantity;
        templateParams[`unit_price_${productCount}`] = item.price.toFixed(2);
        templateParams[`total_price_${productCount}`] = (item.price * item.quantity).toFixed(2);
        productCount++;
    }

    // Enviar la factura al cliente y luego a la administración
    emailjs.send('default_service', 'template_zuvmgun', templateParams)
    .then(() => {
        const adminParams = {
            ...templateParams,  // Copia todo lo que ya está en templateParams (incluidos los productos)
            to_email: 'frozensweetdrink@gmail.com',  // Dirección del administrador
            current_time: new Date().toLocaleString(),  // Hora actual
        };

        return emailjs.send('default_service', 'template_zuvmgun', adminParams);
    })
    .then(() => {
        showAlert('Factura enviada con éxito.');
        clearFormFields();  // Limpiamos los campos del formulario después de enviar la factura
    })
    .catch((error) => {
        console.error('Error al enviar la factura:', error);
        showAlert('Error al enviar la factura. Por favor, intente nuevamente.');
    });
}

// Inicializamos la fecha de la factura
document.getElementById('invoice-date').textContent = new Date().toLocaleDateString();

// Botón para vaciar el carrito (utilizamos el botón existente en el HTML)
document.getElementById('clear-cart-button').addEventListener('click', clearCart);

// Configuramos el botón para enviar la factura
document.getElementById('send-invoice-button').addEventListener('click', sendInvoice);

// Añadimos la funcionalidad a todos los botones de "Agregar a la canasta"
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function () {
        const productName = this.parentElement.querySelector('.product-name').textContent;
        const productPrice = parseFloat(this.getAttribute('data-price'));
        addToCart(productName, productPrice);
    });
});

// Escondemos los campos del formulario hasta que se agregue un producto
document.getElementById('invoice').style.display = 'none';
