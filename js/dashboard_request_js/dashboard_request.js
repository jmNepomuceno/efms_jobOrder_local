let requestsPerHourChartInstance; // Declare globally
let category_clicked = "ALL", sub_category_clicked = null
let requestsByDivisionChart;

let avgCompletionTimeChart;
let statusChart;
let trendChart;
let categoryChart;
let agingChart;

const moveIndicator = (element) => {
    const indicator = document.querySelector(".nav-indicator");
    const navSpan = element.getBoundingClientRect();
    const parent = element.parentElement.getBoundingClientRect();

    indicator.style.width = `${navSpan.width}px`;
    indicator.style.left = `${navSpan.left - parent.left}px`;
}

const fetchNotifValue = () =>{
    $.ajax({
        url: '../php/incoming_request_php/fetch_notifValue.php',
        method: "POST",
        dataType : 'json',
        success: function(response) {
            try { 
                console.log(response)
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



// 📊 Bar chart – Requests per Hour
const barChartOptions = {
    chart: {
        type: 'bar',
        height: '90%',
        toolbar: { show: false },
        foreColor: '#333', // default dark gray text
    },
    series: [{ name: 'Requests per Hour', data: Array(24).fill(0) }],
    xaxis: {
        categories: [...Array(24).keys()].map(h => `${h}:00`),
        labels: { style: { fontSize: '11px' } },
        axisBorder: { color: '#e0e0e0' },
        axisTicks: { color: '#e0e0e0' }
    },
    yaxis: {
        labels: { style: { colors: '#555' } }
    },
    grid: {
        borderColor: '#f1f1f1' // light neutral gridlines
    },
    colors: ['#007bff'], // ✅ default Bootstrap blue
    plotOptions: {
        bar: {
            borderRadius: 5,
            columnWidth: '60%',
            distributed: false
        }
    },
    tooltip: {
        theme: 'light',
        style: { fontSize: '12px' }
    }
};
const barChart = new ApexCharts(document.querySelector("#barGraph"), barChartOptions);
barChart.render();


// 🥧 Pie chart – Request Status Distribution
// const pieChartOptions = {
//     chart: { type: 'pie', height: '90%' },
//     labels: ['Completed', 'Pending', 'On-Process', 'Unattended', 'RTR', 'Correction'],
//     series: [0, 0, 0, 0, 0, 0],
//     colors: [
//         '#28a745', // green (Completed)
//         '#ffc107', // yellow (Pending)
//         '#17a2b8', // cyan (On-Process)
//         '#dc3545', // red (Unattended)
//         '#6f42c1', // purple (RTR)
//         '#343a40'  // gray (Correction)
//     ],
//     legend: {
//         show: true,
//         position: 'bottom',
//         labels: { colors: '#555', useSeriesColors: false }
//     },
//     dataLabels: {
//         style: { fontSize: '12px', colors: ['#fff'] }
//     },
//     tooltip: {
//         theme: 'light',
//         style: { fontSize: '12px' }
//     }
// };
// const pieChart = new ApexCharts(document.querySelector("#pieChart"), pieChartOptions);

// pieChart.render().then(() => {
//     console.log("Pie chart rendered and ready to update");
// });




// 🎨 Default modern chart color palette
const chartColors = {
    primary: '#007bff',   // blue
    secondary: '#6c757d', // gray
    success: '#28a745',   // green
    warning: '#ffc107',   // yellow
    danger: '#dc3545',    // red
    info: '#17a2b8',      // cyan
    light: '#f8f9fa',     // light gray background
    dark: '#343a40'       // dark gray text
};



// ✨ Requests Over Time (Line)
const requestsOverTimeChart = new Chart(document.getElementById('requestsOverTimeChart'), {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Requests',
            data: [],
            backgroundColor: chartColors.lightFill,
            borderColor: chartColors.primary,
            borderWidth: 2,
            fill: true,
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: { 
                beginAtZero: true,
                grid: { color: chartColors.neutral },
                ticks: { color: chartColors.darkText }
            },
            x: { 
                grid: { color: chartColors.neutral },
                ticks: { color: chartColors.darkText }
            }
        },
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: 'Requests Trend Over Time',
                color: chartColors.darkText,
                font: { size: 16 }
            }
        }
    }
});

// 🟠 Request Status Breakdown (Pie)
const requestStatusBreakdownChart = new Chart(document.getElementById('requestStatusBreakdownChart'), {
    type: 'pie',
    data: { 
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [
                chartColors.primary, 
                chartColors.secondary, 
                chartColors.highlight
            ],
            borderColor: chartColors.darkText,
            borderWidth: 1
        }]
    },
    options: { 
        responsive: true,
        plugins: { 
            legend: { display: false },
            title: {
                display: true,
                text: 'Request Status Breakdown',
                color: chartColors.darkText,
                font: { size: 16 }
            }
        }
    }
});

