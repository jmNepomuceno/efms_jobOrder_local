if (window.dateTimeInterval) {
    clearInterval(window.dateTimeInterval);
}

function updateDateTime() {
    let now = new Date();
    let formattedDate = now.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    }).replace(',', ' -'); 

    let dateElement = document.getElementById("date-val-id");
    if (dateElement) {
        dateElement.innerText = formattedDate;
    } else {
        clearInterval(window.dateTimeInterval);
    }
}

window.dateTimeInterval = setInterval(updateDateTime, 1000);


$(document).ready(function(){
    
    const allOptions = $('#sub-infra-select option').clone(); // Backup of all options

    // Make selectedCategory and selectedSubCategory globally accessible
    window.selectedCategory = '';
    window.selectedSubCategory = '';

    $('.infra-btn').on('click', function () {
        // Reset all buttons
        $('.infra-btn').removeClass('active glow-btn').css({
            'opacity': '0.6',
            'border': 'none'
        });

        // Apply active and glowing effect
        $(this).addClass('active glow-btn').css({
            'opacity': '1',
            'border': '2px solid #4f4fff' // subtle blue border
        });

        const selectedCategory = $(this).data('category');
        window.selectedCategory = selectedCategory; // Store globally

        let labelText = '';

        switch (selectedCategory) {
            case 'IU':
                labelText = '-- Select Planning Category --';
                break;
            case 'EU':
                labelText = '-- Select Electrical Category --';
                break;
            case 'MU':
                labelText = '-- Select Mechanical Category --';
                break;
            default:
                labelText = '-- Select Sub Category --';
        }

        $('#sub-infra-select').prop('disabled', false);
        $('#sub-infra-select').empty().append(`<option value="">${labelText}</option>`);

        allOptions.each(function () {
            const val = $(this).val();
            if (val === selectedCategory) {
                $('#sub-infra-select').append($(this));
            }
        });
    });

    // Listen for change in sub-category selection
    $('#sub-infra-select').on('change', function () {
        const selectedVal = $(this).val();
        const selectedText = $('#sub-infra-select option:selected').text();
        window.selectedSubCategory = selectedText;

        if (selectedVal === "") {
            // Reset glow if default option is selected
            $(this).removeClass('active glow-btn').css({
                'opacity': '0.6',
                'border': 'none'
            });
        } else {
            // Apply glow and active styles
            $(this).addClass('active glow-btn').css({
                'opacity': '1',
                'border': '2px solid #4f4fff'
            });
        }
    });


    // Disable dropdown on page load
    $('#sub-infra-select').prop('disabled', true);

    // function checkDescriptionLength() {
    //     if ($("#description-val-id").val().length > 1) {
    //         $("#submit-btn").css("pointer-events", "auto"); 
    //         $("#submit-btn").css("opacity", "1"); 
    //     } else {
    //         $("#submit-btn").css("pointer-events", "none"); 
    //         $("#submit-btn").css("opacity", "0.7"); 

    //     }
    // }

    // $("#description-val-id").on("input", checkDescriptionLength);
})