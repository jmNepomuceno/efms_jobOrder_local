<?php
  $host2 = '192.168.42.10,1435';
  $dbname2 = 'BGH_HRMv2';
  $user2 = 'sa';
  $password2 = 'Pr0f1l3R';

  try {
    $pdo2 = new PDO("sqlsrv:Server=$host2;Database=$dbname2", $user2, $password2);
    $pdo2->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  } catch(PDOException $e) {
    echo "DB Connection Failed: " . $e->getMessage();
  }
?>