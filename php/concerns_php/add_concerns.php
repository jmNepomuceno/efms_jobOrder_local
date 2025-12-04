<?php
include ('../../session.php');
include ('../../assets/connection.php');

require "../../vendor/autoload.php";
use WebSocket\Client;

header("Content-Type: application/json");

// Validate input
if (empty($_POST['concernTitle']) || empty($_POST['concernDescription'])) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

$title = trim($_POST['concernTitle']);
$description = trim($_POST['concernDescription']);

try {

    // Insert concern
    $sql = "INSERT INTO concerns 
            (userID, userName, concernTitle, concernDescription, concernStatus)
            VALUES (?, ?, ?, ?, 'Pending')";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $_SESSION['user'],
        $_SESSION['name'],
        $title,
        $description
    ]);

    $insert_id = $pdo->lastInsertId();

    // WebSocket notify admin
    try {
        $client = new Client("ws://192.168.42.14:8082");
        $client->send(json_encode(["action" => "refreshConcernsList"]));
    } catch (Exception $wsError) {
        // Do not block concern saving if WebSocket fails
    }

    echo json_encode([
        "success" => true,
        "insert_id" => $insert_id
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "DB Error: " . $e->getMessage()
    ]);
    exit;
}
?>
