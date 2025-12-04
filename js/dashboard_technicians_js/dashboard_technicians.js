let requestsPerHourChartInstance; // Declare globally
let category_clicked = "ALL", sub_category_clicked = null, techBioID_clicked = null;
let fetch_viewRequestData;
let techEvalTable;

let modal_view_form = new bootstrap.Modal(document.getElementById('modal-view-form'));

const onLoadFetch_total_request = (startDate, endDate, category, subCategory, techBioID) => {
    console.log("Start Date: ", startDate);
    console.log("End Date: ", endDate);
    console.log("category: ", category);
    console.log("sub category: ", subCategory);
    console.log("techBioID: ", techBioID);
    // startDate = "2025-05-01"
    // endDate = "2025-07-10"
    $.ajax({
        url: '../../php/dashboard_technician_php/fetch_dashboard_technician.php',
        method: 'POST',
        data: {
            startDate: startDate,
            endDate: endDate,
            category: category,
            subCategory: subCategory,
            techBioID: techBioID
        },
        dataType: 'json',
        success: function (response) {
            console.log(response)
            
            barGraph(response.daily_stats)

            technicianPerformanceChart(response.technician_summary); // 👈 add this line
            overdueJobsTable(response.technician_summary); // 👈 add this
            avgResponseTimeChart(response.technician_summary); // 👈 add this
            evaluationInsightsChart(response.technician_summary);
            renderAssignmentFlowChart(response.assignment_flow);
            evaluationBreakdownChart(response.technician_summary);
            evaluationTotalsChart(response.evaluation_breakdown);

            
            kpiCard(startDate, endDate, category, subCategory, techBioID);
            techDataTable(startDate, endDate, category, subCategory, techBioID)
            fetchTechEval(startDate, endDate, category, subCategory, techBioID)
        },
        error: function (err) {
            console.error('AJAX error:', err);
        }
    });
}


const kpiCard = (startDate, endDate, category, subCategory, techBioID) => {
    $.ajax({
        url: '../../php/dashboard_technician_php/fetch_dashboard_tech_kpi.php',
        method: 'POST',
        data: {
            startDate: startDate,
            endDate: endDate,
            category: category,
            subCategory: subCategory,
            techBioID: techBioID
        },
        dataType: 'json',
        success: function (response) {
            console.log(response);

            let totalRequests = 0;
            let totalCompleted = 0;
            let totalAverage = response.averageEvaluationMinutes ? response.averageEvaluationMinutes : 0; // Ensure it's a number
            let totalCorrection = 0;
            let totalUnattended = 0;
            let totalRTR = 0;
            let totalPercentage = 0;
            let totalOnProcess = 0;
            let totalPending = 0;
            // Prepare flat array for barGraph

            Object.entries(response.counts).forEach(([hour, statuses]) => {
                Object.entries(statuses).forEach(([status, count]) => {
                    totalRequests += count;

                    if (status === 'Completed' || status === 'Evaluation') {
                        totalCompleted += count;
                    }
                    if (status === 'Unattended') {
                        totalUnattended += count;
                    }
                    if (status === 'Correction') {
                        totalCorrection += count;
                    }
                    if (status === 'RTR') {
                        totalRTR += count;
                    }
                    if (status === 'Pending') {
                        totalPending += count;
                    }
                    if (status === 'On-Process') {
                        totalOnProcess += count;
                    }
                });
            });

            // Calculate percentage *after* the loop
            if (totalRequests > 0) {
                totalPercentage = ((totalCompleted / (totalRequests - totalCorrection)) * 100).toFixed(2);
            }



            // Display totals
            $('#total-assigned-value').text(totalRequests);
            $('#total-request-completed-value').text(totalCompleted);

            // Set the text
            $('#total-request-average-value').text(totalAverage);

            // Handle 0 or empty case
            if (!totalAverage || totalAverage === "0" || totalAverage === "00:00:00") {
                $('#total-request-average-value').css('color', 'black'); // or your default color
            } else {
                // Split into parts safely
                let parts = totalAverage.split(":");
                let hours = parseInt(parts[0]) || 0;
                let minutes = parseInt(parts[1]) || 0;
                let seconds = parseInt(parts[2]) || 0;

                // Convert to total seconds
                let totalSeconds = (hours * 3600) + (minutes * 60) + seconds;

                // Compare and apply color style
                if (totalSeconds >= 7200) { // 2 hours = 7200 seconds
                    $('#total-request-average-value').css('color', 'red');
                } else {
                    $('#total-request-average-value').css('color', 'green');
                }
            }

            
            $('#total-request-correction-value').text(totalCorrection);
            $('#total-request-onProcess-value').text(totalOnProcess);
            $('#total-request-pending-value').text(totalPending);
            // $('#total-request-unattended-value').text(totalUnattended);
            // $('#total-request-rtr-value').text(totalRTR);

            $('#total-request-accomplished-value').text(totalPercentage+ "%");

            // Update graph
            // barGraph(hourlyTotals);
        },
        error: function (err) {
            console.error("AJAX error: ", err);
        }
    });
}

