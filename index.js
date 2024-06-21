document.addEventListener("DOMContentLoaded", () => {
  // Fetch data from the API when the page loads
  fetchEmployees();

  // Add event listener to the 'Thêm nhân viên' button
  document.getElementById("btnThemNV").addEventListener("click", addEmployee);
});

function fetchEmployees() {
  fetch("https://66753bf2a8d2b4d072ef3584.mockapi.io/api")
    .then((response) => response.json())
    .then((data) => {
      renderEmployees(data);
    })
    .catch((error) => console.error("Error fetching employees:", error));
}

const positionNames = {
  1: "Nhân viên",
  2: "Quản lý",
  3: "Giám đốc",
  // Thêm các chức vụ khác nếu cần thiết
};

function renderEmployees(employees) {
  const tableBody = document.getElementById("tblNhanVien");
  tableBody.innerHTML = ""; // Clear existing table content

  employees.forEach((employee) => {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${employee.maNV}</td>
        <td>${employee.tenNV}</td>
        <td>${positionNames[employee.chucVu]}</td>
        <td>${employee.luongCoBan}</td>
        <td>${employee.gioLam}</td>
        <td>${calculateTotalSalary(employee.luongCoBan, employee.gioLam)}</td>
        <td>${evaluateEmployee(employee.gioLam)}</td>
        <td>        
          <button class="btn btn-danger" onclick="deleteEmployee(${
            employee.id
          })">Delete</button>
        </td>
      `;

    tableBody.appendChild(row);
  });
}

function calculateTotalSalary(luongCoBan, gioLam) {
  // Implement your logic to calculate total salary
  return luongCoBan * gioLam; // Example calculation
}

function evaluateEmployee(gioLam) {
  // Implement your logic to evaluate employee based on working hours
  if (gioLam >= 120) {
    return "Nhân viên xuất sắc";
  } else if (gioLam >= 90) {
    return "Nhân viên giỏi";
  } else {
    return "Nhân viên trung bình";
  }
}

function addEmployee() {
  const maNV = document.getElementById("txtMaNV").value;
  const tenNV = document.getElementById("txtTenNV").value;
  const chucVu = document.getElementById("chucVu").value;
  const luongCoBan = document.getElementById("txtLuongCoBan").value;
  const gioLam = document.getElementById("txtGioLam").value;

  const isValid = validateForm(maNV, tenNV, chucVu, luongCoBan, gioLam);

  if (isValid) {
    const newEmployee = {
      maNV,
      tenNV,
      chucVu,
      luongCoBan,
      gioLam,
    };

    fetch("https://66753bf2a8d2b4d072ef3584.mockapi.io/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEmployee),
    })
      .then((response) => response.json())
      .then((data) => {
        fetchEmployees(); // Refresh the employee list
        clearForm();
      })
      .catch((error) => console.error("Error adding employee:", error));
  }
}

function clearForm() {
  document.getElementById("txtMaNV").value = "";
  document.getElementById("txtTenNV").value = "";
  document.getElementById("chucVu").value = "1";
  document.getElementById("txtLuongCoBan").value = "";
  document.getElementById("txtGioLam").value = "";

  // Clear all error messages
  document.getElementById("errorMaNV").innerText = "";
  document.getElementById("errorTenNV").innerText = "";
  document.getElementById("errorChucVu").innerText = "";
  document.getElementById("errorLuongCoBan").innerText = "";
  document.getElementById("errorGioLam").innerText = "";
}

function deleteEmployee(id) {
  fetch(`https://66753bf2a8d2b4d072ef3584.mockapi.io/api/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      fetchEmployees(); // Refresh the employee list
    })
    .catch((error) => console.error("Error deleting employee:", error));
}

function validateForm(maNV, tenNV, chucVu, luongCoBan, gioLam) {
  let isValid = true;

  // Validate Mã nhân viên
  if (!maNV || !/^\d{4,6}$/.test(maNV)) {
    document.getElementById("errorMaNV").innerText =
      "Mã nhân viên từ 4 đến 6 chữ số";
    isValid = false;
  } else {
    document.getElementById("errorMaNV").innerText = "";
  }

  // Validate Tên nhân viên
  if (!tenNV || !/^[a-zA-Z\u00C0-\u017F\s]+$/.test(tenNV)) {
    document.getElementById("errorTenNV").innerText =
      "Tên nhân viên chỉ được chứa chữ cái và không được để trống";
    isValid = false;
  } else {
    document.getElementById("errorTenNV").innerText = "";
  }

  // Validate Chức vụ
  if (!chucVu) {
    document.getElementById("errorChucVu").innerText =
      "Chức vụ không được để trống";
    isValid = false;
  } else {
    document.getElementById("errorChucVu").innerText = "";
  }

  // Validate Lương cơ bản
  if (
    !luongCoBan ||
    isNaN(luongCoBan) ||
    luongCoBan < 1000000 ||
    luongCoBan > 20000000
  ) {
    document.getElementById("errorLuongCoBan").innerText =
      "Lương cơ bản phải là số từ 1,000,000 đến 20,000,000";
    isValid = false;
  } else {
    document.getElementById("errorLuongCoBan").innerText = "";
  }

  // Validate Số giờ làm
  if (!gioLam || isNaN(gioLam) || gioLam < 50 || gioLam > 150) {
    document.getElementById("errorGioLam").innerText =
      "Số giờ làm trong tháng phải là số từ 50 đến 150";
    isValid = false;
  } else {
    document.getElementById("errorGioLam").innerText = "";
  }

  return isValid;
}
