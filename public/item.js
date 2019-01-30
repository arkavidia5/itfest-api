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
        let name = $('#add-name').val(),
            price = $('#add-price').val(),
            tenant = $('#add-tenant').val(),
            stock = $('#add-stock').val();

        if (name.length < 5 || parseInt(price).isNaN || parseInt(stock).isNaN || parseInt(price) <= 0 || tenant.length < 5 || parseInt(stock) <= 0) {
            alert("error");
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
            resetAddMode();
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
    $('#item-stock').html(`Stock: ${data[4]}`);
    $('#item-max-stock').html(`Max stock: ${data[5]}`);

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

    let reduceButton = $('#reduce-button')[0],
        addButton = $("#add-button")[0];

    addButton.onclick = function(event) {
        modal.style.display = "none";
        let addition = $("#add-istock").val();
        if (parseInt(addition) < 0 || parseInt(addition).isNaN) {
            return;
        }
        // console.log(parseInt(addition));

        fetch("/api/item/add", {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            credential: "same-origin",
            body: JSON.stringify({item_id: data[0], addition: parseInt(addition)})
        }).then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(`response ${response.ok}`)
        }).then((dataJSON) => {
            data.stock += addition;
            data.max_stock += addition;
            row.data(data).draw();
            resetEditMode();
        }).catch((err) => {
            alert(err.message);
            resetEditMode();
        });
    };
    reduceButton.onclick = function (event) {
        modal.style.display = "none";
        let reduce = $("#reduce-stock").val();
        if (parseInt(reduce) < 0 || parseInt(reduce).isNaN || parseInt(reduce) > item.stock) {
            return;
        }
        fetch("/api/item/reduce", {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            credential: "same-origin",
            body: JSON.stringify({item_id: data[0], reduction: parseInt(reduce)})
        }).then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(`response ${response.ok}`)
        }).then((dataJSON) => {
            data.stock += reduce;
            data.max_stock += reduce;
            row.data(data).draw();
            resetEditMode();
        }).catch((err) => {
            alert(err.message);
        });
    };
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
    $('#add-name').val('');
    $('#add-stock').val('');
    $('#add-price').val('');
    $('#add-tenant').val('');
}
