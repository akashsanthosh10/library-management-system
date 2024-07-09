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

$query = "SELECT issue_id, book_id, user_id, issue_date, due_date,  status
          FROM issued_books WHERE status = 'issued'";

$result = mysqli_query($connection, $query);

if (!$result) {
    // Handle the query error
    die("Query failed: " . mysqli_error($connection));
}

$books = array();

while ($row = mysqli_fetch_assoc($result)) {
    $book = array(
        "issueId" => $row['issue_id'],
        "bookId" => $row['book_id'],
        "userId" => $row['user_id'],
        "issueDate" => $row['issue_date'],
        "dueDate" => $row['due_date'],
        "status" => $row['status']
    );

    $books[] = $book;
}

// Convert the array to JSON format
$booksJson = json_encode($books);

// Set the response content type to JSON
header("Content-type: application/json");

// Send the JSON response
echo $booksJson;
?>