// 🟢 Requests by Category (Bar)
const requestsByCategoryChart = new Chart(document.getElementById('requestsByCategoryChart'), {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [
                chartColors.primary,
                chartColors.secondary,
                chartColors.highlight
            ],
            borderColor: chartColors.darkText,
            borderWidth: 1
        }]
    },
    options: { 
        responsive: true,
        scales: {
            x: { 
                grid: { color: chartColors.neutral },
                ticks: { color: chartColors.darkText }
            },
            y: { 
                beginAtZero: true,
                grid: { color: chartColors.neutral },
                ticks: { color: chartColors.darkText }
            }
        },
        plugins: { 
            legend: { display: false },
            title: {
                display: true,
                text: 'Requests by Category',
                color: chartColors.darkText,
                font: { size: 16 }
            }
        }
    }
});

// 🟡 Average Completion Time (Bar)
avgCompletionTimeChart = new Chart(document.getElementById('avgCompletionTimeChart'), {
    type: 'bar',
    data: { 
        labels: [], 
        datasets: [{
            data: [],
            backgroundColor: chartColors.highlight,
            borderColor: chartColors.darkText,
            borderWidth: 1
        }] 
    },
    options: { 
        responsive: true,
        scales: {
            x: { 
                grid: { color: chartColors.neutral },
                ticks: { color: chartColors.darkText }
            },
            y: { 
                beginAtZero: true,
                grid: { color: chartColors.neutral },
                ticks: { color: chartColors.darkText }
            }
        },
        plugins: { 
            legend: { display: false },
            title: {
                display: true,
                text: 'Average Completion Time',
                color: chartColors.darkText,
                font: { size: 16 }
            }
        }
    }
});

// 🧭 Evaluation Ratings (Radar)
const evaluationRadarChart = new Chart(document.getElementById('evaluationRadarChart'), {
    type: 'radar',
    data: { 
        labels: [], 
        datasets: [{
            data: [],
            backgroundColor: chartColors.lightFill,
            borderColor: chartColors.primary,
            borderWidth: 2,
            pointBackgroundColor: chartColors.secondary
        }] 
    },
    options: { 
        responsive: true,
        scales: {
            r: {
                grid: { color: chartColors.neutral },
                pointLabels: { color: chartColors.darkText },
                angleLines: { color: chartColors.neutral },
                ticks: { display: false }
            }
        },
        plugins: { 
            legend: { display: false },
            title: {
                display: true,
                text: 'Evaluation Results',
                color: chartColors.darkText,
                font: { size: 16 }
            }
        }
    }
});

// 🔝 Top Requests (Bar)
const topRequestsChart = new Chart(document.getElementById('topRequestsChart'), {
    type: 'bar',
    data: { 
        labels: [], 
        datasets: [{
            data: [],
            backgroundColor: chartColors.secondary,
            borderColor: chartColors.darkText,
            borderWidth: 1
        }] 
    },
    options: { 
        responsive: true,
        scales: {
            x: { 
                grid: { color: chartColors.neutral },
                ticks: { display: false }
            },
            y: { 
                beginAtZero: true,
                grid: { color: chartColors.neutral },
                ticks: { color: chartColors.darkText }
            }
        },
        plugins: { 
            legend: { display: false },
            title: {
                display: true,
                text: 'Top Requests',
                color: chartColors.darkText,
                font: { size: 16 }
            }
        }
    }
});