const barGraph = (response = []) => {
    console.log(response)
    // Prepare chart data
    const labels = response.map(item => item.req_date);
    const onTimeData = response.map(item => parseInt(item.on_time));
    const exceededData = response.map(item => parseInt(item.exceeded));
    
    // Create chart
    const ctx = document.getElementById('requestsPerHourChart').getContext('2d');
    
    if (window.completedRequestsChartInstance) {
        window.completedRequestsChartInstance.destroy();
    }
    
    window.completedRequestsChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'On Time (≤ 2 hrs)',
                    data: onTimeData,
                    backgroundColor: '#593f37',
                    borderRadius: 4,
                    barThickness: 25,         // Set fixed bar thickness
                    maxBarThickness: 35       // Limit max thickness
                },
                {
                    label: 'Exceeded (> 2 hrs)',
                    data: exceededData,
                    backgroundColor: 'red',
                    borderRadius: 4,
                    barThickness: 25,
                    maxBarThickness: 35
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Date Completed',
                        color: 'black'
                    },
                    ticks: {
                        color: 'black',
                        maxRotation: 90,
                        minRotation: 45
                    }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Completed Requests',
                        color: 'black'
                    },
                    ticks: {
                        color: 'black'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true
                },
                title: {
                    display: true,
                    text: 'Completed Job Orders per Date (On Time vs Exceeded)'
                }
            }
        }
    });
};

const techDataTable = (startDate, endDate, category, subCategory, techBioID) =>{
    console.log(techBioID)
    $.ajax({
        url: '../php/dashboard_technician_php/fetch_techDataTable.php',
        method: "POST",
        data : {startDate, endDate, category, subCategory, techBioID},
        dataType: "json",
        success: function (response) {
            console.log(response);

            fetch_viewRequestData = response
            try {
                let dataSet = [];
                for (let i = 0; i < response.length; i++) {
                    dataSet.push([
                        `<span class="requestNo-span">${response[i].requestNo}</span>`,
                        `<span>${response[i].requestBy.name}</span>`,
                        `<span>${response[i].requestDate}</span>`,
                        `<span>${response[i].requestCategory}</span>`,
                        `<span>${response[i].requestSubCategory}</span>`,
                        `<span>${response[i].requestStatus}</span>`,
                        `<div class="action-pending-div">
                            <button type="button" class="btn btn-primary view-request-btn">View</button>
                        </div>`
                    ]);
                }
                
                if ($.fn.DataTable.isDataTable('#tech-request-dataTable')) {
                    $('#tech-request-dataTable').DataTable().destroy();
                    $('#tech-request-dataTable tbody').empty(); // Clear previous table body
                }

                $('#tech-request-dataTable').DataTable({
                    destroy: true,
                    data: dataSet,
                    columns: [
                        { title: "REQUEST NO." },
                        { title: "NAME OF REQUESTER" },
                        { title: "DATE REQUESTED" },
                        { title: "UNIT" },
                        { title: "CATEGORY" },
                        { title: "Status" },
                        { title: "ACTION" },
                    ],
                    columnDefs: [
                        { targets: 0, createdCell: function(td) { $(td).addClass('request-id-td'); } },
                        { targets: 1, createdCell: function(td) { $(td).addClass('request-name-td'); } },
                        { targets: 2, createdCell: function(td) { $(td).addClass('request-date-td'); } },
                        { targets: 3, createdCell: function(td) { $(td).addClass('request-unit-td'); } },
                        { targets: 4, createdCell: function(td) { $(td).addClass('request-category-td'); } },
                        { targets: 5, createdCell: function(td) { $(td).addClass('request-status-td'); } },
                        { targets: 6, createdCell: function(td) { $(td).addClass('request-action-td'); } },
                    ],
                    // "paging": false,
                    // "info": false,
                    "ordering": false,
                    "pageLength": 8,
                    // "stripeClasses": [],
                    // "search": false,
                    // autoWidth: false,
                });
            } catch (innerError) {
                console.error("Error processing response:", innerError);
            }

        },
        error: function (xhr, status, error) {
            console.error("AJAX request failed:", error);
        }
    });
}

