document.addEventListener('DOMContentLoaded', () => {

    // ===== DATE =====
    const updateDate = () => {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('current-date').innerText =
            now.toLocaleDateString(undefined, options);
    };
    updateDate();

    // ===== BUBBLES =====
    const createBubbles = () => {
        const container = document.getElementById('bubble-container');
        for (let i = 0; i < 20; i++) {
            const b = document.createElement('div');
            b.classList.add('bubble');

            const size = Math.random() * 40 + 10;
            b.style.width = `${size}px`;
            b.style.height = `${size}px`;
            b.style.left = `${Math.random() * 100}%`;
            b.style.animationDuration = `${Math.random() * 5 + 8}s`;
            b.style.animationDelay = `${Math.random() * 5}s`;

            container.appendChild(b);
        }
    };
    createBubbles();

    // ===== TOGGLES =====
    const themeBtn = document.getElementById('dark-mode-toggle');
    const gridBtn = document.getElementById('grid-toggle');

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        themeBtn.innerText =
            document.body.classList.contains('dark-mode') ? "LIGHT" : "DARK";
    });

    gridBtn.addEventListener('click', () => {
        document.querySelector('.dashboard-grid').classList.toggle('no-grid');
        gridBtn.innerText = gridBtn.innerText === "ON" ? "OFF" : "ON";
    });

    // ===== NAV =====
    window.showPage = (pageId, btn) => {
        document.querySelectorAll('.page-section').forEach(p =>
            p.classList.add('hidden')
        );
        document.getElementById(pageId).classList.remove('hidden');

        document.querySelectorAll('.nav-item').forEach(n =>
            n.classList.remove('active')
        );
        btn.classList.add('active');
    };

    // ===== CHARTS =====
    let tempChart, yieldChart;

    const initCharts = () => {

        // 🌡 FULL DAY TEMP CHART
        tempChart = new Chart(document.getElementById('tempChart'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    borderColor: '#008080',
                    backgroundColor: 'rgba(0,128,128,0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });

        // 💰 QUARTERLY YIELD
        yieldChart = new Chart(document.getElementById('yieldChart'), {
            type: 'bar',
            data: {
                labels: ['Q1', 'Q2', 'Q3', 'Q4'],
datasets: [{
    data: [0, 0, 0, 0],
    backgroundColor: getComputedStyle(document.documentElement)
        .getPropertyValue('--accent')
}]
            },
            options: {
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });

        // 🐟 PIE
        new Chart(document.getElementById('speciesPie'), {
            type: 'doughnut',
            data: {
                labels: ['Tuna', 'Sardine', 'Others'],
                datasets: [{
                    data: [45, 30, 25],
                    backgroundColor: ['#008080', '#0e2f44', '#a5f3eb']
                }]
            },
            options: { maintainAspectRatio: false }
        });
    };

    initCharts();

    // ===== DATA =====
    const fetchMarineData = async () => {
        try {
            const res = await fetch(
                `https://marine-api.open-meteo.com/v1/marine?latitude=13.08&longitude=80.27&hourly=sea_surface_temperature,wave_height&timezone=auto`
            );

            const data = await res.json();

            const temps = data.hourly.sea_surface_temperature;
            const waves = data.hourly.wave_height;
            const times = data.hourly.time;

            const now = new Date();

            // ===== CORRECT CURRENT INDEX =====
            let closestIndex = 0;
            let minDiff = Infinity;

            times.forEach((t, i) => {
                const diff = Math.abs(new Date(t).getTime() - now.getTime());
                if (diff < minDiff) {
                    minDiff = diff;
                    closestIndex = i;
                }
            });

            let currentTemp = parseFloat(temps[closestIndex]);
            let currentWave = parseFloat(waves[closestIndex]);

            // ===== DISPLAY =====
            document.getElementById('sea-temp').innerText =
                `${currentTemp.toFixed(1)}°C`;

            document.getElementById('risk-desc').innerText =
                `Current waves: ${currentWave.toFixed(2)}m`;

            const path = document.getElementById('gauge-path');
            const percent = Math.min((currentWave / 2) * 100, 100);
            path.style.strokeDasharray = `${percent}, 100`;

            document.getElementById('risk-val').innerText =
                currentWave < 1 ? "LOW"
                    : (currentWave < 1.6 ? "MID" : "HIGH");

            // ===== FULL DAY GRAPH =====
            const labels = times.slice(0, 24).map(t =>
                new Date(t).toLocaleTimeString([], { hour: '2-digit' })
            );

            const todayTemps = temps.slice(0, 24).map(t =>
                parseFloat(t).toFixed(1)
            );

            tempChart.data.labels = labels;
            tempChart.data.datasets[0].data = todayTemps;
            tempChart.update();

            // ===== ECONOMIC YIELD =====
            const fishingEffort = 1000 + Math.random() * 300;

            const yieldVal =
                fishingEffort *
                (currentTemp / 30) *
                (1 - currentWave / 3);

            const displayYield = (yieldVal / 100).toFixed(2);

            document.querySelector('.yield-val').innerText =
                `Rs. ${displayYield} Cr`;

            const base = parseFloat(displayYield);

            yieldChart.data.datasets[0].data = [
                (base * 0.8).toFixed(2),
                (base * 1.0).toFixed(2),
                (base * 1.2).toFixed(2),
                (base * 1.1).toFixed(2)
            ];

            yieldChart.update();

        } catch (e) {
            console.error("Fetch error:", e);
        }
    };

    fetchMarineData();
    setInterval(fetchMarineData, 10000);

    // ===== POLICIES =====
    const policies = [
    {
        id: "BP-01",
        name: "Mangrove Shield",
        desc: "Restoration and protection of mangrove forests to act as natural barriers against coastal erosion, storm surges, and rising sea levels. These ecosystems also support biodiversity and improve water quality.",
        authority: "Press Information Bureau (Government of India)",
        link: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2117223&reg=3&lang=2",
        impact: "9.5/10"
    },
    {
        id: "BP-02",
        name: "No-Trawl Zone",
        desc: "Strict prohibition of bottom trawling in ecologically sensitive coral reef and marine biodiversity zones to prevent habitat destruction, protect marine life, and ensure sustainable fishing practices.",
        authority: "Press Information Bureau (Government of India)",
        link: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2150101&reg=3&lang=1",
        impact: "8.7/10"
    },
    {
        id: "BP-03",
        name: "Ghost Net Removal",
        desc: "Deployment of advanced monitoring systems and cleanup operations to detect and remove abandoned fishing gear, preventing marine life entanglement and reducing ocean pollution.",
        authority: "Global Ghost Gear Initiative",
        link: "https://www.ghostgear.org/",
        impact: "7.2/10"
    },
    {
        id: "BP-04",
        name: "Marine Protected Areas",
        desc: "Designation of protected ocean regions where human activity is restricted or regulated to conserve marine ecosystems, enhance biodiversity, and promote long-term ecological sustainability.",
        authority: "International Union for Conservation of Nature (IUCN)",
        link: "https://portals.iucn.org/library/efiles/documents/pag-003.pdf",
        impact: "9.0/10"
    }
];

    const pBody = document.getElementById('policy-table');

    policies.forEach(p => {
        pBody.innerHTML += `
            <tr>
                <td><strong>${p.id}</strong></td>
                <td>${p.name}</td>
                <td>${p.desc}</td>
                <td>${p.authority}</td>
                <td>
                    <a href="${p.link}" target="_blank" class="policy-link">
                        View Policy ↗
                    </a>
                </td>
                <td style="color:#008080; font-weight:bold">${p.impact}</td>
            </tr>
        `;
    });

});