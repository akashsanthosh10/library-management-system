<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Retrieve the email and password from the request
$email = $_POST['email'];
$password = $_POST['password'];

// Perform authentication and database check against the admin table
$host = 'localhost'; // Replace with your host name
$dbname = 'librarymanagementsystem'; // Replace with your database name
$username = 'root'; // Replace with your database username
$dbpassword = ''; // Replace with your database password

try {
  // Connect to the MySQL database
  $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $dbpassword);

  // Prepare and execute the query
  $stmt = $pdo->prepare('SELECT * FROM admin WHERE admin_email = :email AND admin_password = :password');
  $stmt->execute([
    'email' => $email,
    'password' => $password
  ]);

  // Check if a matching row is found
  if ($stmt->rowCount() > 0) {
    // Authentication successful
    // Set session or generate authentication token
    session_start();
    $_SESSION['authenticated'] = true;

    // Fetch the admin data
    $adminData = $stmt->fetch(PDO::FETCH_ASSOC);

// Create an array with the desired fields
$response = [
  'success' => true,
  'userData' => [
    'id' => $adminData['admin_id'],
    'username' => $adminData['admin_name'], // Use 'admin_name' as the username field
    'email' => $adminData['admin_email']
  ]
];

    // Send success response along with admin details to the client
    echo json_encode($response);
  } else {
    // Authentication failed
    // Send error response to the client
    echo json_encode(['success' => false, 'message' => 'An account with this email address does not exist!']);
  }
} catch (PDOException $e) {
  // Handle database connection errors
  echo json_encode(['success' => false, 'message' => 'Database error']);
}
?>
