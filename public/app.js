const API_URL = "";

/* ================= LOGIN ================= */
async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (res.ok && data.token) {
    localStorage.setItem("token", data.token);
    window.location.href = "dashboard.html";
  } else {
    document.getElementById("error").innerText =
      data.message || "Login failed";
  }
}

/* ================= FETCH EMPLOYEES ================= */
async function fetchEmployees() {
  const token = localStorage.getItem("token");

  if (!token) return;

  const res = await fetch("/api/employees", {
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  const employees = await res.json();
  const list = document.getElementById("employeeList");
  list.innerHTML = "";

  employees.forEach(emp => {
    const li = document.createElement("li");

    li.innerHTML = `
      <b>${emp.name}</b> (${emp.department}) - ₹${emp.salary}
      <br>
      <button onclick="editEmployee(
        '${emp._id}',
        '${emp.name}',
        '${emp.email}',
        '${emp.department}',
        '${emp.salary}'
      )">Edit</button>
      <button onclick="deleteEmployee('${emp._id}')">Delete</button>
      <hr>
    `;

    list.appendChild(li);
  });
}

/* ================= EDIT ================= */
let selectedEmployeeId = null;

function editEmployee(id, name, email, department, salary) {
  selectedEmployeeId = id;

  document.getElementById("name").value = name;
  document.getElementById("email").value = email;
  document.getElementById("department").value = department;
  document.getElementById("salary").value = salary;
}

/* ================= ADD / UPDATE ================= */
async function addEmployee() {
  const token = localStorage.getItem("token");

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const department = document.getElementById("department").value.trim();
  const salary = document.getElementById("salary").value.trim();

  if (!name || !email || !department || !salary) {
    alert("All fields are required");
    return;
  }

  const employeeData = {
    name,
    email,
    department,
    salary: Number(salary)
  };

  let url = "/api/employees";
  let method = "POST";

  if (selectedEmployeeId) {
    url = `/api/employees/${selectedEmployeeId}`;
    method = "PUT";
  }

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify(employeeData)
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "Operation failed");
    return;
  }

  // reset form
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("department").value = "";
  document.getElementById("salary").value = "";
  selectedEmployeeId = null;

  fetchEmployees();
}

/* ================= DELETE ================= */
async function deleteEmployee(id) {
  const token = localStorage.getItem("token");

  await fetch(`/api/employees/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  fetchEmployees();
}

/* ================= LOGOUT ================= */
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

/* ================= AUTO LOAD ================= */
if (window.location.pathname.includes("dashboard")) {
  fetchEmployees();
}
