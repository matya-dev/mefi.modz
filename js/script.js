// Данные для страницы с модами
const categories = [
    { id: 'top', name: 'Верх', icon: 'fas fa-tshirt' },
    { id: 'bottom', name: 'Низ', icon: 'fas fa-vest' },
    { id: 'shoes', name: 'Обувь', icon: 'fas fa-shoe-prints' },
    { id: 'mask', name: 'Маски', icon: 'fas fa-mask' },
    { id: 'accessory', name: 'Аксессуары', icon: 'fas fa-gem' },
    { id: 'hat', name: 'Шапки', icon: 'fas fa-hat-cowboy' },
    { id: 'backpack', name: 'Рюкзаки', icon: 'fas fa-hiking' },
    { id: 'glasses', name: 'Очки', icon: 'fas fa-glasses' },
    { id: 'headphones', name: 'Наушники', icon: 'fas fa-headphones' },
    { id: 'armor', name: 'Броня', icon: 'fas fa-shield-alt' }
];

// Пример данных модов
const modsData = [
    { 
        id: 1, 
        title: "Броня Balenciaga белая", 
        category: "armor", 
        description: "Красивая броня со времен Дени Абсолюта", 
        // Замените эту ссылку на прямую ссылку вашего изображения в Google Диске (опционально)
        image: "data/preview.png",
        size: "4 MB", 
        downloads: 111,
        // ПРЯМАЯ ССЫЛКА ДЛЯ СКАЧИВАНИЯ
        file: "https://drive.google.com/uc?export=download&id=1HmP8aSrfoKEMihQ_j8OBrhl3JbpcKU-_"
    },
    { 
        id: 2, 
        title: "Броня Balenciaga черная", 
        category: "armor", 
        description: "Красивая броня со времен Дени Абсолюта", 
        image: "data/preview1.png",
        size: "4 MB", 
        downloads: 222,
        file: "https://drive.google.com/uc?export=download&id=1iWbWTvzBACcm1OWsiR5y5I4uwyOqevuX"
    }
];

// Инициализация страницы
document.addEventListener('DOMContentLoaded', function() {
    const categoriesContainer = document.getElementById('categories-container');
    if (categoriesContainer) {
        loadCategories();
        loadMods();
    }
    
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        setupFAQ();
    }
    
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', filterMods);
    }
    
    setupModal();
});

// Загрузка категорий
function loadCategories() {
    const container = document.getElementById('categories-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    const allCategory = document.createElement('div');
    allCategory.className = 'category-card active';
    allCategory.setAttribute('data-category', 'all');
    allCategory.innerHTML = `
        <div class="category-icon"><i class="fas fa-th-large"></i></div>
        <div class="category-name">Все</div>
    `;
    container.appendChild(allCategory);
    
    categories.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        categoryCard.setAttribute('data-category', category.id);
        categoryCard.innerHTML = `
            <div class="category-icon"><i class="${category.icon}"></i></div>
            <div class="category-name">${category.name}</div>
        `;
        container.appendChild(categoryCard);
    });
    
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            document.querySelectorAll('.category-card').forEach(c => {
                c.classList.remove('active');
            });
            this.classList.add('active');
            filterByCategory(category);
        });
    });
}

// Загрузка модов - ИСПРАВЛЕНО!
function loadMods() {
    const container = document.getElementById('mods-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    modsData.forEach(mod => {
        const modCard = document.createElement('div');
        modCard.className = 'mod-card';
        modCard.setAttribute('data-category', mod.category);
        modCard.innerHTML = `
            <div class="mod-image">
                <img src="${mod.image}" alt="${mod.title}" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
            </div>
            <div class="mod-info">
                <h3>${mod.title}</h3>
                <!-- Убрали data-id и изменили обработчик -->
                <a href="#" class="btn-download direct-download" data-file="${mod.file}" data-title="${mod.title}">
                    <i class="fas fa-download"></i> Скачать
                </a>
            </div>
        `;
        container.appendChild(modCard);
    });
    
    // НОВЫЙ обработчик для прямой загрузки
    document.querySelectorAll('.direct-download').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault(); // Останавливаем только переход по "#"
            const fileUrl = this.getAttribute('data-file');
            const fileName = this.getAttribute('data-title') + '.rar';
            
            // Создаем временную ссылку для скачивания
            const tempLink = document.createElement('a');
            tempLink.href = fileUrl;
            tempLink.setAttribute('download', fileName);
            tempLink.style.display = 'none';
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
            
            // Можно также открыть ссылку в новой вкладке для Google Drive
            // window.open(fileUrl, '_blank');
        });
    });
    
    // Старый обработчик для модального окна (если оно нужно)
    document.querySelectorAll('.modal-download').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const modId = parseInt(this.getAttribute('data-id'));
            openModModal(modId);
        });
    });
}

// Фильтрация по категории
function filterByCategory(category) {
    const modCards = document.querySelectorAll('.mod-card');
    modCards.forEach(card => {
        card.style.display = (category === 'all' || card.getAttribute('data-category') === category) ? 'block' : 'none';
    });
}

// Фильтрация по поиску
function filterMods() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const modCards = document.querySelectorAll('.mod-card');
    const activeCategory = document.querySelector('.category-card.active').getAttribute('data-category');
    
    modCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const category = card.getAttribute('data-category');
        
        const categoryMatch = activeCategory === 'all' || category === activeCategory;
        const searchMatch = title.includes(searchTerm) || searchTerm === '';
        
        card.style.display = (categoryMatch && searchMatch) ? 'block' : 'none';
    });
}

// Настройка FAQ
function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.querySelector('.faq-answer').classList.remove('active');
                }
            });
            item.querySelector('.faq-answer').classList.toggle('active');
        });
    });
}

// Настройка модального окна
function setupModal() {
    const modalOverlay = document.getElementById('modal-overlay');
    const closeModalBtn = document.getElementById('close-modal');
    
    if (!modalOverlay || !closeModalBtn) return;
    
    closeModalBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
    });
    
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
        }
    });
}

// Функция открытия модального окна (если она всё ещё нужна)
function openModModal(modId) {
    const mod = modsData.find(m => m.id === modId);
    if (!mod) return;
    
    const category = categories.find(c => c.id === mod.category);
    
    document.getElementById('modal-title').textContent = mod.title;
    document.getElementById('modal-description').textContent = mod.description;
    document.getElementById('modal-category').textContent = category ? category.name : mod.category;
    document.getElementById('modal-size').textContent = mod.size;
    document.getElementById('modal-downloads').textContent = mod.downloads.toLocaleString();
    
    const modalImage = document.getElementById('modal-image');
    modalImage.src = mod.image;
    modalImage.alt = mod.title;
    
    const downloadLink = document.getElementById('modal-download-link');
    downloadLink.href = mod.file;
    downloadLink.setAttribute('download', `${mod.title}.rar`);
    downloadLink.setAttribute('data-file', mod.file);
    
    document.getElementById('modal-overlay').classList.add('active');
}