// 📊 Requests by Subcategory (Bar)
const subCategoryChart = new Chart(document.getElementById('subCategoryChart'), {
    type: 'bar',
    data: {
        labels: [], // labels can stay empty or be filled
        datasets: [{
            label: 'Total Requests',
            data: [],
            backgroundColor: chartColors.secondary,
            borderColor: chartColors.darkText,
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                grid: { color: chartColors.neutral },
                ticks: { 
                    color: chartColors.darkText,
                    maxRotation: 45,
                    minRotation: 45,
                    font: { 
                        size: 6, // <-- adjust the font size here
                        family: 'Arial', // optional: change font family
                        weight: 'bold'   // optional: change font weight
                    }
                }
            },
            y: {
                beginAtZero: true,
                grid: { color: chartColors.neutral },
                ticks: { color: chartColors.darkText }
            }
        },
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: 'Requests by Subcategory',
                color: chartColors.darkText,
                font: { size: 16 }
            },
            tooltip: {
                backgroundColor: chartColors.darkText,
                titleColor: '#fff',
                bodyColor: '#fff'
            }
        }
    }
});



// Generates random pastel colors for charts
function randomColor() {
    const r = Math.floor(150 + Math.random() * 105);
    const g = Math.floor(150 + Math.random() * 105);
    const b = Math.floor(150 + Math.random() * 105);
    return `rgb(${r}, ${g}, ${b})`;
}

// Generates a palette of distinct colors for bars
function generateDistinctColors(count) {
    // 🎨 Modern, clean color palette (Bootstrap-inspired)
    const baseColors = [
        '#007bff', // blue
        '#28a745', // green
        '#ffc107', // yellow
        '#dc3545', // red
        '#17a2b8', // cyan
        '#6610f2', // purple
        '#6c757d'  // gray
    ];

    const colors = [];
    for (let i = 0; i < count; i++) {
        colors.push(baseColors[i % baseColors.length]);
    }
    return colors;
}


// 🧮 Helper: adjusts brightness of hex color
function shadeColor(hex, shade) {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    r = Math.min(255, Math.floor(r * shade));
    g = Math.min(255, Math.floor(g * shade));
    b = Math.min(255, Math.floor(b * shade));

    return `rgb(${r}, ${g}, ${b})`;
}


