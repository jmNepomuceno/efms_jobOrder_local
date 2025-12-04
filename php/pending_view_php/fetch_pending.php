<?php
include ('../../session.php');
include('../../assets/connection.php');

try {
$sql = "SELECT requestNo, requestDate, requestBy, requestDescription, requestStatus, requestCategory, requestSubCategory 
        FROM job_order_request 
        WHERE requestFrom = ? 
        AND requestStatus = 'Pending' 
        AND JSON_UNQUOTE(JSON_EXTRACT(requestBy, '$.bioID')) = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$_SESSION['sectionName'] , $_SESSION['user']]);
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 1. Get unique category codes
    $categoryCodes = array_unique(array_column($data, 'requestCategory'));

    $categoryDescriptions = [];

    if (!empty($categoryCodes)) {
        // Create placeholders (?, ?, ...) for IN clause
        $placeholders = implode(',', array_fill(0, count($categoryCodes), '?'));

        // Fetch all category descriptions at once
        $sql = "SELECT category_code, category_description 
                FROM efms_category 
                WHERE category_code IN ($placeholders)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($categoryCodes);
        $categoryDescriptions = $stmt->fetchAll(PDO::FETCH_KEY_PAIR); // [code => description]
    }

    // 2. Update each row
    foreach ($data as &$row) {
        // Decode JSON
        if (!empty($row['requestBy'])) {
            $row['requestBy'] = json_decode($row['requestBy'], true);
        }

        // Replace requestCategory code with description
        if (isset($categoryDescriptions[$row['requestCategory']])) {
            $row['requestCategory'] = $categoryDescriptions[$row['requestCategory']];
        }
    }
    unset($row); // best practice when using reference

    // 3. Return JSON
    echo json_encode($data);

    // JULY 25 2002

} catch (PDOException $e) {
    die("Database error: " . $e->getMessage());
}

?>
