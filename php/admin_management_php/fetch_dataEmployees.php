<?php
include ('../../session.php');
include('../../assets/connection.php');
// include('../../assets/mssql_connection.php');

$current_date = date('m/d/Y - h:i:s A');

try {
    // Get existing employees
    $sql = "SELECT techBioID FROM efms_technicians";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $existingEmployees = $stmt->fetchAll(PDO::FETCH_COLUMN); // Fetch only techBioID

    // // Fetch HRIS data
    // $sql = "SELECT bioID, LastName, FirstName, Middle, employmentStatus FROM dbo.tblEmployee WHERE sectionID = 23";
    // $stmt = $pdo2->prepare($sql);
    // $stmt->execute();
    // $data_hris = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // $newEntries = [];
    // $insert_sql = "INSERT INTO efms_technicians (techBioID, firstName, lastName, middle, employmentStatus, role) 
    //                VALUES (?, ?, ?, ?, ?, ?)";
    // $insert_stmt = $pdo->prepare($insert_sql);

    // foreach ($data_hris as $row) {
    //     // Check if this bioID exists in efms_technicians
    //     if (!in_array($row['bioID'], $existingEmployees)) {
    //         // Insert new record
    //         $insert_stmt->execute([
    //             $row['bioID'],
    //             $row['FirstName'],
    //             $row['LastName'],
    //             $row['Middle'],
    //             $row['employmentStatus'],
    //             "tech"
    //         ]);
    //         $newEntries[] = $row['bioID']; // Store new IDs
    //     }
    // }

    $output = "";

    if(count($newEntries) > 0) {
        // Fetch only newly inserted employees
        $sql = "SELECT techBioID, firstName, lastName, middle FROM efms_technicians WHERE techBioID IN (" . implode(',', array_fill(0, count($newEntries), '?')) . ")";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($newEntries);
        $employees = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Generate HTML output only for new employees
        foreach ($employees as $perHead) {
            $output .= '<span class="draggable" draggable="true" id="' . $perHead['techBioID'] . '">'
                    . strtoupper($perHead['lastName']) . ', ' . strtoupper($perHead['firstName']) .
                    '</span>';
        }

        echo $output;
    } else {
        echo "No new entries";
    }

} catch (PDOException $e) {
    die("Database error: " . $e->getMessage());
}

?>
