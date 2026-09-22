// ==========================================================================
// Base de Datos de Productos
// ==========================================================================
const products = [
    {
        id: 1,
        title: "Cyberpunk Odyssey",
        category: "RPG",
        price: 59.99,
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        title: "Elden Realm",
        category: "Acción",
        price: 69.99,
        image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        title: "Speed Horizon 5",
        category: "Carreras",
        price: 49.99,
        image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        title: "Galactic Wars",
        category: "Estrategia",
        price: 39.99,
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
    }
];

// Estado de la aplicación
let cart = JSON.parse(localStorage.getItem('nexus_cart')) || [];

// Elementos del DOM
const productsGrid = document.getElementById('products-grid');
const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

// ==========================================================================
// Funciones de Inicialización
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();
});

// Renderizar la grilla de productos
function renderProducts() {
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <div class="product-details">
                <span class="product-tag">${product.category}</span>
                <h3 class="product-title">${product.title}</h3>
                <div class="product-footer">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <button class="btn btn-primary" onclick="addToCart(${product.id})">Añadir</button>
                </div>
            </div>
        </div>
    `).join('');
}

// ==========================================================================
// Lógica del Carrito
// ==========================================================================
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    showToast(`"${product.title}" añadido al carrito`);
}

function updateQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += delta;

    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        updateCartUI();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('nexus_cart', JSON.stringify(cart));
}

function updateCartUI() {
    // Actualizar contador
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Actualizar precio total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;

    // Renderizar items del modal
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted);">Tu carrito está vacío.</p>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.title}</h4>
                    <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})" aria-label="Eliminar">&times;</button>
                </div>
            </div>
        `).join('');
    }
}

// ==========================================================================
// Eventos y UI
// ==========================================================================
cartBtn.addEventListener('click', () => cartModal.classList.add('active'));
closeCartBtn.addEventListener('click', () => cartModal.classList.remove('active'));

// Cerrar modal al hacer clic fuera
cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) cartModal.classList.remove('active');
});

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        showToast("Tu carrito está vacío", "error");
        return;
    }
    alert("¡Gracias por tu compra! En un entorno real, serías redirigido a la pasarela de pago.");
    cart = [];
    saveCart();
    updateCartUI();
    cartModal.classList.remove('active');
});

// Sistema simple de notificaciones (Toast)
function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}
