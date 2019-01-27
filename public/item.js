let dataSet = [];
let table;

$(document).ready( function () {
    table = $('#table-item').DataTable({
        "pagingType": "full_numbers",
        "data": dataSet,
        "columnDefs": [
            { "width": "100px", "targets": 0},
            { "width": "189px", "targets": 1},
            { "width": "180px", "targets": 2},
            { "width": "180px", "targets": 3},
            { "width": "180px", "targets": 4}
        ]
    });
    fetchData();
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
