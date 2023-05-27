const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');

const app = express();

// Load student data from CSV file
const students = [];
fs.createReadStream('students.csv')
  .pipe(csv())
  .on('data', (data) => students.push(data))
  .on('end', () => console.log('Loaded student data'));

// Define API endpoint for loading student details with pagination
app.get('/students', (req, res) => {
  // Get page number and page size from query parameters
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.page_size) || 5;

  // Calculate start and end indices for pagination
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // Get paginated student data
  const paginatedStudents = students.slice(startIndex, endIndex);

  // Return paginated student data as JSON response
  res.json(paginatedStudents);
});

// Define API endpoint for server-side filtering
app.post('/students/filter', (req, res) => {
  // Get filter criteria from request body
  const { column, operator, value } = req.body;

  // Filter student data based on filter criteria
  const filteredStudents = students.filter((student) => {
    switch (operator) {
      case '>':
        return parseInt(student[column]) > parseInt(value);
      case '<':
        return parseInt(student[column]) < parseInt(value);
      case '>=':
        return parseInt(student[column]) >= parseInt(value);
      case '<=':
        return parseInt(student[column]) <= parseInt(value);
      case '=':
        return student[column] === value;
      default:
        return false;
    }
  });

  // Return filtered student data as JSON response
  res.json(filteredStudents);
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));
