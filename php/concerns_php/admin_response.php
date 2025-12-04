<?php
include('../../session.php');
include('../../assets/connection.php');

header("Content-Type: application/json");

// admin only
if ($_SESSION['user'] !== 3858) {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

if (!isset($_POST['concernID'], $_POST['responseText'])) {
    echo json_encode(["success" => false, "message" => "Missing parameters"]);
    exit;
}

try {
    $sql = "UPDATE concerns 
            SET adminResponse = ?, concernStatus = 'Responded'
            WHERE concernID = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$_POST['responseText'], $_POST['concernID']]);

    echo json_encode(["success" => true]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
