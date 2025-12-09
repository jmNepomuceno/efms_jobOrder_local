<?php
include("../../session.php");
include("../../assets/connection.php");

$requestNo = $_POST['requestNo'];

try {
    // Fetch assignment details from job_order_request
    $sql = "SELECT 
                assignDescription,
                assignTargetStartDate,
                assignTargetEndDate,
                assignTo,
                assignToBioID,
                assignBy
            FROM job_order_request
            WHERE requestNo = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$requestNo]);
    $assign = $stmt->fetch(PDO::FETCH_ASSOC);

    // Fetch all assigned technicians from job_order_assigned_techs
    $sql2 = "SELECT 
                techBioID AS bioID,
                techName AS name,
                remarks,
                targetStart,
                targetEnd,
                assignedBy,
                assignedDate
             FROM job_order_assigned_techs
             WHERE requestNo = ?";
    $stmt2 = $pdo->prepare($sql2);
    $stmt2->execute([$requestNo]);
    $techs = $stmt2->fetchAll(PDO::FETCH_ASSOC);

    // Return JSON
    echo json_encode([
        "assignDescription" => $assign['assignDescription'] ?? null,
        "assignTargetStartDate" => $assign['assignTargetStartDate'] ?? null,
        "assignTargetEndDate" => $assign['assignTargetEndDate'] ?? null,
        "assignTo" => $assign['assignTo'] ?? null,
        "assignToBioID" => $assign['assignToBioID'] ?? null,
        "assignBy" => $assign['assignBy'] ?? null,
        "technicians" => $techs
    ]);

} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
