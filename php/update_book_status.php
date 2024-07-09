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

// Retrieve the issueId and returnDate from the POST request
$issueId = $_POST['issueId'];
$returnDate = $_POST['returnDate'];
$status = $_POST['status'];
// Convert the date format from 'dd-mm-yyyy' to 'yyyy-mm-dd'
$formattedDate = date('Y-m-d', strtotime($returnDate));

// Update the status in the "issued_books" table
$queryUpdateStatus = "UPDATE issued_books SET status = '$status' WHERE issue_id = $issueId";

$resultUpdateStatus = mysqli_query($connection, $queryUpdateStatus);

if (!$resultUpdateStatus) {
    // Handle the query error
    die("Query failed: " . mysqli_error($connection));
}

// Insert data into the "returned_books" table
$queryInsertReturned = "INSERT INTO returned_books (issue_id, return_date) VALUES ('$issueId', '$formattedDate')";

$resultInsertReturned = mysqli_query($connection, $queryInsertReturned);

if (!$resultInsertReturned) {
    // Handle the query error
    die("Query failed: " . mysqli_error($connection));
}

// Close the database connection
mysqli_close($connection);

// Send a success response
$response = array('message' => 'Book return added successfully');
echo json_encode($response);
?>
