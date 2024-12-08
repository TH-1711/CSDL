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
}

function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}

// Call the displayProducts function when the page loads
// document.addEventListener("DOMContentLoaded", () => {
//     displayProducts(products);
// });

document.addEventListener("DOMContentLoaded", fetchProducts);


