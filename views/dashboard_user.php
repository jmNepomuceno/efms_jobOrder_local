<?php 
    include('../session.php');
    include('../assets/connection.php');

    $sql = "SELECT PGSDivisionName, PGSDivisionID FROM pgsdivision";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $division_data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $sql = "SELECT sectionName, division, sectionID FROM pgssection";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $section_data = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" href="../css/dashboard_user.css">
    <link rel="stylesheet" href="../css/sidebar.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/highcharts-3d.js"></script>


    <?php require "../links/header_link.php" ?>

    <title>Users Dashboard</title>
</head>
<body>

    <?php 
        $view = "dashboard-sub-div";
        $sub_view = "user-dashboard-sub-down-div";
        include("./sidebar.php");
    ?>

    <div class="right-container">
        <div class="dashboard-container">
            <div class="dashboard-content-div">
                <div class="request-conent-div">

                    <div class="double-date-div">
                        <div class="start-date-div">
                            <span id="start-date-span">Select Start Date: </span>
                            <input id="start-date-input" type="date">
                        </div>
                        <div class="end-date-div">
                            <span id="end-date-span">Select End Date: </span>
                            <input id="end-date-input" type="date">
                        </div>
                        <div class="division-div">
                            <select id="division-select">
                                <option value="" disabled selected>Select Division</option>
                                <?php foreach ($division_data as $division): ?>
                                    <option value="<?= htmlspecialchars($division['PGSDivisionID']) ?>">
                                        <?= htmlspecialchars($division['PGSDivisionName']) ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>

                        <div class="section-div">
                            <select id="section-select">
                                <option value="" selected>Select the Section</option>
                            </select>
                        </div>

                        <button id="filter-date-search-btn" type="button" class="btn btn-secondary">Generate</button>
                        <button id="filter-date-search-btn" type="button" class="btn btn-secondary">Clear</button> <!-- to generate back to normal or today -->
                    </div>
                    
                    <h1>Requests Per Division: </h1>
                    
                    <div class="dashboard-row">
                        <div class="chart-card">
                            <h4>Top Requesting Divisions / Sections</h4>
                            <button class="info-btn" data-info="Shows which sections or divisions have made the most requests over the selected period. Useful for identifying areas with the highest activity.">
                                <i class="fas fa-question-circle"></i>
                            </button>
                            <div id="top-requesting-sections-chart" style="width:100%; min-height:400px;"></div>
                        </div>

                        <div class="chart-card">
                            <h4>Request Volume Trend (Over Time by Users)</h4>
                            <button class="info-btn" 
                                data-info="Shows how many requests were submitted over time by users. Helps track peaks in activity or workload patterns.">
                                <i class="fas fa-question-circle"></i>
                            </button>
                            <div id="request-volume-trend-chart" style="width:100%; min-height:400px;"></div>
                        </div>
                    </div>

                    <div class="dashboard-row">
                        <div class="chart-card">
                            <h4>Average Evaluation Rating per Division</h4>
                            <button class="info-btn" 
                                data-info="Displays the average evaluation score per division based on user feedback (questions Q1–Q5). Helps identify divisions with the highest service satisfaction.">
                                <i class="fas fa-question-circle"></i>
                            </button>
                            <div id="average-rating-per-division-chart" style="width:100%; min-height:400px;"></div>
                        </div>

                        <div class="chart-card">
                            <h4>Average Completion Time by Division</h4>
                            <button class="info-btn" data-info="Shows the average number of hours taken to complete requests in each division. Helps identify which divisions have faster or slower turnaround times.">
                                <i class="fas fa-question-circle"></i>
                            </button>
                            <div id="average-completion-time-chart" style="width:100%; min-height:400px;"></div>
                        </div>

                    </div>

                    <div class="dashboard-row">
                        <div class="chart-card">
                            <h4>Top 5 Requestors (Most Active Users)</h4>
                            <button class="info-btn" 
                                data-info="Displays the users who have made the most job order requests within the selected period. Helps identify the most active requestors.">
                                <i class="fas fa-question-circle"></i>
                            </button>
                            <div id="top-requestors-chart" style="width:100%; min-height:400px;"></div>
                        </div>

                        <div class="chart-card">
                            <h4>Cancelled or Rejected Requests (Trend)</h4>
                            <button class="info-btn" 
                                data-info="Displays the trend of requests that were either cancelled or rejected over time. Helps track fluctuations in unsuccessful job order requests.">
                                <i class="fas fa-question-circle"></i>
                            </button>
                            <div id="cancelled-rejected-trend-chart" style="width:100%; min-height:400px;"></div>
                        </div>
                    </div>


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
    <script src="../js/dashboard_user_js/dashboard_user.js?php echo time(); ?>"></script>

    <script>
        var section_data = <?php echo json_encode($section_data); ?>;
        var division_data = <?php echo json_encode($division_data); ?>;
    </script>
</body>
</html>