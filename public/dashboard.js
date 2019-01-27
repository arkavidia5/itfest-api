$('document').ready(function() {
    $('#new-button').click(function() {
        // $('#new-button').remove();
        if ($('#tenant').length === 1) {
            $("#table-tenant").append('<tr class="new-record"><td><input type="text" class="add-txtbox" value="" /></td><td><input type="text" class="add-txtbox" value="" /></td><td><input type="text" class="add-txtbox" value="" /></td></tr>');
        }
        else if ($('#tenant').length === 1) {
            $("#table-item").append('<tr class="new-record"><td><input type="text" class="add-txtbox" value="" /></td><td><input type="text" class="add-txtbox" value="" /></td><td><input type="text" class="add-txtbox" value="" /></td><td><input type="text" class="add-txtbox" value="" /></td><td><input type="text" class="add-txtbox" value="" /></td><td><input type="text" class="add-txtbox" value="" /></td></tr>');
        }


        if ($('#save-button').length === 0 && $('#cancel-button').length === 0) {
            $('.button').append('<button id="save-button" class="add-button">Save</button> <button id="cancel-button" class="add-button">Cancel</button>');

            $('#cancel-button').click(function() {
                $('.new-record').remove();
                $('.cancel-button').remove();
                $('.save-button').remove();
            });
        }
    });

});
