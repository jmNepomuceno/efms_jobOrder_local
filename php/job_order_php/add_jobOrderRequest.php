<?php 
include('../../session.php');
include('../../assets/connection.php');

require "../../vendor/autoload.php";  // Ensure Composer's autoload is included
use WebSocket\Client;

// Check if the user has a pending request
$sql = "SELECT COUNT(*) AS pending_count FROM efms_joborder.job_order_request 
        WHERE (requestStatus = 'Pending' OR requestStatus = 'On-Process' OR requestStatus = 'Evaluation') 
        AND CAST(JSON_EXTRACT(requestBy, '$.bioID') AS UNSIGNED) = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([$_SESSION['user']]);
$data = $stmt->fetch(PDO::FETCH_ASSOC);
$pending_count = $data['pending_count'];

if ($pending_count >= 1) {
    echo "pending";
} else {
    // Prepare the request object
    $object = $_POST;
    $object["requestBy"] = [
        "name" => $_SESSION['name'],
        "bioID" => $_SESSION['user'],
        "division" => $_SESSION['divisionName'],
        "section" => $_SESSION['sectionName'],
        "exact_location" => $_POST['requestExactFrom']
    ];

    $category = $object['requestCategory'];

    // STEP 2: Get current year and month
    $year = date('Y');   // e.g., 2025
    $month = date('m');  // e.g., 05

    // STEP 3: Pattern for current category and month
    $likePattern = "$category-$year-$month-%";

    // STEP 4: Get the latest requestNo for this category and month
    $sql = "SELECT requestNo FROM job_order_request 
            WHERE requestNo LIKE ? 
            ORDER BY requestNo DESC 
            LIMIT 1";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$likePattern]);
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    // STEP 5: Compute next sequence number
    if ($data && preg_match('/(\d+)$/', $data['requestNo'], $matches)) {
        $lastSeqNum = intval($matches[1]);
        $nextSeqNum = $lastSeqNum + 1;
    } else {
        $nextSeqNum = 1;
    }

    $formattedSeq = str_pad($nextSeqNum, 3, '0', STR_PAD_LEFT); // e.g. 001

    // STEP 6: Final formatted request number
    $requestNo = "$category-$year-$month-$formattedSeq";

    // Insert new record
    $sql = "INSERT INTO job_order_request 
            (requestNo, requestDate, requestFrom, requestBy, requestCategory, requestSubCategory, requestDescription, requestStatus) 
            VALUES (?, ?, ?, ?, ?, ?, ? ,?)";

    $stmt = $pdo->prepare($sql);
    $success = $stmt->execute([
        $requestNo,
        $object["requestDate"],
        $_SESSION['sectionName'],
        json_encode($object["requestBy"]),
        $object["requestCategory"],
        $object["requestSubCategory"],
        $object["requestDescription"],
        $object["requestStatus"],
    ]);

    if ($success) {
        try {
            // $client = new Client("ws://192.168.42.222:8080");
            // $client->send(json_encode(["action" => "refreshIncomingTable"]));
            // $client->send(json_encode(["action" => "refreshPendingTableUser"]));


            $client = new Client("ws://192.168.42.14:8082");
            $client->send(json_encode(["action" => "refreshIncomingTable"]));
            $client->send(json_encode(["action" => "refreshPendingTableUser"]));
            $client->close();
            echo "success";

        //     echo json_encode([
        //     "success" => true,
        //     "reception_time" => date("Y-m-d H:i:s")
        // ]);
        } catch (Exception $e) {
            echo "WebSocket error: " . $e->getMessage();
        }   
        
        $module = "add-job-order-request";
        $action = "add-request";
        $details = "adding a request.";
        include('../transaction_log.php');

    } else {
        echo "error";
    }
}
