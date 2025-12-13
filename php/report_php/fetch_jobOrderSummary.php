<?php
include('../../session.php');
include('../../assets/connection.php');

// Get POST values
$startDate = !empty($_POST['startDate']) ? $_POST['startDate'] : date('Y-m-d');
$endDate = !empty($_POST['endDate']) ? $_POST['endDate'] : date('Y-m-d', strtotime($startDate . ' +1 day'));
$category = $_POST['category'] ?? "ALL";
$techBioID   = $_POST['techBioID'] ?? null;

// 🔧 Override for testing
$startDate = '2025-12-01';
$endDate = '2025-12-13';

$start = date('m/d/Y', strtotime($startDate));
$end   = date('m/d/Y', strtotime($endDate));

$sql = "
    SELECT
        requestNo,
        requestDate,
        requestCategory,
        requestStatus,
        requestStartDate,
        requestEvaluationDate,
        requestBy
    FROM job_order_request
    WHERE STR_TO_DATE(requestDate, '%m/%d/%Y - %r')
        BETWEEN STR_TO_DATE(:startDate, '%m/%d/%Y')
        AND STR_TO_DATE(CONCAT(:endDate, ' 11:59:59 PM'), '%m/%d/%Y %r')
";

$params = [
    ':startDate' => $start,
    ':endDate'   => $end
];

if ($category !== 'ALL') {
    $sql .= " AND requestCategory = :category";
    $params[':category'] = $category;
}

if (!empty($techBioID)) {
    $sql .= " AND processedByID = :techBioID";
    $params[':techBioID'] = $techBioID;
}

$sql .= " ORDER BY requestDate DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

/* Compute Turn Around Time */
foreach ($data as &$row) {

    $row['requestBy'] = json_decode($row['requestBy'], true);

    if (!empty($row['requestStartDate']) && !empty($row['requestEvaluationDate'])) {
        $startDT = DateTime::createFromFormat('m/d/Y - h:i:s A', $row['requestStartDate']);
        $endDT   = DateTime::createFromFormat('m/d/Y - h:i:s A', $row['requestEvaluationDate']);

        if ($startDT && $endDT) {
            $diff = $startDT->diff($endDT);
            $row['turnAroundTime'] =
                $diff->days . "d " .
                $diff->h . "h " .
                $diff->i . "m";
        } else {
            $row['turnAroundTime'] = '';
        }
    } else {
        $row['turnAroundTime'] = '';
    }
}

echo json_encode($data);
