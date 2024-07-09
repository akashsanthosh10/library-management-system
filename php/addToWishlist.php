<?php
$userId = $_POST['userid'];
$bookId = $_POST['bookid'];

// Database configuration
$host = 'localhost'; // Change this to your database host
$username = 'root'; // Change this to your database username
$password = ''; // Change this to your database password
$database = 'librarymanagementsystem'; // Change this to your database name

try {
  // Establish a database connection
  $conn = new PDO("mysql:host=$host;dbname=$database;charset=utf8mb4", $username, $password);
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  // Prepare and execute the INSERT query
  $stmt = $conn->prepare("INSERT INTO wishlist (bookid, userid, added_date) VALUES (:bookId, :userId, NOW())");
  $stmt->bindParam(':bookId', $bookId);
  $stmt->bindParam(':userId', $userId);
  $wishlistStatus = $stmt->execute();

  // Prepare the response data
  $response = array();
  if ($wishlistStatus) {
    $response['status'] = 'success';
    $response['message'] = 'Book added to wishlist';
  } else {
    $response['status'] = 'error';
    $response['message'] = 'Failed to add book to wishlist';
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
