const apiUrl = 'http://localhost:3000/api/product';

async function fetchProducts() {
    try {
        const response = await fetch(apiUrl);
        const products = await response.json();
        // console.log(products);
        displayProducts(products);
    }
    catch (error) {
        console.error("Error fetching product data:", error);
    }
}

function displayProducts(productArray) {
    const productList = document.getElementById("product-list");
    productList.innerHTML = '';

    // Loop through the product list and add each product to the interface
    productArray.forEach((product) => {
        const productItem = document.createElement("div");
        productItem.className = "product-item";

        productItem.innerHTML = `
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <button onclick="openModal(${product.id}, '${product.name}', '${product.description}', ${product.discount_for_employee})">Chi tiết</button>
        `;

        productList.appendChild(productItem);
    });
}

function openModal(productId, name, description, discount) {
    // Update modal content
    document.getElementById('modalTitle').textContent = name;
    document.getElementById('modalPrice').innerHTML = `
        <p><strong>Mô tả:</strong> ${description}</p>
        <p><strong>Chiết khấu cho nhân viên:</strong> ${discount}%</p>
    `;

    // Show the modal
    document.getElementById('productModal').style.display = 'flex';
}

// function openModal(productId) {
//     const product = products.find(p => p.id === productId);

//     // Update the modal title and price
//     document.getElementById('modalTitle').textContent = product.name;
//     document.getElementById('modalPrice').innerHTML = `<strong>Price:</strong> ${product.price}`;
    
//     // Display product colors
//     const colorList = document.querySelector('#productModal .variant.colors');
//     colorList.innerHTML = '<strong>Colors:</strong>';
//     product.colors.forEach(color => {
//         const colorSpan = document.createElement('span');
//         colorSpan.textContent = color;
//         colorList.appendChild(colorSpan);
//     });

//     // Display product sizes
//     const sizeList = document.querySelector('#productModal .variant.sizes');
//     sizeList.innerHTML = '<strong>Sizes:</strong>';
//     product.sizes.forEach(size => {
//         const sizeSpan = document.createElement('span');
//         sizeSpan.textContent = size;
//         sizeList.appendChild(sizeSpan);
//     });

//     // Show the modal
//     document.getElementById('productModal').style.display = 'flex';
// }

function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}

// Call the displayProducts function when the page loads
// document.addEventListener("DOMContentLoaded", () => {
//     displayProducts(products);
// });

document.addEventListener("DOMContentLoaded", fetchProducts);