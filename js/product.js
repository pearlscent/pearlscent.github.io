document.addEventListener('DOMContentLoaded', () => {
    loadSampleProducts(); // Load sample products on page load if none exist
    displayProducts();
    document.getElementById('add-product-form').addEventListener('submit', addProduct);
});

const itemsPerPage = 9; // Number of products to show per page
let currentPage = 1; // Current page number

// Function to add sample products to localStorage
function loadSampleProducts() {
    let products = JSON.parse(localStorage.getItem('products')) || [];

    if (products.length === 0) {
        const sampleProducts = [
            { id: 1, name: "Apple", price: 1.5 },
            { id: 2, name: "Banana", price: 0.5 },
            { id: 3, name: "Orange", price: 0.75 },
            { id: 4, name: "Milk", price: 2.0 },
            { id: 5, name: "Bread", price: 1.25 },
            { id: 6, name: "Cheese", price: 2.5 },
            { id: 7, name: "Butter", price: 3.0 },
            { id: 8, name: "Eggs", price: 1.2 },
            { id: 9, name: "Juice", price: 1.8 },
            { id: 10, name: "Yogurt", price: 1.1 },
            { id: 11, name: "Honey", price: 2.7 },
            { id: 12, name: "Cereal", price: 3.2 }
        ];

        localStorage.setItem('products', JSON.stringify(sampleProducts));
    }
}

// Function to add a new product
function addProduct(event) {
    event.preventDefault();

    const productName = document.getElementById('product-name').value;
    const productPrice = parseFloat(document.getElementById('product-price').value);

    if (!productName || isNaN(productPrice) || productPrice <= 0) {
        alert('Please enter a valid product name and price.');
        return;
    }

    let products = JSON.parse(localStorage.getItem('products')) || [];
    const productId = products.length ? products[products.length - 1].id + 1 : 1;

    const newProduct = {
        id: productId,
        name: productName,
        price: productPrice
    };

    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));
    document.getElementById('add-product-form').reset();
    displayProducts();
    alert(`${productName} has been added.`);
}

// Function to display products based on the current page
function displayProducts() {
    const productList = document.getElementById('product-list');
    let products = JSON.parse(localStorage.getItem('products')) || [];

    if (products.length === 0) {
        productList.innerHTML = '<p>No products available.</p>';
        return;
    }

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedProducts = products.slice(start, end);

    productList.innerHTML = paginatedProducts.map(product => `
        <div class="product" data-id="${product.id}">
            <h2>${product.name}</h2>
            <p>Price: $${product.price}</p>
            <input type="number" id="quantity-${product.id}" value="1" min="1">
            <button onclick="addToCart(${product.id})">Add to Cart</button>
            <button onclick="editProduct(${product.id})">Edit</button>
            <button onclick="removeProduct(${product.id})">Remove</button>
        </div>
    `).join('');

    displayPagination(products.length);
}

// Function to display pagination controls
function displayPagination(totalItems) {
    const paginationContainer = document.getElementById('pagination');
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    paginationContainer.innerHTML = `
        <button onclick="prevPage()" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
        Page ${currentPage} of ${totalPages}
        <button onclick="nextPage()" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
    `;
}

function nextPage() {
    currentPage++;
    displayProducts();
}

function prevPage() {
    currentPage--;
    displayProducts();
}

function addToCart(productId) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(item => item.id === productId);
    const quantity = parseInt(document.getElementById(`quantity-${productId}`).value);

    if (!product) {
        alert('Product not found.');
        return;
    }

    if (isNaN(quantity) || quantity < 1) {
        alert('Please enter a valid quantity.');
        return;
    }

    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const existingProduct = cart.find(item => item.id === productId);
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push({ ...product, quantity });
    }

    sessionStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} added to the cart!`);
}

function removeProduct(productId) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products = products.filter(item => item.id !== productId);
    localStorage.setItem('products', JSON.stringify(products));
    displayProducts();
    alert('Product has been removed.');
}

// Function to edit a product
function editProduct(productId) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(item => item.id === productId);

    if (!product) {
        alert('Product not found.');
        return;
    }

    const newName = prompt('Enter new name for the product:', product.name);
    const newPrice = parseFloat(prompt('Enter new price for the product:', product.price));

    if (!newName || isNaN(newPrice) || newPrice <= 0) {
        alert('Invalid input. Name cannot be empty and price must be a positive number.');
        return;
    }

    product.name = newName;
    product.price = newPrice;

    localStorage.setItem('products', JSON.stringify(products));
    displayProducts();
    alert('Product has been updated.');
}
