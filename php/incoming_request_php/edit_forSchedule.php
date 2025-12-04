<?php
include ('../../session.php');
include('../../assets/connection.php');

require "../../vendor/autoload.php";  // Ensure Composer's autoload is included
use WebSocket\Client;

$current_date = date('m/d/Y - h:i:s A');

try {
    $sql = "UPDATE job_order_request SET requestStatus='For Schedule', processedBy=?, requestForSchedDate=?, requestForSched=?, processedByID=? WHERE requestNo=?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$_SESSION['name'] ,$current_date ,$_POST['requestJobRemarks'],  $_SESSION['user'], $_POST['requestNo']]);


    try {
        $client = new Client("ws://192.168.42.14:8082");
        $client->send(json_encode(["action" => "refreshCorrectionTableUser"]));
        echo "WebSocket message sent successfully!";

        $module = "request-correction";
        $action = "pending-to-correction";
        $details = "Correction Request";
        include('../transaction_log.php');
    } catch (Exception $e) {
        echo "WebSocket error: " . $e->getMessage();
    }
} catch (PDOException $e) {
    die("Database error: " . $e->getMessage());
}

?>
