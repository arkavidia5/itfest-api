let dataSet = [];
let table;
let editStatus;

$(document).ready( function () {
    table = $('#table-tenant').DataTable({
        "pagingType": "full_numbers",
        "data": dataSet,
        "columnDefs": [
            { "width": "100px", "targets": 0},
            { "width": "180px", "targets": 1},
            { "width": "180px", "targets": 2},
        ]
    });
    fetchData();

    $('#new-button').click(function() {
        var editButton = document.getElementById("edit-button");
        editButton.style.display = "none";
        newForm();
    });

    $('#edit-button').click(function() {
        if (dataSet.length > 0) {
            editStatus = 1;
            let addButton = document.getElementById("new-button");
            addButton.style.display = "none";
            let table = $('#table-tenant').DataTable();
            $('#table-tenant').unbind("click");
            $('#table-tenant').on('click', 'tbody tr', function () {
                if (editStatus === 1) {
                    editForm(table.row(this));
                }
            });
        }
        else {
            alert('Cannot edit rows. Empty table');
            $('#edit-button').unbind("click");
        }
    });
});

function fetchData() {
    fetch("/api/tenant/all")
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            dataSet = [];
            for (let obj of data) {
                dataSet.push([obj.name, obj.detail_name, obj.point]);
            }
            table.clear().draw();
            table.rows.add(dataSet);
            table.columns.adjust().draw();
        })
        .catch(err => console.log(err));
}

function newForm() {
    // Get the modal
    let modal = $('#addModal')[0];

    // Get the <span> element that closes the modal
    let span = $(".close-add")[0];

    // When the user clicks the rows, open the modal
    $('#addModal').trigger("reset");
    modal.style.display = "block";

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        resetAddMode();
        modal.style.display = "none";
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target === modal) {
            resetAddMode();
            modal.style.display = "none";
        }
    };

    let save = $('#save-button')[0];
    save.onclick = function(event) {
        modal.style.display = "none";
        let name = $('#add-name').val(),
            detail_name =  $('#add-detail').val(),
            password = $('#add-password').val(),
            point = $('#add-point').val();

        if (name.length < 5 && detail_name.length < 5 && password.length < 5 && parseInt(point) < 100) {
            return;
        }

        fetch("/api/tenant", {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            credential: "same-origin",
            body: JSON.stringify({name, detail_name, password, point})
        }).then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(`response ${response.ok}`)
        }).then((data) => {
            let newdata = [name, detail_name, point];
            dataSet.push(newdata);
            let table = $('#table-tenant').DataTable();
            table.row.add(newdata).draw();
            resetAddMode();
        }).catch((err) => {
            alert(err.message);
        });

    }
}

function editForm(row) {
    let data = row.data();
    // Get the modal
    let modal = $('#editModal')[0];
    // Get the <span> element that closes the modal
    let span = $(".close-edit")[0];
    // When the user clicks the rows, open the modal
    modal.style.display = "block";
    $('#edit-name').val(data[0]);
    $('#edit-detail').val(data[1]);
    $('#edit-point').val(data[2]);
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        resetEditMode();
        modal.style.display = "none";
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target === modal) {
            resetEditMode();
            modal.style.display = "none";
        }
    };

    let change = $('#change-button')[0];
    change.onclick = function(event) {
        modal.style.display = "none";
        // send query save value
        ///////////////////////
        // JOSAL QUERY ! //
        console.log('saved');
        // isi new data
        let newdata = [$('#edit-name').val(), $('#edit-detail').val(), $('#edit-point').val()];
        row.data(newdata).draw();
        resetEditMode();
    }
}

function resetEditMode() {
    let addButton = $("#new-button")[0];
    addButton.style.display = "inline";
    editStatus = 0;
}

function resetAddMode() {
    let editButton = $("#edit-button")[0];
    editButton.style.display = "inline";
    $('#add-name').val('');
    $('#add-detail').val('');
    $('#add-point').val('');
}
