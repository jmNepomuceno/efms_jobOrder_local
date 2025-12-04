<?php
include ('../../session.php');
include('../../assets/connection.php');

try {
    $sql = "SELECT 
                SUM(CASE WHEN requestStatus = 'Pending' THEN 1 ELSE 0 END) AS count_pending,
                SUM(CASE WHEN requestStatus = 'Assigned' THEN 1 ELSE 0 END) AS count_assigned,
                SUM(CASE WHEN requestStatus = 'On-Process' THEN 1 ELSE 0 END) AS count_onProcess,
                SUM(CASE WHEN requestStatus = 'Correction' THEN 1 ELSE 0 END) AS count_correction,
                SUM(CASE WHEN requestStatus = 'Pending Materials' THEN 1 ELSE 0 END) AS count_pendingMaterials,
                SUM(CASE WHEN requestStatus = 'For Schedule' THEN 1 ELSE 0 END) AS count_forSchedule,
                SUM(CASE WHEN requestStatus = 'Returned Request' THEN 1 ELSE 0 END) AS count_returned,
                SUM(CASE WHEN requestStatus = 'Evaluation' THEN 1 ELSE 0 END) AS count_evaluation,
                SUM(CASE WHEN requestStatus = 'Completed' THEN 1 ELSE 0 END) AS count_completed
            FROM job_order_request WHERE CAST(JSON_EXTRACT(requestBy, '$.bioID') AS UNSIGNED) = ?";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$_SESSION['user']]);
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode($data); // Send JSON response

} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

?>
