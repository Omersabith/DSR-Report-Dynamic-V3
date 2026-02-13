// CONFIGURATION
const SUPABASE_URL = 'https://iyxpvbvpampykfjffgol.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Q9IcqOv5IU9boMcm5fnG_w_je4xqV46';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function login(role) {
    const pass = document.getElementById('password').value;
    if (pass === "YOUR_CODE") {
        const db = document.getElementById('dashboard');
        document.getElementById('login-container').style.display = 'none';
        
        // STABILITY FIX: Show block first, then wait a frame before drawing charts
        db.style.display = 'block';
        setTimeout(() => { db.style.opacity = '1'; }, 50);

        if(role === 'admin') document.getElementById('admin-badge').style.display = 'inline';
        fetchAndRender();
    }
}

async function fetchAndRender() {
    try {
        const { data, error } = await supabaseClient
            .from('sales_data')
            .select('payload')
            .eq('id', 1)
            .single();

        if (error) throw error;
        const p = data.payload;

        // Populate Stats
        document.getElementById('total-rev').innerText = (p.total_revenue || 0).toLocaleString(undefined, {minimumFractionDigits: 2});
        document.getElementById('total-qty').innerText = (p.total_units || 0).toLocaleString();

        renderCharts(p);
    } catch (e) {
        console.error("Data Load Failed:", e);
    }
}

function renderCharts(p) {
    // Executive Chart (Whitelisted)
    new Chart(document.getElementById('execChart'), {
        type: 'bar',
        data: {
            labels: Object.keys(p.individual_sales || {}),
            datasets: [{
                label: 'Sales by Executive',
                data: Object.values(p.individual_sales || {}),
                backgroundColor: '#38bdf8'
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    // Channel Chart (KDR vs Others)
    new Chart(document.getElementById('channelChart'), {
        type: 'doughnut',
        data: {
            labels: Object.keys(p.channel_split || {}),
            datasets: [{
                data: Object.values(p.channel_split || {}),
                backgroundColor: ['#818cf8', '#fbbf24', '#34d399', '#f87171']
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}