const fetchTechEval = (startDate, endDate, category, subCategory, techBioID) => {
    $.ajax({
        url: '../php/dashboard_technician_php/fetch_tech_eval.php',
        method: "POST",
        data: { startDate, endDate, category, subCategory, techBioID },
        dataType: "json",
        success: function (response) {
            console.log(response);

            let dataSet = [];
            for (let i = 0; i < response.length; i++) {
                let evalData = response[i].requestEvaluation;

                dataSet.push([
                    `<span class="requestNo-span">${response[i].requestNo}</span>`,
                    `<span>${response[i].requestDate}</span>`,
                    `<span>${response[i].requestCategory}</span>`,
                    `<span>${response[i].requestSubCategory}</span>`,
                    `<span>${(response[i].assignTo ? response[i].assignTo : response[i].processedBy)}</span>`,
                    `<span>${evalData.q1}</span>`,
                    `<span>${evalData.q2}</span>`,
                    `<span>${evalData.q3}</span>`,
                    `<span>${evalData.q4}</span>`,
                    `<span>${evalData.q5}</span>`,
                    `<button type="button" class="btn btn-primary view-request-btn">View</button>`
                ]);
            }

            if ($.fn.DataTable.isDataTable('#tech-eval-table')) {
                $('#tech-eval-table').DataTable().destroy();
                $('#tech-eval-table tbody').empty(); // clear previous body
            }

            $('#tech-eval-table').DataTable({
                destroy: true,
                data: dataSet,
                columns: [
                    { title: "REQUEST NO." },
                    { title: "DATE REQUESTED" },
                    { title: "CATEGORY" },
                    { title: "SUBCATEGORY" },
                    { title: "PROCESSED BY" },
                    { title: "Q1" },
                    { title: "Q2" },
                    { title: "Q3" },
                    { title: "Q4" },
                    { title: "Q5" },
                    { title: "COMMENTS" }
                ],
                columnDefs: [
                    { targets: 0, createdCell: (td) => $(td).addClass('eval-request-no') },
                    { targets: 1, createdCell: (td) => $(td).addClass('eval-request-date') },
                    { targets: 2, createdCell: (td) => $(td).addClass('eval-request-category') },
                    { targets: 3, createdCell: (td) => $(td).addClass('eval-request-subcategory') },
                    { targets: 4, createdCell: (td) => $(td).addClass('eval-processed-by') },
                    { targets: 5, createdCell: (td) => $(td).addClass('eval-q1') },
                    { targets: 6, createdCell: (td) => $(td).addClass('eval-q2') },
                    { targets: 7, createdCell: (td) => $(td).addClass('eval-q3') },
                    { targets: 8, createdCell: (td) => $(td).addClass('eval-q4') },
                    { targets: 9, createdCell: (td) => $(td).addClass('eval-q5') },
                    { targets: 10, createdCell: (td) => $(td).addClass('eval-comments') },
                ],
                ordering: false,
                "pageLength": 8,

            });
        },
        error: function (xhr, status, error) {
            console.error("AJAX request failed:", error);
        }
    });
};

