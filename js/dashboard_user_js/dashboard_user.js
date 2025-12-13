// dashboard_user.js (cleaned & debugged)
// Assumes ApexCharts and jQuery already loaded

// Keep chart references so we can destroy before re-rendering
let chartRequestVolume = null;
let chartAvgRating = null;
let chartAvgCompletion = null;
let chartTopRequestors = null;
let chartCancelledRejected = null;
let chartTopSections = null;

$(document).ready(function () {
    // Ensure fetchNotifValue exists in your app; call if present
    if (typeof fetchNotifValue === 'function') fetchNotifValue();

    // Initial fetch with null filters
    onLoadFetch_total_request(null, null, null, null);

    // Protect DOM access for selects
    const divisionSelect = document.getElementById("division-select");
    const sectionSelect = document.getElementById("section-select");

    if (sectionSelect) {
        sectionSelect.innerHTML = '<option value="" disabled selected>Select Section</option>';
    }

    if (divisionSelect && sectionSelect && typeof section_data !== 'undefined') {
        divisionSelect.addEventListener("change", function () {
            let selectedDivisionID = parseInt(this.value);
            sectionSelect.innerHTML = '<option value="" disabled selected>Select Section</option>';
            if (Number.isNaN(selectedDivisionID)) return;

            const filteredSections = section_data.filter(section => {
                return parseInt(section.division) === selectedDivisionID;
            });

            filteredSections.forEach(section => {
                const option = document.createElement("option");
                option.value = section.sectionID;
                option.textContent = section.sectionName;
                sectionSelect.appendChild(option);
            });
        });
    } else {
        if (!divisionSelect || !sectionSelect) console.warn("division-select or section-select not found in DOM");
        if (typeof section_data === 'undefined') console.warn("section_data is not defined");
    }

    // Filter button
    $(document).off('click', '#filter-date-search-btn').on('click', '#filter-date-search-btn', function () {
        const startDate = $('#start-date-input').val();
        const endDate = $('#end-date-input').val();
        const division = $('#division-select').val();
        const section = $('#section-select').val();
        // call same fetch used on load
        onLoadFetch_total_request(startDate || null, endDate || null, division || null, section || null);
    });

    // info tooltip handlers (guard)
    const infoButtons = document.querySelectorAll('.info-btn');
    if (infoButtons && infoButtons.length) {
        const tooltip = document.createElement('div');
        tooltip.className = 'chart-tooltip';
        document.body.appendChild(tooltip);

        infoButtons.forEach(btn => {
            btn.addEventListener('mouseenter', (e) => {
                tooltip.textContent = btn.dataset.info || '';
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
    }
});

// Centralized loader used on page load and filter
const onLoadFetch_total_request = (startDate, endDate, division, section) => {
    console.log("Fetching data with filters:", { startDate, endDate, division, section });
    $.ajax({
        url: '../../php/dashboard_user_php/fetch_user_request.php',
        method: 'POST',
        data: { startDate, endDate, division, section },
        dataType: 'json',
        success: function (response) {
            console.log(response)
            if (!response || typeof response !== 'object') {
                console.error("Invalid response from server:", response);
                return;
            }

            // Total requests
            $('#total-request-value').text(response.totalRequests ?? 0);

            // Top section — use topSection (string) primarily
            if (response.topSection) {
                $('#top-request-value').text(response.topSection);
            } else if (Array.isArray(response.topRequestingDivisionsSections) && response.topRequestingDivisionsSections.length > 0) {
                // fallback to first entry in ranked sections
                const first = response.topRequestingDivisionsSections[0];
                const secName = first.section ?? first.section_name ?? "Unknown";
                const total = first.total_requests ?? first.total ?? 0;
                $('#top-request-value').text(`${secName} - ${total}`);
            } else {
                $('#top-request-value').text('No top section data');
            }

            // Render charts if data exists. Each renderer handles empty arrays.
            renderRequestVolumeTrendChart(response.requestVolumeTrend || []);
            renderAverageRatingPerDivisionChart(response.averageRatingPerDivision || []);
            renderAverageCompletionTimeChart(response.averageCompletionByDivision || []);
            renderTopRequestorsChart(response.topRequestors || []);
            renderCancelledRejectedTrendChart(response.cancelledRejectedTrend || []);
            renderTopRequestingSectionsChart(response.topRequestingDivisionsSections || []);
        },
        error: function (err) {
            console.error('AJAX error:', err);
        }
    });
};

/* ---------- Chart renderers (destroy before creating) ---------- */

function destroyIfExists(chartVar) {
    try {
        if (chartVar && typeof chartVar.destroy === 'function') {
            chartVar.destroy();
        }
    } catch (e) {
        console.warn('Chart destroy error', e);
    }
}

function renderRequestVolumeTrendChart(data) {
    destroyIfExists(chartRequestVolume);
    if (!Array.isArray(data) || data.length === 0) {
        console.warn("No data for Request Volume Trend chart");
        return;
    }

    const dates = data.map(item => item.request_day);
    const requestCounts = data.map(item => parseInt(item.total_requests || 0));

    const options = {
        chart: { type: 'line', height: 375, toolbar: { show: false }, zoom: { enabled: false } },
        stroke: { curve: 'smooth', width: 3 },
        series: [{ name: 'Requests', data: requestCounts }],
        xaxis: { categories: dates, title: { text: 'Date' }, labels: { rotate: -45 } },
        yaxis: { title: { text: 'Total Requests' }, min: 0 },
        colors: ['#1cc88a'],
        dataLabels: { enabled: false },
        tooltip: { theme: 'dark', y: { formatter: val => `${val} requests` } }
    };

    const el = document.querySelector("#request-volume-trend-chart");
    if (el) {
        chartRequestVolume = new ApexCharts(el, options);
        chartRequestVolume.render();
    } else console.error("Chart element not found: #request-volume-trend-chart");
}

function renderAverageRatingPerDivisionChart(data) {
    destroyIfExists(chartAvgRating);
    if (!Array.isArray(data) || data.length === 0) {
        console.warn("No data for Average Rating Per Division chart");
        return;
    }

    const divisions = data.map(item => item.division || 'Unknown');
    const ratings = data.map(item => parseFloat(item.avg_rating || 0));

    const options = {
        chart: { type: 'bar', height: 375, toolbar: { show: false } },
        plotOptions: { bar: { horizontal: true, borderRadius: 6, distributed: true } },
        series: [{ name: 'Average Rating', data: ratings }],
        xaxis: { categories: divisions, title: { text: 'Average Rating (out of 5)' }, min: 0, max: 5 },
        dataLabels: { enabled: true, formatter: val => `${val} ★`, style: { colors: ['#333'] } },
        colors: ['#00C49F', '#0088FE', '#FFBB28', '#FF8042', '#4CAF50', '#AB47BC'],
        tooltip: { y: { formatter: val => `${val} ★` } }
    };

    const el = document.querySelector("#average-rating-per-division-chart");
    if (el) {
        chartAvgRating = new ApexCharts(el, options);
        chartAvgRating.render();
    } else console.error("Chart element not found: #average-rating-per-division-chart");
}

function renderAverageCompletionTimeChart(data) {
    destroyIfExists(chartAvgCompletion);
    if (!Array.isArray(data) || data.length === 0) {
        console.warn("No data for Average Completion Time chart");
        return;
    }

    const divisions = data.map(item => item.division || 'Unknown');
    const avgHours = data.map(item => parseFloat(item.avg_hours || 0));

    const options = {
        chart: { type: 'bar', height: 375, toolbar: { show: false } },
        series: [{ name: 'Average Completion Time (hours)', data: avgHours }],
        xaxis: { categories: divisions, title: { text: 'Division' }, labels: { rotate: -45 } },
        yaxis: { title: { text: 'Hours' }, min: 0 },
        colors: ['#f6c23e'],
        dataLabels: { enabled: false },
        tooltip: { theme: 'dark', y: { formatter: val => `${val.toFixed(2)} hours` } },
        plotOptions: { bar: { borderRadius: 4, horizontal: false } }
    };

    const el = document.querySelector("#average-completion-time-chart");
    if (el) {
        chartAvgCompletion = new ApexCharts(el, options);
        chartAvgCompletion.render();
    } else console.error("Chart element not found: #average-completion-time-chart");
}

function renderTopRequestorsChart(data) {
    destroyIfExists(chartTopRequestors);
    if (!Array.isArray(data) || data.length === 0) {
        console.warn("No data for Top Requestors chart");
        return;
    }

    const names = data.map(item => item.requestor_name || 'Unknown');
    const counts = data.map(item => parseInt(item.total_requests || 0));

    const options = {
        chart: { type: 'bar', height: 375, toolbar: { show: false } },
        series: [{ name: 'Total Requests', data: counts }],
        xaxis: { categories: names, title: { text: 'Requestor Name' }, labels: { rotate: -45 } },
        yaxis: { title: { text: 'Number of Requests' }, min: 0 },
        colors: ['#36b9cc'],
        plotOptions: { bar: { borderRadius: 4, horizontal: true } },
        dataLabels: { enabled: true, style: { colors: ['#fff'] }, formatter: val => `${val}` },
        tooltip: { theme: 'dark', y: { formatter: val => `${val} requests` } }
    };

    const el = document.querySelector("#top-requestors-chart");
    if (el) {
        chartTopRequestors = new ApexCharts(el, options);
        chartTopRequestors.render();
    } else console.error("Chart element not found: #top-requestors-chart");
}

function renderCancelledRejectedTrendChart(data) {
    destroyIfExists(chartCancelledRejected);
    if (!Array.isArray(data) || data.length === 0) {
        console.warn("No data for Cancelled/Rejected Requests chart");
        return;
    }

    const dates = data.map(item => item.request_day);
    const totals = data.map(item => parseInt(item.total_requests || 0));

    const options = {
        chart: { type: 'area', height: 375, toolbar: { show: false }, zoom: { enabled: false } },
        stroke: { curve: 'smooth', width: 3 },
        series: [{ name: 'Cancelled/Rejected Requests', data: totals }],
        xaxis: { categories: dates, title: { text: 'Date' }, labels: { rotate: -45 } },
        yaxis: { title: { text: 'Number of Requests' }, min: 0 },
        colors: ['#e74a3b'],
        dataLabels: { enabled: false },
        tooltip: { theme: 'dark', y: { formatter: val => `${val} requests` } },
        fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.5, opacityTo: 0.1, stops: [0, 100] } },
        markers: { size: 6, colors: ['#e74a3b'], strokeColors: '#fff', strokeWidth: 2 }
    };

    const el = document.querySelector("#cancelled-rejected-trend-chart");
    if (el) {
        chartCancelledRejected = new ApexCharts(el, options);
        chartCancelledRejected.render();
    } else console.error("Chart element not found: #cancelled-rejected-trend-chart");
}

function renderTopRequestingSectionsChart(data) {
    destroyIfExists(chartTopSections);
    if (!Array.isArray(data) || data.length === 0) {
        console.warn("No data for Top Requesting Sections chart");
        return;
    }

    // Use keys present in your response:
    const sectionNames = data.map(item => item.section ?? item.section_name ?? 'Unknown');
    const requestCounts = data.map(item => parseInt(item.total_requests ?? item.total ?? 0));

    const options = {
        chart: { type: 'bar', height: 375, toolbar: { show: false } },
        plotOptions: { bar: { borderRadius: 6, horizontal: true } },
        dataLabels: { enabled: true },
        series: [{ name: 'Total Requests', data: requestCounts }],
        xaxis: { categories: sectionNames, title: { text: 'Requests' } },
        tooltip: { theme: 'dark', y: { formatter: (val) => `${val} requests` } },
        colors: ['#4e73df']
    };

    const el = document.querySelector("#top-requesting-sections-chart");
    if (el) {
        chartTopSections = new ApexCharts(el, options);
        chartTopSections.render();
    } else console.error("Chart element not found: #top-requesting-sections-chart");
}
