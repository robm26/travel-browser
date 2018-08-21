/**
 * Created by mccaul on 5/29/18.
 */
let workbook;
let activeSheet;
let viz;

function initViz() {
    console.log('initViz() starting');
    let containerDiv = document.getElementById("vizContainer"),
        url = "https://public.tableau.com/views/ProfitDetailsDashboard/ProfitDashboard";

    let options = {
        width: 1000,
        height: 600,
        hideTabs: true,
        hideToolbar: true,
        onFirstInteractive: function () {
            workbook = viz.getWorkbook();
            activeSheet = workbook.getActiveSheet();
        }
    };

    viz = new tableau.Viz(containerDiv, url, options);

}

function cityFilter(city) {

    activeSheet.getWorksheets().get("Profit Map").applyFilterAsync(
        "City",
        city,
        tableau.FilterUpdateType.REPLACE);

}
