const penetrationCtx = document.getElementById('penetrationChart').getContext('2d');
const distributionCtx = document.getElementById('distributionChart').getContext('2d');
let penetrationChart, distributionChart;

function simulateCumulativePenetration(n, m, p) {
    let results = Array(m).fill().map(() => [0]);
    let penetrationCounts = Array(m).fill(0);

    for (let i = 0; i < m; i++) {
        let cumulative = 0;
        for (let j = 1; j <= n; j++) {
            if (Math.random() < p) cumulative++;
            results[i].push(cumulative);
        }
        penetrationCounts[i] = cumulative;
    }

    const distribution = {};
    for (let count of penetrationCounts) distribution[count] = (distribution[count] || 0) + 1;

    return { results, distribution };
}

function updatePenetrationChart(n, m, p) {
    const { results, distribution } = simulateCumulativePenetration(n, m, p);
    const labels = Array.from({ length: n }, (_, i) => `${i + 1}`);
    const datasets = results.map((result, index) => ({
        label: `Attacker ${index + 1}`,
        data: result,
        borderColor: `rgba(${Math.random() * 200 + 55}, ${Math.random() * 200 + 55}, ${Math.random() * 200 + 55}, 0.9)`,
        fill: false,
        stepped: true,
        borderWidth: 2
    }));

    if (penetrationChart) {
        penetrationChart.data.labels = ['Start', ...labels];
        penetrationChart.data.datasets = datasets;
        penetrationChart.options.scales.y.max = n;
        penetrationChart.update();
    } else {
        penetrationChart = new Chart(penetrationCtx, {
            type: 'line',
            data: {
                labels: ['Start', ...labels],
                datasets: datasets
            },
            options: {
                scales: {
                    y: { min: 0, max: n, grid: { display: false }, ticks: { color: '#999' } },
                    x: { grid: { display: false }, ticks: { color: '#999' } }
                },
                plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } }
            }
        });
    }

    updateDistributionChart(distribution, n);
}

function updateDistributionChart(distribution, maxServers) {
    const distributionLabels = Array.from({ length: maxServers + 1 }, (_, i) => `${i}`);
    const distributionData = distributionLabels.map(label => distribution[label] || 0);

    if (distributionChart) {
        distributionChart.data.labels = distributionLabels;
        distributionChart.data.datasets[0].data = distributionData;
        distributionChart.update();
    } else {
        distributionChart = new Chart(distributionCtx, {
            type: 'bar',
            data: {
                labels: distributionLabels,
                datasets: [{
                    data: distributionData,
                    backgroundColor: 'rgba(70, 130, 180, 0.8)',
                    borderColor: 'rgba(70, 130, 180, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: { grid: { display: false }, ticks: { color: '#999' } },
                    x: { grid: { display: false }, ticks: { color: '#999' } }
                },
                plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } }
            }
        });
    }
}

document.getElementById('settingsForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const n = parseInt(document.getElementById('numServers').value);
    const m = parseInt(document.getElementById('numAttackers').value);
    const p = parseFloat(document.getElementById('penetrationProbability').value);
    updatePenetrationChart(n, m, p);
});

updatePenetrationChart(10, 5, 0.5);
