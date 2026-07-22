const API_KEY = localStorage.getItem('apiKey');

// Protect Route
if (!API_KEY) {
    window.location.href = '/cafe/admin/login.html';
}

function getHeaders() {
    return {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
    };
}

function logout() {
    localStorage.removeItem('apiKey');
    window.location.href = '/cafe/admin/login.html';
}

function showTab(tab, e) {
    document.getElementById('reservationsTab').style.display = tab === 'reservations' ? 'block' : 'none';
    document.getElementById('menuTab').style.display = tab === 'menu' ? 'block' : 'none';
    document.getElementById('ordersTab').style.display = tab === 'orders' ? 'block' : 'none';
    
    document.querySelectorAll('.admin-sidebar button').forEach(b => b.classList.remove('active'));
    if (e) e.target.classList.add('active');
}

// --- Button Event Listeners ---
document.getElementById('tabReservations').addEventListener('click', function(e) { showTab('reservations', e); });
document.getElementById('tabMenu').addEventListener('click', function(e) { showTab('menu', e); });
document.getElementById('tabOrders').addEventListener('click', function(e) { showTab('orders', e); });
document.getElementById('tabLogout').addEventListener('click', function() { logout(); });

// --- Dashboard Stats ---
async function fetchStats() {
    try {
        const res = await fetch('/cafe-api/admin/stats', { headers: getHeaders() });
        if (res.status === 401) { logout(); return; }
        const data = await res.json();
        if (data.success) {
            document.getElementById('statsOrders').textContent = data.data.totalOrders;
            document.getElementById('statsReservations').textContent = data.data.totalReservations;
            document.getElementById('statsMenuItems').textContent = data.data.totalMenuItems;
        }
    } catch (err) { console.error(err); }
}

// --- Reservations Logic ---
async function fetchReservations() {
    try {
        const res = await fetch('/cafe-api/admin/reservations', { headers: getHeaders() });
        if (res.status === 401) { logout(); return; }
        
        const data = await res.json();
        const body = document.getElementById('reservationsBody');
        
        if (data.success && data.data.length > 0) {
            const pending = data.data.filter(r => r.status === 'pending');
            const others = data.data.filter(r => r.status !== 'pending');
            const sorted = [...pending, ...others];

            body.innerHTML = sorted.map(r => `
                <tr>
                    <td>${r.name}<br><small>${r.email}</small></td>
                    <td>${r.date}</td>
                    <td>${r.time}</td>
                    <td>${r.guests}</td>
                    <td><span class="status-badge status-${r.status}">${r.status}</span></td>
                    <td>
                        ${r.status === 'pending' ? `
                            <button class="btn btn-success btn-sm" onclick="updateRes(${r.id}, 'confirmed')">Confirm</button>
                            <button class="btn btn-danger btn-sm" onclick="updateRes(${r.id}, 'cancelled')">Cancel</button>
                        ` : ''}
                    </td>
                </tr>
            `).join('');

            const tracker = document.getElementById('capacityTracker');
            const totalGuests = data.data.filter(r => r.status === 'confirmed').reduce((sum, r) => sum + r.guests, 0);
            const pct = Math.min((totalGuests / 100) * 100, 100);
            const barColor = totalGuests >= 80 ? 'var(--danger)' : totalGuests >= 50 ? 'var(--warning)' : 'var(--success)';
            tracker.innerHTML = `
                <p><strong>Today's Confirmed Guests:</strong> ${totalGuests}</p>
                <div class="capacity-bar-container">
                    <div class="capacity-bar" style="width: ${pct}%; background: ${barColor};"></div>
                </div>
                <p>${totalGuests >= 80 ? 'Fully booked!' : totalGuests >= 50 ? 'Busy day ahead.' : 'Plenty of space available.'}</p>
            `;
        } else {
            body.innerHTML = '<tr><td colspan="6">No reservations yet.</td></tr>';
            document.getElementById('capacityTracker').innerHTML = '<p>No confirmed reservations today.</p>';
        }
    } catch (err) {
        console.error(err);
    }
}

async function updateRes(id, status) {
    try {
        await fetch(`/cafe-api/admin/reservations/${id}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ status })
        });
        fetchReservations();
    } catch (err) {
        console.error(err);
    }
}

// --- Orders Logic ---
async function fetchOrders() {
    try {
        const res = await fetch('/cafe-api/admin/orders', { headers: getHeaders() });
        if (res.status === 401) { logout(); return; }
        const data = await res.json();
        const body = document.getElementById('ordersBody');

        if (data.success && data.data.length > 0) {
            const pending = data.data.filter(o => o.status === 'pending');
            const others = data.data.filter(o => o.status !== 'pending');
            const sorted = [...pending, ...others];

            body.innerHTML = sorted.map(o => `
                <tr>
                    <td><strong>${o.orderNumber}</strong></td>
                    <td>${o.customerName}<br><small>${o.customerPhone}</small></td>
                    <td>${o.items.map(i => `${i.quantity}x ${i.name}`).join('<br>')}</td>
                    <td><strong>${o.total} MAD</strong></td>
                    <td><span class="status-badge status-${o.status}">${o.status}</span></td>
                    <td>
                        <select class="form-control" style="width:auto;padding:0.4rem;font-size:0.8rem;" onchange="updateOrderStatus('${o.id}', this.value)">
                            <option value="pending" ${o.status==='pending'?'selected':''}>Pending</option>
                            <option value="confirmed" ${o.status==='confirmed'?'selected':''}>Confirmed</option>
                            <option value="preparing" ${o.status==='preparing'?'selected':''}>Preparing</option>
                            <option value="ready" ${o.status==='ready'?'selected':''}>Ready</option>
                            <option value="completed" ${o.status==='completed'?'selected':''}>Completed</option>
                            <option value="cancelled" ${o.status==='cancelled'?'selected':''}>Cancelled</option>
                        </select>
                    </td>
                </tr>
            `).join('');
        } else {
            body.innerHTML = '<tr><td colspan="6">No orders yet.</td></tr>';
        }
    } catch (err) { console.error(err); }
}

async function updateOrderStatus(id, status) {
    try {
        await fetch(`/cafe-api/admin/orders/${id}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({ status })
        });
        fetchOrders();
    } catch (err) { console.error(err); }
}

// --- Menu Logic ---
async function fetchMenuAdmin() {
    try {
        const res = await fetch('/cafe-api/menu');
        const data = await res.json();
        const body = document.getElementById('menuBody');
        
        if (data.success && data.data.length > 0) {
            body.innerHTML = data.data.map(item => `
                <tr>
                    <td>
                        ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width:50px;height:50px;border-radius:8px;object-fit:cover;margin-right:8px;">` : ''}
                        ${item.name}
                    </td>
                    <td>${item.category}</td>
                    <td>${item.price} MAD</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="deleteMenu(${item.id})">Delete</button>
                    </td>
                </tr>
            `).join('');
        } else {
            body.innerHTML = '<tr><td colspan="4">No menu items.</td></tr>';
        }
    } catch (err) {
        console.error(err);
    }
}

async function deleteMenu(id) {
    if(!confirm('Are you sure you want to delete this item?')) return;
    
    try {
        await fetch(`/cafe-api/admin/menu/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        fetchMenuAdmin();
    } catch (err) {
        console.error(err);
    }
}

// Add Menu Item Handler
document.getElementById('menuForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    
    try {
        await fetch('/cafe-api/admin/menu', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        e.target.reset();
        fetchMenuAdmin();
    } catch (err) {
        console.error(err);
    }
});

// Initial Load
fetchStats();
fetchReservations();
fetchOrders();
fetchMenuAdmin();
