<?php
// Start the session
include('../session.php');
include('../assets/connection.php');

// Unset all session variables
$_SESSION = [];

// Destroy the session
session_destroy();

// Optionally, delete the session cookie if it exists
// if (ini_get("session.use_cookies")) {
//     $params = session_get_cookie_params();
//     setcookie(
//         session_name(), // Cookie name
//         '',            // Empty value
//         time() - 42000, // Expire in the past
//         $params["path"], 
//         $params["domain"], 
//         $params["secure"], 
//         $params["httponly"]
//     );
// }

// Redirect the user to the login page or homepage
echo "../";