import {products} from './products.js';
import {renderCatalog} from './catalog.js';
import {initCart} from './cart.js';

const catalog = document.querySelector('#catalog');
const sort = document.querySelector('#sort');
const filters = document.querySelectorAll('[data-category]');
const resultCount = document.querySelector('#results-count');
const toast = document.querySelector('#toast');
let selectedCategory = 'all';
let toastTimer;

function notify(message) {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    if (document.querySelector('#cart-dialog').open) {
        document.querySelector('#cart-feedback').textContent = message;
    }
    toast.classList.add('is-visible');
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3000);
}

function showStorageNotice() {
    const notice = document.querySelector('#storage-notice');
    notice.textContent = 'Сохранение недоступно в этом браузере. Корзина работает до перезагрузки страницы.';
    notice.hidden = false;
}

const cart = initCart(products, {notify, onStorageError: showStorageNotice});

function updateCatalog() {
    const visibleProducts = products.filter((product) => selectedCategory === 'all' || product.category === selectedCategory);
    if (sort.value === 'price-asc') visibleProducts.sort((a, b) => a.price - b.price);
    if (sort.value === 'price-desc') visibleProducts.sort((a, b) => b.price - a.price);
    renderCatalog(visibleProducts, catalog, cart.add);
    resultCount.textContent = `В коллекции: ${visibleProducts.length} из ${products.length}`;
}

filters.forEach((button) => {
    button.addEventListener('click', () => {
        selectedCategory = button.dataset.category;
        filters.forEach((filter) => {
            const active = filter === button;
            filter.classList.toggle('is-active', active);
            filter.setAttribute('aria-pressed', String(active));
        });
        updateCatalog();
    });
});

sort.addEventListener('change', updateCatalog);
updateCatalog();
