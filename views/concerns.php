<?php 
    include('../session.php');
    include('../assets/connection.php');

    // echo "<pre>"; print_r($_SESSION); echo "</pre>";

    $isAdmin = ($_SESSION['user'] === 3858); 
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EFMS-APP</title>
    <link rel="stylesheet" href="../css/concerns.css">
    <link rel="stylesheet" href="../css/sidebar.css">
    <link rel="stylesheet" href="../css/navbar.css">

    <?php require "../links/header_link.php" ?>

</head>
<body>
    <script>
        let isAdmin = <?= $isAdmin ? 'true' : 'false' ?>;
    </script>

    <?php 
        $view = "concerns-sub-div";
        $sub_view = "none";
        include("./sidebar.php");
    ?>

    <div class="right-container">
        <?php 
            // $view = "home";
            // include("./navbar.php");
        ?>
        <div class="concern-container">

            <!-- Send Concern Form -->
            <?php if($isAdmin == false){ ?>
                    <div class="concern-form-card">
                        <h2>Submit a Concern / Bug Report</h2>

                        <div class="form-group">
                            <label>Concern Title</label>
                            <input type="text" id="concern-title" placeholder="Short summary of the issue">
                        </div>

                        <div class="form-group">
                            <label>Describe the Issue</label>
                            <textarea id="concern-description" rows="4" placeholder="Explain the issue, how it happens, steps to reproduce..."></textarea>
                        </div>

                        <button id="submit-concern-btn">Submit Concern</button>
                    </div>
                <hr>
           <?php }?>
           

            <!-- User Concerns List -->
            <h2>Your Concerns</h2>
            <table class="concern-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="concern-list">
                    <!-- Concerns will be appended here -->
                </tbody>
            </table>

        </div>

        <!-- Concern Expanded Details Template -->
        <script type="text/template" id="concern-detail-template">
            <tr class="concern-details-row">
                <td colspan="4">
                    <div class="details-box">

                        <div class="details-header">
                            <strong>Concern Details</strong>
                            <button class="close-details-btn">Close</button>
                        </div>

                        <p><strong>Description:</strong><br>__DESCRIPTION__</p>
                        <p><strong>Admin Response:</strong><br>__RESPONSE__</p>

                        <div class="admin-response-box">
                            <textarea class="response-input" rows="2" placeholder="Write a response..."></textarea>
                            <button class="send-response-btn">Send Response</button>
                        </div>

                    </div>
                </td>
            </tr>
        </script>


    </div>


    <div class="modal fade" id="modal-notif" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-dialog-top" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 id="modal-title-incoming" class="modal-title-incoming" id="exampleModalLabel">Your Cart</h5>
                </div>
                <div id="modal-body-incoming" class="modal-body-incoming ml-2">
                    
                </div>
                <div class="modal-footer">=
                    <button id="close-modal-btn-incoming" type="button" type="button" data-bs-dismiss="modal">CLOSE</button>
                </div>
            </div>
        </div>
    </div>

    <?php require "../links/script_links.php" ?>

    <script> </script>
    <script src="../assets/script.js?v=<?php echo time(); ?>"></script>
    <script src="../js/sidebar_traverse.js?v=<?php echo time(); ?>"></script>
    <script src="../js/concerns_js/concerns.js?v=<?php echo time(); ?>"></script>

    <!-- <script src="../js/home_traverse.js?v=<?php echo time(); ?>"></script> -->
    <!-- <script src="../js/home_function.js?v=<?php echo time(); ?>"></script> -->
    
    <script>
        const fetchNotifValue = () =>{
            $.ajax({
                url: '../php/incoming_request_php/fetch_notifValue.php',
                method: "POST",
                dataType : 'json',
                success: function(response) {
                    try { 
                        // console.log(response)
                        const pending_value = parseInt(response.count_pending)
                        const myJob_value = parseInt(response.count_evaluation) + parseInt(response.count_onProcess)
                        const onProcess_value = parseInt(response.count_onProcess)
                        const evaluation_value = parseInt(response.count_evaluation)
                        
                        console.log(356, pending_value)

                        if(pending_value > 0){
                            $('#jobOrder-notif-span').text(pending_value)
                            $('#jobOrder-notif-span').css('display' , 'block')

                            $('#notif-value').text(pending_value);
                            $('#notif-value').css('display', 'flex');

                        }else{
                            $('#jobOrder-notif-span').css('display' , 'none')
                            
                            $('#notif-value').text(pending_value);
                            $('#notif-value').css('display', 'none');
                        }
                        
                        if(myJob_value > 0){
                            $('#your-job-notif-span').text(myJob_value)
                            $('#your-job-notif-span').css('display' , 'block')

                        }else{
                            $('#your-job-notif-span').css('display' , 'none')
                        }

                        if(onProcess_value > 0){
                            $('#on-process-notif-span').text(onProcess_value)
                            $('#on-process-notif-span').css('display' , 'block')
                        }else{
                            $('#on-process-notif-span').css('display' , 'none')
                        }

                        
                        if(evaluation_value > 0){
                            $('#for-evaluation-notif-span').text(evaluation_value)
                            $('#for-evaluation-notif-span').css('display' , 'block')
                        }else{
                            $('#for-evaluation-notif-span').css('display' , 'none')
                        }

                    } catch (innerError) {
                        console.error("Error processing response:", innerError);
                    }
                },
                error: function(xhr, status, error) {
                    console.error("AJAX request failed:", error);
                }
            });
        }

        socket.onmessage = function(event) {
            let data = JSON.parse(event.data);
            console.log("Received from WebSocket:", data); // Debugging

            // Call fetchNotifValue() on every process update
            switch (data.action) {
                case "refreshIncomingTable":
                    fetchNotifValue()
                    break;
                default:
                    console.log("Unknown action:", data.action);
            }
        };
        fetchNotifValue()

    </script>
</body>
</html>
 