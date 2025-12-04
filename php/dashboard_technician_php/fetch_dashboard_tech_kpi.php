<?php
include('../../session.php');
include('../../assets/connection.php');

// Get POST values or default to today if missing
$startDate = !empty($_POST['startDate']) ? $_POST['startDate'] : date('Y-m-d');
$endDate = !empty($_POST['endDate']) ? $_POST['endDate'] : date('Y-m-d', strtotime($startDate . ' +1 day'));

$category = $_POST['category'] ?? "ALL";
$subCategory = !empty($_POST['subCategory']) ? $_POST['subCategory'] : "none";

// Format for DB comparison
$startDateFormatted = date('m/d/Y', strtotime($startDate));
$endDateFormatted = date('m/d/Y', strtotime($endDate));

try {
    // --- Query 1: counts per hour and status ---
    if ($category === 'ALL') {
        $sql = "
            SELECT 
                HOUR(STR_TO_DATE(requestDate, '%m/%d/%Y - %h:%i:%s %p')) AS hr, 
                requestStatus,
                COUNT(*) AS total 
            FROM job_order_request 
            WHERE STR_TO_DATE(requestDate, '%m/%d/%Y - %h:%i:%s %p') 
                BETWEEN STR_TO_DATE(:startDate, '%m/%d/%Y') 
                AND STR_TO_DATE(CONCAT(:endDate, ' 11:59:59 PM'), '%m/%d/%Y %r')
            GROUP BY hr, requestStatus
            ORDER BY hr
        ";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':startDate' => $startDateFormatted,
            ':endDate' => $endDateFormatted
        ]);
    } else {
        if ($subCategory !== "none") {
            $sql = "
                SELECT 
                    HOUR(STR_TO_DATE(requestDate, '%m/%d/%Y - %h:%i:%s %p')) AS hr, 
                    requestStatus,
                    COUNT(*) AS total 
                FROM job_order_request 
                WHERE requestCategory = :category 
                    AND requestSubCategory = :subCategory
                    AND STR_TO_DATE(requestDate, '%m/%d/%Y - %h:%i:%s %p') 
                        BETWEEN STR_TO_DATE(:startDate, '%m/%d/%Y') 
                        AND STR_TO_DATE(CONCAT(:endDate, ' 11:59:59 PM'), '%m/%d/%Y %r')
                GROUP BY hr, requestStatus
                ORDER BY hr
            ";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':category' => $category,
                ':subCategory' => $subCategory,
                ':startDate' => $startDateFormatted,
                ':endDate' => $endDateFormatted
            ]);
        } else {
            $sql = "
                SELECT 
                    HOUR(STR_TO_DATE(requestDate, '%m/%d/%Y - %h:%i:%s %p')) AS hr, 
                    requestStatus,
                    COUNT(*) AS total 
                FROM job_order_request 
                WHERE requestCategory = :category
                    AND STR_TO_DATE(requestDate, '%m/%d/%Y - %h:%i:%s %p') 
                        BETWEEN STR_TO_DATE(:startDate, '%m/%d/%Y') 
                        AND STR_TO_DATE(CONCAT(:endDate, ' 11:59:59 PM'), '%m/%d/%Y %r')
                GROUP BY hr, requestStatus
                ORDER BY hr
            ";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':category' => $category,
                ':startDate' => $startDateFormatted,
                ':endDate' => $endDateFormatted
            ]);
        }
    }

    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Format results
    $requestsPerHourStatus = [];
    foreach ($results as $row) {
        $hour = (int)$row['hr'];
        $status = $row['requestStatus'];
        $total = (int)$row['total'];

        if (!isset($requestsPerHourStatus[$hour])) {
            $requestsPerHourStatus[$hour] = [];
        }
        $requestsPerHourStatus[$hour][$status] = $total;
    }

    // --- Query 2: average evaluation time ---
    if ($category === 'ALL') {
        $sqlAvg = "
            SELECT 
                AVG(TIMESTAMPDIFF(SECOND,
                    STR_TO_DATE(requestDate, '%m/%d/%Y - %h:%i:%s %p'),
                    STR_TO_DATE(requestEvaluationDate, '%m/%d/%Y - %h:%i:%s %p')
                )) AS avgEvaluationSeconds
            FROM job_order_request
            WHERE requestStatus IN ('Completed', 'Evaluation')
                AND requestEvaluationDate IS NOT NULL
                AND STR_TO_DATE(requestDate, '%m/%d/%Y - %h:%i:%s %p') 
                    BETWEEN STR_TO_DATE(:startDate, '%m/%d/%Y') 
                    AND STR_TO_DATE(CONCAT(:endDate, ' 11:59:59 PM'), '%m/%d/%Y %r')
        ";
        $stmtAvg = $pdo->prepare($sqlAvg);
        $stmtAvg->execute([
            ':startDate' => $startDateFormatted,
            ':endDate' => $endDateFormatted
        ]);
    } else {
        if ($subCategory !== "none") {
            $sqlAvg = "
                SELECT 
                    AVG(TIMESTAMPDIFF(SECOND,
                        STR_TO_DATE(requestDate, '%m/%d/%Y - %h:%i:%s %p'),
                        STR_TO_DATE(requestEvaluationDate, '%m/%d/%Y - %h:%i:%s %p')
                    )) AS avgEvaluationSeconds
                FROM job_order_request
                WHERE requestCategory = :category
                    AND requestSubCategory = :subCategory
                    AND requestStatus IN ('Completed', 'Evaluation')
                    AND requestEvaluationDate IS NOT NULL
                    AND STR_TO_DATE(requestDate, '%m/%d/%Y - %h:%i:%s %p') 
                        BETWEEN STR_TO_DATE(:startDate, '%m/%d/%Y') 
                        AND STR_TO_DATE(CONCAT(:endDate, ' 11:59:59 PM'), '%m/%d/%Y %r')
            ";
            $stmtAvg = $pdo->prepare($sqlAvg);
            $stmtAvg->execute([
                ':category' => $category,
                ':subCategory' => $subCategory,
                ':startDate' => $startDateFormatted,
                ':endDate' => $endDateFormatted
            ]);
        } else {
            $sqlAvg = "
                SELECT 
                    AVG(TIMESTAMPDIFF(SECOND,
                        STR_TO_DATE(requestDate, '%m/%d/%Y - %h:%i:%s %p'),
                        STR_TO_DATE(requestEvaluationDate, '%m/%d/%Y - %h:%i:%s %p')
                    )) AS avgEvaluationSeconds
                FROM job_order_request 
                WHERE requestCategory = :category
                    AND requestStatus IN ('Completed', 'Evaluation')
                    AND requestEvaluationDate IS NOT NULL
                    AND STR_TO_DATE(requestDate, '%m/%d/%Y - %h:%i:%s %p') 
                        BETWEEN STR_TO_DATE(:startDate, '%m/%d/%Y') 
                        AND STR_TO_DATE(CONCAT(:endDate, ' 11:59:59 PM'), '%m/%d/%Y %r')
            ";
            $stmtAvg = $pdo->prepare($sqlAvg);
            $stmtAvg->execute([
                ':category' => $category,
                ':startDate' => $startDateFormatted,
                ':endDate' => $endDateFormatted
            ]);
        }
    }

    $avgResult = $stmtAvg->fetch(PDO::FETCH_ASSOC);
    $avgEvaluationSeconds = $avgResult['avgEvaluationSeconds'];

    if ($avgEvaluationSeconds !== null) {
        $totalSeconds = round($avgEvaluationSeconds);
        $hours = floor($totalSeconds / 3600);
        $minutes = floor(($totalSeconds % 3600) / 60);
        $seconds = $totalSeconds % 60;
        $avgEvaluationTimeFormatted = sprintf('%02d:%02d:%02d', $hours, $minutes, $seconds);
    } else {
        $avgEvaluationTimeFormatted = null;
    }

    // Final output
    echo json_encode([
        'counts' => $requestsPerHourStatus,
        'averageEvaluationMinutes' => $avgEvaluationTimeFormatted
    ]);

} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
