let requestsPerHourChartInstance; // Declare globally


const onLoadFetch_total_request = (startDate, endDate, division, section) => {
    console.log("Start Date: ", startDate);
    console.log("End Date: ", endDate);
    console.log("division: ", division);
    console.log("section: ", section);
    
    $.ajax({
        url: '../../php/dashboard_user_php/fetch_user_request.php',
        method: 'POST',
        data: { startDate, endDate, division, section },
        dataType: 'json',
        success: function (response) {
            console.log("AJAX Response: ", response);

            $('#total-request-value').text(response.totalRequests ?? 0);

            if (response.topSection) {
                $('#top-request-value').text(`${response.topSection}`);
            } else {
                $('#top-request-value').text('No top section data');
            }

            // ✅ Fix: use correct property name
            if (Array.isArray(response.topRequestingDivisionsSections)) {
                renderTopRequestingSectionsChart(response.topRequestingDivisionsSections);
            } else {
                console.warn("No topRequestingDivisionsSections data found.");
            }

            if (Array.isArray(response.requestVolumeTrend)) {
                renderRequestVolumeTrendChart(response.requestVolumeTrend);
            } else {
                console.warn("No requestVolumeTrend data found.");
            }

            if (Array.isArray(response.averageRatingPerDivision)) {
                renderAverageRatingPerDivisionChart(response.averageRatingPerDivision);
            }

            renderAverageCompletionTimeChart(response.averageCompletionByDivision);
            renderTopRequestorsChart(response.topRequestors); // 👈 Add this
            renderCancelledRejectedTrendChart(response.cancelledRejectedTrend); // 👈 Added here
        },
        error: function (err) {
            console.error('AJAX error:', err);
        }
    });
};

onLoadFetch_total_request(null, null, null, null); // Initial call

function renderRequestVolumeTrendChart(data) {
    if (!Array.isArray(data) || data.length === 0) {
        console.warn("No data for Request Volume Trend chart");
        return;
    }

    // Format data for chart
    const dates = data.map(item => item.request_day);
    const requestCounts = data.map(item => item.total_requests);

    const options = {
        chart: {
            type: 'line',
            height: 375,
            toolbar: { show: false },
            zoom: { enabled: false }
        },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        series: [{
            name: 'Requests',
            data: requestCounts
        }],
        xaxis: {
            categories: dates,
            title: { text: 'Date' },
            labels: { rotate: -45 }
        },
        yaxis: {
            title: { text: 'Total Requests' },
            min: 0
        },
        colors: ['#1cc88a'],
        dataLabels: {
            enabled: false
        },
        tooltip: {
            theme: 'dark',
            y: {
                formatter: val => `${val} requests`
            }
        }
    };

    const chartElement = document.querySelector("#request-volume-trend-chart");
    if (chartElement) {
        const chart = new ApexCharts(chartElement, options);
        chart.render();
    } else {
        console.error("Chart element not found: #request-volume-trend-chart");
    }
}

function renderAverageRatingPerDivisionChart(data) {
    const divisions = data.map(item => item.division || 'Unknown');
    const ratings = data.map(item => parseFloat(item.avg_rating));

    const options = {
        chart: {
            type: 'bar',
            height: 375,
            toolbar: { show: false }
        },

        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 6,
                distributed: true
            }
        },
        colors: ['#00C49F', '#0088FE', '#FFBB28', '#FF8042', '#4CAF50', '#AB47BC'],
        dataLabels: {
            enabled: true,
            formatter: val => val + ' ★',
            style: { colors: ['#333'] }
        },
        xaxis: {
            categories: divisions,
            title: {
                text: 'Average Rating (out of 5)'
            },
            min: 0,
            max: 5
        },
        tooltip: {
            y: {
                formatter: val => val + ' ★'
            }
        },
        series: [{
            name: 'Average Rating',
            data: ratings
        }]
    };

    const chart = new ApexCharts(document.querySelector("#average-rating-per-division-chart"), options);
    chart.render();
}

function renderAverageCompletionTimeChart(data) {
    if (!Array.isArray(data) || data.length === 0) {
        console.warn("No data for Average Completion Time chart");
        return;
    }

    const divisions = data.map(item => item.division || 'Unknown');
    const avgHours = data.map(item => parseFloat(item.avg_hours));

    const options = {
        chart: {
            type: 'bar',
            height: 375,
            toolbar: { show: false }
        },
        series: [{
            name: 'Average Completion Time (hours)',
            data: avgHours
        }],
        xaxis: {
            categories: divisions,
            title: { text: 'Division' },
            labels: { rotate: -45 }
        },
        yaxis: {
            title: { text: 'Hours' },
            min: 0
        },
        colors: ['#f6c23e'],
        dataLabels: { enabled: false },
        tooltip: {
            theme: 'dark',
            y: {
                formatter: val => `${val.toFixed(2)} hours`
            }
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: false
            }
        }
    };

    const chartEl = document.querySelector("#average-completion-time-chart");
    if (chartEl) {
        const chart = new ApexCharts(chartEl, options);
        chart.render();
    } else {
        console.error("Chart element not found: #average-completion-time-chart");
    }
}

