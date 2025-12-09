<?php 
    include('../session.php');
    include('../assets/connection.php');
    // include('../assets/mssql_connection.php');

    $sql = "SELECT techBioID, firstName, lastName, middle, techCategory, role FROM efms_technicians";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $employees = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // echo '<pre>'; print_r($employees);  echo '</pre>';

    // Categorize employees
    $categories = [
        "free_agents" => [],
        "IU" => [],
        "MU" => [],
        "EU" => []
    ];

    foreach ($employees as $employee) {
        $category = isset($employee['techCategory']) ? $employee['techCategory'] : "free_agents";
        if (isset($categories[$category])) {
            $categories[$category][] = $employee;
        }
    }


    // Function to generate draggable span elements
    function generateDraggableSpans($employees, $extraClass = "") {
        $output = "";
        foreach ($employees as $perHead) {
            if ($perHead['role'] == 'tech') {
                $output .= '<span class="draggable ' . $extraClass . '" draggable="true" id="' . $perHead['techBioID'] . '">'
                    . strtoupper($perHead['lastName']) . ', ' . strtoupper($perHead['firstName']) .
                    // delete button
                    '<i class="delete-btn fa-solid fa-trash" data-id="' . $perHead['techBioID'] . '"></i>'
                    . '</span>';
            }
        }
        return $output;
    }

    // echo '<pre>'; print_r($categories['free_agents']);  echo '</pre>';

    // $sql = "DELETE FROM efms_technicians WHERE techBioID=4826";
    // $stmt = $pdo->prepare($sql);
    // $stmt->execute();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" href="../css/admin_management.css">
    <link rel="stylesheet" href="../css/sidebar.css">
    <link rel="stylesheet" href="../css/navbar.css">

    <?php require "../links/header_link.php" ?>

    <title>Admin Account Management</title>
</head>
<body>

    <?php 
        $view = "admin-management-sub-div";
        $sub_view = "employee-admin-sub-down-div";
        include("./sidebar.php");
    ?>

    <div class="right-container">
        <?php 
            // $view = "Admin Management";
            // include("./navbar.php");
        ?>

        <div class="manage-accts-div">
            <div class="draft-function-div">
                <h5>Unassign Employees</h5>
                <div class="function-unassign-div">
                    <button id="refresh-drag-btn">Refresh Employee List</button>
                    <button id="multi-select-drag-btn">Multi Select</button>
                    <div class="search-div">
                        <input type="text" id="search-input" placeholder="Search Employee" autocomplete="off">
                        <button id="search-btn">Search</button>
                    </div>
                </div>
            </div>

            <div class="draft-container-div">
                
                <div class="free-agents">
                    <?= generateDraggableSpans($categories['free_agents']) ? generateDraggableSpans($categories['free_agents']) : "No Data"; ?>
                </div>
                
                <div class="loader"></div>

            </div>

            <div class="category-container">
                <?php
                $category_names = ["IU", "EU" , "MU"];
                

                foreach ($category_names as $category) {
                    $cat_name = "";
                    if($category == 'IU'){
                        $cat_name = "INFRA / PLANNING UNIT";
                    }else if($category == 'MU'){
                        $cat_name = "MECHANICAL UNIT";
                    }
                    else if($category == 'EU'){
                        $cat_name = "ELECTRICAL UNIT";
                    }

                    $sql = "SELECT firstName, lastName, middle FROM efms_technicians WHERE role='unit_admin' AND techCategory =?";
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute([$category]);
                    $tech_admin = $stmt->fetch(PDO::FETCH_ASSOC);

                    $categoryID = $category;
                    echo '
                    <div class="container">
                        <div class="title">' . $cat_name . ' </div>
                        <div class="title-search-div"> 
                            <i class="fa-solid fa-magnifying-glass title-search-icon"></i>
                            <input type="text" class="title-search-input" placeholder="Search" />
                        </div>
                        <div class="draggable-container" id="' . $categoryID . '-category">
                            <span class="tech-admin-span">' . $tech_admin['lastName'] . ", " . $tech_admin['firstName'] . '</span>
                            ' . (isset($categories[$categoryID]) ? generateDraggableSpans($categories[$categoryID], "draggable-done") : "") . '
                        </div>
                    </div>';
                }
                ?>
            </div>

            <div class="function-btn">
                <div class="function-sub-btn">
                    <!-- <button type="button" class="btn btn-primary" id="add-personel-btn">Add Personnels</button> -->
                    <button type="button" class="btn btn-primary" id="move-personel-btn">Move Personnels</button>
                </div>
            
                <div class="confirmation-btn">
                    <button type="button" class="btn btn-success" id="save-btn">SAVE</button>
                    <button type="button" class="btn btn-danger" id="cancel-btn">CANCEL</button>
                </div>
            </div>
        </div>

                        

    </div>
    
    <div class="modal fade" id="modal-notif" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-dialog-top" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 id="modal-title-incoming" class="modal-title-incoming" id="exampleModalLabel">Successfully Updated</h5>
                </div>
                <div id="modal-body-incoming" class="modal-body-incoming ml-2">
                    
                </div>
                <div class="modal-footer">
                    <button id="close-modal-btn-incoming" type="button" type="button" data-bs-dismiss="modal">CLOSE</button>
                </div>
            </div>
        </div>
    </div>

    

    <?php require "../links/script_links.php" ?>
    <script src="../assets/script.js?v=<?php echo time(); ?>"></script>
    <script src="../js/sidebar_traverse.js?v=<?php echo time(); ?>"></script>
    <script src="../js/admin_management_js/admin_management.js?php echo time(); ?>"></script>
    <!-- <script src="../js/admin_management_js/admin_management_traverse.js?php echo time(); ?>"></script> -->
</body>
</html>