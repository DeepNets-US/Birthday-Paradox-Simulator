class BirthdayParadox {
    constructor(nPeople) {
        this.nPeople = nPeople;
        this.birthdays = Array.from({ length: nPeople }, () => this.genBd());
    }

    genBd() {
        // Generate random month (0-11) and date (1-31)
        const randomMonth = Math.floor(Math.random() * 12);
        const randomDate = Math.floor(Math.random() * 31) + 1;

        // Create a new Date with the current year (you can adjust the year as needed)
        const birthday = new Date(new Date().getFullYear(), randomMonth, randomDate);

        return birthday;
    }

    readable(bd) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[bd.getMonth()]} ${bd.getDate()}`;
    }

    showBirthdays() {
        return this.birthdays.map(bd => this.readable(bd));
    }

    getMatch(birthdays) {
        birthdays = birthdays || this.birthdays;

        const uniqueDates = new Set();

        for (const birthday of birthdays) {
            const dateString = this.readable(birthday);
            if (uniqueDates.has(dateString)) {
                return birthday; // Return the first matching birthday encountered
            }
            uniqueDates.add(dateString);
        }

        return null; // Return null if no match is found
    }
}




// Execution of the program based on user inputs
const NPeople = document.getElementById("NPeople");
const NSims = document.getElementById("NSims");
const StepCase = document.getElementById("StepCase");
const startSims = document.getElementById("startSims");
const graphs = document.querySelector(".graphs");
const enterAudio = document.querySelector(".enterAudio");

startSims.addEventListener("click", function (event) {
    if (event.type === "click" || (event.type === "keypress" && event.key === "Enter")) {
        const nPeopleValue = parseInt(NPeople.value);
        const nSimsValue = parseInt(NSims.value);
        const stepCaseValue = parseInt(StepCase.value);

        // Check if any input is empty or negative
        if (isNaN(nPeopleValue) || isNaN(nSimsValue) || isNaN(stepCaseValue) ||
            nPeopleValue <= 0 || nSimsValue <= 0 || stepCaseValue <= 0) {
            alert("Please enter valid positive values for N people, Simulations, and Step Case.");
        } else {
            startSimulation(nPeopleValue, nSimsValue, stepCaseValue);
            enterAudio.play();
        }
    }
});

// Listen for the "keypress" event on input fields and trigger the event
NPeople.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        startSims.click();
    }
});

NSims.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        startSims.click();
    }
});

StepCase.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        startSims.click();
    }
});

// A function for handling simulation
function startSimulation(nPeopleValue, nSimsValue, stepCaseValue) {
    graphs.innerHTML = `
    <div class="charts">
        <div id="lineDataChart"></div>
        <div id="pieChart"></div>
    <div>
    `;

    let totalMatches = 0;
    let stepMatches = 0;
    let stepProbas = [];

    for (let i = 1; i <= nSimsValue; i++) {

        const paradox = new BirthdayParadox(nPeopleValue);

        let match = paradox.getMatch();
        if (match !== null) {
            totalMatches++;
            stepMatches++;
        }

        if (i % stepCaseValue === 0) {
            let stepProba = (stepMatches / stepCaseValue).toFixed(2);
            stepProbas.push(Number(stepProba));
            stepMatches = 0;

            renderLineGraph(stepProbas, stepCaseValue);
        }
    }

    // Calculate the final probability based on total matches and simulations, rounding to two decimal places
    let finalProbability = parseFloat((totalMatches / nSimsValue).toFixed(2));
    renderPieChart(finalProbability);
}



// Render the Chart
function renderLineGraph(stepProbas, stepCaseValue) {
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var data = new google.visualization.DataTable();
        data.addColumn('number', 'Step');
        data.addColumn('number', 'Probability');

        for (var i = 0; i < stepProbas.length; i++) {
            data.addRow([(i + 1) * stepCaseValue, stepProbas[i]]);
        }

        var options = {
            title: 'Probability Variations',
            curveType: 'function',
            backgroundColor: 'transparent',
            legend: { position: 'bottom' },
            width: 600, height: 500,
        };

        var chart = new google.visualization.LineChart(document.getElementById('lineDataChart'));

        chart.draw(data, options);
    }
}


function renderPieChart(finalProbability) {

    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var data = google.visualization.arrayToDataTable([
            ["Element", "Probability", { role: "style" }],
            ["Match", finalProbability, "#b87333"],
            ["No Match", 1 - finalProbability, "silver"]
        ]);

        var view = new google.visualization.DataView(data);
        view.setColumns([0, 1,
            {
                calc: "stringify",
                sourceColumn: 1,
                type: "string",
                role: "annotation"
            },
            2]);

        var options = {
            title: "Overall Probability",
            pieHole: 0.4,
            backgroundColor: 'transparent',
            width: 600, height: 500,
            bar: { groupWidth: "95%" },
            legend: { position: "none" },
        };

        var chart = new google.visualization.PieChart(document.getElementById("pieChart"));
        chart.draw(view, options);
    }

}