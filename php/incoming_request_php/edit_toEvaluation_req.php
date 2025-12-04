<?php
include ('../../session.php');
include('../../assets/connection.php');

require "../../vendor/autoload.php";  // Ensure Composer's autoload is included
use WebSocket\Client;

$current_date = date('m/d/Y - h:i:s A');

try {
    $sql = "UPDATE job_order_request SET requestStatus='Evaluation', requestEvaluationDate=?, requestJobRemarks = ? WHERE requestNo=?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$current_date, $_POST['requestJobRemarks'] , $_POST['requestNo']]);

    // fetch all the start job or on process
    $sql = "SELECT COUNT(*) AS count FROM job_order_request WHERE requestStatus='On-Process' AND processedBy=?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$_SESSION['name']]);
    $my_jobs_data = $stmt->fetch(PDO::FETCH_ASSOC);
    $count_onProcess = $my_jobs_data['count'];

    $sql = "SELECT COUNT(*) AS count FROM job_order_request WHERE requestStatus='Evaluation' AND processedBy=?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$_SESSION['name']]);
    $my_jobs_data = $stmt->fetch(PDO::FETCH_ASSOC);
    $count_evaluation = $my_jobs_data['count'];

    echo json_encode([
        "count_onProcess" => $count_onProcess,
        "count_evaluation" => $count_evaluation,
        "count_yourJob" => $count_evaluation + $count_onProcess
    ]);

    // websocket server
    $client = new Client("ws://192.168.42.14:8082");
    $client->send(json_encode(["action" => "refreshEvaluationTableUser"]));
    $client->send(json_encode(["action" => "refreshOnProcessTableUser"]));

    $module = "request-evaluation";
    $action = "onProcess-to-evaluation";
    $details = "Evaluation Request";
    include('../transaction_log.php');

} catch (PDOException $e) {
    die("Database error: " . $e->getMessage());
}

?>
