<?php 
    
    // $sql = "SELECT permission FROM permission WHERE role=?";
    // $stmt = $pdo->prepare($sql);
    // $stmt->execute([$_SESSION['role']]);
    // $permission_account = $stmt->fetch(PDO::FETCH_ASSOC);
    // $permissions = json_decode($permission_account['permission'], true);

    // echo json_encode($_SESSION);     
    

    // echo  $_SESSION["role"];
    // if()

    $username_role = "";
    if ($_SESSION['role'] == 'super_admin') {
        // Super admin role
        $username_role = "Super Admin";

    } 
    else if ($_SESSION['role'] == 'unit_admin') {
        // Get the category (IU, EU, MU) for this unit admin
        $sql = "SELECT techCategory FROM efms_technicians WHERE techBioID=?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$_SESSION['user']]);
        $tech_category = $stmt->fetch(PDO::FETCH_ASSOC);
        $username_role = $tech_category ? strtoupper($tech_category['techCategory']) . " Unit Admin" : "Unit Admin";

    } 
    else if ($_SESSION['role'] == 'unit_semi_admin') {
        // Get the category (IU, EU, MU) for this unit admin
        $sql = "SELECT techCategory FROM efms_technicians WHERE techBioID=?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$_SESSION['user']]);
        $tech_category = $stmt->fetch(PDO::FETCH_ASSOC);
        $username_role = $tech_category ? strtoupper($tech_category['techCategory']) . " Unit Semi Admin" : "Unit Semi Admin";

    } 
    else if ($_SESSION['role'] == 'tech') {
        // Regular technician – show their unit
        $sql = "SELECT techCategory FROM efms_technicians WHERE techBioID=?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$_SESSION['user']]);
        $tech_category = $stmt->fetch(PDO::FETCH_ASSOC);
        $username_role = $tech_category ? strtoupper($tech_category['techCategory']) . " Technician" : "Technician";

    } else {
        // Default for requestors or users
        $username_role = "User";
    }


    // check the current number of incoming requests after refresh
    $sql = "SELECT COUNT(*) as count FROM job_order_request WHERE requestStatus='Pending'";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $incoming_request_count = $stmt->fetch(PDO::FETCH_ASSOC);
    $incoming_request_count = $incoming_request_count['count'];

    $sql = "SELECT COUNT(*) as count FROM updates WHERE status='completed'";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $update_count = $stmt->fetch(PDO::FETCH_ASSOC);
    $update_count = $update_count['count'];
