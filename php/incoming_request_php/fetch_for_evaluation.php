<?php
include ('../../session.php');
include('../../assets/connection.php');

try {
    $sql = "SELECT COUNT(*) AS count FROM job_order_request WHERE requestStatus='Evaluation' AND processedBy=?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$_SESSION['name']]);
    $my_jobs_data = $stmt->fetch(PDO::FETCH_ASSOC);
    $count_evaluation = $my_jobs_data['count'];

    echo $count_evaluation;

} catch (PDOException $e) {
    die("Database error: " . $e->getMessage());
}

?>