const technicianPerformanceChart = (response) => {
    const technicianNames = [];
    const completedJobs = [];
    const completionRates = [];
    const overdueJobs = [];
    const avgTimes = [];

    response.forEach(item => {
        technicianNames.push(item.tech_name || 'Unknown');
        completedJobs.push(item.completed || 0);
        completionRates.push(item.completion_rate || 0);
        overdueJobs.push(item.exceeded || 0);
        avgTimes.push(item.avg_time_hours || 0);
    });

    const dynamicHeight = Math.max(400, technicianNames.length * 90); // 50px per bar

    const options = {
        series: [
            { name: 'Completed Jobs', data: completedJobs },
            { name: 'Overdue Jobs', data: overdueJobs },
            { name: 'Completion Rate (%)', data: completionRates },
            { name: 'Avg Time (hrs)', data: avgTimes }
        ],
        chart: {
            type: 'bar',
            height: dynamicHeight,
            stacked: false,
            toolbar: { show: true }
        },
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 6,
                barHeight: '65%',
            }
        },
        dataLabels: {
            enabled: true,
            formatter: val => val.toFixed(1)
        },
        stroke: {
            show: true,
            width: 1,
            colors: ['#fff']
        },
        xaxis: {
            categories: technicianNames,
            title: { text: 'Technician Performance' }
        },
        fill: { opacity: 0.8 },
        colors: ['#1E90FF', '#E74C3C', '#2ECC71', '#F4D03F'],
        legend: { position: 'top', horizontalAlign: 'center' },
        tooltip: {
            y: { formatter: val => (typeof val === 'number' ? val.toFixed(2) : val) }
        }
    };

    if (window.techPerformanceChartInstance) {
        window.techPerformanceChartInstance.destroy();
    }

    window.techPerformanceChartInstance = new ApexCharts(
        document.querySelector("#technician-performance-chart"),
        options
    );
    window.techPerformanceChartInstance.render();
};

