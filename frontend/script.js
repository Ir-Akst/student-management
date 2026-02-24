const API_URL = "http://localhost:5000/api/students";

let editId = null;

document.addEventListener("DOMContentLoaded", () => {
    fetchStudents();
});

async function fetchStudents() {
    const res = await fetch(API_URL);
    const students = await res.json();

    const container = document.getElementById("studentList");
    container.innerHTML = "";

    document.getElementById("studentCount").innerText =
        `Total: ${students.length}`;

    students.forEach(student => {
        const card = document.createElement("div");
        card.className = "student-card";

        card.innerHTML = `
            <p><strong>Name:</strong> ${student.name}</p>
            <p>Email: ${student.email}</p>
            <p>Age: ${student.age}</p>
            <p>Course: ${student.course}</p>

            <button onclick="editStudent('${student.id}')">Edit</button>
            <button onclick="deleteStudent('${student.id}')">Delete</button>
        `;

        container.appendChild(card);
    });
}

async function addStudent() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const age = document.getElementById("age").value;
    const course = document.getElementById("course").value;

    if (!name || !email || !age || !course) {
        alert("Fill all fields");
        return;
    }

    if (editId) {
        // UPDATE
        await fetch(`${API_URL}/${editId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, age, course })
        });

        editId = null;
        document.querySelector("button").innerText = "Add Student";

    } else {
        // ADD
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, age, course })
        });
    }

    clearForm();
    fetchStudents();
}

function editStudent(id) {
    fetch(`${API_URL}/${id}`)
        .then(res => res.json())
        .then(student => {
            document.getElementById("name").value = student.name;
            document.getElementById("email").value = student.email;
            document.getElementById("age").value = student.age;
            document.getElementById("course").value = student.course;

            editId = id;
            document.querySelector("button").innerText = "Update Student";
        });
}

async function deleteStudent(id) {
    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    fetchStudents();
}

function clearForm() {
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("age").value = "";
    document.getElementById("course").value = "";
}