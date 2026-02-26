document.addEventListener('DOMContentLoaded', () => {
    // 1. DYNAMIC DATE & DAY
    const updateDate = () => {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('current-date').innerText = now.toLocaleDateString(undefined, options);
    };
    updateDate();

    // 2. BUBBLE ENGINE
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

    // 3. PAGE NAVIGATION
    window.showPage = (pageId, btn) => {
        document.querySelectorAll('.page-section').forEach(p => p.classList.add('hidden'));
        document.getElementById(pageId).classList.remove('hidden');
       
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        btn.classList.add('active');
    };

    // 4. CHARTS
    const tempCtx = document.getElementById('tempChart').getContext('2d');
    const tempChart = new Chart(tempCtx, {
        type: 'line',
        data: {
            labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
            datasets: [{
                label: 'SST (°C)',
                data: [27.5, 27.2, 28.1, 29.4, 28.8, 28.2],
                borderColor: '#008080',
                fill: true,
                backgroundColor: 'rgba(0, 128, 128, 0.1)',
                tension: 0.4
            }]
        },
        options: { maintainAspectRatio: false }
    });

    const yieldCtx = document.getElementById('yieldChart').getContext('2d');
    new Chart(yieldCtx, {
        type: 'bar',
        data: {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [{ data: [1.2, 2.5, 3.8, 4.2], backgroundColor: '#0e2f44', borderRadius: 5 }]
        },
        options: { plugins: { legend: { display: false } }, maintainAspectRatio: false }
    });

    const pieCtx = document.getElementById('speciesPie').getContext('2d');
    new Chart(pieCtx, {
        type: 'doughnut',
        data: {
            labels: ['Tuna', 'Sardine', 'Mackerel', 'Others'],
            datasets: [{ data: [40, 25, 20, 15], backgroundColor: ['#008080', '#0e2f44', '#10b981', '#a5f3eb'] }]
        },
        options: { maintainAspectRatio: false }
    });

    // 5. LIVE API INTEGRATION
    const fetchMarineData = async () => {
        try {
            const res = await fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=13.08&longitude=80.27&hourly=sea_surface_temperature,wave_height`);
            const data = await res.json();
           
            const curTemp = data.hourly.sea_surface_temperature[0];
            const curWave = data.hourly.wave_height[0];

            document.getElementById('sea-temp').innerText = `${curTemp}°C`;
            document.getElementById('risk-desc').innerText = `Current wave height: ${curWave}m`;
           
            // Risk Level Logic
            if(curWave > 1.2) {
                document.getElementById('risk-val').innerText = "MID";
                document.getElementById('risk-fill').style.width = "60%";
                document.getElementById('risk-val').style.color = "orange";
            } else {
                document.getElementById('risk-val').innerText = "LOW";
                document.getElementById('risk-fill').style.width = "25%";
            }
        } catch (e) {
            console.warn("API Offline - Using Simulation Data");
            document.getElementById('sea-temp').innerText = "28.1°C";
        }
    };
    fetchMarineData();

    // 6. POLICY TABLE POPULATION
    const policies = [
        { id: "BP-01", name: "Mangrove Shield", desc: "Regenerating 500 hectares of mangrove forests to act as natural storm surge barriers.", impact: "9.5/10" },
        { id: "BP-02", name: "No-Trawl Zone", desc: "Restricting heavy machinery fishing in coral hotspots to allow seabed recovery.", impact: "8.7/10" },
        { id: "BP-03", name: "Ghost Net Removal", desc: "AI-driven drone fleets identifying and retrieving abandoned fishing nets.", impact: "7.2/10" }
    ];

    const pBody = document.getElementById('policy-table');
    policies.forEach(p => {
        pBody.innerHTML += `<tr>
            <td><strong>${p.id}</strong></td>
            <td>${p.name}</td>
            <td style="color: #64748b; font-size: 0.9rem;">${p.desc}</td>
            <td style="color: #008080; font-weight: bold;">${p.impact}</td>
        </tr>`;
    });
});