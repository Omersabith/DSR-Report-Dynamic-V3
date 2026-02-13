const URL = 'YOUR_SUPABASE_URL';
const KEY = 'YOUR_SUPABASE_KEY';
const supabaseClient = supabase.createClient(URL, KEY);

async function handleLogin(role) {
    const code = document.getElementById('access-code').value;
    if (code === "1234") { // Replace with your code
        document.getElementById('login-container').style.display = 'none';
        const dashboard = document.getElementById('dashboard-main');
        
        // Ensure display is block so charts have width to work with
        dashboard.style.display = 'block';
        
        if (role === 'admin') document.getElementById('admin-tag').style.display = 'block';
        fetchData();
    }
}

async function fetchData() {
    const { data } = await supabaseClient
        .from('sales_data')
        .select('payload')
        .eq('id', 1)
        .single();

    if (data && data.payload) {
        const p = data.payload;
        
        // Numerical Displays
        document.getElementById('disp-revenue').innerText = `$${p.total_revenue.toLocaleString()}`;
        document.getElementById('disp-units').innerText = p.total_units.toLocaleString();

        // Whitelisted Exec Chart (Anas, Suhail, Salam, Manseer)
        new Chart(document.getElementById('execBarChart'), {
            type: 'bar',
            data: {
                labels: Object.keys(p.individual_sales),
                datasets: [{ label: 'Performance', data: Object.values(p.individual_sales), backgroundColor: '#38bdf8' }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });

        // Channel Split Chart (KDR vs Others)
        new Chart(document.getElementById('channelPieChart'), {
            type: 'doughnut',
            data: {
                labels: Object.keys(p.channel_split),
                datasets: [{ data: Object.values(p.channel_split), backgroundColor: ['#0ea5e9', '#6366f1', '#10b981'] }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }
}