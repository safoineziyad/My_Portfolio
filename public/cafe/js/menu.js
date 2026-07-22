// Menu Page - Fetch & Filter
(function () {
    const grid = document.getElementById('menuGrid');
    const filtersContainer = document.getElementById('filters');
    if (!grid || !filtersContainer) return;

    let allItems = [];

    fetch('/cafe-api/menu')
        .then(res => res.json())
        .then(data => {
            if (data.success && data.data.length > 0) {
                allItems = data.data;
                renderMenu(allItems);
            } else {
                grid.innerHTML = '<p class="loading-text">No menu items available.</p>';
            }
        })
        .catch(() => {
            grid.innerHTML = '<p class="loading-text">Error loading menu.</p>';
        });

    function renderMenu(items) {
        if (items.length === 0) {
            grid.innerHTML = '<p class="loading-text">No items in this category.</p>';
            return;
        }
        grid.innerHTML = items.map(item => `
            <div class="menu-card">
                ${item.image ? `<img src="${item.image}" alt="${item.name}" class="menu-card-img">` : ''}
                <div class="menu-card-body">
                    <span class="menu-cat">${item.category}</span>
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <div class="menu-card-footer">
                        <div class="menu-price">${item.price} MAD</div>
                        <button class="btn btn-sm" onclick='addToCart(${JSON.stringify({id:item.id,name:item.name,price:item.price,image:item.image||""})})'>Add to Cart</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    filtersContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;

        filtersContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const cat = btn.getAttribute('data-cat');
        if (cat === 'All') {
            renderMenu(allItems);
        } else {
            renderMenu(allItems.filter(item => item.category === cat));
        }
    });
})();
