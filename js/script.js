let allProducts = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function renderCart() {
    const cartBody = document.getElementById('cart-body');
    const cartTotal = document.getElementById('cart-total');

    cartBody.innerHTML = '';

    if (cart.length === 0) {
        cartBody.innerHTML = '<p>Tu carrito está vacío.</p>';
        cartTotal.textContent = '$0.00';
        return;
    }

    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItemHTML = `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <img src="${item.image}" alt="${item.title}" style="width: 50px; height: 50px; object-fit: contain;">
                <div class="flex-grow-1 mx-3">
                    <p class="mb-0" style="font-size: 0.9rem;">${item.title}</p>
                    <p class="mb-0 text-muted">$${item.price.toFixed(2)}</p>
                </div>
                <div class="d-flex align-items-center">
                    <button class="btn btn-sm btn-secondary" onclick="changeQuantity(${item.id}, -1)">-</button>
                    <span class="mx-2">${item.quantity}</span>
                    <button class="btn btn-sm btn-secondary" onclick="changeQuantity(${item.id}, 1)">+</button>
                </div>
                <p class="mb-0 mx-3 fw-bold">$${itemTotal.toFixed(2)}</p>
                <button class="btn btn-sm btn-danger" onclick="removeFromCart(${item.id})">X</button>
            </div>
        `;
        cartBody.innerHTML += cartItemHTML;
    });

    cartTotal.textContent = `$${total.toFixed(2)}`;
}

window.addToCart = function(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) {
        console.error('Product not found!');
        return;
    }

    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartCount();
    alert(`"${product.title}" ha sido agregado al carrito.`);
};

window.changeQuantity = function(productId, change) {
    const cartItem = cart.find(item => item.id === productId);
    if (!cartItem) return;

    cartItem.quantity += change;

    if (cartItem.quantity <= 0) {
        cart = cart.filter(item => item.id !== productId);
    }

    saveCart();
    updateCartCount();
    renderCart();
};

window.removeFromCart = function(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCart();
};

document.addEventListener('DOMContentLoaded', () => {
    const productContainer = document.getElementById('product-container');
    const cartModal = document.getElementById('cartModal');

    cartModal.addEventListener('show.bs.modal', renderCart);

    async function fetchProducts() {
        try {
            const response = await fetch('./js/products.js');
            allProducts = await response.json();
            renderProducts(allProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
            productContainer.innerHTML = '<p class="text-center text-danger">No se pudieron cargar los productos.</p>';
        }
    }

    function renderProducts(products) {
        productContainer.innerHTML = '';
        products.forEach(product => {
            const productCard = `
                <div class="col-md-4 col-lg-3">
                    <div class="card h-100 shadow-sm">
                        <img src="${product.image}" class="card-img-top p-3" alt="${product.title}" style="height: 200px; object-fit: contain;">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title" style="font-size: 1rem;">${product.title}</h5>
                            <p class="card-text fw-bold mt-2">$${product.price.toFixed(2)}</p>
                            <button class="btn btn-accent mt-auto" onclick="addToCart(${product.id})">Agregar al Carrito</button>
                        </div>
                    </div>
                </div>
            `;
            productContainer.innerHTML += productCard;
        });
    }

    fetchProducts();
    updateCartCount();
});
