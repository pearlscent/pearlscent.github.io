document.addEventListener('DOMContentLoaded', displayCartItems);

function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        totalPriceElement.textContent = '';
        return;
    }

    // Generate HTML for each cart item
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <h2>${item.name}</h2>
            <p>Price: $${item.price}</p>
            <label>Quantity: </label>
            <input type="number" value="${item.quantity}" min="0" onchange="updateQuantity(${item.id}, this.value)">
            <button onclick="removeFromCart(${item.id})">Remove</button>
        </div>
    `).join('');

    // Calculate total price
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    totalPriceElement.textContent = `Total Price: $${totalPrice}`;
}

// Function to update the quantity of a product in the cart
function updateQuantity(productId, newQuantity) {
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const product = cart.find(item => item.id == productId);

    newQuantity = parseInt(newQuantity);

    if (product) {
        if (newQuantity > 0) {
            product.quantity = newQuantity;
            sessionStorage.setItem('cart', JSON.stringify(cart));
            displayCartItems();
        } else if (newQuantity === 0) {
            // Remove the product if quantity is set to 0
            removeFromCart(productId);
        } else {
            alert('Please enter a valid quantity.');
        }
    }
}

// Function to remove a product from the cart
function removeFromCart(productId) {
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id != productId);
    sessionStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
}

function clearCart() {
    sessionStorage.removeItem('cart'); // Remove all items from the cart
    displayCartItems(); // Refresh the cart display
    alert('All items have been removed from the cart.');
}
