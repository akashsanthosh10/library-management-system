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

$query = "SELECT * FROM user";
$result = mysqli_query($connection, $query);

$users = array();

// Process each row of the result set
while ($row = mysqli_fetch_assoc($result)) {
    // Store the book information in an array
    $user = array(
        'userID' => $row['user_id'],
        'name' => $row['user_name'],
        'email' => $row['user_email']
    );

    // Add the book to the array of books
    $users[] = $user;
}

// Close the database connection
mysqli_close($connection);

// Send the book data as JSON response
header('Content-Type: application/json');
echo json_encode($users);
exit;

?>