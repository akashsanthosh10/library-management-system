<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Retrieve the name, email, and password from the request
$name = $_POST['name'];
$email = $_POST['email'];
$userPassword = $_POST['password'];

// Perform database insert
// Replace with your own logic to insert the data into the MySQL database
$host = 'localhost';
$dbname = 'librarymanagementsystem';
$username = 'root';
$dbPassword = '';

try {
  // Connect to the MySQL database
  $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $dbPassword);

  // Prepare and execute the query
  $stmt = $pdo->prepare('INSERT INTO user (user_name, user_email, user_password) VALUES (:name, :email, :password)');
  $stmt->execute([
    'name' => $name,
    'email' => $email,
    'password' => $userPassword
  ]);

  // Return success response to the client
  $response = ['success' => true];
  echo json_encode($response);
} catch (PDOException $e) {
  // Return error response to the client
  $response = ['success' => false, 'message' => 'Error occurred during signup.'];
  echo json_encode($response);
}
?>
