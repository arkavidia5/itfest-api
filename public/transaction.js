let dataSet = [];
let table;

$(document).ready( function () {
    table = $('#table-transaction').DataTable({
        "pagingType": "full_numbers",
        "data": dataSet,
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
    fetchData();
});

function fetchData() {
    fetch("/api/transaction/all")
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            dataSet = [];
            for (let obj of data) {
                dataSet.push([obj.type, obj.item, obj.tenant, obj.user_id, obj.quantity, obj.total_price, obj.created_at]);
            }
            table.clear().draw();
            table.rows.add(dataSet);
            table.columns.adjust().draw();
        })
        .catch(err => console.log(err));
}
