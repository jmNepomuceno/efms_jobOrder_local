<?php
include('../../session.php');          // user session
include('../../assets/connection.php'); // provides $pdo (PDO connection)

header("Content-Type: application/json");

try {
    // Validate input
    if (!isset($_POST['id']) || !isset($_POST['status'])) {
        echo json_encode([
            "success" => false,
            "message" => "Missing required fields."
        ]);
        exit;
    }

    $id = $_POST['id'];
    $status = $_POST['status'];

    // Update query
    $sql = "UPDATE updates SET status = :status WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ":status" => $status,
        ":id" => $id
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Status updated successfully."
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>
