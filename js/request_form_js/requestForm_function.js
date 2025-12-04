function validateFields() {
    const category = window.selectedCategory;
    const subcategory = window.selectedSubCategory;
    const description = $('#description-val-id').val().trim();

    // Enable the button only if all are filled
    if (category && subcategory && description) {
        $('#submit-btn').css("pointer-events", "auto").css("opacity", "1");
    } else {
        $('#submit-btn').css("pointer-events", "none").css("opacity", "0.7");
    }
}

$(document).ready(function(){
    // Revalidate whenever user types or selects

    $('#description-val-id').on('input', validateFields);
    $('#sub-infra-select').on('change', function () {
        const value = $(this).val();
        const text = $('#sub-infra-select option:selected').text()
        // Only accept valid selections
        if (value !== "") {
            window.selectedSubCategory = text;
        } else {
            window.selectedSubCategory = null;
        }
        validateFields();
    });

    $('.infra-btn').on('click', function () {
        window.selectedCategory = $(this).data('category');
        validateFields();
    });

    $("#submit-btn").on("click", function () {
        const requestCategory = window.selectedCategory;
        const requestSubCategory = window.selectedSubCategory;
        const requestDescription = $('#description-val-id').val().trim();

        if (!requestCategory || !requestSubCategory || !requestDescription) {
            Swal.fire({
                icon: 'warning',
                title: 'Incomplete Fields',
                text: 'Please complete all fields before submitting.',
                confirmButtonColor: '#3085d6',
            });
            return;
        }

        const data = {
            requestDate: $('#date-val-id').text(),
            requestExactFrom: $('#section-val-id').val(),
            requestCategory,
            requestSubCategory,
            requestDescription,
            requestStatus: "Pending",
        };

        console.log(data);

        try {
            $.ajax({
                url: '../php/job_order_php/add_jobOrderRequest.php',
                method: "POST",
                data: data,
                success: function(response) {
                    console.log(response)
                    response = response.trim()
                    try {
                        if (response === 'success') {
                            Swal.fire({
                                icon: 'success',
                                title: 'Request Submitted!',
                                text: 'Your job order request has been successfully submitted.',
                                confirmButtonColor: '#3085d6',
                            }).then(() => {
                                // Reset fields
                                $(".infra-btn").each(function () {
                                    $(this).css("opacity", "");
                                });
                                $('#predefined-concerns').val("").trigger("change");
                                $('#description-val-id').val("");

                                // remove all the glow effects
                                $('.infra-btn').removeClass('active glow-btn').css({
                                    'opacity': '0.6',
                                    'border': 'none'
                                });
                                $('#sub-infra-select').removeClass('active glow-btn').css({
                                    'opacity': '0.6',
                                    'border': 'none'
                                });
                                $('#sub-infra-select')
                                    .prop('disabled', true)
                                    .empty()
                                    .append('<option value="">-- Select Sub Category --</option>');
                                window.selectedCategory = null;
                                window.selectedSubCategory = null;
                                $('#submit-btn').css("pointer-events", "none").css("opacity", "0.7");
                            });

                        } 
                        else if (response === 'pending') {
                            Swal.fire({
                                icon: 'info',
                                title: 'Pending Request',
                                text: 'You still have a pending request. Please wait for it to be processed.',
                                confirmButtonColor: '#3085d6',
                            });
                        } 
                        else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Submission Failed',
                                text: 'Something went wrong while submitting your request.',
                                confirmButtonColor: '#d33',
                            });
                        }

                    } catch (innerError) {
                        console.error("Error processing response:", innerError);
                    }
                },
                error: function(xhr, status, error) {
                    console.error("AJAX request failed:", error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Server Error',
                        text: 'Unable to submit your request. Please try again later.',
                        confirmButtonColor: '#d33',
                    });
                }
            });
        } catch (ajaxError) {
            console.error("Unexpected error occurred:", ajaxError);
            Swal.fire({
                icon: 'error',
                title: 'Unexpected Error',
                text: 'An unexpected issue occurred. Please refresh and try again.',
                confirmButtonColor: '#d33',
            });
        }
    });


})