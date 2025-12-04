<?php
include ('../../session.php');
include('../../assets/connection.php');

$current_date = date('m/d/Y - h:i:s A');
require "../../vendor/autoload.php";  // Ensure Composer's autoload is included
use WebSocket\Client;

try {
    if($_POST['cancelRequest'] === 'from_correction'){
        $sql = "UPDATE job_order_request SET requestStatus='Cancelled', cancellationDate=? WHERE requestNo=?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$current_date, $_POST['requestNo']]);
    }else{
        $sql = "UPDATE job_order_request SET requestStatus='Cancelled', cancellationRequest=?, cancellationDate=? WHERE requestNo=?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$_POST['cancelRequest'], $current_date, $_POST['requestNo']]);
    }
    
    echo "success";
    $client = new Client("ws://192.168.42.14:8082");
    $client->send(json_encode(["action" => "refreshCancelTableUser"]));

} catch (PDOException $e) {
    die("Database error: " . $e->getMessage());
}

?>
