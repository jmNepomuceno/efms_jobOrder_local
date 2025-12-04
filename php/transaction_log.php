<?php 
    $user_id = $_SESSION['user'];
    $date = date('m/d/Y - h:i:s A');


    $sql = "INSERT INTO transaction_logs 
            (user_id, module, action, details, date) 
            VALUES (?, ?, ?, ?, ?)";

    $stmt = $pdo->prepare($sql);
    $success = $stmt->execute([
        $user_id,
        $module,
        $action,
        $details,
        $date
    ]);
?> 