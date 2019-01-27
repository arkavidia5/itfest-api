$(document).ready( function () {
    if ($('#user').length === 1) {
        $('#table-user').DataTable({
            "pagingType": "full_numbers",
            "columnDefs": [
                { "width": "100px", "targets": 0},
                { "width": "180px", "targets": 1}
              ]
        });
        $('#table-user').removeAttr('style');
    }
    else if ($('#tenant').length === 1) {
        $('.table').DataTable({
            "pagingType": "full_numbers",
            "columnDefs": [
                { "width": "100px", "targets": 0},
                { "width": "180px", "targets": 1},
                { "width": "180px", "targets": 2}
              ]
        });      
    }
    else if ($('#item').length === 1) {
        $('.table').DataTable({
            "pagingType": "full_numbers",
            "columnDefs": [
                { "width": "100px", "targets": 0},
                { "width": "189px", "targets": 1},
                { "width": "180px", "targets": 2},
                { "width": "180px", "targets": 3},
                { "width": "180px", "targets": 4}
              ]
        });       
    }
    else if ($('#transaction').length === 1) {
        $('.table').DataTable({
            "pagingType": "full_numbers",
            "columnDefs": [
                { "width": "100px", "targets": 0},
                { "width": "189px", "targets": 1},
                { "width": "180px", "targets": 2},
                { "width": "180px", "targets": 3},
                { "width": "180px", "targets": 4},
                { "width": "180px", "targets": 5},
                { "width": "180px", "targets": 6}
              ]
        });         
    }
} );