function renderTopRequestorsChart(data) {
    if (!Array.isArray(data) || data.length === 0) {
        console.warn("No data for Top Requestors chart");
        return;
    }

    const names = data.map(item => item.requestor_name || 'Unknown');
    const counts = data.map(item => parseInt(item.total_requests));

    const options = {
        chart: {
            type: 'bar',
            height: 375,
            toolbar: { show: false }
        },
        series: [{
            name: 'Total Requests',
            data: counts
        }],
        xaxis: {
            categories: names,
            title: { text: 'Requestor Name' },
            labels: { rotate: -45 }
        },
        yaxis: {
            title: { text: 'Number of Requests' },
            min: 0
        },
        colors: ['#36b9cc'],
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: true
            }
        },
        dataLabels: {
            enabled: true,
            style: {
                colors: ['#fff']
            },
            formatter: val => `${val}`
        },
        tooltip: {
            theme: 'dark',
            y: {
                formatter: val => `${val} requests`
            }
        }
    };

    const chartEl = document.querySelector("#top-requestors-chart");
    if (chartEl) {
        const chart = new ApexCharts(chartEl, options);
        chart.render();
    } else {
        console.error("Chart element not found: #top-requestors-chart");
    }
}

function renderCancelledRejectedTrendChart(data) {
    if (!Array.isArray(data) || data.length === 0) {
        console.warn("No data for Cancelled/Rejected Requests chart");
        return;
    }

    const dates = data.map(item => item.request_day);
    const totals = data.map(item => parseInt(item.total_requests));

    const options = {
        chart: {
            type: 'area',
            height: 375,
            toolbar: { show: false },
            zoom: { enabled: false }
        },
        stroke: { curve: 'smooth', width: 3 },
        series: [{
            name: 'Cancelled/Rejected Requests',
            data: totals
        }],
        xaxis: {
            categories: dates,
            title: { text: 'Date' },
            labels: { rotate: -45 }
        },
        yaxis: {
            title: { text: 'Number of Requests' },
            min: 0
        },
        colors: ['#e74a3b'],
        dataLabels: { enabled: false },
        tooltip: {
            theme: 'dark',
            y: { formatter: val => `${val} requests` }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.5,
                opacityTo: 0.1,
                stops: [0, 100]
            }
        },
        markers: {
            size: 6,
            colors: ['#e74a3b'],
            strokeColors: '#fff',
            strokeWidth: 2
        }
    };

    const chartEl = document.querySelector("#cancelled-rejected-trend-chart");
    if (chartEl) {
        const chart = new ApexCharts(chartEl, options);
        chart.render();
    } else {
        console.error("Chart element not found: #cancelled-rejected-trend-chart");
    }
}

function renderTopRequestingSectionsChart(data) {
    const sectionNames = data.map(item => item.section);
    const requestCounts = data.map(item => item.total_requests);

    const options = {
        chart: {
            type: 'bar',
            height: 375,
            toolbar: { show: false }
        },
        plotOptions: {
            bar: {
                borderRadius: 6,
                horizontal: true
            }
        },
        dataLabels: {
            enabled: true
        },
        colors: ['#4e73df'],
        series: [{
            name: 'Total Requests',
            data: requestCounts
        }],
        xaxis: {
            categories: sectionNames,
            title: { text: 'Requests' }
        },
        yaxis: {
            title: { text: 'Sections' }
        },
        tooltip: {
            theme: 'dark',
            y: {
                formatter: (val) => `${val} requests`
            }
        }
    };

    const chartElement = document.querySelector("#top-requesting-sections-chart");
    if (chartElement) {
        const chart = new ApexCharts(chartElement, options);
        chart.render();
    } else {
        console.error("Chart element not found: #top-requesting-sections-chart");
    }
}




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

    let divisionSelect = document.getElementById("division-select");
    let sectionSelect = document.getElementById("section-select");

    // Clear the section dropdown initially
    sectionSelect.innerHTML = '<option value="" disabled selected>Select Section</option>';

    // Listen for changes in the division select dropdown
    divisionSelect.addEventListener("change", function () {
        console.log(88)
        let selectedDivisionID = parseInt(this.value); // Get the selected PGSDivisionID
        sectionSelect.innerHTML = '<option value="" disabled selected>Select Section</option>'; // Reset section dropdown

        // Filter sections where the 'division' field (PGSDivisionID) matches
        let filteredSections = section_data.filter(section => parseInt(section.division) === selectedDivisionID);

        // Populate the section dropdown with matching sections
        filteredSections.forEach(section => {
            console.log(section)
            let option = document.createElement("option");
            option.value = section.sectionID;
            option.textContent = section.sectionName;
            sectionSelect.appendChild(option);
        });
    });

    $(document).off('click', '#filter-date-search-btn').on('click', '#filter-date-search-btn', function () {
        const startDate = $('#start-date-input').val();
        const endDate = $('#end-date-input').val(); 
        const division = $('#division-select').val();
        const section = $('#section-select').val();
        console.log(startDate, endDate, division, section)

        $.ajax({
            url: '../../php/dashboard_user_php/fetch_user_request.php',
            method: 'POST',
            data: {
            startDate, endDate, division, section
            },
            dataType: 'json',
            success: function (response) {
                console.log(response)
                
                $('#total-request-value').text(response.totalRequestsForSection);
                $('#top-request-value').text(response.topSectionInDivision.section + " - " + response.topSectionInDivision.total);
                render3DPieChart(response.categoryPie)
                render3DPieChartSub(response.subCategoryPie)
            },
            error: function (err) {
                console.error('AJAX error:', err);
            }
        });

        // // Restriction checks
        // if (!startDate) {
        //     alert('Please select a start date.');
        //     return;
        // }
    
        // // If it's not a daily request, require endDate
        // if (from !== 'daily_request' && !endDate) {
        //     alert('Please select an end date.');
        //     return;
        // }
    
        // Proceed with AJAX
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


