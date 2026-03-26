document.addEventListener('DOMContentLoaded', () => {
    const updateDate = () => {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('current-date').innerText = now.toLocaleDateString(undefined, options);
    };
    updateDate();

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

    const themeBtn = document.getElementById('dark-mode-toggle');
    const gridBtn = document.getElementById('grid-toggle');

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        themeBtn.innerText = document.body.classList.contains('dark-mode') ? "LIGHT" : "DARK";
    });

    gridBtn.addEventListener('click', () => {
        document.querySelector('.dashboard-grid').classList.toggle('no-grid');
        gridBtn.innerText = gridBtn.innerText === "ON" ? "OFF" : "ON";
    });

    window.showPage = (pageId, btn) => {
        document.querySelectorAll('.page-section').forEach(p => p.classList.add('hidden'));
        document.getElementById(pageId).classList.remove('hidden');
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        btn.classList.add('active');
    };

    const initCharts = () => {
        new Chart(document.getElementById('tempChart'), {
            type: 'line',
            data: {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                datasets: [{ label: 'SST', data: [28.1, 27.8, 28.5, 29.2, 28.9, 28.3], borderColor: '#008080', tension: 0.4, fill: true, backgroundColor: 'rgba(0,128,128,0.1)' }]
            },
            options: { maintainAspectRatio: false, plugins: { legend: { display: false } } }
        });

        new Chart(document.getElementById('yieldChart'), {
            type: 'bar',
            data: { labels: ['Q1', 'Q2', 'Q3', 'Q4'], datasets: [{ data: [1.8, 2.5, 3.2, 4.2], backgroundColor: '#0e2f44' }] },
            options: { maintainAspectRatio: false, plugins: { legend: { display: false } } }
        });

        new Chart(document.getElementById('speciesPie'), {
            type: 'doughnut',
            data: { labels: ['Tuna', 'Sardine', 'Others'], datasets: [{ data: [45, 30, 25], backgroundColor: ['#008080', '#0e2f44', '#a5f3eb'] }] },
            options: { maintainAspectRatio: false }
        });
    };
    initCharts();

    const fetchMarineData = async () => {
        try {
            const res = await fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=13.08&longitude=80.27&hourly=sea_surface_temperature,wave_height`);
            const data = await res.json();
            const temp = data.hourly.sea_surface_temperature[0];
            const wave = data.hourly.wave_height[0];

            document.getElementById('sea-temp').innerText = `${temp}°C`;
            document.getElementById('risk-desc').innerText = `Current waves: ${wave}m`;
           
            const path = document.getElementById('gauge-path');
            const percent = Math.min((wave / 2) * 100, 100);
            path.style.strokeDasharray = `${percent}, 100`;
            document.getElementById('risk-val').innerText = wave < 1 ? "LOW" : (wave < 1.6 ? "MID" : "HIGH");
        } catch (e) {
            document.getElementById('sea-temp').innerText = "29.2°C";
            document.getElementById('risk-val').innerText = "LOW";
        }
    };
    fetchMarineData();

    const policies = [
        { id: "BP-01", name: "Mangrove Shield", desc: "Regenerating storm surge barriers.", impact: "9.5/10" },
        { id: "BP-02", name: "No-Trawl Zone", desc: "Restricting fishing in coral hotspots.", impact: "8.7/10" },
        { id: "BP-03", name: "Ghost Net Removal", desc: "AI-driven drone fleets identifying and retrieving abandoned fishing nets.", impact: "7.2/10" }
    ];

    const pBody = document.getElementById('policy-table');
    policies.forEach(p => {
        pBody.innerHTML += `<tr><td><strong>${p.id}</strong></td><td>${p.name}</td><td>${p.desc}</td><td style="color:#008080; font-weight:bold">${p.impact}</td></tr>`;
    });
});