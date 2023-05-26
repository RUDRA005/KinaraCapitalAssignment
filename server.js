const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API route for loading student details with pagination
app.get('/api/students', (req, res) => {
  const { page, pageSize } = req.query;

  // Read student details from a file (e.g., students.json)
  fs.readFile('students.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to load student details' });
    }

    const studentData = JSON.parse(data);

    // Calculate the start and end indices for pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;

    // Retrieve the paginated subset of student data
    const paginatedStudents = studentData.slice(startIndex, endIndex);

    res.json({ data: paginatedStudents });
  });
});

// API route for server-side filtering
app.get('/api/students/filter', (req, res) => {
  const { id, name, totalMarks } = req.query;

  // Read student details from a file (e.g., students.json)
  fs.readFile('students.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to load student details' });
    }

    const studentData = JSON.parse(data);

    // Apply filters to the student data
    const filteredStudents = studentData.filter((student) => {
      let match = true;

      if (id && student.id !== parseInt(id)) {
        match = false;
      }
      if (name && !student.name.includes(name)) {
        match = false;
      }
      if (totalMarks && student.totalMarks !== parseInt(totalMarks)) {
        match = false;
      }

      return match;
    });

    res.json({ data: filteredStudents });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
