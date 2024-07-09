<?php
$userId = $_POST['userId'];
$bookId = $_POST['bookId'];

// Database configuration
$host = 'localhost'; // Change this to your database host
$username = 'root'; // Change this to your database username
$password = ''; // Change this to your database password
$database = 'librarymanagementsystem'; // Change this to your database name

try {
  // Establish a database connection
  $conn = new PDO("mysql:host=$host;dbname=$database;charset=utf8mb4", $username, $password);
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  // Prepare and execute the DELETE query
  $stmt = $conn->prepare("DELETE FROM wishlist WHERE bookid = :bookId AND userid = :userId");
  $stmt->bindParam(':bookId', $bookId);
  $stmt->bindParam(':userId', $userId);
  $deleteStatus = $stmt->execute();

  // Prepare the response data
  $response = array();
  if ($deleteStatus) {
    $response['status'] = 'success';
    $response['message'] = 'Book deleted from wishlist';
  } else {
    $response['status'] = 'error';
    $response['message'] = 'Failed to delete book from wishlist';
  }
} catch (PDOException $e) {
  // Handle database connection errors
  $response['status'] = 'error';
  $response['message'] = 'Database connection error: ' . $e->getMessage();
}

// Send the JSON response
header('Content-Type: application/json');
echo json_encode($response);
?>
