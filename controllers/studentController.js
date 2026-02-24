const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/students.json");

// Helper function to read file
const readData = () => {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
};

// Helper function to write file
const writeData = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Add Student
exports.addStudent = (req, res) => {
    const students = readData();

    const newStudent = {
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
        course: req.body.course
    };

    students.push(newStudent);
    writeData(students);

    res.status(201).json(newStudent);
};

// Get All Students
exports.getAllStudents = (req, res) => {
    const students = readData();
    res.json(students);
};

// Get Student by ID
exports.getStudentById = (req, res) => {
    const students = readData();
    const student = students.find(s => s.id === req.params.id);

    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
};

// Update Student
exports.updateStudent = (req, res) => {
    const students = readData();
    const index = students.findIndex(s => s.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({ message: "Student not found" });
    }

    students[index] = { ...students[index], ...req.body };
    writeData(students);

    res.json(students[index]);
};

// Delete Student
exports.deleteStudent = (req, res) => {
    let students = readData();
    const filtered = students.filter(s => s.id !== req.params.id);

    if (students.length === filtered.length) {
        return res.status(404).json({ message: "Student not found" });
    }

    writeData(filtered);
    res.json({ message: "Student deleted successfully" });
};

// Search by Course
exports.searchByCourse = (req, res) => {
    const students = readData();
    const filtered = students.filter(
        s => s.course.toLowerCase() === req.query.course.toLowerCase()
    );

    res.json(filtered);
};