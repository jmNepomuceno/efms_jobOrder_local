<?php 
    include('../session.php');
    include('../assets/connection.php');

    // echo "<pre>"; print_r($_SESSION); echo "</pre>";
    $isAdmin = ($_SESSION['user'] === 3858);

    // $sql = "UPDATE updates SET status='ongoing' WHERE id=1";
    // $stmt = $pdo->prepare($sql);
    // $stmt->execute();

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EFMS-APP</title>
    <link rel="stylesheet" href="../css/report.css">
    <link rel="stylesheet" href="../css/sidebar.css">
    <link rel="stylesheet" href="../css/navbar.css">

    <?php require "../links/header_link.php" ?>

</head>
<body>
    <script>
        let isAdmin = <?= $isAdmin ? 'true' : 'false' ?>;
    </script>
    <?php 
        $view = "report-sub-div";
        $sub_view = "none";
        include("./sidebar.php");
    ?>

    <div class="right-container">
        <div class="job-order-summary-wrapper">
            <div class="job-order-filter-wrapper">
                <div class="filter-group">
                    <label>Date From</label>
                    <input type="date" id="filter-start-date">
                </div>

                <div class="filter-group">
                    <label>Date To</label>
                    <input type="date" id="filter-end-date">
                </div>

                <div class="filter-group">
                    <label>Category</label>
                    <select id="filter-category">
                        <option value="ALL">All</option>
                        <option value="IU">IU</option>
                        <option value="EU">EU</option>
                        <option value="MU">MU</option>
                    </select>
                </div>

                <div class="filter-group">
                    <label>Technician (Bio ID)</label>
                    <input type="number" id="filter-techBioID" placeholder="Optional">
                </div>

                <div class="filter-action-group">
                    <button id="filter-apply-btn" class="btn btn-primary">
                        Apply Filter
                    </button>

                    <button id="filter-reset-btn" class="btn btn-secondary">
                        Reset
                    </button>
                </div>

            </div>

            <table id="job-order-summary-table" class="display nowrap" style="width:100%">
                <thead></thead>
                <tbody></tbody>
            </table>
        </div>

    </div>


    <!-- Modal for Adding Suggestion -->
    

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
    <script src="../js/report_js/report.js?v=<?php echo time(); ?>"></script>

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
 