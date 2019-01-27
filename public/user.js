let dataSet = [];
let table;

$(document).ready( function () {
    table = $('#table-user').DataTable({
        "pagingType": "full_numbers",
        "data": dataSet,
        "columns": [
            {title: "User ID"},
            {title: "Point"}
        ],
        "columnDefs": [
            { "width": "200px", "targets": 0},
            { "width": "100px", "targets": 1}
        ]
    });
    fetchData();
    $("#submit-button").click(postData);
});

function fetchData() {
    fetch("/api/user/all")
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            dataSet = [];
            for (let obj of data) {
                dataSet.push([obj.id, obj.point]);
            }
            table.clear().draw();
            table.rows.add(dataSet);
            table.columns.adjust().draw();
        })
        .catch(err => console.log(err));
}

function showTable(data) {
    $("#tbody-user").empty();
    for (let obj of data) {
        let tr = document.createElement("tr");
        let td_1 = document.createElement("td");
        let td_2 = document.createElement("td");
        tr.appendChild(td_1);
        tr.appendChild(td_2);
        td_1.appendChild(document.createTextNode(obj.id));
        td_2.appendChild(document.createTextNode(obj.point));
        $("#tbody-user").append(tr);
    }
}

function postData() {
    let count = parseInt($("#user-count").val());
    console.log(count);
    if (Number.isNaN(count) || count < 0 || count > 1000) {
        alert("Count is wrong");
    } else {
        fetch("/api/user", {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            credential: "same-origin",
            body: JSON.stringify({count})
        }).then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Response(`response ${response.ok}`)
        }).then((data) => {
            fetchData();
        }).catch((err) => {console.log(err)});
    }

}