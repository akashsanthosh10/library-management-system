<?php
// Get the form data
$newBookName = $_POST['newBookName'];
$newBookAuthor = $_POST['newBookAuthor'];
$newBookPublishYear = $_POST['newBookPublishYear'];

// Create a new MySQLi instance (replace the database credentials with your own)
$mysqli = new mysqli('localhost', 'root', '', 'librarymanagementsystem');

// Check for connection errors
if ($mysqli->connect_errno) {
    $response = array('status' => 'error', 'message' => 'Failed to connect to MySQL: ' . $mysqli->connect_error);
    echo json_encode($response);
    exit();
}

// Prepare the SQL statement
$stmt = $mysqli->prepare('INSERT INTO books (book_name, author_name, publication_year) VALUES (?, ?, ?)');

// Bind the parameters to the statement
$stmt->bind_param('sss', $newBookName, $newBookAuthor, $newBookPublishYear);

// Execute the statement
if ($stmt->execute()) {
    $response = array('status' => 'success', 'message' => 'Book inserted successfully.');
    echo json_encode($response);
} else {
    $response = array('status' => 'error', 'message' => 'Error inserting book: ' . $stmt->error);
    echo json_encode($response);
}

// Close the statement and the database connection
$stmt->close();
$mysqli->close();
?>