const overdueJobsTable = (response) => {
    const tableBody = document.querySelector('#overdueJobsTable tbody');
    if (!tableBody) return;

    tableBody.innerHTML = ''; // Clear old rows

    response.forEach(item => {
        const tech = item.tech_name || 'Unknown';
        const total = item.total_jobs || 0;
        const overdue = item.exceeded || 0;
        const percent = total > 0 ? ((overdue / total) * 100).toFixed(1) : '0.0';

        const row = `
            <tr>
                <td>${tech}</td>
                <td>${total}</td>
                <td>${overdue}</td>
                <td>${percent}%</td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
};

const avgResponseTimeChart = (response) => {
    const technicianNames = [];
    const avgTimes = [];

    response.forEach(item => {
        technicianNames.push(item.tech_name || 'Unknown');
        avgTimes.push(item.avg_time_hours || 0);
    });

    const options = {
        series: [{
            name: 'Average Response Time (hrs)',
            data: avgTimes
        }],
        chart: {
            type: 'line',
            height: 400,
            toolbar: { show: true },
            zoom: { enabled: true }
        },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        markers: {
            size: 5,
            colors: ['#fff'],
            strokeColors: '#1E90FF',
            strokeWidth: 2
        },
        dataLabels: {
            enabled: true,
            formatter: val => val.toFixed(2)
        },
        xaxis: {
            categories: technicianNames,
            title: { text: 'Technicians' },
            labels: { rotate: -45, style: { fontSize: '12px' } }
        },
        yaxis: {
            title: { text: 'Avg Time (hrs)' },
            min: 0
        },
        colors: ['#1E90FF'],
        tooltip: {
            y: {
                formatter: function (val) {
                    return val.toFixed(2) + ' hrs';
                }
            }
        },
        title: {
            text: 'Average Response Time per Technician',
            align: 'center'
        }
    };

    // Destroy existing chart if present
    if (window.avgResponseTimeChartInstance) {
        window.avgResponseTimeChartInstance.destroy();
    }

    window.avgResponseTimeChartInstance = new ApexCharts(
        document.querySelector("#avgResponseTimeChart"),
        options
    );
    window.avgResponseTimeChartInstance.render();
};

const evaluationInsightsChart = (response) => {
    const technicianNames = [];
    const ratings = [];

    response.forEach(item => {
        technicianNames.push(item.tech_name || 'Unknown');
        ratings.push(item.avg_rating ? parseFloat(item.avg_rating) : 0);
    });

    const options = {
        series: [{
            name: 'Average Rating',
            data: ratings
        }],
        chart: {
            type: 'bar',
            height: 450,
            toolbar: { show: true }
        },
        title: {
            text: 'Evaluation / Satisfaction Insights',
            align: 'center',
            style: { fontSize: '18px', fontWeight: 'bold' }
        },
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 6,
                distributed: true,
                dataLabels: { position: 'right' }
            }
        },
        dataLabels: {
            enabled: true,
            formatter: (val) => val.toFixed(2),
            style: { colors: ['#333'], fontSize: '13px' }
        },
        xaxis: {
            categories: technicianNames,
            title: {
                text: 'Average Rating (1–5)',
                style: { fontSize: '14px', fontWeight: 600 }
            },
            labels: {
                style: { fontSize: '12px' },
                formatter: (val) => val.toFixed(0)
            },
            min: 0,
            max: 5,
            tickAmount: 5
        },
        yaxis: {
            labels: {
                style: { fontSize: '13px' }
            }
        },
        colors: [
            '#2ECC71', '#3498DB', '#F1C40F', '#E67E22',
            '#9B59B6', '#1ABC9C', '#E74C3C', '#34495E'
        ],
        tooltip: {
            y: {
                formatter: (val) => `${val.toFixed(2)} / 5.00`
            }
        },
        grid: {
            borderColor: '#e0e0e0',
            strokeDashArray: 4
        },
        legend: { show: false }
    };

    // Destroy previous instance if exists
    if (window.evaluationInsightsChartInstance) {
        window.evaluationInsightsChartInstance.destroy();
    }

    window.evaluationInsightsChartInstance = new ApexCharts(
        document.querySelector("#evaluationInsightsChart"),
        options
    );
    window.evaluationInsightsChartInstance.render();
};

const renderAssignmentFlowChart = (data) => {
    const container = document.querySelector("#assignmentFlowChart");
    if (!container) return;

    if (!data || data.length === 0) {
        container.innerHTML = "<p style='text-align:center; color:gray;'>No assignment data available.</p>";
        return;
    }

    const assignByCount = {};
    const assignToCount = {};

    data.forEach(item => {
        const assignBy = item.assign_by?.trim();
        const assignTo = item.assign_to?.trim();
        const count = parseInt(item.total_assigned);

        if (assignBy) assignByCount[assignBy] = (assignByCount[assignBy] || 0) + count;
        if (assignTo) assignToCount[assignTo] = (assignToCount[assignTo] || 0) + count;
    });

    // Merge all unique names
    const allPeople = Array.from(new Set([...Object.keys(assignByCount), ...Object.keys(assignToCount)]));
    const assignedByData = allPeople.map(name => assignByCount[name] || 0);
    const assignedToData = allPeople.map(name => assignToCount[name] || 0);

    const options = {
        series: [
            { name: 'Requests Assigned By', data: assignedByData },
            { name: 'Requests Assigned To', data: assignedToData }
        ],
        chart: {
            type: 'bar',
            height: 450,
            stacked: false,
            toolbar: { show: false }
        },
        title: {
            text: 'Assignment Activity Overview',
            align: 'center',
            style: { fontSize: '18px', fontWeight: 'bold' }
        },
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 6
            }
        },
        dataLabels: {
            enabled: true,
            formatter: (val) => val > 0 ? val : '',
            style: { fontSize: '13px', colors: ['#333'] }
        },
        xaxis: {
            categories: allPeople,
            title: {
                text: 'Number of Requests',
                style: { fontSize: '14px', fontWeight: 600 }
            }
        },
        colors: ['#1ABC9C', '#3498DB'],
        tooltip: {
            y: { formatter: (val) => `${val} request${val > 1 ? 's' : ''}` }
        },
        legend: {
            position: 'top',
            horizontalAlign: 'center',
            fontSize: '13px'
        },
        grid: {
            borderColor: '#e0e0e0',
            strokeDashArray: 4
        }
    };

    if (window.assignmentFlowChartInstance) {
        window.assignmentFlowChartInstance.destroy();
    }

    window.assignmentFlowChartInstance = new ApexCharts(container, options);
    window.assignmentFlowChartInstance.render();
};

const evaluationBreakdownChart = (response) => {
    const questions = [
        "Service repairs attended within schedule",
        "Gives update on status of job request",
        "Accomplished job with quality",
        "Courteous and helpful staff",
        "Timely response given"
    ];

    // Compute overall averages (across all technicians)
    let totalQ1 = 0, totalQ2 = 0, totalQ3 = 0, totalQ4 = 0, totalQ5 = 0, count = 0;
    response.forEach(item => {
        if (item.q1_avg) {
            totalQ1 += parseFloat(item.q1_avg);
            totalQ2 += parseFloat(item.q2_avg);
            totalQ3 += parseFloat(item.q3_avg);
            totalQ4 += parseFloat(item.q4_avg);
            totalQ5 += parseFloat(item.q5_avg);
            count++;
        }
    });

    const averages = [
        (totalQ1 / count).toFixed(2),
        (totalQ2 / count).toFixed(2),
        (totalQ3 / count).toFixed(2),
        (totalQ4 / count).toFixed(2),
        (totalQ5 / count).toFixed(2)
    ];

    const options = {
        series: [{
            name: 'Average Rating',
            data: averages
        }],
        chart: {
            type: 'bar',
            height: 400,
            toolbar: { show: true }
        },
        title: {
            text: 'Evaluation / Satisfaction Breakdown',
            align: 'center',
            style: { fontSize: '18px', fontWeight: 'bold' }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: 6,
                distributed: true
            }
        },
        dataLabels: {
            enabled: true,
            formatter: (val) => val,
            style: { fontSize: '13px', colors: ['#333'] }
        },
        xaxis: {
            categories: questions,
            labels: { style: { fontSize: '12px' } },
            title: {
                text: 'Evaluation Criteria',
                style: { fontSize: '14px', fontWeight: 600 }
            }
        },
        yaxis: {
            min: 0,
            max: 5,
            tickAmount: 5,
            title: {
                text: 'Average Rating (1–5)',
                style: { fontSize: '14px', fontWeight: 600 }
            }
        },
        colors: ['#1ABC9C', '#3498DB', '#F1C40F', '#E67E22', '#9B59B6'],
        grid: {
            borderColor: '#e0e0e0',
            strokeDashArray: 4
        }
    };

    if (window.evaluationBreakdownChartInstance) {
        window.evaluationBreakdownChartInstance.destroy();
    }

    window.evaluationBreakdownChartInstance = new ApexCharts(
        document.querySelector("#evaluationBreakdownChart"),
        options
    );
    window.evaluationBreakdownChartInstance.render();
};

const evaluationTotalsChart = (response) => {
    console.log(response);

    // Ensure response is always an array
    const data = Array.isArray(response) ? response : [response];

    const questions = [
        "Service repairs attended within schedule",
        "Gives update on status of job request",
        "Accomplished job with quality",
        "Courteous and helpful staff",
        "Timely response given"
    ];

    let total = {
        vs: [0, 0, 0, 0, 0],
        s: [0, 0, 0, 0, 0],
        us: [0, 0, 0, 0, 0],
        p: [0, 0, 0, 0, 0]
    };

    // Aggregate all counts
    data.forEach(item => {
        for (let i = 1; i <= 5; i++) {
            total.vs[i - 1] += parseInt(item[`q${i}_vs`] || 0);
            total.s[i - 1] += parseInt(item[`q${i}_s`] || 0);
            total.us[i - 1] += parseInt(item[`q${i}_us`] || 0);
            total.p[i - 1] += parseInt(item[`q${i}_p`] || 0);
        }
    });

    const options = {
        series: [
            { name: 'Very Satisfied', data: total.vs },
            { name: 'Satisfied', data: total.s },
            { name: 'Unsatisfactory', data: total.us },
            { name: 'Poor', data: total.p }
        ],
        chart: {
            type: 'bar',
            height: 400,
            stacked: true,
            toolbar: { show: true }
        },
        title: {
            text: 'Evaluation / Satisfaction Totals',
            align: 'center',
            style: { fontSize: '18px', fontWeight: 'bold' }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: 6
            }
        },
        dataLabels: {
            enabled: true,
            style: { fontSize: '12px', colors: ['#fff'] }
        },
        xaxis: {
            categories: questions,
            labels: { style: { fontSize: '12px' } },
            title: {
                text: 'Evaluation Criteria',
                style: { fontSize: '14px', fontWeight: 600 }
            }
        },
        yaxis: {
            title: {
                text: 'Total Responses',
                style: { fontSize: '14px', fontWeight: 600 }
            },
            min: 0
        },
        colors: ['#1ABC9C', '#3498DB', '#E67E22', '#E74C3C'],
        grid: {
            borderColor: '#e0e0e0',
            strokeDashArray: 4
        },
        legend: {
            position: 'top',
            labels: { colors: '#fff' }
        }
    };

    if (window.evaluationTotalsChartInstance) {
        window.evaluationTotalsChartInstance.destroy();
    }

    window.evaluationTotalsChartInstance = new ApexCharts(
        document.querySelector("#evaluationTotalsChart"),
        options
    );
    window.evaluationTotalsChartInstance.render();
};




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



// Initial move to the first active tab on load
$(document).ready(function () {
    fetchNotifValue()
    onLoadFetch_total_request('', '', "ALL", null, null);

    const today = new Date().toISOString().split('T')[0]; // format: YYYY-MM-DD

    document.getElementById("start-date-input").value = today;
    document.getElementById("end-date-input").value = today;

    $(document).off('click', '#filter-date-search-btn').on('click', '#filter-date-search-btn', function () {
        const startDate = $('#start-date-input').val();
        const endDate = $('#end-date-input').val();
        const category = category_clicked
        const sub_category = sub_category_clicked
        const techBioID = techBioID_clicked 

        // Restriction checks
        if (!startDate) {
            alert('Please select a start date.');
            return;
        }
    
        // Proceed with AJAX
        onLoadFetch_total_request(startDate, endDate, category, sub_category, techBioID);
    });
    
    $('.filter-category-div button').on('click', function() {
        // Remove the active class from all buttons
        $('.filter-category-div button').removeClass('filter-category-active');

        // Add the active class to the clicked button
        $(this).addClass('filter-category-active');

        const category = $(this).data('category');

        const startDate = $('#start-date-input').val();
        const endDate = $('#end-date-input').val();
        category_clicked = category
        const sub_category = sub_category_clicked
        const techBioID = techBioID_clicked
        // populate the sub category


        onLoadFetch_total_request(startDate, endDate, category, sub_category, techBioID);

        if(category != "ALL"){
            $.ajax({
                url: '../../php/dashboard_request_php/fetch_subCategoryFilter.php',
                method: 'POST',
                data: {category},
                dataType: 'json',
                success: function (response) {
                    console.log(response);
    
                    // First, clear all options
                    $('#filter-subCategory-select').css('pointer-events' , 'auto')
                    $('#filter-subCategory-select').css('opacity' , '1')
    
                    const select = document.getElementById("filter-subCategory-select");
                    select.innerHTML = ''; // remove all options
    
                    // Add default option
                    const defaultOption = document.createElement("option");
                    defaultOption.value = "";
                    defaultOption.textContent = "-- Select Sub Category --";
                    select.appendChild(defaultOption);
    
                    // Populate with new options from PHP response
                    response.forEach(function(item) {
                        const option = document.createElement("option");
                        option.value = "IU"; // You can change this depending on your logic
                        option.textContent = item.sub_category_description;
                        select.appendChild(option);
                    });
                },
                error: function (err) {
                    console.error("AJAX error: ", err);
                }
            });
    
            $.ajax({
                url: '../../php/dashboard_technician_php/fetch_technicians.php',
                method: 'POST',
                data: { category },
                dataType: 'json',
                success: function (response) {
                    console.log(response);
            
                    // Enable the technicians select dropdown
                    $('#filter-technicians-select').css('pointer-events', 'auto');
                    $('#filter-technicians-select').css('opacity', '1');
            
                    const select = document.getElementById("filter-technicians-select");
                    select.innerHTML = ''; // Clear all options
            
                    // Add default option
                    const defaultOption = document.createElement("option");
                    defaultOption.value = "";
                    defaultOption.textContent = "-- Select Technician --";
                    select.appendChild(defaultOption);
            
                    // Populate the dropdown with technicians
                    response.forEach(function(tech) {
                        const option = document.createElement("option");
                        const fullName = `${tech.firstName || ''} ${tech.middle ? tech.middle[0] + '.' : ''} ${tech.lastName || ''}`.trim();
            
                        option.value = fullName;
                        option.textContent = fullName;
                        option.dataset.category = tech.techBioID;
                        select.appendChild(option);
                    });
                },
                error: function (err) {
                    console.error("AJAX error: ", err);
                }
            });
        }
        else{
            $('#filter-subCategory-select').css('pointer-events' , 'none')
            $('#filter-subCategory-select').css('opacity' , '0.3')

            $('#filter-technicians-select').css('pointer-events', 'none');
            $('#filter-technicians-select').css('opacity', '0.3');
        }
        
        
    });

    $(document).on('change', '#filter-subCategory-select', function () {
        const selectedValue = $(this).val();
        const selectedText = $(this).find("option:selected").text();
    
        // Do something with the selected value/text
        console.log("Selected Sub Category Value:", selectedValue);
        console.log("Selected Sub Category Text:", selectedText);
    
        sub_category_clicked = selectedText
        console.log(sub_category_clicked)

        const startDate = $('#start-date-input').val();
        const endDate = $('#end-date-input').val();
        const category = category_clicked
        const sub_category = sub_category_clicked
        const techBioID = techBioID_clicked

        onLoadFetch_total_request(startDate, endDate, category, sub_category, techBioID);
    });

    $(document).on('change', '#filter-technicians-select', function () {
        const selectedCategory = $(this).find("option:selected").data("category");
    
        techBioID_clicked = selectedCategory
        console.log(techBioID_clicked)

        const startDate = $('#start-date-input').val();
        const endDate = $('#end-date-input').val();
        const category = category_clicked
        const sub_category = sub_category_clicked
        const techBioID = techBioID_clicked

        onLoadFetch_total_request(startDate, endDate, category, sub_category, techBioID);
    });

    $(document).off('click', '.view-request-btn').on('click', '.view-request-btn', function() {
        const index = $('.view-request-btn').index(this);
        const data = fetch_viewRequestData[index]
        console.log(data)
        
        $('#user-name').text(data.requestBy.name);
        $('#user-bioid').text(data.requestBy.bioID);
        $('#user-division').text(data.requestBy.division);
        $('#user-section').text(data.requestBy.section);
    
        $('#job-order-id').text(`${data.requestNo}`);
        $('#date-requested').text(data.requestDate);
        $('#request-type').text(data.requestCategory);
    
        $('#request-description').text(data.requestDescription);

        // $('#tech-name-i').text(data.processedBy ? data.processedBy : "No data yet.")
        $('#tech-name-i').text((data.assignTo ? data.assignTo : data.processedBy))
        $('#reception-date-i').text(data.requestStartDate ? data.requestStartDate : data.requestCorrectionDate )
        $('.tech-remarks-textarea').attr('placeholder', (data.requestJobRemarks) ? data.requestJobRemarks : data.requestCorrection);
        $('#modal-status-incoming').text(data.requestStatus);
        modal_view_form.show()
    })

    document.querySelectorAll('.dashboard-nav span').forEach(tab => {
        tab.addEventListener('click', () => {
            // Highlight active
            document.querySelectorAll('.dashboard-nav span').forEach(s => s.classList.remove('active'));
            tab.classList.add('active');

            // Scroll to section
            const targetId = tab.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });


    const infoButtons = document.querySelectorAll('.info-btn');
    const tooltip = document.createElement('div');
    tooltip.className = 'chart-tooltip';
    document.body.appendChild(tooltip);

    infoButtons.forEach(btn => {
        btn.addEventListener('mouseenter', (e) => {
            tooltip.textContent = btn.dataset.info;
            tooltip.style.display = 'block';
            tooltip.style.left = `${e.pageX + 10}px`;
            tooltip.style.top = `${e.pageY + 10}px`;
        });
        btn.addEventListener('mousemove', (e) => {
            tooltip.style.left = `${e.pageX + 10}px`;
            tooltip.style.top = `${e.pageY + 10}px`;
        });
        btn.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });
    });

});