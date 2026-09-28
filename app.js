const DEFAULT_LISTINGS = [
    {
        id: "tac-101",
        name: "Used Wooden Pallets (Sturdy)",
        category: "Construction",
        type: "Sell",
        quantity: "15 pcs",
        price: "₱150 / pc",
        barangay: "Marasbaras",
        description: "Clean industrial wooden pallets in good condition. Ideal for DIY furniture, gardening beds, or warehouse storage.",
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80",
        sellerName: "Engr. Renato Santos",
        sellerEmail: "renato@tacloban.gov.ph",
        sellerContact: "0918-555-0192",
        date: "2026-03-24"
    },
    {
        id: "tac-103",
        name: "Corrugated GI Roofing Sheets",
        category: "Construction",
        type: "Sell",
        quantity: "10 sheets",
        price: "₱200 / sheet",
        barangay: "Downtown",
        description: "Salvaged G.I. sheets, minor rust but structurally solid. Good for roofing sheds or fences.",
        image: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=600&q=80",
        sellerName: "Carlos Tacloban",
        sellerEmail: "carlos@tacloban.gov.ph",
        sellerContact: "0920-111-2233",
        date: "2026-03-22"
    },
    {
        id: "tac-105",
        name: "Glass Jars & Bottles (Assorted)",
        category: "Glass",
        type: "Free",
        quantity: "40 pcs",
        price: "Free / Donation",
        barangay: "Sagkahan",
        description: "Assorted food jars with lids. Cleaned and ready for pickling, condiments, or candle making.",
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
        sellerName: "Elena Cruz",
        sellerEmail: "elena@tacloban.gov.ph",
        sellerContact: "0915-999-0011",
        date: "2026-03-19"
    },
    {
        id: "tac-106",
        name: "Cotton Textile Scrap Bundles",
        category: "Textiles",
        type: "Trade",
        quantity: "5 sacks",
        price: "Trade for Potting Plants",
        barangay: "V&G Subdivision",
        description: "Clean garment factory remnants suitable for rag-making, stuffing, or art craft workshops.",
        image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80",
        sellerName: "LGU Eco-Coop",
        sellerEmail: "ecocoop@tacloban.gov.ph",
        sellerContact: "0916-222-7788",
        date: "2026-03-18"
    }
];

let currentUser = null;
let listings = [];

window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('tacloban_theme') || 'theme-eco';
    changeTheme(savedTheme, false);

    const savedListings = localStorage.getItem('tacloban_listings');
    if (savedListings) {
        try {
            listings = JSON.parse(savedListings);
        } catch(e) {
            listings = DEFAULT_LISTINGS;
        }
    } else {
        listings = DEFAULT_LISTINGS;
        localStorage.setItem('tacloban_listings', JSON.stringify(listings));
    }

    const savedUser = localStorage.getItem('tacloban_user');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
        } catch(e) {
            currentUser = null;
        }
    } else {
        currentUser = {
            name: "Juan Dela Cruz",
            email: "juan@tacloban.gov.ph",
            barangay: "Barangay San Jose",
            contact: "0917-123-4567"
        };
        localStorage.setItem('tacloban_user', JSON.stringify(currentUser));
    }

    updateAuthNav();
    renderMarketplace();
});

