// Cart Management using localStorage
const Cart = {
    KEY: 'cafeNomadCart',

    getItems() {
        try {
            return JSON.parse(localStorage.getItem(this.KEY)) || [];
        } catch { return []; }
    },

    save(items) {
        localStorage.setItem(this.KEY, JSON.stringify(items));
        this.updateBadge();
    },

    addItem(menuItem) {
        const items = this.getItems();
        const existing = items.find(i => i.id === menuItem.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            items.push({ id: menuItem.id, name: menuItem.name, price: menuItem.price, image: menuItem.image || '', quantity: 1 });
        }
        this.save(items);
        this.showToast(`${menuItem.name} added to cart`);
    },

    removeItem(id) {
        const items = this.getItems().filter(i => i.id !== id);
        this.save(items);
    },

    updateQuantity(id, qty) {
        const items = this.getItems();
        const item = items.find(i => i.id === id);
        if (item) {
            item.quantity = Math.max(1, qty);
        }
        this.save(items);
    },

    getTotal() {
        return this.getItems().reduce((sum, i) => sum + i.price * i.quantity, 0);
    },

    getTax() {
        return Math.round(this.getTotal() * 0.10 * 100) / 100;
    },

    getGrandTotal() {
        return Math.round((this.getTotal() + this.getTax()) * 100) / 100;
    },

    getCount() {
        return this.getItems().reduce((sum, i) => sum + i.quantity, 0);
    },

    clear() {
        localStorage.removeItem(this.KEY);
        this.updateBadge();
    },

    updateBadge() {
        const badge = document.getElementById('cartBadge');
        if (badge) {
            const count = this.getCount();
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    },

    showToast(msg) {
        let toast = document.getElementById('cartToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'cartToast';
            toast.className = 'cart-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    }
};

// Initialize badge on every page
document.addEventListener('DOMContentLoaded', () => Cart.updateBadge());
