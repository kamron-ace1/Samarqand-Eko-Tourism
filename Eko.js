// --- Umumiy yordamchi funksiyalar ---

// 🆕 YANGI: Skroll animatsiyasi (tepaga va pastga ishlashi uchun)
function checkVisibility() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    const windowHeight = window.innerHeight;
    
    elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        
        // Agar elementning yuqori qismi ekran balandligining 85% dan yuqori bo'lsa VA pastki qismi 0 dan yuqori bo'lsa (ya'ni skrin ichida yoki kirib kelayotgan bo'lsa)
        if (rect.top < windowHeight * 0.85 && rect.bottom > 0) {
            element.classList.add('visible');
        } else {
            // Agar element butunlay ekrandan chiqib ketsa, 'visible' ni olib tashlaymiz
            element.classList.remove('visible'); 
        }
    });
}

// --- Joylar filtrlash logikasi ---
function filterPlaces(filter) {
    const placeList = document.querySelectorAll('.place-card');
    
    // Aktiv tugmani belgilash
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === filter) {
            btn.classList.add('active');
        }
    });
    
    placeList.forEach(card => {
        const tags = card.getAttribute('data-tags');
        
        if (filter === 'all' || tags.includes(filter)) {
            // Ko'rsatish
            card.style.display = 'block'; // Animatsiyasiz tezkor ko'rsatish
            setTimeout(() => card.classList.add('visible'), 50);
        } else {
            // Yashirish
            card.classList.remove('visible');
            card.style.display = 'none'; // To'liq yashirish
        }
    });
}

// --- Modal (popup) logikasi ---
const modal = document.getElementById('place-modal');
const modalTitle = document.getElementById('modal-title');
const modalLocation = document.getElementById('modal-location');
const modalActivities = document.getElementById('modal-activities');
const modalDescription = document.getElementById('modal-description');
const modalMapIframe = document.getElementById('modal-map-iframe');

function openModal(cardElement) {
    // 1. Hozirgi tilni aniqlash
    const currentLangElement = document.querySelector('.lang-option.active');
    const currentLang = currentLangElement ? currentLangElement.getAttribute('data-lang') : 'uz';
    
    // 2. Matnlarni hozirgi tilga moslab olish
    modalTitle.textContent = cardElement.getAttribute(`data-${currentLang}-title`); // data-uz-title dan olamiz
    modalLocation.textContent = cardElement.getAttribute(`data-modal-location-${currentLang}`);
    modalActivities.textContent = cardElement.getAttribute(`data-modal-activities-${currentLang}`);
    modalDescription.textContent = cardElement.getAttribute(`data-modal-description-${currentLang}`);
    
    // 3. Har bir joylashuv uchun xarita URL'sini shakllantirish
    const lat = cardElement.getAttribute('data-lat');
    const lng = cardElement.getAttribute('data-lng');
    
    // Xarita joylashuvi URL'sini to'g'ri tuzish
    if (lat && lng) {
        // Eslatma: Google Maps URL'si to'g'ri ishlashi uchun `http://googleusercontent.com/maps.google.com/embed` prefixini saqlab qoldim.
        const mapSrc = `https://maps.google.com/maps?q=${lat},${lng}&hl=${currentLang}&z=13&output=embed`;
        modalMapIframe.src = mapSrc;
    } else {
        modalMapIframe.src = '';
    }
    
    // 4. Modalni ko'rsatish
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; 
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; 
    modalMapIframe.src = 'about:blank'; // Xaritani tozalash
}

// Modalni orqa fonni bosish orqali yopish
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}

// Buyurtma tugmasi va izoh (comment) funksiyasi
function bookTripAndNotify() {
    // Foydalanuvchi so'roviga binoan har doim izoh beriladi
    showNotification("Buyurtmangiz qabul qilindi!");
}

// Xabarnomani ko'rsatish funksiyasi (o'zgarishsiz)
function showNotification(message) {
    const container = document.getElementById('notification-container');
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    
    if (container) {
        container.appendChild(toast);
    
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                container.removeChild(toast);
            }, 500); 
        }, 6000); 
    }
}

/* 🌐 TIL ALMASHTIRISH MATNLARI UCHUN TARJIMA OB'YEKTI */
const translations = {
    'uz': {
        'location-title': "Joylashuvi:",
        'activities-title': "Faoliyatlar:",
        'all': "Barchasi",
        'tog': "Tog'lar",
        'daryo': "Daryo/Tabiat",
        'madaniy': "Madaniy/Ziyorat",
        'qishloq': "Agroturizm",
    },
    'ru': {
        'location-title': "Расположение:",
        'activities-title': "Активности:",
        'all': "Все",
        'tog': "Горы",
        'daryo': "Река/Природа",
        'madaniy': "Культура/Зиярат",
        'qishloq': "Агротуризм",
    },
    'en': {
        'location-title': "Location:",
        'activities-title': "Activities:",
        'all': "All",
        'tog': "Mountains",
        'daryo': "River/Nature",
        'madaniy': "Cultural/Pilgrimage",
        'qishloq': "Agrotourism",
    }
};

/* DROPDOWN LOGIKASI FUNKSIYALARI */

