<?php
include('../../session.php');
include('../../assets/connection.php');

header("Content-Type: application/json");

try {
    $sql = "SELECT * FROM concerns WHERE userID = ? ORDER BY concernID DESC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$_SESSION['user']]);

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $data
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>
