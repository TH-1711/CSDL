const baseUrl = 'http://localhost:3000/api/product';
// const apiFilterUrl = `${baseUrl}/getProductByStoreAndCategory`;

async function fetchProducts() {
    try {
        const response = await fetch(baseUrl);
        const products = await response.json();
        // console.log(products);
        displayProducts(products);
    }
    catch (error) {
        console.error("Error fetching product data:", error);
    }
}

async function filterProducts() {
    // Get the selected store ID and category ID
    const storeSelect = document.getElementById("storeSelect");
    const categorySelect = document.getElementById("categorySelect");
    const storeID = storeSelect.value;
    const categoryID = categorySelect.value;

    try {
        let apiUrl;
        if (categoryID === "all" && storeID !== "all") {
            apiUrl = `${baseUrl}/getProductByStore?storeID=${storeID}`;
        } else if (categoryID !== "all" && storeID === "all"){
            apiUrl = `${baseUrl}/getProductByCategory?categoryID=${categoryID}`;
        } else if (categoryID !== "all" && storeID !== "all") {
            apiUrl = `${baseUrl}/getProductByStoreAndCategory?storeID=${storeID}&categoryID=${categoryID}`;
        } else {
            apiUrl = `${baseUrl}`
        }

        // Fetch data from the API
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.status}`);
        }
        const products = await response.json();

        if (products.length === 0) {
            alert('Không tìm thấy sản phẩm thuộc danh mục này.');
        }
        
        //console.log(products);
        displayProducts(products);

    } catch (error) {
        console.error("Error fetching filtered product data:", error);
        // alert("Failed to fetch product data. Please try again.");
        alert('Không tìm thấy sản phẩm thuộc danh mục này.');
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
        <p><strong>Mã sản phẩm:</strong> ${productId}</p>
        <p><strong>Mô tả:</strong> ${description}</p>
        <p><strong>Chiết khấu cho nhân viên:</strong> ${discount}%</p>
    `;

    // Show the modal
    document.getElementById('productModal').style.display = 'flex';

    // Fetch variations for the product
    fetch(`http://localhost:3000/api/product/getVariationByProduct?productID=${productId}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch product variations: ${response.status}`);
            }
            return response.json();
        })
        .then((variations) => {
            // Populate the modal with sizes and prices
            const sizesContainer = document.querySelector('.variant.sizes');
            const colorsContainer = document.querySelector('.variant.colors');

            // Clear any existing content
            sizesContainer.innerHTML = '';
            colorsContainer.innerHTML = '';

            // Populate sizes with clickable functionality
            variations.forEach((variation) => {
                const sizeElement = document.createElement('span');
                sizeElement.className = 'size';
                sizeElement.textContent = variation.size;

                // Add click event to show colors and prices for the selected size
                sizeElement.addEventListener('click', () => {
                    // Highlight the selected size
                    document.querySelectorAll('.size').forEach(el => el.classList.remove('selected'));
                    sizeElement.classList.add('selected');

                    // Display colors for the selected size
                    colorsContainer.innerHTML = `
                        <strong>Màu hiện có:</strong> 
                        ${variation.colors.map(color => `<span class="color">${color}</span>`).join('')}
                    `;

                    // Display prices for the selected size
                    document.getElementById('modalPrice').innerHTML = `
                        <p><strong>Mã sản phẩm:</strong> ${productId}</p>
                        <p><strong>Mô tả:</strong> ${description}</p>
                        <p><strong>Chiết khấu cho nhân viên:</strong> ${discount}%</p>
                        <p><strong>Giá gốc:</strong> ${variation.origin_price} VND</p>
                        <p><strong>Giá bán:</strong> ${variation.sell_price} VND</p>
                    `;
                });

                sizesContainer.appendChild(sizeElement);
            });

            // Initial state: Display no colors or prices
            colorsContainer.innerHTML = '<strong>Click a size to view available colors</strong>';
        })
        .catch((error) => {
            console.error("Error fetching product variations:", error);
            alert("Failed to load product variations. Please try again.");
        });

    // Show the modal
    document.getElementById('productModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}

function openAddProductModal() {
    document.getElementById('addProductModal').style.display = 'block';
}
function closeAddProductModal() {
    document.getElementById('addProductModal').style.display = 'none';
}

// Call the displayProducts function when the page loads
// document.addEventListener("DOMContentLoaded", () => {
//     displayProducts(products);
// });

document.addEventListener("DOMContentLoaded", fetchProducts);


