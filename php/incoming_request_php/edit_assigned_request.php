<?php
include('../../session.php');
include('../../assets/connection.php'); // your PDO connection

header('Content-Type: application/json');

try {
    // Collect POST data
    $requestNo = $_POST['requestNo'] ?? null;
    $assignDescription = $_POST['assignDescription'] ?? '';
    $assignTargetStartDate = $_POST['assignStartDate'] ?? '';
    $assignTargetEndDate = $_POST['assignEndDate'] ?? '';
    $assignTo = $_POST['assignTo'] ?? '';
    $assignToBioID = $_POST['assignToBioID'] ?? '';
    $assignBy = $_SESSION['name'] ?? '';
    $technicians = json_decode($_POST['technicians'] ?? '[]', true); // array of additional techs

    if (!$requestNo) {
        throw new Exception("Request number is required.");
    }

    $pdo->beginTransaction();

    // 1. Update main job_order_request assigned fields
    $sql = "UPDATE job_order_request 
            SET assignDescription = ?, 
                assignTargetStartDate = ?, 
                assignTargetEndDate = ?, 
                assignTo = ?, 
                assignToBioID = ?, 
                assignBy = ?
            WHERE requestNo = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $assignDescription,
        $assignTargetStartDate,
        $assignTargetEndDate,
        $assignTo,
        $assignToBioID,
        $assignBy,
        $requestNo
    ]);

    // 2. Handle additional technicians
    if (!empty($technicians)) {
        // Optionally delete old additional techs for this request first
        $stmtDelete = $pdo->prepare("DELETE FROM job_order_assigned_techs WHERE requestNo = ?");
        $stmtDelete->execute([$requestNo]);

        // Insert new ones
        $stmtInsert = $pdo->prepare("INSERT INTO job_order_assigned_techs 
            (requestNo, techBioID, techName, remarks, targetStart, targetEnd, assignedBy, assignedDate)
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())");

        foreach ($technicians as $tech) {
            $stmtInsert->execute([
                $requestNo,
                $tech['bioID'] ?? null,
                $tech['name'] ?? '',
                $tech['remarks'] ?? '',
                $tech['targetStart'] ?? null,
                $tech['targetEnd'] ?? null,
                $assignBy
            ]);
        }
    }

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'message' => "Assigned request updated successfully."
    ]);

} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
