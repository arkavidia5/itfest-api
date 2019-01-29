let dataSet = [];
let table;
let editStatus;

$(document).ready( function () {
    table = $('#table-item').DataTable({
        "pagingType": "full_numbers",
        "data": dataSet,
        "columnDefs": [
            { "width": "300px", "targets": 0},
            { "width": "250px", "targets": 1},
            { "width": "180px", "targets": 2},
            { "width": "150px", "targets": 3},
            { "width": "150px", "targets": 4}
        ]
    });
    fetchData();

    $('#new-button').click(function() {
        let editButton = document.getElementById("edit-button");
        editButton.style.display = "none";
        newForm();
    });

    $('#edit-button').click(function() {
        console.log(dataSet);
        if (dataSet.length > 0) {
            editStatus = 1;
            let addButton = document.getElementById("new-button");
            addButton.style.display = "none";
            let table = $('#table-item').DataTable();
            $('#table-item').unbind("click");
            $('#table-item').on('click', 'tbody tr', function () {
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
    fetch("/api/item/all")
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            dataSet = [];
            for (let obj of data) {
                dataSet.push([obj.id, obj.name, obj.price, obj.tenant, obj.stock, obj.max_stock]);
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
        // send query save value
        ///////////////////////
        // JOSAL QUERY ! //
        let name = $('#add-name').val(),
            price = $('#add-price').val(),
            tenant = $('#add-tenant').val(),
            stock = $('#add-stock').val();

        if (name.length < 5 && parseInt(price) <= 0 && tenant.length < 5 && parseInt(stock) <= 0) {
            return;
        }
        fetch("/api/item", {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            credential: "same-origin",
            body: JSON.stringify({name, price, tenant, stock})
        }).then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(`response ${response.ok}`)
        }).then((data) => {
            let newdata = [data.id, name, price, tenant, stock, data.max_stock];
            dataSet.push(newdata);
            let table = $('#table-item').DataTable();
            table.row.add(newdata).draw();
            resetAddMode();
        }).catch((err) => {
            alert(err.message);
        });
    }
}

function editForm(row) {
    let data = row.data();
    console.log('yes');
    // Get the modal
    let modal = $('#editModal')[0];

    // Get the <span> element that closes the modal
    let span = $(".close-edit")[0];

    // When the user clicks the rows, open the modal
    modal.style.display = "block";
    $('#edit-id').val(data[0]);
    $('#edit-name').val(data[1]);
    $('#edit-price').val(data[2]);
    $('#edit-tenant').val(data[3]);
    $('#edit-stock').val(data[4]);
    $('#edit-max-stock').val(data[5]);

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        resetEditMode();
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            resetEditMode();
            modal.style.display = "none";
        }
    }

    let change = $('#change-button')[0];
    change.onclick = function(event) {
        modal.style.display = "none";
        // send query save value
        ///////////////////////
        // JOSAL QUERY ! //
        console.log('saved');
        // isi new data
        let newdata = [data[0], $('#edit-name').val(), $('#edit-price').val(), $('#edit-tenant').val(), $('#edit-stock').val(), $('#edit-max-stock').val()];
        row.data(newdata).draw();
        resetEditMode();
    }
}

function resetEditMode() {
    console.log('reset');
    let addButton = $("#new-button")[0];
    addButton.style.display = "inline";
    editStatus = 0;
}

function resetAddMode() {
    console.log('reset');
    let editButton = $("#edit-button")[0];
    editButton.style.display = "inline";
    $('#add-id').val('');
    $('#add-name').val('');
    $('#add-price').val('');
    $('#add-tenant').val('');
    $('#add-stock').val('');
    $('#add-max-stock').val('');
}
