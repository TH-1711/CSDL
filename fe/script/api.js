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

    const storeID = document.getElementById("storeSelect").value;
    const apiUrl = 
        (storeID === "all") ? 
        `http://localhost:3000/api/product/getVariationByProduct?productID=${productId}` 
        :
        `http://localhost:3000/api/product/getVariationByProductAndStore?productID=${productId}&storeID=${storeID}`;

    fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch product variations: ${response.status}`);
            }
            return response.json();
        })
        .then((variations) => {
            const sizesContainer = document.querySelector('.variant.sizes');
            const colorsContainer = document.querySelector('.variant.colors');

            // Clear any existing content
            sizesContainer.innerHTML = '';
            colorsContainer.innerHTML = '';

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
                    if (storeID === "all") {
                        // If storeID is "all", just display colors without quantity
                        colorsContainer.innerHTML = `
                            <strong>Màu hiện có:</strong> 
                            ${variation.colors.map(color => `<span class="color">${color}</span>`).join('')}
                        `;
                    } else {
                        // If a specific store is selected, display colors with quantities
                        colorsContainer.innerHTML = `
                            <strong>Màu hiện có:</strong> 
                            ${variation.colors.map(color => `<span class="color">${color.color} (${color.quantity} chiếc)</span>`).join('')}
                        `;
                    }

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

            colorsContainer.innerHTML = '<strong>Click a size to view available colors</strong>';
        })
        .catch((error) => {
            console.error("Error fetching product variations:", error);
            alert("Failed to load product variations. Please try again.");
        });

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

function openAddProductVariationModal() {
    document.getElementById('addProductVariationModal').style.display = 'block';
}

function closeAddProductVariationModal() {
    document.getElementById('addProductVariationModal').style.display = 'none';
}

async function addProduct(event) {
    event.preventDefault();

    const name = document.getElementById("productName").value;
    const categoryID = parseInt(document.getElementById("productCategory").value, 10);
    const description = document.getElementById("productDesc").value;
    const discountForEmployee = parseInt(document.getElementById("productEmpDiscount").value, 10);

    const requestBody = {
        categoryID,
        name,
        description,
        discountForEmployee
    };

    try {
        // Send a POST request to the API
        const response = await fetch(`${baseUrl}/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        // Check for a successful response
        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(`Error: ${errorResponse.message}`);
        }

        // Parse the JSON response
        const result = await response.json();
        alert(`Thêm sản phẩm thành công: mã sản phẩm --> ${result.productID}`);

        // Optionally refresh the product list
        fetchProducts();

        // Close the modal
        closeAddProductModal();

    } catch (error) {
        console.error("Error adding product:", error);
        alert("Failed to add product. Please try again.");
    }

}

async function addProductVariation(event) {
    event.preventDefault();

    const productID = parseInt(document.getElementById("productId").value, 10);
    const originPrice = parseFloat(document.getElementById("originPrice").value);
    const size = document.getElementById("size").value;

    const requestBody = {
        productID,
        originPrice,
        size
    };

    try {
        const response = await fetch(`${baseUrl}/createVariation`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(`Error: ${errorResponse.message}`);
        }

        const result = await response.json();
        console.log(result);

        const errorSameVariation = "A variation with the same size already exists for this product.";
        const errorInconsistVariation1 = "Cannot add default size (D) because specific size variations already exist";
        const errorInconsistVariation2 = "Cannot add size S because a default size (D) variation already exists";
        
        if (result.status === "Failed"){
            if(result.message.includes(errorSameVariation)){
                alert(`Sản phẩm này đã có size ${size}`);
            } else if (result.message.includes(errorInconsistVariation1)) {
                alert(`Sản phẩm này đã có size cụ thể nên không thể thêm size mặc định (D)`);
            } else if (result.message.includes(errorInconsistVariation2)) {
                alert(`Sản phẩm này đã có size mặc định (D) nên không thể thêm size cụ thể`);
            } else {
                alert(result.message);
            }
        } else {
            alert(`Thêm biến thể sản phẩm thành công: mã biến thể --> ${result.id}`);
            closeAddProductVariationModal();
        }
    } catch (error) {
        console.error("Error adding product variation:", error);
        alert("Failed to add product variation. Please try again.");
    }
}


// Call the displayProducts function when the page loads
// document.addEventListener("DOMContentLoaded", () => {
//     displayProducts(products);
// });

document.addEventListener("DOMContentLoaded", fetchProducts);


