var columnDefs = [
    { headerName: "Trader", field: "trader" },
    { headerName: "Ticker", field: "ticker" },

    { headerName: "Time", field: "time" },
    {
        headerName: "Type", field: "type", cellStyle: function (params) {
            if (params.value === 'SELL' || params.value === 'SHORT') {
                //mark police cells as red
                return { color: 'red' };
            } else if (params.value === 'BUY' || params.value === 'COVER') {
                return { color: 'green' };
            }
        }
    },
    { headerName: "Group", field: "group" },
    { headerName: "Option", field: "option" },
];

// let the grid know which columns and what data to use
var gridOptions = {
    defaultColDef: {
        sortable: true,
        resizable: true,
        filter: true,

    },
    columnDefs: columnDefs,
    isExternalFilterPresent: isExternalFilterPresent,
    doesExternalFilterPass: doesExternalFilterPass
};

var filterType = "All";

function isExternalFilterPresent() {
    return filterType !== 'All';
}

function externalFilterChanged(newValue) {
    //document.body.appendChild(document.createTextNode(newValue));
    console.log(newValue);
    filterType = newValue;
    gridOptions.api.onFilterChanged();
}

function doesExternalFilterPass(node) {
    switch (filterType) {
        case 'Scott':
            return node.data.trader === "Scott";
        case 'Dan':
            return node.data.trader === "Dan";
        case 'Calls':
            return node.data.option.includes("C") === true;
        case 'Puts':
            return node.data.option.includes("P") === true;
        default:
            return true;
    }
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
    gridOptions.api.sizeColumnsToFit();
    //add listeners
    document.getElementById('filter-all').checked = true;

    var el1 = document.querySelector('#filter-all');
    el1.onchange = function () { externalFilterChanged('All') };
    var el2 = document.querySelector('#filter-scott');
    el2.onchange = function () { externalFilterChanged('Scott') };
    var el3 = document.querySelector('#filter-dan');
    el3.onchange = function () { externalFilterChanged('Dan') };
    var el4 = document.querySelector('#filter-calls');
    el4.onchange = function () { externalFilterChanged('Calls') };
    var el5 = document.querySelector('#filter-puts');
    el5.onchange = function () { externalFilterChanged('Puts') };

    main();
});

function main() {
    chrome.storage.local.get("trades", function (data) {
        if (typeof data.trades == "undefined") {
            //document.body.appendChild(document.createTextNode("bad data"));
        } else {
            gridOptions.api.setRowData(data.trades);

            document.getElementById("num").innerHTML = "Total Trades: " + data.trades.length;
            //debug data
            //document.getElementById("data").innerHTML = JSON.stringify(data.trades);
        }
    });
}
