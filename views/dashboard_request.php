<?php 
    include('../session.php');
    include('../assets/connection.php');
    include('../assets/mssql_connection.php');

    $sql = "SELECT techBioID, firstName, lastName, middle, techCategory FROM efms_technicians";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $employees = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" href="../css/dashboard_request.css">
    <link rel="stylesheet" href="../css/sidebar.css">
    <!-- <link rel="stylesheet" href="../css/navbar.css"> -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <?php require "../links/header_link.php" ?>

    <title>Requests Dashboard</title>
</head>
<body>

    <?php 
        $view = "dashboard-sub-div";
        $sub_view = "req-dashboard-sub-down-div";
        include("./sidebar.php");
    ?>

    <div class="right-container">
        <div class="dashboard-container">
            <div class="dashboard-content-div">
                <div class="request-conent-div">

                    <!-- FILTERS -->
                    <div class="filter-category-div">
                        <span>Filter Unit: </span>
                        <button class="filter-category-active" id="all-filter-btn" data-category="ALL">ALL</button>
                        <button id="iu-filter-btn" data-category="IU">INFRA / PLANNING</button>
                        <button id="eu-filter-btn" data-category="EU">ELECTRICAL</button>
                        <button id="mu-filter-btn" data-category="MU">MECHANICAL</button>
                        <div class="vl"></div>
                        <select id="filter-subCategory-select">
                            <option value="">-- Select Sub Category --</option>

                            <option value="IU">CARPENTRY WORKS</option>
                            <option value="IU">FABRICATION</option>
                            <option value="IU">MASONRY WORKS</option>
                            <option value="IU">WELDING WORKS</option>
                            <option value="IU">PAINTING WORKS</option>
                            <option value="IU">PLUMBING WORKS</option>
                            <option value="IU">ROOFING WORKS</option>
                            <option value="IU">CONDEMN/ASSESSMENTS</option>

                            <option value="EU">ELECTRICAL WORKS</option>
                            <option value="EU">AIRCONDITIONING WORKS</option>
                            <option value="EU">REFRIGERATION WORKS (NON MEDICAL)</option>

                            <option value="MU">PREVENTIVE MAINTENANCE</option>
                            <option value="MU">CALIBRATION</option>
                            <option value="MU">REPAIR (MEDICAL & NON MEDICAL)</option>
                            <option value="MU">CONDEMN/ASSESSMENT</option>
                        </select>
                    </div>

                    <!-- DATE FILTERS -->
                    <div class="double-date-div">
                        <div class="start-date-div">
                            <span id="start-date-span">Select Start Date: </span>
                            <input id="start-date-input" type="date">
                        </div>
                        <div class="end-date-div">
                            <span id="end-date-span">Select End Date: </span>
                            <input id="end-date-input" type="date">
                        </div>
                        <button id="filter-date-search-btn" type="button" class="btn btn-secondary">Search</button>
                    </div>

                    <!-- HEADER -->
                    <h1>EFMS Requests Dashboard</h1>
                    

                    <!-- ROW 1: SUMMARY CARDS -->
                    <div class="request-summary-row">
                        <div class="summary-card">
                            <h3>Total Requests</h3>
                            <p id="total-request-value">0</p>
                        </div>
                        <div class="summary-card">
                            <h3>Completed</h3>
                            <p id="total-request-completed-value">0</p>
                        </div>
                        <div class="summary-card">
                            <h3>Pending</h3>
                            <p id="total-request-pending-value">0</p>
                        </div>
                        <div class="summary-card">
                            <h3>In-Progress</h3>
                            <p id="total-request-onProcess-value">0</p>
                        </div>
                        <div class="summary-card">
                            <h3>Assigned</h3>
                            <p id="total-request-assigned-value">0</p>
                        </div>
                        <div class="summary-card">
                            <h3>Evaluation</h3>
                            <p id="total-request-evaluation-value">0</p>
                        </div>
                        <div class="summary-card">
                            <h3>Correction Requests</h3>
                            <p id="total-request-correction-value">0</p>
                        </div>
                        <div class="summary-card">
                            <h3>Cancelled</h3>
                            <p id="total-request-cancelled-value">0</p>
                        </div>
                        <div class="summary-card">
                            <h3>Pending Materials</h3>
                            <p id="total-request-pending-materials-value">0</p>
                        </div>
                        <div class="summary-card">
                            <h3>% Accomplished</h3>
                            <p id="total-request-accomplished-value">0%</p>
                        </div>
                    </div>

                    <div class="dashboard-row">
                        <div class="chart-card">
                            <!-- a bar chart showing how many job orders or requests were logged at each hour of the day. -->
                            <h4>Requests per hour</h4>
                            <button class="info-btn" data-info="Shows how many job orders were logged at each hour of the day, helping identify peak request times.">
                                <i class="fas fa-question-circle"></i>
                            </button>
                            <div class="canvas-class" id="barGraph"></div>
                        </div>
                        <div class="chart-card">
                            <h4>Requests by Subcategory</h4>
                            <button class="info-btn" data-info="Shows the number of requests per subcategory across all units. Helps identify which types of concerns are most common.">
                                <i class="fas fa-question-circle"></i>
                            </button>
                            <canvas class="canvas-class" id="subCategoryChart"></canvas>
                        </div>
                    </div>

                    <!-- ROW 2: MAIN CHARTS -->
                    <div class="dashboard-row">
                        <div class="chart-card">
                            <h4>Requests Trend Over Time</h4>
                            <button class="info-btn" data-info="Tracks how requests are submitted over time — helps identify patterns, spikes, or declines in activity.">
                                <i class="fas fa-question-circle"></i>
                            </button>
                            <canvas id="requestsOverTimeChart"></canvas>
                        </div>
                        <div class="chart-card">
                            <h4>Status Breakdown</h4>
                            <button class="info-btn" data-info="Compares how many requests fall under each status category for the selected date range.">
                                <i class="fas fa-question-circle"></i>
                            </button>
                            <canvas id="requestStatusBreakdownChart"></canvas>
                        </div>
                    </div>

                    <!-- ROW 3: CATEGORY INSIGHTS -->
                    <div class="dashboard-row">
                        <div class="chart-card">
                            <h4>Requests by Unit</h4>
                            <button class="info-btn" data-info="Visualizes how many requests each technical unit (EU, MU, IU) handled.">
                                <i class="fas fa-question-circle"></i>
                            </button>
                            <canvas id="requestsByCategoryChart"></canvas>
                        </div>
                        <div class="chart-card">
                            <h4>Average Completion Time per Unit</h4>
                            <button class="info-btn" data-info="Shows the average time it takes each unit to complete a job order — shorter bars mean faster response.">
                                <i class="fas fa-question-circle"></i>
                            </button>
                            <canvas id="avgCompletionTimeChart"></canvas>
                        </div>
                    </div>

                    <!-- ROW 4: EVALUATION & COMMON ISSUES -->
                    <div class="dashboard-row">
                        <div class="chart-card">
                            <h4>Average Satisfaction Ratings</h4>
                            <button class="info-btn" data-info="Displays the average ratings from evaluation forms to gauge user satisfaction with each service aspect.">
                                <i class="fas fa-question-circle"></i>
                            </button>
                            <canvas id="evaluationRadarChart"></canvas>
                        </div>
                        <div class="chart-card">
                            <h4>Top 5 Most Common Request Descriptions</h4>
                            <button class="info-btn" data-info="Lists the most frequently reported issues — helps identify recurring maintenance concerns.">
                                <i class="fas fa-question-circle"></i>
                            </button>
                            <canvas id="topRequestsChart"></canvas>
                        </div>
                    </div>

                    <!-- ROW 5: PENDING AGING & DEPARTMENTS -->
                    <div class="dashboard-row">
                        <div class="chart-card">
                            <h4>Requests by Division / Department</h4>
                            <button class="info-btn" data-info="Shows how many job orders were logged by each division or department, helping identify which areas generate the most requests.">
                                <i class="fas fa-question-circle"></i>
                            </button>
                            <canvas id="requestsByDivisionChart"></canvas>
                        </div>

                        <div class="chart-card">
                            <h4>Recent Job Orders</h4>
                            <button class="info-btn" data-info="Shows the latest requests received, including their category, subcategory, and current status.">
                                <i class="fas fa-question-circle"></i>
                            </button>
                            <table id="recentRequestsTable">
                                <thead>
                                    <tr>
                                        <th>Request No</th>
                                        <th>Category</th>
                                        <th>Subcategory</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <!-- dynamically populated -->
                                </tbody>
                            </table>
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

    <!-- 
        //
        total job order recevied
        total job order cpmpleted
        total job pending total job unattended
        total efms for correction request
        total job order reporting
        total job order in-progress
        percetage accomplished
    -->

    

    <?php require "../links/script_links.php" ?>
    <script src="../assets/script.js?v=<?php echo time(); ?>"></script>
    <script src="../js/sidebar_traverse.js?v=<?php echo time(); ?>"></script>
    <script src="../js/dashboard_request_js/dashboard_request.js?php echo time(); ?>"></script>
</body>
</html>