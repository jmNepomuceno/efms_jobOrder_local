<?php
include ('../../session.php');
include('../../assets/connection.php');

try {
    $sql = "SELECT requestNo, requestDate, requestBy, requestDescription, requestStatus, requestCategory, requestStartDate, processedBy, assignTo, assignToBioID, assignTargetStartDate, assignTargetEndDate
        FROM job_order_request 
        WHERE requestFrom = ? AND requestStatus = 'On-Process'
        AND JSON_UNQUOTE(JSON_EXTRACT(requestBy, '$.bioID')) = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$_SESSION['sectionName'] , $_SESSION['user']]);
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

    // Step 2: Decode requestBy and replace category code with description
    foreach ($data as &$row) {
        if (!empty($row['requestBy'])) {
            $row['requestBy'] = json_decode($row['requestBy'], true);
        }

        if (isset($categoryDescriptions[$row['requestCategory']])) {
            $row['requestCategory'] = $categoryDescriptions[$row['requestCategory']];
        }
    }
    unset($row); // Best practice when using reference in foreach

    echo json_encode($data);


} catch (PDOException $e) {
    die("Database error: " . $e->getMessage());
}

?>
