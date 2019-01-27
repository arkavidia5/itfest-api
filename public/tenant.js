let dataSet = [];
let table;

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
