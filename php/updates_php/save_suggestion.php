<?php
include('../../session.php');
include('../../assets/connection.php');
header("Content-Type: application/json");

// Only logged-in users can submit
if (!isset($_POST['details']) || empty(trim($_POST['details']))) {
    echo json_encode(["success" => false, "message" => "Suggestion details are required."]);
    exit;
}

$user_name = $_SESSION['name'];
$details = trim($_POST['details']);

// Generate unique request number: SR-YYYYMMDD-XXX
$datePart = date("Ymd");
try {
    // Count how many suggestions today already exist
    $stmtCount = $pdo->prepare("SELECT COUNT(*) AS cnt FROM suggestions WHERE DATE(created_at) = CURDATE()");
    $stmtCount->execute();
    $countToday = $stmtCount->fetch(PDO::FETCH_ASSOC)['cnt'] + 1;

    $req_no = sprintf("SR-%s-%03d", $datePart, $countToday);

    $stmt = $pdo->prepare("INSERT INTO suggestions (req_no, user_name, details) VALUES (?, ?, ?)");
    $stmt->execute([$req_no, $user_name, $details]);

    echo json_encode(["success" => true, "req_no" => $req_no]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