?>
    <div class="left-container">
        <div class="home-name-div">
             <h1>EFMS TICKETING SYSTEM</h1>
        </div>

        <div class="side-bar-route">
            <div class="side-bar-routes" id="request-form-sub-div">
                <i class="fa-solid fa-box"></i>
                <span>Request Form</span>
            </div>

            <?php if ($_SESSION['role'] == 'super_admin' || $_SESSION['role'] == 'unit_admin' || $_SESSION['role'] == 'unit_semi_admin') { ?>
            <div class="side-bar-routes" id="incoming-request-sub-div">
                <i class="fa-solid fa-box"></i>
                <audio id="notificationSound" src="../source/sounds/efms_alarm.wav" preload="auto" loop></audio>
                <span>Incoming Request</span>

                <span id="notif-value">0</span>
            </div>
            <?php }; ?>

            <?php if ($_SESSION['role'] == 'tech') { ?>
            <div class="side-bar-routes" id="assigned-request-sub-div">
                <i class="fa-solid fa-box"></i>
                <audio id="notificationSound" src="../source/sounds/efms_alarm.wav" preload="auto" loop></audio>
                <span>Assigned Request</span>

                <span id="notif-value">0</span>
            </div>
            <?php }; ?>

            <?php if ($_SESSION['role'] == 'super_admin') { ?>
            <div class="side-bar-routes" id="admin-management-sub-div">
                <i class="fa-solid fa-box"></i>
                <span>Admin Management</span>
                <i id="adminmanage-arrow" class="fa-solid fa-caret-down"></i>
            </div>
            <?php }; ?>

            <div class="sub-down-div" id="adminmanage-sub-down-div">
                <?php if ($_SESSION['role'] == 'super_admin') { ?>
                    <div class="sub-down-bar-routes" id="employee-admin-sub-down-div">
                        <i class="fa-solid fa-box"></i>
                        <span>Personnel Management</span>
                    </div>
                <?php }; ?>

                <?php if ($_SESSION['role'] == 'super_admin') { ?>
                    <div class="sub-down-bar-routes" id="adminacc-admin-sub-down-div">
                        <i class="fa-solid fa-box"></i>
                        <span>Admin Account</span>
                    </div>
                <?php }; ?>

                <!-- <div class="sub-down-bar-routes" id="user-admin-sub-down-div">
                    <i class="fa-solid fa-box"></i>
                    <span>Users</span>
                </div> -->
            </div>
            
            
            <?php if ($_SESSION['role'] == 'super_admin' || $_SESSION['role'] == 'unit_admin' || $_SESSION['role'] == 'unit_semi_admin') { ?>
            <div class="side-bar-routes" id="dashboard-sub-div">
                <i class="fa-solid fa-box"></i>
                <span>EFMS Dashboard</span>
                <i id="dashboard-arrow" class="fa-solid fa-caret-down"></i>
            </div>

            <div class="sub-down-div" id="dashboard-sub-down-div">

                <div class="sub-down-bar-routes" id="req-dashboard-sub-down-div">
                    <i class="fa-solid fa-box"></i>
                    <span>Requests</span>
                </div>

                <div class="sub-down-bar-routes" id="tech-dashboard-sub-down-div">
                    <i class="fa-solid fa-box"></i>
                    <span>Technicians</span>
                </div>

                <div class="sub-down-bar-routes" id="user-dashboard-sub-down-div">
                    <i class="fa-solid fa-box"></i>
                    <span>Users</span>
                </div>
            </div>            
            <?php }; ?>

            <?php if ($_SESSION['role'] == 'super_admin' || $_SESSION['role'] == 'unit_admin' || $_SESSION['role'] == 'unit_semi_admin' || $_SESSION['role'] == 'tech') { ?>
                <div class="side-bar-routes" id="report-sub-div">
                    <i class="fa-solid fa-box"></i>
                    <span>Reports</span>
                </div>
            <?php }; ?>

            <hr id="sub-routes-hr">
            <?php if ($_SESSION['role'] == 'super_admin' || $_SESSION['role'] == 'unit_admin' || $_SESSION['role'] == 'unit_semi_admin' || $_SESSION['role'] == 'tech') { ?>
                <div class="side-bar-routes" id="update-sub-div">
                    <i class="fa-solid fa-box"></i>
                    <span>Updates</span>
                    <span id="notif-value-updates">0</span>
                    <!-- <i id="adminmanage-arrow" class="fa-solid fa-caret-down"></i> -->
                </div>
            <?php }; ?>

            <?php if ($_SESSION['role'] == 'super_admin' || $_SESSION['role'] == 'unit_admin' || $_SESSION['role'] == 'unit_semi_admin' || $_SESSION['role'] == 'tech') { ?>
                <div class="side-bar-routes" id="concerns-sub-div">
                    <i class="fa-solid fa-box"></i>
                    <span>Concerns / Issues / Bugs</span>
                    <!-- <i id="adminmanage-arrow" class="fa-solid fa-caret-down"></i> -->
                </div>
            <?php }; ?>

            
        </div>

        <div class="user-acc-div">
            <div class="user-info">
                <img src="../source/home_img/user.png" alt="user-img"> 
                <p><span><?php echo $username_role ?> </span>| <?php echo $_SESSION['name'] ?></p>
            </div>
            <button class="logout-btn" id="logout-btn"><i class="fa-solid fa-right-from-bracket"></i> Logout</button>
            
        </div>
    </div>

    <div class="modal fade" id="modal-logout" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-dialog-top" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 id="modal-title-incoming" class="modal-title-incoming" id="exampleModalLabel">Are you sure you want to logout?</h5>
                </div>
                <div id="modal-body-incoming" class="modal-body-incoming ml-2">
                    
                </div>
                <div class="modal-footer">
                    <button id="yes-modal-btn-logout" type="button" type="button" data-bs-dismiss="modal">YES</button>
                    <button id="no-modal-btn-logout" type="button" type="button" data-bs-dismiss="modal">NO</button>
                </div>
            </div>
        </div>
    </div>

    <script> 
        var view = "<?php echo $view ?>";
        var sub_view = "<?php echo $sub_view ?>";
        
        var incoming_request_count = <?php echo $incoming_request_count ?>;
        var update_count = <?php echo $update_count ?>;
        // const audio = new Audio('../source/sound/shopee.mp3'); // Load the notification sound
        // let previousResponse = 0; // Store the previous count to prevent duplicate sounds

        // const fetchIncomingOrder = () => {
        //     $.ajax({
        //         url: '../php/fetch_incoming_order.php',
        //         method: "GET",
        //         success: function(response) {
        //             console.log(response);
        //             response = parseInt(response);

        //             if (response > 0) {
        //                 $('#bell-notif').removeClass('hidden'); // Show bell notification
        //                 audio.play();
        //             } else {
        //                 $('#bell-notif').addClass('hidden'); // Hide bell notification
        //             }

        //             previousResponse = response; // Update previous response count
        //         }
        //     });
        // };Sear

        // // Run the function every 5 minutes (300000ms)
        // setInterval(fetchIncomingOrder, 300000);

        // // Run immediately on page load
        // fetchIncomingOrder();
    </script>