<?php
use WebSocket\Client;

// auto_update_on_process.php
// Run this every minute. It updates Assigned -> On-Process when assignTargetStartDate <= now.

date_default_timezone_set('Asia/Manila'); // set to your timezone
$logFile = __DIR__ . '/auto_update_on_process.log';
$maxSize = 1024 * 1024; // 1 MB max size

// Correct paths based on your directory structure
include('../../session.php');
include('../../assets/connection.php');
require '../../vendor/autoload.php';  // composer autoload for websocket


function logMsg($msg) {
    global $logFile;
    file_put_contents($logFile, date('[Y-m-d H:i:s] ') . $msg . PHP_EOL, FILE_APPEND);
}

try {

    logMsg("Script started.");

    // 1) SELECT candidate rows to update (status Assigned and assignTargetStartDate <= NOW())
    // We store dates like "11/06/2025 - 11:25:00 AM". Convert to DATETIME with STR_TO_DATE.
    $sql = "
        SELECT requestNo, assignTargetStartDate, assignTo, assignToBioID, assignBy
        FROM job_order_request
        WHERE requestStatus = 'Assigned'
        AND STR_TO_DATE(assignTargetStartDate, '%m/%d/%Y - %h:%i:%s %p') <= NOW()
    ";
    $stmt = $pdo->query($sql);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($rows)) {
        logMsg("No rows to update.");
        exit;
    }

    // 2) Prepare update statement
    $updateSql = "UPDATE job_order_request
                  SET requestStatus = 'On-Process',
                      requestStartDate = :requestStartDate,
                      processedBy = :processedBy,
                      processedByID = :processedByID
                  WHERE requestNo = :requestNo";
    $updateStmt = $pdo->prepare($updateSql);

    $nowFormatted = date('m/d/Y - h:i:s A');

    $updatedRequests = [];

    foreach ($rows as $r) {
        // Determine processedBy / processedByID logic - choose appropriate values.
        // Here I use assignBy as processedBy and assignToBioID as processedByID (adjust if different).
        $processedBy = $r['assignBy'] ?? null;
        $processedByID = $r['assignToBioID'] ?? null;

        $updateStmt->execute([
            ':requestStartDate' => $nowFormatted,
            ':processedBy' => $processedBy,
            ':processedByID' => $processedByID,
            ':requestNo' => $r['requestNo']
        ]);

        $updatedRequests[] = $r['requestNo'];
        logMsg("Updated requestNo={$r['requestNo']} to On-Process (start={$nowFormatted}).");
    }

    // 3) optionally: write transaction log or transaction_log.php include (if you use it)
    // include __DIR__ . '/../transaction_log.php'; // adapt if needed

    // 4) Broadcast via WebSocket so front-end refreshes immediately
    try {
        $client = new WebSocket\Client("ws://192.168.42.14:8082");
        // send multiple messages to refresh different tables
        $client->send(json_encode(["action" => "refreshOnProcessTableUser"]));
        $client->send(json_encode(["action" => "refreshPendingTableUser"]));
        $client->send(json_encode(["action" => "refreshPendingTableTech"]));
        $client->close();
        logMsg("WebSocket notifications sent.");
    } catch (Exception $e) {
        logMsg("WebSocket send failed: " . $e->getMessage());
    }

    logMsg("Script finished. updated_count=" . count($updatedRequests));

    
    // Check if log file exists and exceeds max size
    if (file_exists($logFile) && filesize($logFile) > $maxSize) {
        // Keep only the last 1000 lines
        $lines = file($logFile);
        $lastLines = array_slice($lines, -1000);
        file_put_contents($logFile, implode("", $lastLines));
        
        // Add note
        file_put_contents($logFile, "\n--- Log trimmed automatically on " . date('Y-m-d H:i:s') . " ---\n", FILE_APPEND);
    }

} catch (PDOException $ex) {
    logMsg("DB error: " . $ex->getMessage());
    exit(1);
} catch (Exception $ex) {
    logMsg("General error: " . $ex->getMessage());
    exit(1);
}
?>
