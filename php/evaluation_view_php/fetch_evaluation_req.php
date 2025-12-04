<?php
include ('../../session.php');
include('../../assets/connection.php');

try {
    $sql = "SELECT requestNo, requestDate, requestBy, requestDescription, requestCategory, requestStatus, processedBy, requestStartDate, requestEvaluationDate, requestJobRemarks, processedByID, assignTo, assignToBioID, assignTargetStartDate, assignTargetEndDate
    FROM job_order_request 
    WHERE CAST(JSON_EXTRACT(requestBy, '$.bioID') AS UNSIGNED) = ? 
    AND requestStatus = 'Evaluation'";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$_SESSION['user']]);
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Step 1: Extract unique category codes
    $categoryCodes = array_unique(array_column($data, 'requestCategory'));
    $categoryDescriptions = [];

    if (!empty($categoryCodes)) {
    $placeholders = implode(',', array_fill(0, count($categoryCodes), '?'));

    $sql = "SELECT category_code, category_description 
            FROM efms_category 
            WHERE category_code IN ($placeholders)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($categoryCodes);
    $categoryDescriptions = $stmt->fetchAll(PDO::FETCH_KEY_PAIR); // ['code' => 'description']
    }

    // Step 2: Decode requestBy and map requestCategory
    foreach ($data as &$row) {
    if (!empty($row['requestBy'])) {
        $row['requestBy'] = json_decode($row['requestBy'], true);
    }

    if (isset($categoryDescriptions[$row['requestCategory']])) {
        $row['requestCategory'] = $categoryDescriptions[$row['requestCategory']];
    }
    }
    unset($row); // Good practice

    echo json_encode($data);


} catch (PDOException $e) {
    die("Database error: " . $e->getMessage());
}

?>
