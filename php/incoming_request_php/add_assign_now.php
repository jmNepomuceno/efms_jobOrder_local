<?php
    include ('../../session.php');
    include('../../assets/connection.php');

    require "../../vendor/autoload.php";  // Ensure Composer's autoload is included
    use WebSocket\Client;

    $current_date = date('m/d/Y - h:i:s A');

    try {
        $sql = "UPDATE job_order_request SET requestStatus='On-Process', processedBy=?, processedByID=?, requestStartDate=? WHERE requestNo=?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$_SESSION['name'] , $_SESSION['user'] ,$current_date , $_POST['requestNo']]);

        // websocket server
        $client = new Client("ws://192.168.42.14:8082");
        $client->send(json_encode(["action" => "refreshOnProcessTableUser"])); 
        $client->send(json_encode(["action" => "refreshPendingTableUser"]));
        $client->send(json_encode(["action" => "refreshPendingTableTech"]));

    } catch (PDOException $e) {
        die("Database error: " . $e->getMessage());
    }
?>