function changeTheme(themeName, save = true) {
    const body = document.getElementById('app-body');
    body.className = `h-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans flex flex-col antialiased ${themeName}`;
    
    if (themeName === 'theme-dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    const selector = document.getElementById('theme-selector');
    if (selector) selector.value = themeName;

    if (save) {
        localStorage.setItem('tacloban_theme', themeName);
        showToast(`Switched to ${themeName.replace('theme-', '').toUpperCase()} theme`);
    }
}

function switchView(viewName) {
    document.getElementById('view-marketplace').classList.add('hidden');
    document.getElementById('view-my-listings').classList.add('hidden');
    document.getElementById('view-guidelines').classList.add('hidden');

    document.getElementById('nav-marketplace').classList.remove('border-white', 'text-white');
    document.getElementById('nav-listings').classList.remove('border-white', 'text-white');
    document.getElementById('nav-guidelines').classList.remove('border-white', 'text-white');

    if (viewName === 'marketplace') {
        document.getElementById('view-marketplace').classList.remove('hidden');
        document.getElementById('nav-marketplace').classList.add('border-white', 'text-white');
        renderMarketplace();
    } else if (viewName === 'my-listings') {
        document.getElementById('view-my-listings').classList.remove('hidden');
        document.getElementById('nav-listings').classList.add('border-white', 'text-white');
        renderMyListings();
    } else if (viewName === 'guidelines') {
        document.getElementById('view-guidelines').classList.remove('hidden');
        document.getElementById('nav-guidelines').classList.add('border-white', 'text-white');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

function updateAuthNav() {
    const container = document.getElementById('auth-nav-container');
    if (currentUser) {
        container.innerHTML = `
            <div class="flex items-center space-x-2 bg-black/20 px-3 py-1.5 rounded-lg border border-white/20 text-xs text-white">
                <i class="fa-solid fa-user-circle text-base"></i>
                <div class="hidden sm:block text-left">
                    <p class="font-bold leading-none">${currentUser.name}</p>
                    <p class="text-[10px] opacity-80 mt-0.5">${currentUser.barangay}</p>
                </div>
                <button onclick="handleLogout()" class="ml-2 hover:opacity-75 p-1" title="Sign Out"><i class="fa-solid fa-right-from-bracket"></i></button>
            </div>
        `;
    } else {
        container.innerHTML = `
            <button onclick="openAuthModal()" class="bg-white text-gray-900 font-semibold px-4 py-2 rounded-lg text-xs hover:bg-gray-100 transition shadow">
                <i class="fa-solid fa-user mr-1"></i> Sign In
            </button>
        `;
    }
}

function openAuthModal() {
    document.getElementById('auth-modal').classList.remove('hidden');
}

function closeAuthModal() {
    document.getElementById('auth-modal').classList.add('hidden');
}

function switchAuthTab(tab) {
    const loginForm = document.getElementById('form-login');
    const signupForm = document.getElementById('form-signup');
    const tabLogin = document.getElementById('tab-login');
    const tabSignup = document.getElementById('tab-signup');
    const title = document.getElementById('auth-modal-title');

    if (tab === 'login') {
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
        tabLogin.className = "flex-1 pb-2 font-semibold text-[var(--accent-color)] border-b-2 border-[var(--accent-color)] text-sm";
        tabSignup.className = "flex-1 pb-2 font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm";
        title.innerText = "LGU Tacloban Portal Login";
    } else {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
        tabSignup.className = "flex-1 pb-2 font-semibold text-[var(--accent-color)] border-b-2 border-[var(--accent-color)] text-sm";
        tabLogin.className = "flex-1 pb-2 font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm";
        title.innerText = "Resident Registration";
    }
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    currentUser = {
        name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        email: email,
        barangay: "Downtown",
        contact: "0917-000-0000"
    };
    localStorage.setItem('tacloban_user', JSON.stringify(currentUser));
    closeAuthModal();
    updateAuthNav();
    showToast("Successfully signed in!");
    renderMarketplace();
}

function handleSignup(e) {
    e.preventDefault();
    currentUser = {
        name: document.getElementById('signup-name').value,
        email: document.getElementById('signup-email').value,
        barangay: document.getElementById('signup-barangay').value,
        contact: document.getElementById('signup-contact').value
    };
    localStorage.setItem('tacloban_user', JSON.stringify(currentUser));
    closeAuthModal();
    updateAuthNav();
    showToast("Account registered successfully!");
    renderMarketplace();
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('tacloban_user');
    updateAuthNav();
    showToast("Signed out successfully");
    renderMarketplace();
}

function renderMarketplace() {
    const search = document.getElementById('filter-search').value.toLowerCase();
    const category = document.getElementById('filter-category').value;
    const type = document.getElementById('filter-type').value;
    const barangay = document.getElementById('filter-barangay').value;

    const filtered = listings.filter(item => {
        const matchSearch = item.name.toLowerCase().includes(search) || item.description.toLowerCase().includes(search) || item.barangay.toLowerCase().includes(search);
        const matchCategory = !category || item.category === category;
        const matchType = !type || item.type === type;
        const matchBarangay = !barangay || item.barangay === barangay;
        return matchSearch && matchCategory && matchType && matchBarangay;
    });

    const grid = document.getElementById('marketplace-grid');
    const empty = document.getElementById('marketplace-empty');
    const heading = document.getElementById('listings-count-heading');

    heading.innerText = `Available Materials (${filtered.length})`;

    if (filtered.length === 0) {
        grid.innerHTML = '';
        empty.classList.remove('hidden');
        return;
    }
    empty.classList.add('hidden');

    grid.innerHTML = filtered.map(item => `
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition flex flex-col justify-between group">
            <div>
                <div class="relative h-48 bg-gray-100 dark:bg-gray-900 overflow-hidden cursor-pointer" onclick="openDetailModal('${item.id}')">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1532996122724-e3c3fa4a0d5d?auto=format&fit=crop&w=600&q=80'" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
                    <div class="absolute top-3 left-3 flex flex-col gap-1">
                        <span class="bg-[var(--primary-bg)] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow">${item.category}</span>
                        <span class="${item.type === 'Sell' ? 'bg-blue-600' : item.type === 'Trade' ? 'bg-amber-600' : 'bg-purple-600'} text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow">${item.type === 'Sell' ? 'For Sale' : item.type === 'Trade' ? 'Open for Trade' : 'Free / Donation'}</span>
                    </div>
                </div>
                <div class="p-4 space-y-2">
                    <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span class="flex items-center space-x-1 text-[var(--accent-color)] font-medium">
                            <i class="fa-solid fa-location-dot"></i>
                            <span>Brgy. ${item.barangay}</span>
                        </span>
                        <span>${item.date}</span>
                    </div>
                    <h4 class="font-bold text-gray-900 dark:text-white line-clamp-1 cursor-pointer hover:opacity-75" onclick="openDetailModal('${item.id}')">${item.name}</h4>
                    <p class="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">${item.description}</p>
                </div>
            </div>
            <div class="p-4 pt-0 border-t border-gray-100 dark:border-gray-700 mt-2 flex items-center justify-between">
                <div>
                    <span class="text-[10px] text-gray-400 block uppercase font-semibold">Value / Terms</span>
                    <span class="text-sm font-bold text-[var(--accent-color)]">${item.price}</span>
                </div>
                <button onclick="openDetailModal('${item.id}')" class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:opacity-85 px-3 py-1.5 rounded-lg text-xs font-semibold transition">
                    View & Inquire
                </button>
            </div>
        </div>
    `).join('');
}

function applyFilters() {
    renderMarketplace();
}

function renderMyListings() {
    const grid = document.getElementById('my-listings-grid');
    const empty = document.getElementById('my-listings-empty');

    const userListings = currentUser ? listings.filter(item => item.sellerEmail === currentUser.email) : listings;

    if (userListings.length === 0) {
        grid.innerHTML = '';
        empty.classList.remove('hidden');
        return;
    }
    empty.classList.add('hidden');

    grid.innerHTML = userListings.map(item => `
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col justify-between">
            <div>
                <div class="relative h-40 bg-gray-100 dark:bg-gray-900">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1532996122724-e3c3fa4a0d5d?auto=format&fit=crop&w=600&q=80'" class="w-full h-full object-cover">
                    <span class="absolute top-3 left-3 bg-[var(--primary-bg)] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">${item.category}</span>
                </div>
                <div class="p-4 space-y-1">
                    <div class="text-xs text-[var(--accent-color)] font-medium">Brgy. ${item.barangay}</div>
                    <h4 class="font-bold text-gray-900 dark:text-white">${item.name}</h4>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Qty: ${item.quantity} • ${item.price}</p>
                </div>
            </div>
            <div class="p-4 pt-0 border-t border-gray-100 dark:border-gray-700 mt-2 flex items-center justify-between">
                <button onclick="openEditListingModal('${item.id}')" class="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"><i class="fa-solid fa-pen-to-square mr-1"></i> Edit</button>
                <button onclick="deleteListing('${item.id}')" class="text-xs text-red-600 dark:text-red-400 hover:underline font-medium"><i class="fa-solid fa-trash mr-1"></i> Delete</button>
            </div>
        </div>
    `).join('');
}

function openCreateListingModal() {
    if (!currentUser) {
        showToast("Please sign in to post reusable materials.");
        openAuthModal();
        return;
    }
    document.getElementById('listing-modal-title').innerText = "Post Reusable Material";
    document.getElementById('form-listing').reset();
    document.getElementById('listing-id').value = "";
    document.getElementById('list-image-url').value = "https://images.unsplash.com/photo-1532996122724-e3c3fa4a0d5d?auto=format&fit=crop&w=600&q=80";
    document.getElementById('image-preview-container').classList.add('hidden');
    document.getElementById('listing-modal').classList.remove('hidden');
    togglePriceField();
}

function openEditListingModal(id) {
    const item = listings.find(l => l.id === id);
    if (!item) return;
    document.getElementById('listing-modal-title').innerText = "Edit Material Listing";
    document.getElementById('listing-id').value = item.id;
    document.getElementById('list-name').value = item.name;
    document.getElementById('list-category').value = item.category;
    document.getElementById('list-type').value = item.type;
    document.getElementById('list-quantity').value = item.quantity;
    document.getElementById('list-price').value = item.price;
    document.getElementById('list-barangay').value = item.barangay;
    document.getElementById('list-description').value = item.description;
    document.getElementById('list-image-url').value = item.image;

    const preview = document.getElementById('image-preview');
    preview.src = item.image;
    document.getElementById('image-preview-container').classList.remove('hidden');

    document.getElementById('listing-modal').classList.remove('hidden');
    togglePriceField();
}

function closeListingModal() {
    document.getElementById('listing-modal').classList.add('hidden');
}

function togglePriceField() {
    const type = document.getElementById('list-type').value;
    const container = document.getElementById('price-container');
    const label = document.getElementById('price-label');
    const input = document.getElementById('list-price');

    if (type === 'Free') {
        container.style.display = 'none';
        input.value = 'Free / Donation';
    } else {
        container.style.display = 'block';
        if (type === 'Trade') {
            label.innerText = 'Trade Preference *';
            input.placeholder = 'e.g., Trade for gardening tools';
        } else {
            label.innerText = 'Price (PHP) *';
            input.placeholder = 'e.g., ₱300';
        }
    }
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const base64 = event.target.result;
            document.getElementById('list-image-url').value = base64;
            const preview = document.getElementById('image-preview');
            preview.src = base64;
            document.getElementById('image-preview-container').classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
}

function handleSaveListing(e) {
    e.preventDefault();
    const id = document.getElementById('listing-id').value;
    const name = document.getElementById('list-name').value;
    const category = document.getElementById('list-category').value;
    const type = document.getElementById('list-type').value;
    const quantity = document.getElementById('list-quantity').value;
    const price = document.getElementById('list-price').value;
    const barangay = document.getElementById('list-barangay').value;
    const description = document.getElementById('list-description').value;
    const image = document.getElementById('list-image-url').value || 'https://images.unsplash.com/photo-1532996122724-e3c3fa4a0d5d?auto=format&fit=crop&w=600&q=80';

    if (id) {
        const index = listings.findIndex(l => l.id === id);
        if (index !== -1) {
            listings[index] = {
                ...listings[index],
                name, category, type, quantity, price, barangay, description, image
            };
        }
        showToast("Listing updated successfully!");
    } else {
        const newListing = {
            id: "tac-" + Date.now(),
            name, category, type, quantity, price, barangay, description, image,
            sellerName: currentUser ? currentUser.name : "Tacloban Resident",
            sellerEmail: currentUser ? currentUser.email : "resident@tacloban.gov.ph",
            sellerContact: currentUser ? currentUser.contact : "0917-000-0000",
            date: new Date().toISOString().split('T')[0]
        };
        listings.unshift(newListing);
        showToast("Material listed successfully!");
    }

    localStorage.setItem('tacloban_listings', JSON.stringify(listings));
    closeListingModal();
    renderMarketplace();
    renderMyListings();
}

function deleteListing(id) {
    if (confirm("Are you sure you want to remove this listing?")) {
        listings = listings.filter(l => l.id !== id);
        localStorage.setItem('tacloban_listings', JSON.stringify(listings));
        renderMarketplace();
        renderMyListings();
        showToast("Listing removed");
    }
}

function openDetailModal(id) {
    const item = listings.find(l => l.id === id);
    if (!item) return;

    const container = document.getElementById('detail-modal-content');
    container.innerHTML = `
        <div class="flex justify-between items-start">
            <div>
                <div class="flex items-center space-x-2 mb-1">
                    <span class="bg-[var(--primary-bg)] text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">${item.category}</span>
                    <span class="${item.type === 'Sell' ? 'bg-blue-600' : item.type === 'Trade' ? 'bg-amber-600' : 'bg-purple-600'} text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">${item.type === 'Sell' ? 'For Sale' : item.type === 'Trade' ? 'Open for Trade' : 'Free / Donation'}</span>
                </div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">${item.name}</h2>
            </div>
            <button onclick="closeDetailModal()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl p-2"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="rounded-xl overflow-hidden h-64 bg-gray-100 dark:bg-gray-900 border dark:border-gray-700">
            <img src="${item.image}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1532996122724-e3c3fa4a0d5d?auto=format&fit=crop&w=600&q=80'" class="w-full h-full object-cover">
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 text-sm">
            <div>
                <span class="text-xs text-gray-500 block">Quantity</span>
                <span class="font-semibold text-gray-800 dark:text-gray-200">${item.quantity}</span>
            </div>
            <div>
                <span class="text-xs text-gray-500 block">Price / Terms</span>
                <span class="font-bold text-[var(--accent-color)]">${item.price}</span>
            </div>
            <div>
                <span class="text-xs text-gray-500 block">Location</span>
                <span class="font-semibold text-gray-800 dark:text-gray-200">Brgy. ${item.barangay}</span>
            </div>
        </div>

        <div>
            <h4 class="text-xs font-bold uppercase text-gray-500 tracking-wider mb-1">Description & Condition</h4>
            <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">${item.description}</p>
        </div>

        <div class="bg-[var(--banner-bg)] text-[var(--banner-text)] border p-4 rounded-xl flex items-center justify-between">
            <div>
                <span class="text-xs uppercase font-bold block opacity-85">Seller / LGU Coordinator</span>
                <h4 class="font-bold">${item.sellerName}</h4>
                <p class="text-xs mt-0.5"><i class="fa-solid fa-phone mr-1"></i> ${item.sellerContact} • <i class="fa-solid fa-envelope mr-1"></i> ${item.sellerEmail}</p>
            </div>
            <button onclick="openInquiryModalFromDetail('${item.id}', '${item.name.replace(/'/g, "\\'")}')" class="bg-[var(--primary-bg)] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:opacity-95 shadow transition flex items-center space-x-2">
                <i class="fa-solid fa-paper-plane"></i>
                <span>Inquire / Request</span>
            </button>
        </div>
    `;

    document.getElementById('detail-modal').classList.remove('hidden');
}

function closeDetailModal() {
    document.getElementById('detail-modal').classList.add('hidden');
}

function openInquiryModalFromDetail(id, name) {
    closeDetailModal();
    document.getElementById('inquiry-listing-id').value = id;
    document.getElementById('inquiry-item-title').innerText = name;
    if (currentUser) {
        document.getElementById('inquiry-name').value = currentUser.name;
        document.getElementById('inquiry-contact').value = currentUser.contact;
    }
    document.getElementById('inquiry-modal').classList.remove('hidden');
}

function closeInquiryModal() {
    document.getElementById('inquiry-modal').classList.add('hidden');
}

function submitInquiry(e) {
    e.preventDefault();
    closeInquiryModal();
    showToast("Inquiry/Request sent successfully! The seller will contact you offline.");
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const msg = document.getElementById('toast-message');
    msg.innerText = message;
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3500);
}
