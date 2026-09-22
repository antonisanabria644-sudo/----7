// TODOS TUS PRECIOS OFICIALES EN BOLIVIANOS (Bs)
const products = [
    // Pases y Paquetes
    { id: 1, title: "Pase de Diamantes Semanal", category: "Pases", price: 18.20 },
    { id: 2, title: "Paquete Semanal Élite", category: "Paquetes", price: 10.00 },
    { id: 3, title: "Paquete Mensual Épico", category: "Paquetes", price: 45.50 },
    { id: 4, title: "Pase Crepuscular", category: "Pases", price: 91.00 },

    // Recargas de Diamantes
    { id: 5, title: "50 Diamantes (+5 bonus)", category: "Diamantes", price: 8.75 },
    { id: 6, title: "150 Diamantes (+15 bonus)", category: "Diamantes", price: 26.25 },
    { id: 7, title: "250 Diamantes (+25 bonus)", category: "Diamantes", price: 43.75 },
    { id: 8, title: "500 Diamantes (+65 bonus)", category: "Diamantes", price: 87.50 },
    { id: 9, title: "1000 Diamantes (+155 bonus)", category: "Diamantes", price: 175.00 },
    { id: 10, title: "1500 Diamantes (+265 bonus)", category: "Diamantes", price: 268.75 },
    { id: 11, title: "2500 Diamantes (+475 bonus)", category: "Diamantes", price: 443.75 },
    { id: 12, title: "5000 Diamantes (+1000 bonus)", category: "Diamantes", price: 875.00 }
];

let cart = JSON.parse(localStorage.getItem('mlbb_cart')) || [];

const productsGrid = document.getElementById('products-grid');
const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();
});

function renderProducts() {
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div>
                <span class="product-tag">${product.category}</span>
                <h3 class="product-title">${product.title}</h3>
            </div>
            <div class="product-footer">
                <span class="product-price">Bs ${product.price.toFixed(2)}</span>
                <button class="btn btn-primary" onclick="addToCart(${product.id})">Añadir</button>
            </div>
        </div>
    `).join('');
}

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
    showToast(`"${product.title}" agregado`);
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
    localStorage.setItem('mlbb_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `Bs ${total.toFixed(2)}`;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted);">Carrito vacío.</p>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div>
                    <h4>${item.title}</h4>
                    <small>Bs ${item.price.toFixed(2)} x ${item.quantity}</small>
                </div>
                <div>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">&times;</button>
                </div>
            </div>
        `).join('');
    }
}

cartBtn.addEventListener('click', () => cartModal.classList.add('active'));
closeCartBtn.addEventListener('click', () => cartModal.classList.remove('active'));

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return alert("El carrito está vacío");
    alert("¡Pedido registrado! Puedes conectar esto con tu número de WhatsApp para recibir los datos del jugador.");
    cart = [];
    saveCart();
    updateCartUI();
    cartModal.classList.remove('active');
});

function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
