document.addEventListener('DOMContentLoaded', () => {
    // Глобальные переменные
    let balance = 1000;
    const inventory = [];
    const history = [];
    const stats = {
        totalCasesOpened: 0,
        totalSpent: 0
    };

    // Ссылки на элементы DOM
    const balanceElement = document.getElementById('balance');
    const inventoryList = document.getElementById('inventory-list');
    const historySection = document.getElementById('history-section');
    const statsSection = document.getElementById('stats-section');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    // Объекты с предметами для каждого типа кейса
    const caseItems = {
        'Пистолетный': [
            { name: 'USP', price: 200, image: 'usp.png' },
            { name: 'GLOCK', price: 300, image: 'glock.png' },
            { name: 'P250', price: 250, image: 'p250.png' },
            { name: 'FIVESEVEN', price: 250, image: 'fiveseven.png' },
            { name: 'TEC9', price: 250, image: 'tec9.png' },
            { name: 'CZ75A', price: 250, image: 'cz75a.png' },
            { name: 'DEAGLE', price: 250, image: 'deagle.png' }
        ],
        'Автоматный': [
            { name: 'MP9', price: 200, image: 'mp9.png' },
            { name: 'MAC10', price: 300, image: 'mac10.png' },
            { name: 'MP7', price: 250, image: 'mp7.png' },
            { name: 'MP5', price: 250, image: 'mp5.png' },
            { name: 'UMP', price: 250, image: 'ump.png' },
            { name: 'P90', price: 250, image: 'p90.png' },
            { name: 'BIZON', price: 250, image: 'bizon.png' },
            { name: 'FAMAS', price: 250, image: 'famas.png' },
            { name: 'GALIL', price: 250, image: 'galil.png' },
            { name: 'M4A1S', price: 250, image: 'm4a1s.png' },
            { name: 'AK47', price: 250, image: 'ak47.png' },
            { name: 'M4A1', price: 250, image: 'm4a1.png' },
            { name: 'M4A1', price: 250, image: 'm4a1.png' }
        ],
        'Снайперский': [
            { name: 'AWP', price: 1000, image: 'awp.png' },
            { name: 'SSG 08', price: 400, image: 'ssg08.png' },
            { name: 'SCAR20', price: 350, image: 'scar20.png' }
        ],
        'Ножевой': [
            { name: 'Kerambit', price: 1000, image: 'kerambit.png' },
            { name: 'Butterfly', price: 1200, image: 'butterfly.png' },
        ]
    };

    // Функция для загрузки данных из localStorage
    function loadGame() {
        const savedData = JSON.parse(localStorage.getItem('gameData'));
        if (savedData) {
            balance = savedData.balance;
            inventory.push(...savedData.inventory);
            history.push(...savedData.history);
            Object.assign(stats, savedData.stats);
        }
        updateBalance(0); // Обновляем отображение баланса
        updateInventory(); // Обновляем отображение инвентаря
        updateHistoryDisplay(); // Обновляем историю
        updateStatsDisplay(); // Обновляем статистику
    }

    // Функция для сохранения данных в localStorage
    function saveGame() {
        const gameData = {
            balance,
            inventory,
            history,
            stats
        };
        localStorage.setItem('gameData', JSON.stringify(gameData));
    }

    // Функция для обновления баланса
    function updateBalance(amount) {
        balance += amount;
        balanceElement.textContent = `$${Math.floor(balance)}`; // Округляем баланс
        saveGame();
    }

    // Функция для получения случайного предмета в зависимости от типа кейса
    function getRandomItem(caseType) {
        const items = caseItems[caseType];
        const randomIndex = Math.floor(Math.random() * items.length);
        return items[randomIndex];
    }

    // Функция для обновления инвентаря
    function updateInventory() {
        inventoryList.innerHTML = '';

        if (inventory.length === 0) {
            inventoryList.innerHTML = '<p>Инвентарь пуст</p>';
            return;
        }

        inventory.forEach((item, index) => {
            // Генерация рандомной цены для продажи (±20% от исходной цены)
            const minPrice = item.price * 0.8; // Минимальная цена (80% от исходной)
            const maxPrice = item.price * 1.2; // Максимальная цена (120% от исходной)
            const randomSellPrice = Math.floor(Math.random() * (maxPrice - minPrice) + minPrice); // Округляем цену

            const itemDiv = document.createElement('div');
            itemDiv.className = 'inventory-item';
            itemDiv.innerHTML = `
                <img src="images/${item.image}" alt="${item.name}">
                <p>${item.name}</p>
                <button class="sell-button" data-index="${index}">Продать за $${randomSellPrice}</button>
            `;
            inventoryList.appendChild(itemDiv);
        });

        document.querySelectorAll('.sell-button').forEach(button => {
            button.addEventListener('click', () => {
                const index = button.getAttribute('data-index');
                sellItem(index);
            });
        });
        saveGame();
    }

    // Функция для показа toast-уведомления
    function showToast(message) {
        toastMessage.textContent = message;
        toast.style.display = 'block';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }

    // Функция для продажи предмета
    function sellItem(index) {
        const soldItem = inventory.splice(index, 1)[0];

        // Генерация рандомной цены для продажи (±20% от исходной цены)
        const minPrice = soldItem.price * 0.8; // Минимальная цена (80% от исходной)
        const maxPrice = soldItem.price * 1.2; // Максимальная цена (120% от исходной)
        const randomSellPrice = Math.floor(Math.random() * (maxPrice - minPrice) + minPrice); // Округляем цену

        updateBalance(randomSellPrice);
        addToHistory(`Продан предмет "${soldItem.name}" за $${randomSellPrice}`);
        updateInventory();
        showToast(`Вы успешно продали "${soldItem.name}" за $${randomSellPrice}!`);
    }

    // Функция для добавления записи в историю
    function addToHistory(entry) {
        const timestamp = new Date().toLocaleString();
        history.push(`${timestamp}: ${entry}`);
        updateHistoryDisplay();
        saveGame();
    }

    // Функция для обновления отображения истории
    function updateHistoryDisplay() {
        historySection.innerHTML = '<h2>История</h2>';
        history.forEach((entry, index) => {
            const [time, action] = entry.split(': ');
            const entryElement = document.createElement('div');
            entryElement.className = 'history-entry';
            entryElement.innerHTML = `
                <p>${action}</p>
                <span>${time}</span>
            `;
            historySection.appendChild(entryElement);
        });
    }

    // Функция для обновления статистики
    function updateStats(price) {
        stats.totalCasesOpened++;
        stats.totalSpent += price;
        updateStatsDisplay();
        saveGame();
    }

    // Функция для обновления отображения статистики
    function updateStatsDisplay() {
        statsSection.innerHTML = `
            <h2>Статистика</h2>
            <p>Всего открытых кейсов: ${stats.totalCasesOpened}</p>
            <p>Общая сумма потраченных денег: $${Math.floor(stats.totalSpent)}</p>
        `;
    }

    // Обработчики событий для кнопок "Открыть"
    document.querySelectorAll('.buy-button').forEach(button => {
        button.addEventListener('click', () => {
            const caseCard = button.closest('.case-card');
            const caseName = caseCard.querySelector('p').textContent;
            const price = parseFloat(button.textContent.replace('Открыть за $', ''));

            if (balance >= price) {
                updateBalance(-price);
                const randomItem = getRandomItem(caseName);
                inventory.push(randomItem);

                addToHistory(`Куплен кейс "${caseName}" за $${price}. Выпал предмет: ${randomItem.name}`);
                updateStats(price);
                updateInventory();
                showToast(`Вы успешно купили "${caseName}" за $${price} и получили "${randomItem.name}"!`);
            } else {
                showToast('Недостаточно средств для покупки!');
            }
        });
    });

    // Переключение между разделами
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = {
        'cases-section': document.querySelector('#cases-section'),
        'inventory-section': document.querySelector('#inventory-section'),
        'history-section': document.querySelector('#history-section'),
        'stats-section': document.querySelector('#stats-section')
    };

    const hideAllSections = () => {
        Object.values(sections).forEach(section => {
            section.style.display = 'none';
        });
    };

    const removeActiveClass = () => {
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
    };

    sections['cases-section'].style.display = 'block';
    document.querySelector('.nav-link[data-section="cases-section"]').classList.add('active');

    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');

            hideAllSections();
            removeActiveClass();

            sections[sectionId].style.display = 'block';
            link.classList.add('active');

            if (sectionId === 'inventory-section') {
                updateInventory();
            }
        });
    });

    // Загружаем сохраненные данные при старте
    loadGame();
});