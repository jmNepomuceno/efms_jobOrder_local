<?php 
include ('../../session.php');
include('../../assets/connection.php');

// Defaults
$today = date('Y-m-d');

$startDate = !empty($_POST['startDate']) ? $_POST['startDate'] : date('Y-m-d');

if (!empty($_POST['endDate'])) {
    $endDate = $_POST['endDate'];
} else {
    // Default to one day after start date if endDate is not set
    $endDate = date('Y-m-d', strtotime($startDate . ' +1 day'));
}

// $startDate = "2025-07-01"; // For testing purposes, set a fixed start date
// $endDate = "2025-08-11"; // For testing purposes, set a


$category = $_POST['category'] ?? "ALL";
$subCategory = !empty($_POST['subCategory']) ? $_POST['subCategory'] : "none";

// Format for comparison with requestDate in the DB 
$startDateFormatted = date('m/d/Y', strtotime($startDate));
$endDateFormatted = date('m/d/Y', strtotime($endDate));

$techBioID = $_POST['techBioID'] ?? null;

// Format dates for DB
$startDateFormatted = date('m/d/Y', strtotime($startDate));
$endDateFormatted = date('m/d/Y', strtotime($endDate));

$sql = "
    SELECT requestNo, requestDate, requestCategory, requestSubCategory, processedByID, processedBy, requestEvaluation, assignTo, assignToBioID, assignTargetStartDate, assignTargetEndDate
    FROM job_order_request
    WHERE CAST(JSON_EXTRACT(requestEvaluation, '$.q1') AS CHAR) IS NOT NULL
      AND STR_TO_DATE(requestDate, '%m/%d/%Y - %r') 
            BETWEEN STR_TO_DATE(:startDate, '%m/%d/%Y')
            AND STR_TO_DATE(CONCAT(:endDate, ' 11:59:59 PM'), '%m/%d/%Y %r')
";

// Parameters
$params = [
    ':startDate' => $startDateFormatted,
    ':endDate' => $endDateFormatted,
];

// Optional filters
if (!empty($techBioID)) {
    $sql .= " AND processedByID = :techBioID";
    $params[':techBioID'] = $techBioID;
}

if (!empty($category) && $category !== 'ALL') {
    $sql .= " AND requestCategory = :category";
    $params[':category'] = $category;
}

if (!empty($subCategory) && $subCategory !== 'none') {
    $sql .= " AND requestSubCategory = :subCategory";
    $params[':subCategory'] = $subCategory;
}

$sql .= " ORDER BY requestDate DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);

$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Decode requestEvaluation JSON per record
foreach ($data as &$row) {
    $row['requestEvaluation'] = json_decode($row['requestEvaluation'], true);
}

echo json_encode($data);


?>
