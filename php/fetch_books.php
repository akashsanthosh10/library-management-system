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

$searchTerm = $_GET['search'] ?? '';

// Prepare the SQL query
$query = "SELECT * FROM books WHERE 
              book_name LIKE '%$searchTerm%' OR 
              author_name LIKE '%$searchTerm%' OR 
              publication_year LIKE '%$searchTerm%'";
$result = mysqli_query($connection, $query);

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

// Close the database connection
mysqli_close($connection);

// Send the book data as JSON response
header('Content-Type: application/json');
echo json_encode($books);
exit;
?>
