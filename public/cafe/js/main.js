// Mobile Hamburger Menu Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
}

// Reveal on Scroll
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealEls.forEach(el => revealObserver.observe(el));
}

// Render Today's Specials on Homepage
if (window.location.pathname === '/cafe/' || window.location.pathname === '/cafe/index.html') {
    const grid = document.getElementById('specialsGrid');
    if (grid) {
        fetch('/cafe-api/menu?popular=true')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data.length > 0) {
                    grid.innerHTML = data.data.map(item => `
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
                } else {
                    grid.innerHTML = '<p class="loading-text">No specials available today.</p>';
                }
            })
            .catch(() => grid.innerHTML = '<p class="loading-text">Error loading menu.</p>');
    }
}

// Reservation Form Handler
const resForm = document.getElementById('reservationForm');
if (resForm) {
    resForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const msgDiv = document.getElementById('formMessage');
        const formData = new FormData(resForm);
        const data = Object.fromEntries(formData);

        // Simple Date Validation
        const selectedDate = new Date(data.date);
        const today = new Date();
        today.setHours(0,0,0,0);
        
        if (selectedDate < today) {
            msgDiv.innerHTML = '<div class="message error">Please select a future date.</div>';
            return;
        }

        try {
            const res = await fetch('/cafe-api/reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();

            if (res.ok) {
                msgDiv.innerHTML = '<div class="message success">Reservation request sent! We will confirm shortly.</div>';
                resForm.reset();
            } else {
                msgDiv.innerHTML = `<div class="message error">${result.message}</div>`;
            }
        } catch (err) {
            msgDiv.innerHTML = '<div class="message error">Server error. Try again later.</div>';
        }
    });
}

// Contact Form Handler
const contactForm = document.getElementById('contactForm');

function addToCart(item) {
    if (typeof Cart !== 'undefined') {
        Cart.addItem(item);
    }
}

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const msgDiv = document.getElementById('formMessage');
        const data = Object.fromEntries(new FormData(contactForm));

        try {
            const res = await fetch('/cafe-api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            
            if (res.ok) {
                msgDiv.innerHTML = '<div class="message success">We will get back to you soon!</div>';
                contactForm.reset();
            } else {
                msgDiv.innerHTML = `<div class="message error">${result.message || 'Failed to send message.'}</div>`;
            }
        } catch (err) {
            msgDiv.innerHTML = '<div class="message error">Server error. Try again later.</div>';
        }
    });
}