function setupLanguageSwitcher() {
    const dropdownBtn = document.getElementById('current-lang-display');
    const dropdownMenu = document.getElementById('lang-menu');
    const langOptions = document.querySelectorAll('.lang-option');
    
    if (!dropdownBtn || !dropdownMenu) return; 
    
    // Dropdownni ochish/yopish
    dropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });
    
    // Tilni tanlash va o'zgartirish
    langOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            const newLang = option.getAttribute('data-lang');
            setLanguage(newLang);
            
            dropdownMenu.style.display = 'none';
        });
    });
    
    // Menyu tashqarisini bosilganda yopish
    document.addEventListener('click', (e) => {
        if (dropdownMenu && !dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.style.display = 'none';
        }
    });
    
    // ⭐️ QO'SHIMCHA: Tugmaga globus ikonkasini o'rnatish
    dropdownBtn.innerHTML = '<i class="fas fa-globe"></i>'; 
}

function updateLangDisplay(lang) {
    const langOptions = document.querySelectorAll('.lang-option');
    // const currentLangDisplay = document.getElementById('current-lang-display'); // Bu endi Globus ikonkasi, matn kerak emas

    langOptions.forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-lang') === lang) {
            option.classList.add('active');
        }
    });
    
    // ⭐️ O'ZGARTIRILDI: Globus tugmasidagi matnni yangilash mantig'i olib tashlandi.
}


// --- TILNI ALMASHTIRISHNING ASOSIY FUNKSIYASI ---
function setLanguage(lang) {
    // 1. Dropdown tugmasini yangilash 
    updateLangDisplay(lang); 
    
    // 2. HTML ichidagi matnlarni yangilash
    
    // a) H1, Subtitle, Tugmalar (data-uz atributiga ega) va boshqalar
    document.querySelectorAll(`[data-${lang}]`).forEach(element => {
        const attributeValue = element.getAttribute(`data-${lang}`);
        
        // Elementning ichidagi matnni to'g'ridan-to'g'ri o'zgartirish (agar u ikonka bo'lmasa)
        if (element.children.length === 0 || element.tagName.toLowerCase() === 'a' || element.tagName.toLowerCase() === 'button') {
            element.textContent = attributeValue;
        }
    });
    
    // b) Hero H1 va Subtitle
    const heroH1 = document.querySelector('.hero-banner h1');
    const heroSubtitle = document.querySelector('.hero-banner .subtitle'); 

    if (heroH1) {
        const heroBanner = document.querySelector('.hero-banner');
        heroH1.textContent = heroBanner.getAttribute(`data-${lang}-h1`) || '';
    }
    if (heroSubtitle) {
        heroSubtitle.textContent = heroSubtitle.getAttribute(`data-${lang}`) || '';
    }
    
    // c) Xususiyat/Xizmatlar kartochkalari (H3)
    document.querySelectorAll('.feature-card h3, .service-card h3').forEach(element => {
        const iconElement = element.querySelector('.icon, .service-icon');
        const iconHtml = iconElement ? iconElement.outerHTML : '';
        const text = element.getAttribute(`data-${lang}-h3`);
        if (text) {
             element.innerHTML = iconHtml + ' ' + text;
        }
    });
    
    // d) Joy kartochkalari (Place Cards)
    document.querySelectorAll('.place-card').forEach(card => {
        const titleElement = card.querySelector('.place-title');
        const descElement = card.querySelector('.card-description-placeholder'); 
        
        // Sarlavhani o'rnatish
        if (titleElement) {
            titleElement.textContent = card.getAttribute(`data-${lang}-title`) || '';
        }
        
        // Qisqa ta'rifni o'rnatish
        const fullDesc = card.getAttribute(`data-modal-description-${lang}`); 
        const MAX_LENGTH = 140; 
        
        let summary = fullDesc || '';
        if (fullDesc && fullDesc.length > MAX_LENGTH) {
            summary = fullDesc.substring(0, MAX_LENGTH).trim();
            const lastSpace = summary.lastIndexOf(' ');
            if (lastSpace !== -1) {
                summary = summary.substring(0, lastSpace);
            }
            summary += '...';
        }
        
        if (descElement) {
             descElement.innerHTML = summary;
        }
    });
    
    // e) Modal ichidagi doimiy sarlavhalar (Joylashuvi:, Faoliyatlar:)
    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        if (translations[lang] && translations[lang][key]) {
             // Matnni yangilash uchun eng yaxshi usul
             const strongElement = element.querySelector('strong');
             if (strongElement) {
                const icon = strongElement.querySelector('i');
                const iconHtml = icon ? icon.outerHTML : '';
                strongElement.innerHTML = iconHtml + ' ' + translations[lang][key]; // Matnni ikonka yoniga qo'yish
             } else {
                 element.textContent = translations[lang][key];
             }
        }
    });
    
    // f) Filtr tugmalari
    document.querySelectorAll('.filter-btn').forEach(button => {
        const filterType = button.getAttribute('data-filter');
        if (translations[lang] && translations[lang][filterType]) {
            const iconHtml = button.querySelector('i').outerHTML;
            button.innerHTML = iconHtml + ' ' + translations[lang][filterType];
        }
    });
}


// --- DOMContentLoaded da barcha listenerlarni o'rnatish ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Skroll animatsiyalari
    window.addEventListener('scroll', checkVisibility);
    checkVisibility(); 
    
    // 2. Dropdownni sozlash
    setupLanguageSwitcher();
    
    // 3. Sayt yuklanganda avtomatik ravishda O'zbek tilini o'rnatish
    setLanguage('uz'); 
    
    // 4. Filtr tugmalariga listener qo'shish
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            filterPlaces(filter);
        });
    });

    // ⭐️ QO'SHIMCHA: Kartochkalarni bosish funksiyasini ulash
    document.querySelectorAll('.place-card').forEach(card => {
        card.addEventListener('click', () => {
            openModal(card);
        });
    });
});

// Modalni orqa fonni bosish orqali yopish (yuqorida takrorlangan, shuni ishlatamiz)
// window.onclick = function(event) { ... }