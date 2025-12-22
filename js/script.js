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

// Пример данных модов (в реальности нужно получать с сервера или из data-файлов)
const modsData = [
    { 
        id: 1, 
        title: "Броня Balenciaga белая", 
        category: "armor", 
        description: "Красивая броня со времен Дени Абсолюта", 
        image: "data/armor/preview.png", // Можно заменить на ссылку на картинку в Google Диске
        size: "4 MB", 
        downloads: 111,
        file: "https://drive.google.com/file/d/1HmP8aSrfoKEMihQ_j8OBrhl3JbpcKU-_/view" // ВСТАВЬТЕ ССЫЛКУ СЮДА
    },

    { 
        id: 2, 
        title: "Броня Balenciaga черная", 
        category: "armor", 
        description: "Красивая броня со времен Дени Абсолюта", 
        image: "data/armor/preview1.png", // Можно заменить на ссылку на картинку в Google Диске
        size: "4 MB", 
        downloads: 222,
        file: "https://drive.google.com/file/d/1iWbWTvzBACcm1OWsiR5y5I4uwyOqevuX/view" // ВСТАВЬТЕ ССЫЛКУ СЮДА
    }
];

// Инициализация страницы
document.addEventListener('DOMContentLoaded', function() {
    // Если на странице есть контейнер категорий, загружаем категории
    const categoriesContainer = document.getElementById('categories-container');
    if (categoriesContainer) {
        loadCategories();
        loadMods();
    }
    
    // Если на странице есть FAQ, настраиваем аккордеон
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        setupFAQ();
    }
    
    // Настройка поиска
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', filterMods);
    }
    
    // Настройка модального окна
    setupModal();
});

// Загрузка категорий
function loadCategories() {
    const container = document.getElementById('categories-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Кнопка "Все"
    const allCategory = document.createElement('div');
    allCategory.className = 'category-card active';
    allCategory.setAttribute('data-category', 'all');
    allCategory.innerHTML = `
        <div class="category-icon"><i class="fas fa-th-large"></i></div>
        <div class="category-name">Все</div>
    `;
    container.appendChild(allCategory);
    
    // Категории
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
    
    // Обработчики кликов на категории
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Обновляем активную категорию
            document.querySelectorAll('.category-card').forEach(c => {
                c.classList.remove('active');
            });
            this.classList.add('active');
            
            // Фильтруем моды
            filterByCategory(category);
        });
    });
}

// Загрузка модов
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
                <a href="#" class="btn-download" data-id="${mod.id}">
                    <i class="fas fa-download"></i> Скачать
                </a>
            </div>
        `;
        container.appendChild(modCard);
    });
    
    // Обработчики для кнопок скачивания
    document.querySelectorAll('.btn-download').forEach(btn => {
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
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
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
        
        // Проверяем категорию
        const categoryMatch = activeCategory === 'all' || category === activeCategory;
        
        // Проверяем поисковый запрос
        const searchMatch = title.includes(searchTerm) || searchTerm === '';
        
        if (categoryMatch && searchMatch) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Настройка FAQ
function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Закрываем все остальные
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.querySelector('.faq-answer').classList.remove('active');
                }
            });
            
            // Открываем/закрываем текущий
            const answer = item.querySelector('.faq-answer');
            answer.classList.toggle('active');
        });
    });
}

// Настройка модального окна
function setupModal() {
    const modalOverlay = document.getElementById('modal-overlay');
    const closeModalBtn = document.getElementById('close-modal');
    
    if (!modalOverlay || !closeModalBtn) return;
    
    // Закрытие модального окна
    closeModalBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
    });
    
    // Закрытие при клике на оверлей
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
        }
    });
}

// Открытие модального окна с информацией о моде
function openModModal(modId) {
    const mod = modsData.find(m => m.id === modId);
    if (!mod) return;
    
    // Находим элемент категории
    const category = categories.find(c => c.id === mod.category);
    
    // Заполняем модальное окно
    document.getElementById('modal-title').textContent = mod.title;
    document.getElementById('modal-description').textContent = mod.description;
    document.getElementById('modal-category').textContent = category ? category.name : mod.category;
    document.getElementById('modal-size').textContent = mod.size;
    document.getElementById('modal-downloads').textContent = mod.downloads.toLocaleString();
    
    // Устанавливаем изображение
    const modalImage = document.getElementById('modal-image');
    modalImage.src = mod.image;
    modalImage.alt = mod.title;
    
    // Устанавливаем ссылку для скачивания
    const downloadLink = document.getElementById('modal-download-link');
    // Важно: установка атрибута download заставит браузер скачать файл, а не открыть его
    downloadLink.href = mod.file;
    downloadLink.setAttribute('download', `${mod.title}.rar`); // Меняем .zip на .rar
    
    // Показываем модальное окно
    document.getElementById('modal-overlay').classList.add('active');
}
