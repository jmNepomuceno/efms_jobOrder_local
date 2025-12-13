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

$startDate = "2025-12-01"; // For testing purposes, set a fixed start date
$endDate = "2025-12-12"; // For testing purposes, set a


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
    SELECT 
        j.requestNo,

        ANY_VALUE(j.requestDate) AS requestDate,
        ANY_VALUE(j.requestCategory) AS requestCategory,
        ANY_VALUE(j.requestStartDate) AS requestStartDate,
        ANY_VALUE(j.requestEvaluationDate) AS requestEvaluationDate,
        ANY_VALUE(j.requestCompletedDate) AS requestCompletedDate,
        ANY_VALUE(j.requestDescription) AS requestDescription,
        ANY_VALUE(j.requestBy) AS requestBy,
        ANY_VALUE(j.requestJobRemarks) AS requestJobRemarks,
        ANY_VALUE(j.requestSubCategory) AS requestSubCategory,
        ANY_VALUE(j.processedByID) AS processedByID,
        ANY_VALUE(j.processedBy) AS processedBy,
        ANY_VALUE(j.requestEvaluation) AS requestEvaluation,
        ANY_VALUE(j.assignTo) AS assignTo,
        ANY_VALUE(j.assignToBioID) AS assignToBioID,
        ANY_VALUE(j.assignTargetStartDate) AS assignTargetStartDate,
        ANY_VALUE(j.assignTargetEndDate) AS assignTargetEndDate,

        -- ✅ All assigned technicians
        GROUP_CONCAT(
            DISTINCT CONCAT(t.techName, '||', t.techBioID)
            ORDER BY t.techName
            SEPARATOR '~~'
        ) AS assignedTechs


    FROM job_order_request j
    LEFT JOIN job_order_assigned_techs t 
        ON j.requestNo = t.requestNo

    WHERE CAST(JSON_EXTRACT(j.requestEvaluation, '$.q1') AS CHAR) IS NOT NULL
      AND STR_TO_DATE(j.requestDate, '%m/%d/%Y - %r') 
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
    $sql .= " AND (j.processedByID = :techBioID OR t.techBioID = :techBioID)";
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

$sql .= " GROUP BY j.requestNo ORDER BY requestDate DESC";



$stmt = $pdo->prepare($sql);
$stmt->execute($params);

$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Decode requestEvaluation JSON per record
foreach ($data as &$row) {

    // Decode requestEvaluation JSON
    $row['requestEvaluation'] = json_decode($row['requestEvaluation'], true);

    if (!empty($row['requestBy'])) {
        $row['requestBy'] = json_decode($row['requestBy'], true);
    }

    // 🔹 Convert assignedTechs string → array
    $assignedTechsArr = [];

    if (!empty($row['assignedTechs'])) {
        $techs = explode('~~', $row['assignedTechs']);

        foreach ($techs as $tech) {
            [$name, $bioID] = explode('||', $tech);
            $assignedTechsArr[] = [
                'name'  => $name,
                'bioID' => $bioID
            ];
        }
    }

    $row['assignedTechs'] = $assignedTechsArr;
}


echo json_encode($data);


?>
