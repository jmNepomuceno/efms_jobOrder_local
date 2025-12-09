<?php
include('../../session.php');  // adjust path if needed
include('../../assets/connection.php'); // use your $pdo connection

header("Content-Type: application/json");

try {
    // Fetch all updates
    $sql = "SELECT * FROM updates ORDER BY id ASC";
    $stmt = $pdo->query($sql);
    $updates = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $updates
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>
