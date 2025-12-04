<?php
include('../../session.php');
include('../../assets/connection.php');

// Use POST values or default
$startDate = $_POST['startDate'] ?? date('Y-m-d');
$endDate = $_POST['endDate'] ?? date('Y-m-d');
$category = $_POST['category'] ?? 'ALL';
$subCategory = $_POST['subCategory'] ?? 'none';

$startDate = !empty($_POST['startDate']) ? $_POST['startDate'] : date('Y-m-d');

if (!empty($_POST['endDate'])) {
    $endDate = $_POST['endDate'];
} else {
    // Default to one day after start date if endDate is not set
    $endDate = date('Y-m-d', strtotime($startDate . ' +1 day'));
}

// 🧠 Override for testing — remove later
// $startDate = '2025-01-21';
// $endDate = '2025-11-07';

$category = $_POST['category'] ?? "ALL";
$subCategory = !empty($_POST['subCategory']) ? $_POST['subCategory'] : "none";

// Format for comparison with requestDate in the DB
$startDateFormatted = date('m/d/Y', strtotime($startDate));
$endDateFormatted = date('m/d/Y', strtotime($endDate));

try {
    $params = [
        ':startDate' => $startDateFormatted,
        ':endDate' => $endDateFormatted
    ];

    $where = "STR_TO_DATE(requestDate, '%m/%d/%Y - %r') 
              BETWEEN STR_TO_DATE(:startDate, '%m/%d/%Y') 
              AND STR_TO_DATE(CONCAT(:endDate, ' 11:59:59 PM'), '%m/%d/%Y %r')";
    if ($category !== 'ALL') {
        $where .= " AND requestCategory = :category";
        $params[':category'] = $category;
    }
    if ($subCategory !== 'none') {
        $where .= " AND requestSubCategory = :subCategory";
        $params[':subCategory'] = $subCategory;
    }

    /* --------------------------------------------------
       🔹 1. SUMMARY DATA (Totals + Hourly + Percentage)
    -------------------------------------------------- */
    $summarySQL = "SELECT 
                        HOUR(STR_TO_DATE(requestDate, '%m/%d/%Y - %r')) AS hour,
                        requestStatus,
                        COUNT(*) AS total
                   FROM job_order_request
                   WHERE $where
                   GROUP BY hour, requestStatus
                   ORDER BY hour";
    $summaryStmt = $pdo->prepare($summarySQL);
    $summaryStmt->execute($params);
    $summaryData = $summaryStmt->fetchAll(PDO::FETCH_ASSOC);

    $totals = [
        'totalRequests' => 0,
        'correction' => 0,
        'completed' => 0,
        'pending' => 0,
        'onProcess' => 0,
        'assigned' => 0,
        'cancelled' => 0,
        'evaluation' => 0,
    ];
    $hourlyTotals = array_fill(0, 24, 0);

    foreach ($summaryData as $row) {
        $hour = (int)$row['hour'];
        $status = $row['requestStatus'];
        $count = (int)$row['total'];

        $totals['totalRequests'] += $count;
        if ($hour >= 0 && $hour <= 23) {
            $hourlyTotals[$hour] += $count;
        }

        switch ($status) {
            case 'Correction': $totals['correction'] += $count; break;
            case 'Completed': $totals['completed'] += $count; break;
            case 'Evaluation': $totals['evaluation'] += $count; break;
            case 'Pending': $totals['pending'] += $count; break;
            case 'On-Process': $totals['onProcess'] += $count; break;
            case 'Assigned': $totals['assigned'] += $count; break;
            case 'Cancelled': $totals['cancelled'] += $count; break;
            case 'Evaluation': $totals['evaluation'] += $count; break;
            case 'Pending Materials': $totals['pendingMaterials'] += $count; break;
        }
    }

    $totalPercentage = $totals['totalRequests'] > 0
        ? round((($totals['completed'] + $totals['correction'] + $totals['evaluation'] + $totals['cancelled']) / $totals['totalRequests']) * 100, 2)
        : 0;

    /* --------------------------------------------------
       🔹 2. EXISTING DASHBOARD DATASETS
    -------------------------------------------------- */

    // Requests Trend (by date)
    $trendSQL = "SELECT DATE_FORMAT(STR_TO_DATE(requestDate, '%m/%d/%Y - %r'), '%Y-%m-%d') AS date,
                        COUNT(*) AS total
                 FROM job_order_request
                 WHERE $where
                 GROUP BY date ORDER BY date";
    $trendStmt = $pdo->prepare($trendSQL);
    $trendStmt->execute($params);
    $trendData = $trendStmt->fetchAll(PDO::FETCH_ASSOC);

    // Status Breakdown
    $statusSQL = "SELECT requestStatus, COUNT(*) AS total
                  FROM job_order_request
                  WHERE $where
                  GROUP BY requestStatus";
    $statusStmt = $pdo->prepare($statusSQL);
    $statusStmt->execute($params);
    $statusData = $statusStmt->fetchAll(PDO::FETCH_ASSOC);

    // Requests by Category/Unit
    $catSQL = "SELECT requestCategory, COUNT(*) AS total
               FROM job_order_request
               WHERE $where
               GROUP BY requestCategory";
    $catStmt = $pdo->prepare($catSQL);
    $catStmt->execute($params);
    $catData = $catStmt->fetchAll(PDO::FETCH_ASSOC);

    // Average Completion Time per Unit
    $timeSQL = "SELECT requestCategory,
                       AVG(TIMESTAMPDIFF(HOUR, 
                           STR_TO_DATE(requestStartDate, '%m/%d/%Y - %r'),
                           STR_TO_DATE(requestCompletedDate, '%m/%d/%Y - %r')
                       )) AS avg_hours
                FROM job_order_request
                WHERE requestCompletedDate IS NOT NULL AND $where
                GROUP BY requestCategory";
    $timeStmt = $pdo->prepare($timeSQL);
    $timeStmt->execute($params);
    $timeData = $timeStmt->fetchAll(PDO::FETCH_ASSOC);

    // Average Evaluation Ratings
    $evalSQL = "SELECT requestEvaluation
                FROM job_order_request
                WHERE requestEvaluation IS NOT NULL AND $where";
    $evalStmt = $pdo->prepare($evalSQL);
    $evalStmt->execute($params);
    $evals = $evalStmt->fetchAll(PDO::FETCH_COLUMN);

    $ratingCounts = ['Very Satisfactory'=>0,'Satisfactory'=>0,'Fair'=>0,'Poor'=>0];
    foreach ($evals as $evalJson) {
        $eval = json_decode($evalJson, true);
        foreach (['q1','q2','q3','q4','q5'] as $q) {
            if (!empty($eval[$q]) && isset($ratingCounts[$eval[$q]])) {
                $ratingCounts[$eval[$q]]++;
            }
        }
    }

    // Top 5 Most Common Descriptions
    $descSQL = "SELECT requestDescription, COUNT(*) AS total
                FROM job_order_request
                WHERE $where
                GROUP BY requestDescription
                ORDER BY total DESC
                LIMIT 5";
    $descStmt = $pdo->prepare($descSQL);
    $descStmt->execute($params);
    $descData = $descStmt->fetchAll(PDO::FETCH_ASSOC);

    // Pending Aging (average days pending)
    $agingSQL = "SELECT requestCategory,
                        AVG(TIMESTAMPDIFF(DAY,
                            STR_TO_DATE(requestDate, '%m/%d/%Y - %r'),
                            NOW()
                        )) AS avg_days
                 FROM job_order_request
                 WHERE requestStatus = 'Pending' AND $where
                 GROUP BY requestCategory";
    $agingStmt = $pdo->prepare($agingSQL);
    $agingStmt->execute($params);
    $agingData = $agingStmt->fetchAll(PDO::FETCH_ASSOC);

    // Recent Job Orders
    $recentSQL = "SELECT requestNo, requestCategory, requestSubCategory, requestStatus, requestDate
                  FROM job_order_request
                  WHERE $where
                  ORDER BY STR_TO_DATE(requestDate, '%m/%d/%Y - %r') DESC
                  LIMIT 10";
    $recentStmt = $pdo->prepare($recentSQL);
    $recentStmt->execute($params);
    $recentData = $recentStmt->fetchAll(PDO::FETCH_ASSOC);


    // Fetch all data needed for divisions and comments
    $divComSQL = "SELECT requestBy, requestEvaluation
                FROM job_order_request
                WHERE $where";
    $divComStmt = $pdo->prepare($divComSQL);
    $divComStmt->execute($params);
    $divComData = $divComStmt->fetchAll(PDO::FETCH_ASSOC);

    $divisionCounts = [];
    $comments = [];

    foreach ($divComData as $row) {
        // Decode requestBy JSON safely
        $requestBy = json_decode($row['requestBy'], true);

        // Determine division name with fallback
        $divisionName = 'Unknown Division';
        if (is_array($requestBy) && !empty($requestBy['division'])) {
            $divisionName = strtoupper(trim($requestBy['division']));
        }

        // Count requests by division
        if (!isset($divisionCounts[$divisionName])) {
            $divisionCounts[$divisionName] = 0;
        }
        $divisionCounts[$divisionName]++;

        // Decode evaluation JSON safely
        if (!empty($row['requestEvaluation'])) {
            $evaluation = json_decode($row['requestEvaluation'], true);
            if (!empty($evaluation['comments'])) {
                $comments[] = [
                    'division' => $divisionName,
                    'comment' => trim($evaluation['comments'])
                ];
            }
        }
    }


    // Format division data for JSON output
    $divisionData = [];
    foreach ($divisionCounts as $division => $count) {
        $divisionData[] = [
            'division_name' => $division,
            'total' => $count
        ];
    }



    // Requests by Subcategory
    $subcatSQL = "SELECT requestSubCategory, COUNT(*) AS total
                FROM job_order_request
                WHERE $where
                GROUP BY requestSubCategory
                ORDER BY total DESC";
    $subcatStmt = $pdo->prepare($subcatSQL);
    $subcatStmt->execute($params);
    $subcatData = $subcatStmt->fetchAll(PDO::FETCH_ASSOC);

    /* --------------------------------------------------
       🔹 FINAL OUTPUT
    -------------------------------------------------- */
    echo json_encode([
        'summary' => [
            'totals' => $totals,
            'hourlyTotals' => $hourlyTotals,
            'totalPercentage' => $totalPercentage
        ],
        'trend' => $trendData,
        'status' => $statusData,
        'category' => $catData,
        'subCategory' => $subcatData, // ✅ add this line
        'completionTime' => $timeData,
        'ratings' => $ratingCounts,
        'topRequests' => $descData,
        'aging' => $agingData,
        'recent' => $recentData,
        'divisions' => $divisionData,
        'comments' => $comments
    ]);


} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
