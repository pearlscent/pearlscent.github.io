document.addEventListener('DOMContentLoaded', () => {
    const isAdminPage = document.getElementById('admin-product-list') !== null; // Check if admin page
    loadSampleProducts(); // Load sample products on page load if none exist
    if (isAdminPage) {
        displayProducts(true); // Display admin product list
        document.getElementById('add-product-form').addEventListener('submit', addProduct);
    } else {
        displayProducts(); // Display user product list
    }
});

const itemsPerPage = 9; // Number of products to show per page
let currentPage = 1; // Current page number

// Function to add sample products to localStorage
async function loadSampleProducts() {
    try {
        const response = await fetch('/productsData.json'); // Adjust the path as needed
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const sampleProducts = await response.json();

        let products = JSON.parse(localStorage.getItem('products')) || [];
        if (products.length === 0) {
            localStorage.setItem('products', JSON.stringify(sampleProducts));
            console.log('Sample products loaded successfully.');
        }
    } catch (error) {
        console.error('Error loading sample products:', error);
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
function displayProducts(isAdmin = false) {
    const productList = isAdmin ? document.getElementById('admin-product-list') : document.getElementById('product-list');
    let products = JSON.parse(localStorage.getItem('products')) || [];
    if (products.length === 0) {
        productList.innerHTML = '<p>No products available.</p>';
        return;
    }

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedProducts = products.slice(start, end);

    productList.innerHTML = paginatedProducts.map(product => `
        <div class="${isAdmin ? 'adminProduct' : 'product'}" data-id="${product.id}">
            <h2>${product.name}</h2>
            <p>Price: $${product.price}</p>
            ${isAdmin ? `
                <button onclick="editProduct(${product.id})">Edit</button>
                <button onclick="removeProduct(${product.id})">Remove</button>
            ` : `
                <input type="number" id="quantity-${product.id}" value="1" min="1">
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            `}
        </div>
    `).join('');

    displayPagination(products.length, isAdmin);
}

// Function to display pagination controls
function displayPagination(totalItems, isAdmin = false) {
    const paginationContainer = document.getElementById('pagination');
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    paginationContainer.innerHTML = `
        <button onclick="prevPage(${isAdmin})" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
        Page ${currentPage} of ${totalPages}
        <button onclick="nextPage(${isAdmin})" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
    `;
}

function nextPage(isAdmin = false) {
    currentPage++;
    displayProducts(isAdmin);
}

function prevPage(isAdmin = false) {
    currentPage--;
    displayProducts(isAdmin);
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
    //alert(`${product.name} added to the cart!`);
}

// Function to Remove a product
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
