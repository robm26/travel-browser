/**
 * Created by mccaul on 5/29/18.
 */
let workbook;
let activeSheet;

function stateFilter(state) {

    console.log('filtering on state ' + state);
    activeSheet.getWorksheets().get("ProfitMap").applyFilterAsync(
        "State",
        state,
        tableau.FilterUpdateType.REPLACE);

}
function stateFilter(state) {

    console.log('filtering on state ' + state);
    activeSheet.getWorksheets().get("ProfitMap").applyFilterAsync(
        "State",
        state,
        tableau.FilterUpdateType.REPLACE);

}
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

    let viz = new tableau.Viz(containerDiv, url, options);

}