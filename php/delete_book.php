<?php
// Assuming you have a database connection established
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database configuration
$host = 'localhost'; // Change this to your database host
$username = 'root'; // Change this to your database username
$password = ''; // Change this to your database password
$database = 'librarymanagementsystem'; // Change this to your database name

// Establish a database connection
$connection = mysqli_connect($host, $username, $password, $database);

// Check if the connection was successful
if (!$connection) {
    die('Database connection failed: ' . mysqli_connect_error());
}

// Check if the request method is DELETE
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Get the book ID from the request parameters or body
    $bookId = $_GET['bookId']; // Assuming the book ID is passed as a query parameter

    // Perform the delete operation
    // Replace 'books' with the actual table name where your books are stored
    $sql = "DELETE FROM books WHERE book_id = ?";
    $stmt = mysqli_prepare($connection, $sql);
    mysqli_stmt_bind_param($stmt, "i", $bookId);
    mysqli_stmt_execute($stmt);

    // Check the affected rows to determine if the delete was successful
    $rowCount = mysqli_stmt_affected_rows($stmt);
    if ($rowCount > 0) {
        // Book deleted successfully
        $response = ['success' => true];
    } else {
        // Book not found or deletion failed
        $response = ['success' => false, 'error' => 'Book not found or deletion failed'];
    }

    // Send the JSON response
    header('Content-Type: application/json');
    echo json_encode($response);
}
?>
