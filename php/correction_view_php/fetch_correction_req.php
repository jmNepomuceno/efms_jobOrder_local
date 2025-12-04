<?php
include ('../../session.php');
include('../../assets/connection.php');

try {
    $sql = "SELECT requestNo, requestDate, requestBy, requestDescription, requestCategory, requestStatus, processedBy, requestCorrectionDate, requestCorrection , processedByID, assignTo, assignToBioID, assignTargetStartDate, assignTargetEndDate
    FROM job_order_request 
    WHERE CAST(JSON_EXTRACT(requestBy, '$.bioID') AS UNSIGNED) = ? 
    AND requestStatus = 'Correction'";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$_SESSION['user']]);
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Collect unique category codes
    $categoryCodes = array_unique(array_column($data, 'requestCategory'));

    // If there are categories to look up
    if (!empty($categoryCodes)) {
    $placeholders = implode(',', array_fill(0, count($categoryCodes), '?'));
    $catSql = "SELECT category_code, category_description FROM efms_category WHERE category_code IN ($placeholders)";
    $catStmt = $pdo->prepare($catSql);
    $catStmt->execute($categoryCodes);
    $categoryMap = $catStmt->fetchAll(PDO::FETCH_KEY_PAIR); // [code => description]
    }

    // Decode JSON and replace category code with description
    foreach ($data as &$row) {
    if (!empty($row['requestBy'])) {
        $row['requestBy'] = json_decode($row['requestBy'], true);
    }

    if (isset($categoryMap[$row['requestCategory']])) {
        $row['requestCategory'] = $categoryMap[$row['requestCategory']];
    }
    }

    echo json_encode($data);

} catch (PDOException $e) {
    die("Database error: " . $e->getMessage());
}

?>
