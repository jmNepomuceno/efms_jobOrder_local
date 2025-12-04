<?php
include ('../../session.php');
include('../../assets/connection.php');

try {
    // Step 1: Fetch all completed job order requests by the logged-in user
    $sql = "SELECT requestNo, requestDate, requestBy, requestDescription, requestCategory, requestStatus, processedBy, requestStartDate, requestCompletedDate, requestEvaluationDate, requestEvaluation, requestJobRemarks, processedByID , assignTo, assignToBioID, assignTargetStartDate, assignTargetEndDate
            FROM job_order_request 
            WHERE CAST(JSON_EXTRACT(requestBy, '$.bioID') AS UNSIGNED) = ? 
              AND requestStatus = 'Completed' ORDER BY requestCompletedDate DESC" ;
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$_SESSION['user']]);
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Step 2: Extract unique requestCategory codes
    $categoryCodes = array_values(array_unique(array_column($data, 'requestCategory'))); // reset indexes!

    // Step 3: Fetch category descriptions only if there are category codes
    $categoryMap = [];
    if (!empty($categoryCodes)) {
        $placeholders = implode(',', array_fill(0, count($categoryCodes), '?'));
        $catSql = "SELECT category_code, category_description FROM efms_category WHERE category_code IN ($placeholders)";
        $catStmt = $pdo->prepare($catSql);
        $catStmt->execute($categoryCodes);
        $categoryMap = $catStmt->fetchAll(PDO::FETCH_KEY_PAIR); // [code => description]
    }

    // Step 4: Decode requestBy JSON and replace category codes with descriptions
    foreach ($data as &$row) {
        if (!empty($row['requestBy'])) {
            $row['requestBy'] = json_decode($row['requestBy'], true);
        }

        if (isset($categoryMap[$row['requestCategory']])) {
            $row['requestCategory'] = $categoryMap[$row['requestCategory']];
        }
    }
    unset($row); // Best practice

    // Step 5: Return the enriched data
    echo json_encode($data);

} catch (PDOException $e) {
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>
