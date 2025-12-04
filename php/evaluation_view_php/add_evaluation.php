<?php 
    include('../../session.php');
    include('../../assets/connection.php');
    $current_date = date('m/d/Y - h:i:s A');

    require "../../vendor/autoload.php";  // Ensure Composer's autoload is included
    use WebSocket\Client;


    $requestNo = $_POST['requestNo'];
    $evaluation = [
        "q1" => $_POST['q1'],
        "q2" => $_POST['q2'],
        "q3" => $_POST['q3'],
        "q4" => $_POST['q4'],
        "q5" => $_POST['q5'],
        "comments" => $_POST['comment']
    ];

    $evaluationJSON = json_encode($evaluation);
    
    $sql = "UPDATE job_order_request SET requestEvaluation=?, requestCompletedDate=?, requestStatus='Completed' WHERE requestNo=?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$evaluationJSON , $current_date, $requestNo]);

    // websocket server
    $client = new Client("ws://192.168.42.14:8082");
    $client->send(json_encode(["action" => "refreshDoneEvaluationTableUser"]));

    $module = "request-evaluation-done";
    $action = "evaluation-to-completed";
    $details = "Completed Request";
    include('../transaction_log.php');

    // update the request status to be finl completed
    // echo json_encode($_POST);
    
?>