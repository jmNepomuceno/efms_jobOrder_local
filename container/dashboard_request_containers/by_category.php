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
        <div class="category-div">
            <select id="category-select">
                <option value="" selected>Select the Category</option>
                <option value="MET">MET</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Carpentry">Carpentry</option>
            </select>
        </div>

        <div class="sub-category-div">
            <select id="sub-category-select">
                <option value="" selected>Select the Sub Category</option>
                <option value="MET">MET</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Carpentry">Carpentry</option>
            </select>
        </div>

        <button id="filter-date-search-btn" type="button" class="btn btn-secondary">Search</button>

    </div>

   
    
    <h1>Total Request By: </h1>
    
    <div class="request-graph-div">
        <canvas id="requestsPerHourChart" ></canvas>
        <div class="request-tally-div">
            <div class="total-request-div">
                <span>Total Request</span>
                <span id="total-request-value">0</span>
            </div>
            <div class="total-request-ot-div">
                <span>Total Overdue Request</span>
                <span id="total-request-ot-value">0</span>
            </div>
            <div class="total-request-cancel-div">
                <span>Total Cancelled Request</span>
                <span id="total-request-cancel-value">0</span>
            </div>
        </div>
    </div>
</div>