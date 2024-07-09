<?php
// issue_book.php

// Retrieve the form data sent via AJAX
$userId = $_POST['userid'];
$bookId = $_POST['bookid'];
$issueDate = date("Y-m-d", strtotime($_POST['issuedate']));
$dueDate = date("Y-m-d", strtotime($_POST['duedate']));
// Connect to the MySQL database (update with your database credentials)
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "librarymanagementsystem";

// Create a new PDO instance
try {
  $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  // Check if the book exists
  $stmt = $conn->prepare("SELECT COUNT(*) FROM books WHERE book_id = ?");
  $stmt->execute([$bookId]);
  $bookExists = ($stmt->fetchColumn() > 0);

  // Check if the user exists
  $stmt = $conn->prepare("SELECT COUNT(*) FROM user WHERE user_id = ?");
  $stmt->execute([$userId]);
  $userExists = ($stmt->fetchColumn() > 0);

  if (!$bookExists) {
    $response = [
      'status' => 'error',
      'message' => 'Book not found'
    ];
  } elseif (!$userExists) {
    $response = [
      'status' => 'error',
      'message' => 'User not found'
    ];
  } else {
    // Prepare the SQL statement for inserting the issued book details
    $stmt = $conn->prepare("INSERT INTO issued_books (book_id, user_id, issue_date, due_date, status) VALUES (?, ?, ?, ?,  'issued')");
    $stmt->execute([$bookId, $userId, $issueDate, $dueDate]);

    $response = [
      'status' => 'success',
      'message' => 'Book issued successfully'
    ];
  }

  // Close the database connection
  $conn = null;

  // Send the response back to the client
  echo json_encode($response);
} catch (PDOException $e) {
  // Handle any errors that occurred during the database connection or insertion
  $response = [
    'status' => 'error',
    'message' => 'Error: ' . $e->getMessage()
  ];
  echo json_encode($response);
}
?>
