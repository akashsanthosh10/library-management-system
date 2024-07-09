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
$userId = $_GET['userId']; // Retrieve the user_id from the query parameters
// Fetch the currently issued books data with book title
// Fetch the currently issued books data with book title for the specified user
$sql = "SELECT i.book_id, b.book_name, i.issue_date, i.due_date, r.return_date
FROM issued_books i
LEFT JOIN returned_books r ON i.issue_id = r.issue_id
INNER JOIN books b ON i.book_id = b.book_id
WHERE i.user_id = ?";
$stmt = mysqli_prepare($connection, $sql);
mysqli_stmt_bind_param($stmt, "i", $userId);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if ($result) {
    $books = array();
    
    // Fetch each row from the result set
    while ($row = mysqli_fetch_assoc($result)) {
        $books[] = $row;
    }
    
    // Send the JSON response
    header('Content-Type: application/json');
    echo json_encode($books);
} else {
    // Error occurred while fetching the data
    $response = ['error' => 'Failed to fetch currently issued books'];
    
    // Send the JSON response
    header('Content-Type: application/json');
    echo json_encode($response);
}

// Close the database connection
mysqli_close($connection);
?>
