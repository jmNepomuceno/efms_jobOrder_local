<?php
include('../../session.php');
include('../../assets/connection.php');

header("Content-Type: application/json");

// only admin allowed
if ($_SESSION['user'] !== 3858) {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

try {
    $sql = "
        SELECT * FROM concerns ORDER BY concernID DESC;
    ";
    $stmt = $pdo->query($sql);
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
