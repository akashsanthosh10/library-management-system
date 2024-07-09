<?php
// Retrieve the bookId and userId from the AJAX request
$bookId = $_POST['bookId'];
$userId = $_POST['userId'];

// Check if the book is in the user's wishlist
$isInWishlist = checkWishlist($bookId, $userId);

// Prepare the response object
$response = array();
$response['status'] = 'success';
$response['inWishlist'] = $isInWishlist;

// Return the response as JSON
echo json_encode($response);

// Function to check if the book is in the user's wishlist
function checkWishlist($bookId, $userId) {
  // Connect to the database
  $conn = mysqli_connect("localhost", "root", "", "librarymanagementsystem");

  // Check if the connection was successful
  if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
  }

  // Prepare the SQL statement to check if the book is in the wishlist
  $sql = "SELECT * FROM wishlist WHERE bookid = '$bookId' AND userid = '$userId'";

  // Execute the query
  $result = mysqli_query($conn, $sql);

  // Check if any rows were returned
  $numRows = mysqli_num_rows($result);

  // Close the database connection
  mysqli_close($conn);

  // Return true if the book is in the wishlist, false otherwise
  return ($numRows > 0);
}
?>
