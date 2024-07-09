<?php
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

$userId = $_GET['userId'];

// Prepare the SQL query
$query = "SELECT books.book_id, books.book_name, books.author_name, books.publication_year
FROM books
INNER JOIN wishlist ON books.book_id = wishlist.bookid
WHERE wishlist.userId = ?";

// Prepare the statement
$stmt = mysqli_prepare($connection, $query);

// Bind the parameter
mysqli_stmt_bind_param($stmt, "s", $userId);

// Execute the statement
mysqli_stmt_execute($stmt);

// Get the result set
$result = mysqli_stmt_get_result($stmt);

$books = array();

// Process each row of the result set
while ($row = mysqli_fetch_assoc($result)) {
    // Store the book information in an array
    $book = array(
        'bookId' => $row['book_id'],
        'bookName' => $row['book_name'],
        'author' => isset($row['author_name']) ? $row['author_name'] : '',
        'publishYear' => isset($row['publication_year']) ? $row['publication_year'] : ''
    );

    // Add the book to the array of books
    $books[] = $book;
}

// Close the statement
mysqli_stmt_close($stmt);

// Close the database connection
mysqli_close($connection);

// Send the book data as JSON response
header('Content-Type: application/json');
echo json_encode($books);
exit;
?>
