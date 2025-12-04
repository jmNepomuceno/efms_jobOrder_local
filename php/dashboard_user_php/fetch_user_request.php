<?php
include('../../session.php');
include('../../assets/connection.php');

$startDate = !empty($_POST['startDate']) ? $_POST['startDate'] : date('Y-m-d');
$endDate = !empty($_POST['endDate']) ? $_POST['endDate'] : date('Y-m-d');
$divisionID = $_POST['division'] ?? null;
$sectionID = $_POST['section'] ?? null;

// TEMP (for testing)
// $startDate = '2025-05-21';
// $endDate = '2025-10-27';

$startDateFormatted = date('m/d/Y', strtotime($startDate));
$endDateFormatted = date('m/d/Y', strtotime($endDate));

try {
    // 🧩 Step 1: Fetch Top Requesting Divisions/Sections
    $stmt = $pdo->prepare("
        SELECT 
            JSON_UNQUOTE(JSON_EXTRACT(requestBy, '$.division')) AS division,
            JSON_UNQUOTE(JSON_EXTRACT(requestBy, '$.section')) AS section,
            COUNT(*) AS total_requests
        FROM job_order_request
        WHERE STR_TO_DATE(requestDate, '%m/%d/%Y - %r') 
              BETWEEN STR_TO_DATE(:startDate, '%m/%d/%Y') 
              AND STR_TO_DATE(CONCAT(:endDate, ' 11:59:59 PM'), '%m/%d/%Y %r')
        GROUP BY division, section
        ORDER BY total_requests DESC
    ");
    $stmt->execute([
        ':startDate' => $startDateFormatted,
        ':endDate' => $endDateFormatted
    ]);
    $topDivisionsSections = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 🧩 Step 2: Fetch Total Requests
    $stmtTotal = $pdo->prepare("
        SELECT COUNT(*) FROM job_order_request
        WHERE STR_TO_DATE(requestDate, '%m/%d/%Y - %r') 
              BETWEEN STR_TO_DATE(:startDate, '%m/%d/%Y') 
              AND STR_TO_DATE(CONCAT(:endDate, ' 11:59:59 PM'), '%m/%d/%Y %r')
    ");
    $stmtTotal->execute([
        ':startDate' => $startDateFormatted,
        ':endDate' => $endDateFormatted
    ]);
    $totalRequests = (int) $stmtTotal->fetchColumn();

    // 🧩 Step 3: Determine Top Division and Top Section
    $topDivision = null;
    $topSection = null;
    if (!empty($topDivisionsSections)) {
        $topDivision = $topDivisionsSections[0]['division'];
        $topSection = $topDivisionsSections[0]['section'];
    }

    // 🧩 Step 4: Fetch Request Volume Trend (Over Time)
    $stmtTrend = $pdo->prepare("
        SELECT 
            DATE_FORMAT(STR_TO_DATE(requestDate, '%m/%d/%Y - %r'), '%Y-%m-%d') AS request_day,
            COUNT(*) AS total_requests
        FROM job_order_request
        WHERE STR_TO_DATE(requestDate, '%m/%d/%Y - %r') 
              BETWEEN STR_TO_DATE(:startDate, '%m/%d/%Y') 
              AND STR_TO_DATE(CONCAT(:endDate, ' 11:59:59 PM'), '%m/%d/%Y %r')
        GROUP BY request_day
        ORDER BY request_day ASC
    ");
    $stmtTrend->execute([
        ':startDate' => $startDateFormatted,
        ':endDate' => $endDateFormatted
    ]);
    $requestVolumeTrend = $stmtTrend->fetchAll(PDO::FETCH_ASSOC);

    // 🧩 Step 5: Average Evaluation Rating per Division
    $stmtAllDivisions = $pdo->prepare("
        SELECT DISTINCT JSON_UNQUOTE(JSON_EXTRACT(requestBy, '$.division')) AS division
        FROM job_order_request
        WHERE JSON_EXTRACT(requestBy, '$.division') IS NOT NULL
    ");
    $stmtAllDivisions->execute();
    $allDivisions = $stmtAllDivisions->fetchAll(PDO::FETCH_COLUMN);

    $stmtRating = $pdo->prepare("
        SELECT 
            JSON_UNQUOTE(JSON_EXTRACT(requestBy, '$.division')) AS division,
            requestEvaluation
        FROM job_order_request
        WHERE requestEvaluation IS NOT NULL
        AND requestEvaluation != ''
        AND STR_TO_DATE(requestDate, '%m/%d/%Y - %r') 
            BETWEEN STR_TO_DATE(:startDate, '%m/%d/%Y') 
            AND STR_TO_DATE(CONCAT(:endDate, ' 11:59:59 PM'), '%m/%d/%Y %r')
    ");
    $stmtRating->execute([
        ':startDate' => $startDateFormatted,
        ':endDate' => $endDateFormatted
    ]);

    $divisionRatings = [];

    while ($row = $stmtRating->fetch(PDO::FETCH_ASSOC)) {
        $division = $row['division'] ?? 'Unknown';
        $evaluation = json_decode($row['requestEvaluation'], true);

        if (!is_array($evaluation)) continue;

        $map = [
            'Outstanding' => 5,
            'Very Satisfactory' => 4,
            'Satisfactory' => 3,
            'Fair' => 2,
            'Poor' => 1,
            'Unsatisfactory' => 1
        ];

        $scores = [];
        foreach (['q1', 'q2', 'q3', 'q4', 'q5'] as $q) {
            if (!empty($evaluation[$q]) && isset($map[$evaluation[$q]])) {
                $scores[] = $map[$evaluation[$q]];
            }
        }

        if (!empty($scores)) {
            $avg = array_sum($scores) / count($scores);
            $divisionRatings[$division][] = $avg;
        }
    }

    // Compute per-division average
    $averageRatingPerDivision = [];
    foreach ($allDivisions as $division) {
        if (isset($divisionRatings[$division])) {
            $avg = array_sum($divisionRatings[$division]) / count($divisionRatings[$division]);
            $averageRatingPerDivision[] = [
                'division' => $division,
                'avg_rating' => round($avg, 2)
            ];
        } else {
            // Divisions with no evaluations
            $averageRatingPerDivision[] = [
                'division' => $division,
                'avg_rating' => 0
            ];
        }
    }

    // Sort highest to lowest
    usort($averageRatingPerDivision, function($a, $b) {
        return $b['avg_rating'] <=> $a['avg_rating'];
    });

    $response['averageRatingPerDivision'] = $averageRatingPerDivision;

    // 🧩 Step 6: Average Completion Time by Division
    $stmtCompletion = $pdo->prepare("
        SELECT 
            JSON_UNQUOTE(JSON_EXTRACT(requestBy, '$.division')) AS division,
            requestStartDate,
            requestCompletedDate
        FROM job_order_request
        WHERE requestCompletedDate IS NOT NULL
        AND requestCompletedDate != ''
        AND requestStartDate IS NOT NULL
        AND requestStartDate != ''
        AND STR_TO_DATE(requestDate, '%m/%d/%Y - %r') 
            BETWEEN STR_TO_DATE(:startDate, '%m/%d/%Y') 
            AND STR_TO_DATE(CONCAT(:endDate, ' 11:59:59 PM'), '%m/%d/%Y %r')
    ");

    $stmtCompletion->execute([
        ':startDate' => $startDateFormatted,
        ':endDate' => $endDateFormatted
    ]);

    $completionTimes = [];
    while ($row = $stmtCompletion->fetch(PDO::FETCH_ASSOC)) {
        $division = $row['division'] ?? 'Unknown';
        $start = DateTime::createFromFormat('m/d/Y - h:i:s A', $row['requestStartDate']);
        $end = DateTime::createFromFormat('m/d/Y - h:i:s A', $row['requestCompletedDate']);

        if ($start && $end) {
            $hours = ($end->getTimestamp() - $start->getTimestamp()) / 3600; // convert to hours
            if ($hours >= 0) {
                $completionTimes[$division][] = $hours;
            }
        }
    }

    $averageCompletionByDivision = [];
    foreach ($completionTimes as $division => $hoursArr) {
        $average = array_sum($hoursArr) / count($hoursArr);
        $averageCompletionByDivision[] = [
            'division' => $division,
            'avg_hours' => round($average, 2)
        ];
    }

    $response['averageCompletionByDivision'] = $averageCompletionByDivision;

    // 🧩 Step 7: Top 5 Requestors (Most Active Users)
    $stmtTopRequestors = $pdo->prepare("
        SELECT 
            JSON_UNQUOTE(JSON_EXTRACT(requestBy, '$.name')) AS requestor_name,
            COUNT(*) AS total_requests
        FROM job_order_request
        WHERE STR_TO_DATE(requestDate, '%m/%d/%Y - %r') 
            BETWEEN STR_TO_DATE(:startDate, '%m/%d/%Y') 
            AND STR_TO_DATE(CONCAT(:endDate, ' 11:59:59 PM'), '%m/%d/%Y %r')
        GROUP BY requestor_name
        ORDER BY total_requests DESC
        LIMIT 5
    ");
    $stmtTopRequestors->execute([
        ':startDate' => $startDateFormatted,
        ':endDate' => $endDateFormatted
    ]);
    $topRequestors = $stmtTopRequestors->fetchAll(PDO::FETCH_ASSOC);

    $response['topRequestors'] = $topRequestors;

    // 🧩 Step 8: Cancelled or Rejected Requests (Trend)
    $stmtCancelledRejected = $pdo->prepare("
        SELECT 
            DATE_FORMAT(STR_TO_DATE(requestDate, '%m/%d/%Y - %r'), '%Y-%m-%d') AS request_day,
            COUNT(*) AS total_requests
        FROM job_order_request
        WHERE (
            requestStatus = 'Cancelled' 
            OR requestStatus = 'Rejected'
        )
        AND STR_TO_DATE(requestDate, '%m/%d/%Y - %r') 
            BETWEEN STR_TO_DATE(:startDate, '%m/%d/%Y') 
            AND STR_TO_DATE(CONCAT(:endDate, ' 11:59:59 PM'), '%m/%d/%Y %r')
        GROUP BY request_day
        ORDER BY request_day ASC
    ");

    $stmtCancelledRejected->execute([
        ':startDate' => $startDateFormatted,
        ':endDate' => $endDateFormatted
    ]);

    $cancelledRejectedTrend = $stmtCancelledRejected->fetchAll(PDO::FETCH_ASSOC);
    $response['cancelledRejectedTrend'] = $cancelledRejectedTrend;



    echo json_encode([
        'totalRequests' => $totalRequests,
        'topRequestingDivisionsSections' => $topDivisionsSections,
        'topDivision' => $topDivision,
        'topSection' => $topSection,
        'requestVolumeTrend' => $requestVolumeTrend,
        'averageRatingPerDivision' => $averageRatingPerDivision,
        'averageCompletionByDivision' => $averageCompletionByDivision,
        'topRequestors' => $topRequestors,
        'cancelledRejectedTrend' => $cancelledRejectedTrend
    ]);


} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