// 🔹 Unified dashboard data fetcher
const onLoadFetch_total_request = (startDate, endDate, category, subCategory) => {
    $.ajax({
        url: '../../php/dashboard_request_php/fetch_dashboard_request.php',
        method: 'POST',
        data: { startDate, endDate, category, subCategory },
        dataType: 'json',
        success: function (data) {
            console.log("Dashboard data:", data);

            // ✅ 1. SUMMARY (Top cards + ApexCharts)
            if (data.summary) {
                const totals = data.summary.totals;
                const hourlyTotals = data.summary.hourlyTotals;
                const totalPercentage = data.summary.totalPercentage;

                $('#total-request-value').text(totals.totalRequests);
                $('#total-request-correction-value').text(totals.correction);
                $('#total-request-completed-value').text(totals.completed);
                $('#total-request-pending-value').text(totals.pending);
                $('#total-request-onProcess-value').text(totals.onProcess);
                $('#total-request-assigned-value').text(totals.assigned);
                $('#total-request-evaluation-value').text(totals.evaluation);
                $('#total-request-cancelled-value').text(totals.cancelled);
                $('#total-request-pending-materials-value').text(totals.pendingMaterials);
                $('#total-request-accomplished-value').text(totalPercentage + "%");

                if (typeof barChart !== 'undefined') {
                    barChart.updateSeries([{ data: hourlyTotals }]);
                }

                // if (typeof pieChart !== 'undefined' && pieChart.updateSeries) {
                //     pieChart.updateSeries([
                //         totals.completed || 0,
                //         totals.pending || 0,
                //         totals.onProcess || 0,
                //         totals.unattended || 0,
                //         totals.rtr || 0,
                //         totals.correction || 0
                //     ]);
                // } else {
                //     console.warn("Pie chart not ready or updateSeries unavailable");
                // }
            }

            // ✅ 2. DETAILED CHARTS (Chart.js)
            if (data.trend) {
                requestsOverTimeChart.data.labels = data.trend.map(d => d.date);
                requestsOverTimeChart.data.datasets[0].data = data.trend.map(d => parseInt(d.total));
                requestsOverTimeChart.update();
            }

            if (data.status) {
                requestStatusBreakdownChart.data.labels = data.status.map(s => s.requestStatus);
                requestStatusBreakdownChart.data.datasets[0].data = data.status.map(s => parseInt(s.total));
                requestStatusBreakdownChart.update();
            }

            const unitColors = {
                IU: '#4e73df',
                EU: '#1cc88a',
                MU: '#f6c23e'
            };

            // 🔹 Requests by Category (IU, EU, MU)
            if (Array.isArray(data.category) && data.category.length > 0) {
                // Use Chart.js default color palette
                const defaultColors = {
                    IU: '#36A2EB', // Blue
                    EU: '#FF6384', // Pink/Red
                    MU: '#FFCE56'  // Yellow
                };

                console.log(data.category);
                requestsByCategoryChart.data.labels = data.category.map(c => c.requestCategory);
                requestsByCategoryChart.data.datasets[0].data = data.category.map(c => parseInt(c.total));
                requestsByCategoryChart.data.datasets[0].backgroundColor = data.category.map(
                    c => defaultColors[c.requestCategory] || randomColor()
                );
                requestsByCategoryChart.update();
            } else {
                $('#requestsByCategoryChart').parent().find('.text-muted').remove();
                $('#requestsByCategoryChart').parent().append('<p class="text-muted mt-2">No data available.</p>');
                requestsByCategoryChart.data.labels = [];
                requestsByCategoryChart.data.datasets[0].data = [];
                requestsByCategoryChart.update();
            }



            // 🔹 Average Completion Time per Unit
            if (Array.isArray(data.completionTime) && data.completionTime.length > 0) {
                const colors = generateDistinctColors(data.completionTime.length);
                if (typeof avgCompletionTimeChart !== 'undefined' && avgCompletionTimeChart) {
                    avgCompletionTimeChart.data.labels = data.completionTime.map(c => c.requestCategory || 'Unknown');
                    avgCompletionTimeChart.data.datasets[0].data = data.completionTime.map(c => parseFloat(c.avg_hours));
                    avgCompletionTimeChart.data.datasets[0].backgroundColor = colors
                    avgCompletionTimeChart.update();
                }
            } else {
                avgCompletionTimeChart.data.labels = [];
                avgCompletionTimeChart.data.datasets[0].data = [];
                avgCompletionTimeChart.update();
            }

            if (data.ratings) {
                evaluationRadarChart.data.labels = Object.keys(data.ratings).filter(k => k);
                evaluationRadarChart.data.datasets[0].data = Object.values(data.ratings);
                evaluationRadarChart.update();
            }


            // 🔹 Top 5 Most Common Requests
            if (Array.isArray(data.topRequests) && data.topRequests.length > 0) {
                const colors = generateDistinctColors(data.topRequests.length);
                console.log(data.topRequests);
                topRequestsChart.data.labels = data.topRequests.map(t => t.requestDescription || 'Unknown');
                topRequestsChart.data.datasets[0].data = data.topRequests.map(t => parseInt(t.total));
                topRequestsChart.data.datasets[0].backgroundColor = colors;
                topRequestsChart.update();
            } else {
                topRequestsChart.data.labels = [];
                topRequestsChart.data.datasets[0].data = [];
                topRequestsChart.update();
            }

            if (data.recent) {
                const tableBody = $('#recentRequestsTable tbody');
                tableBody.empty();
                data.recent.forEach(r => {
                    tableBody.append(`
                        <tr>
                            <td>${r.requestNo}</td>
                            <td>${r.requestCategory}</td>
                            <td>${r.requestSubCategory}</td>
                            <td>${r.requestStatus}</td>
                            <td>${r.requestDate}</td>
                        </tr>
                    `);
                });
            }

            // ✅ Requests by Division / Department
            if (data.divisions && data.divisions.length > 0) {
                const colors = generateDistinctColors(data.divisions.length); // 🌿 use earthy tones

                if (!requestsByDivisionChart) {
                    requestsByDivisionChart = new Chart(document.getElementById('requestsByDivisionChart'), {
                        type: 'bar',
                        data: {
                            labels: data.divisions.map(d => d.division_name),
                            datasets: [{
                                label: 'Requests',
                                data: data.divisions.map(d => parseInt(d.total)),
                                backgroundColor: colors
                            }]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                legend: { display: false }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    grid: { color: 'rgba(66, 42, 34, 0.1)' }, // subtle warm gridline
                                    ticks: { color: '#291915' } // earthy text tone
                                },
                                x: {
                                    grid: { display: false },
                                    ticks: { color: '#291915' }
                                }
                            }
                        }
                    });
                } else {
                    // ✅ Requests by Division Chart (safe update)
                    if (typeof requestsByDivisionChart !== 'undefined' && requestsByDivisionChart) {
                        requestsByDivisionChart.data.labels = data.divisions.map(d => d.division_name);
                        requestsByDivisionChart.data.datasets[0].data = data.divisions.map(d => parseInt(d.total));
                        requestsByDivisionChart.data.datasets[0].backgroundColor = colors
                        requestsByDivisionChart.update();
                    }
                }
            }


            // ✅ Evaluation Comments
            if (data.comments && data.comments.length > 0) {
                const commentsContainer = $('#evaluationCommentsContainer');
                commentsContainer.empty();
                data.comments.forEach(c => {
                    commentsContainer.append(`
                        <div class="comment-card">
                            <p><strong>${c.unit}</strong>: ${c.comment}</p>
                        </div>
                    `);
                });
            } else {
                $('#evaluationCommentsContainer').html('<p class="text-muted">No evaluation comments available.</p>');
            }

            if (data.subCategory && data.subCategory.length > 0) {
                subCategoryChart.data.labels = data.subCategory.map(item => item.requestSubCategory);
                subCategoryChart.data.datasets[0].data = data.subCategory.map(item => item.total);
                subCategoryChart.update();
            }

        }, 
        error: function (xhr, status, err) {
            console.error("AJAX Error:", err);
        }
    });
};

// Initial move to the first active tab on load
$(document).ready(function () {
    fetchNotifValue();
    onLoadFetch_total_request(null, null, "ALL", null);

    const today = new Date().toISOString().split('T')[0]; // format: YYYY-MM-DD

    document.getElementById("start-date-input").value = today;
    document.getElementById("end-date-input").value = today;

    $(document).off('click', '#filter-date-search-btn').on('click', '#filter-date-search-btn', function () {
        const startDate = $('#start-date-input').val();
        const endDate = $('#end-date-input').val();
        const category = category_clicked
        const sub_category = sub_category_clicked

        // Restriction checks
        if (!startDate) {
            alert('Please select a start date.');
            return;
        }
    
        // Proceed with AJAX
        onLoadFetch_total_request(startDate, endDate, category, sub_category);
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

        // populate the sub category


        onLoadFetch_total_request(startDate, endDate, category, sub_category);

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

        onLoadFetch_total_request(startDate, endDate, category, sub_category);
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