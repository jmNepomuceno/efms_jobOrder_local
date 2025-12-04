<?php
include ('../../session.php');
include('../../assets/connection.php');

try {
    $techBioID = $_POST['techBioID'] ?? null;

    // 1. Get filter values
    $startDate = !empty($_POST['startDate']) ? $_POST['startDate'] : date('Y-m-d');
    $endDate = !empty($_POST['endDate']) ? $_POST['endDate'] : date('Y-m-d', strtotime($startDate . ' +1 day'));

    // $startDate = "2025-07-01"; // For testing purposes, set a fixed start date
    // $endDate = "2025-08-11"; // For testing purposes, set a


    $category = $_POST['category'] ?? "ALL";
    $subCategory = !empty($_POST['subCategory']) ? $_POST['subCategory'] : "none";

    // Format dates to match DB format
    $startDateFormatted = date('m/d/Y', strtotime($startDate));
    $endDateFormatted = date('m/d/Y', strtotime($endDate));

    $params = [':startDate' => $startDateFormatted, ':endDate' => $endDateFormatted];

    // 2. Build SQL
    $sql = "
        SELECT requestNo, requestDate, requestStartDate, requestEvaluationDate, requestCompletedDate,
               requestDescription, requestCategory, requestSubCategory, requestBy, processedBy, requestJobRemarks, requestStatus, requestCorrectionDate, requestCorrection, assignTo, assignToBioID, assignTargetStartDate, assignTargetEndDate
        FROM job_order_request
        WHERE (requestStatus = 'Completed' OR requestStatus = 'Correction' OR requestStatus = 'Evaluation')
        AND STR_TO_DATE(requestDate, '%m/%d/%Y - %r') 
            BETWEEN STR_TO_DATE(:startDate, '%m/%d/%Y') 
            AND STR_TO_DATE(CONCAT(:endDate, ' 11:59:59 PM'), '%m/%d/%Y %r')
    ";

    // Add technician filter only if techBioID is provided
    if (!empty($techBioID)) {
        $sql .= " AND processedByID = :processedByID";
        $params[':processedByID'] = $techBioID;
    }

    // Add category filters
    if ($category !== "ALL") {
        $sql .= " AND requestCategory = :category";
        $params[':category'] = $category;

        if ($subCategory !== "none") {
            $sql .= " AND requestSubCategory = :subCategory";
            $params[':subCategory'] = $subCategory;
        }
    }

    // 3. Execute query
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $my_jobs_data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 4. Fetch category descriptions
    $categoryCodes = array_unique(array_column($my_jobs_data, 'requestCategory'));
    $categoryDescriptions = [];

    if (!empty($categoryCodes)) {
        $placeholders = implode(',', array_fill(0, count($categoryCodes), '?'));
        $stmt = $pdo->prepare("SELECT category_code, category_description FROM efms_category WHERE category_code IN ($placeholders)");
        $stmt->execute(array_values($categoryCodes));  // Ensure indexed array
        $categoryDescriptions = $stmt->fetchAll(PDO::FETCH_KEY_PAIR); // [code => description]
    }

    // 5. Enhance result
    foreach ($my_jobs_data as &$row) {
        if (isset($categoryDescriptions[$row['requestCategory']])) {
            $row['requestCategory'] = $categoryDescriptions[$row['requestCategory']];
        }

        if (!empty($row['requestBy'])) {
            $row['requestBy'] = json_decode($row['requestBy'], true);
        }
    }
    unset($row); // Clean up reference

    // 6. Return as JSON
    echo json_encode($my_jobs_data);

    // echo json_encode([
    //     'startDate' => $startDateFormatted,
    //     'endDate' => $endDateFormatted,
    //     'category' => $category,
    //     'subCategory' => $subCategory,
    //     'techBioID' => $techBioID
    // ]);

} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}


?>
