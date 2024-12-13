const baseUrl = "http://localhost:3000/api/promotion";

async function createDiscount() {
  // Get input values from the form
  const contentPromo = document.getElementById("contentPromo").value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  // Validate inputs
  if (!contentPromo || !startDate || !endDate) {
    alert("Hãy điền đủ thông tin.!");
    return;
  }

  // Prepare the request body
  const requestBody = {
    content: contentPromo,
    start_date: startDate,
    end_date: endDate,
  };

  try {
    // Make the API request
    const response = await fetch(`${baseUrl}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    // Parse the response
    const result = await response.json();
    console.log("result >>>", result);

    if (response.ok) {
      // Show success message and update the summary
      alert("Tạo khuyến mãi thành công!");
      const promoSummary = document.getElementById("promoSummary");
      promoSummary.style.display = "block";
      console.log("result >>>", result);
      document.getElementById("summaryCode").textContent =
        result[0].id || "N/A"; // Assuming API returns an ID
      document.getElementById("summaryDescription").textContent =
        requestBody.content;
      document.getElementById("summaryStartDate").textContent =
        requestBody.start_date;
      document.getElementById("summaryEndDate").textContent =
        requestBody.end_date;

      // Clear form inputs
      document.getElementById("contentPromo").value = "";
      document.getElementById("startDate").value = "";
      document.getElementById("endDate").value = "";
    } else {
      // Handle API errors
      alert(
        `Tạo khuyến mãi thất bại: ngày bắt đầu không được sau ngày kết thúc`
      );
    }
  } catch (error) {
    // Handle network or unexpected errors
    console.error("Error creating discount:", error);
    alert("Đã xảy ra lỗi khi tạo khuyến mãi. Vui lòng thử lại.");
  }
}

function showCreateDiscount() {
  document.getElementById("createDiscountForm").style.display = "block";
  document.getElementById("applyDiscountForm").style.display = "none";
  document.getElementById("updatePromotionForm").style.display = "none";
  document.getElementById("deletePromotionForm").style.display = "none";
  document.getElementById("showPromotionList").style.display = "none";

  document.getElementById("createDiscountBtn").classList.add("active");
  document.getElementById("applyDiscountBtn").classList.remove("active");
  document.getElementById("updateDiscountBtn").classList.remove("active");
  document.getElementById("deleteDiscountBtn").classList.remove("active");
  document.getElementById("showPromotionListBtn").classList.remove("active");
}

function showApplyDiscount() {
  document.getElementById("applyDiscountForm").style.display = "block";
  document.getElementById("createDiscountForm").style.display = "none";
  document.getElementById("updatePromotionForm").style.display = "none";
  document.getElementById("deletePromotionForm").style.display = "none";
  document.getElementById("showPromotionList").style.display = "none";

  document.getElementById("applyDiscountBtn").classList.add("active");
  document.getElementById("createDiscountBtn").classList.remove("active");
  document.getElementById("updateDiscountBtn").classList.remove("active");
  document.getElementById("deleteDiscountBtn").classList.remove("active");
  document.getElementById("showPromotionListBtn").classList.remove("active");
}
function showPromotionList() {
  document.getElementById("applyDiscountForm").style.display = "none";
  document.getElementById("createDiscountForm").style.display = "none";
  document.getElementById("updatePromotionForm").style.display = "none";
  document.getElementById("deletePromotionForm").style.display = "none";
  document.getElementById("showPromotionList").style.display = "block";

  document.getElementById("applyDiscountBtn").classList.remove("active");
  document.getElementById("createDiscountBtn").classList.remove("active");
  document.getElementById("updateDiscountBtn").classList.remove("active");
  document.getElementById("deleteDiscountBtn").classList.remove("active");
  document.getElementById("showPromotionListBtn").classList.add("active");

  fetchPromotionList();
}

async function applyDiscount() {
  const applyCode = document.getElementById("applyCode").value;
  const productId = document.getElementById("productId").value;
  const discount = document.getElementById("discount").value;
  const condition = document.getElementById("condition").value;

  if (!applyCode || !productId || !discount) {
    alert("Hãy nhập đủ thông tin mã khuyến mãi, mã sản phẩm, và mức giảm giá.");
    return;
  }

  // Prepare the request body
  const requestBody = {
    promotionID: parseInt(applyCode, 10),
    productID: parseInt(productId, 10),
    discountRate: parseInt(discount, 10),
    useCondition: condition || "", // Optional field
  };

  try {
    const response = await fetch(`${baseUrl}/apply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();
    console.log("Apply discount result:", result);

    if (response.ok && result.status === "Success") {
      // Show success message and update the summary
      alert("Khuyến mãi đã được áp dụng thành công!");
      document.getElementById("applySummary").style.display = "block";
      document.getElementById("applySummaryCode").textContent =
        requestBody.promotionID;
      console.log("res:", result.productName);
      const productName = result.productName;
      document.getElementById("applySummaryProduct").textContent =
        requestBody.productIDs[0] + " - (" + productName + ")";
      document.getElementById("applySummaryDiscount").textContent =
        requestBody.discountRate;
      document.getElementById("applySummaryCondition").textContent =
        requestBody.useCondition;

      // Clear form inputs
      document.getElementById("applyCode").value = "";
      document.getElementById("productId").value = "";
      document.getElementById("discount").value = "";
      document.getElementById("condition").value = "";
    } else {
      // Handle API errors
      alert(`Áp dụng khuyến mãi thất bại.}`);
    }
  } catch (error) {
    console.error("Error applying discount:", error);
    alert("Đã xảy ra lỗi khi áp dụng khuyến mãi. Vui lòng thử lại.");
  }
}

function showUpdatePromotion() {
  document.getElementById("updatePromotionForm").style.display = "block";
  document.getElementById("createDiscountForm").style.display = "none";
  document.getElementById("applyDiscountForm").style.display = "none";
  document.getElementById("deletePromotionForm").style.display = "none";
  document.getElementById("showPromotionList").style.display = "none";

  document.getElementById("updateDiscountBtn").classList.add("active");
  document.getElementById("createDiscountBtn").classList.remove("active");
  document.getElementById("applyDiscountBtn").classList.remove("active");
  document.getElementById("deleteDiscountBtn").classList.remove("active");
  document.getElementById("showPromotionListBtn").classList.remove("active");
}

async function updatePromotion() {
  const promotionID = document.getElementById("updatePromotionID").value;
  const content = document.getElementById("updateContent").value;
  const start_date = document.getElementById("updateStartDate").value;
  const end_date = document.getElementById("updateEndDate").value;
  const discountRate = document.getElementById("updateDiscountRate").value;

  if (!promotionID) {
    alert("Please enter the Promotion ID.");
    return;
  }

  const requestBody = {
    promotionID: parseInt(promotionID, 10),
    updates: {
      content: content || undefined,
      start_date: start_date || undefined,
      end_date: end_date || undefined,
      discountRate: discountRate ? parseInt(discountRate, 10) : undefined,
    },
  };

  try {
    const response = await fetch("http://localhost:3000/api/promotion/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();
    console.log("Update promotion result:", result);

    if (response.ok && result.status === "Success") {
      alert("Cập nhật thông tin khuyến mãi thành công!");
      // Clear form inputs
      document.getElementById("updatePromotionID").value = "";
      document.getElementById("updateContent").value = "";
      document.getElementById("updateStartDate").value = "";
      document.getElementById("updateEndDate").value = "";
      document.getElementById("updateDiscountRate").value = "";
    } else {
      alert(
        `Cập nhật thông tin khuyến mãi thất bại: ${
          result.message || "Unknown error"
        }`
      );
    }
  } catch (error) {
    console.error("Error updating promotion:", error);
    alert("An error occurred while updating the promotion. Please try again.");
  }
}

function showDeletePromotion() {
  document.getElementById("deletePromotionForm").style.display = "block";
  document.getElementById("createDiscountForm").style.display = "none";
  document.getElementById("applyDiscountForm").style.display = "none";
  document.getElementById("updatePromotionForm").style.display = "none";
  document.getElementById("showPromotionList").style.display = "none";

  document.getElementById("deleteDiscountBtn").classList.add("active");
  document.getElementById("createDiscountBtn").classList.remove("active");
  document.getElementById("applyDiscountBtn").classList.remove("active");
  document.getElementById("updateDiscountBtn").classList.remove("active");
  document.getElementById("showPromotionListBtn").classList.remove("active");
}

async function deletePromotion() {
  const promotionID = document.getElementById("deletePromotionID").value;

  if (!promotionID) {
    alert("Please enter the Promotion ID.");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/promotion/delete?promotionID=${promotionID}`,
      {
        method: "DELETE",
      }
    );

    const result = await response.json();
    console.log("Delete promotion result:", result);

    if (response.ok) {
      alert("Thu hồi khuyến mãi thành công!");
      document.getElementById("deletePromotionID").value = "";
    } else {
      alert(`Failed to delete promotion: ${result.message || "Unknown error"}`);
    }
  } catch (error) {
    console.error("Error deleting promotion:", error);
    alert("An error occurred while deleting the promotion. Please try again.");
  }
}

async function fetchPromotionList() {
  const promotionTable = document.getElementById("promotionList");
  const showPromotionDiv = document.getElementById("showPromotionList");

  async function fetchPromotions() {
    try {
      // Gửi yêu cầu đến API
      const response = await fetch("http://localhost:3000/api/promotion/");
      if (!response.ok) {
        throw new Error("Failed to fetch promotions");
      }
      const promotions = await response.json();

      function formatDate(isoDate) {
        const date = new Date(isoDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Thêm '0' nếu tháng < 10
        const day = String(date.getDate()).padStart(2, "0"); // Thêm '0' nếu ngày < 10
        return `${year}-${month}-${day}`;
      }
      // Xóa nội dung cũ trong bảng
      promotionTable.innerHTML = "";

      // Thêm từng row với dữ liệu từ API
      promotions.forEach((promotion) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${promotion.id}</td>
            <td>${promotion.content}</td>
            <td>${formatDate(promotion.start_date)}</td>
            <td>${formatDate(promotion.end_date)}</td>
          `;
        promotionTable.appendChild(row);
      });

      // Hiển thị bảng khi có dữ liệu
      showPromotionDiv.style.display = "block";
    } catch (error) {
      console.error("Error fetching promotions:", error);
      alert("Failed to load promotions. Please try again later.");
    }
  }

  // Gọi API khi trang được tải
  await fetchPromotions();
}
