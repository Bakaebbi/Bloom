import {formatPrice} from './products.js';

const STORAGE_KEY = 'bloom-cart-v1';
const MAX_QUANTITY = 99;

// Храним только идентификаторы и количество. Цены всегда берём из каталога.
function readCart(knownProducts, onStorageError) {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
        if (!Array.isArray(saved)) return [];
        const valid = new Map();
        saved.forEach((item) => {
            if (!item || !knownProducts.has(item.id) || !Number.isInteger(item.quantity) || item.quantity < 1) return;
            valid.set(item.id, {id: item.id, quantity: Math.min(item.quantity, MAX_QUANTITY)});
        });
        return [...valid.values()];
    } catch (error) {
        // Повреждённый JSON не мешает пользоваться каталогом.
        if (!(error instanceof SyntaxError)) onStorageError();
        return [];
    }
}

export function initCart(products, {notify, onStorageError}) {
    const knownProducts = new Map(products.map((product) => [product.id, product]));
    let items = readCart(knownProducts, onStorageError);
    const dialog = document.querySelector('#cart-dialog');
    const list = document.querySelector('#cart-items');
    const total = document.querySelector('#cart-total');
    const counter = document.querySelector('#cart-count');
    const openButton = document.querySelector('#cart-open');
    let previousFocus = null;
    let scrollPosition = 0;

    function save() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch {
            onStorageError();
        }
    }

    function close() {
        dialog.close();
    }

    function open() {
        if (dialog.open) return;
        previousFocus = document.activeElement;
        scrollPosition = window.scrollY;
        document.body.style.top = `-${scrollPosition}px`;
        document.body.classList.add('cart-is-open');
        dialog.showModal();
    }

    function makeButton(text, label, action, id) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = text;
        button.setAttribute('aria-label', label);
        button.dataset.action = action;
        button.dataset.id = String(id);
        return button;
    }

    function createItem(item) {
        const product = knownProducts.get(item.id);
        const row = document.createElement('article');
        row.className = 'cart-item';
        const image = document.createElement('img');
        image.src = product.image;
        image.alt = '';
        image.width = 90;
        image.height = 100;
        const content = document.createElement('div');
        content.className = 'cart-item-content';
        const heading = document.createElement('h3');
        heading.textContent = product.name;
        const unitPrice = document.createElement('p');
        unitPrice.className = 'cart-unit-price';
        unitPrice.textContent = `${formatPrice(product.price)} / шт.`;
        const controls = document.createElement('div');
        controls.className = 'cart-item-controls';
        const quantity = document.createElement('div');
        quantity.className = 'quantity-control';
        const minus = makeButton('−', `Уменьшить количество «${product.name}»`, 'decrease', item.id);
        minus.disabled = item.quantity === 1;
        const count = document.createElement('span');
        count.textContent = String(item.quantity);
        count.setAttribute('aria-label', `Количество: ${item.quantity}`);
        const plus = makeButton('+', `Увеличить количество «${product.name}»`, 'increase', item.id);
        plus.disabled = item.quantity === MAX_QUANTITY;
        quantity.append(minus, count, plus);
        const subtotal = document.createElement('strong');
        subtotal.textContent = formatPrice(product.price * item.quantity);
        controls.append(quantity, subtotal);
        const remove = makeButton('Удалить', `Удалить «${product.name}» из корзины`, 'remove', item.id);
        remove.className = 'remove-button';
        content.append(heading, unitPrice, controls, remove);
        row.append(image, content);
        return row;
    }

    function render() {
        const fragment = document.createDocumentFragment();
        if (!items.length) {
            const empty = document.createElement('div');
            empty.className = 'cart-empty';
            const heading = document.createElement('h3');
            heading.textContent = 'Здесь скоро расцветёт';
            const text = document.createElement('p');
            text.textContent = 'Добавьте букет, который вам по душе.';
            empty.append(heading, text);
            fragment.append(empty);
        } else {
            items.forEach((item) => fragment.append(createItem(item)));
        }
        list.replaceChildren(fragment);
        const quantity = items.reduce((sum, item) => sum + item.quantity, 0);
        counter.textContent = String(quantity);
        openButton.setAttribute('aria-label', `Открыть корзину. Товаров: ${quantity}`);
        total.textContent = formatPrice(items.reduce((sum, item) => sum + knownProducts.get(item.id).price * item.quantity, 0));
    }

    function add(id) {
        if (!knownProducts.has(id)) return;
        const existing = items.find((item) => item.id === id);
        if (existing?.quantity === MAX_QUANTITY) {
            notify('В корзине уже 99 штук этого товара');
            return;
        }
        if (existing) existing.quantity += 1;
        else items.push({id, quantity: 1});
        save();
        render();
        notify(`«${knownProducts.get(id).name}» добавлен в корзину`);
    }

    list.addEventListener('click', (event) => {
        const button = event.target.closest('button[data-action]');
        if (!button) return;
        const id = Number(button.dataset.id);
        const item = items.find((entry) => entry.id === id);
        if (!item) return;
        const action = button.dataset.action;
        const index = items.indexOf(item);
        if (action === 'remove') items = items.filter((entry) => entry.id !== id);
        if (action === 'increase') item.quantity = Math.min(MAX_QUANTITY, item.quantity + 1);
        if (action === 'decrease') item.quantity = Math.max(1, item.quantity - 1);
        save();
        render();

        // Перерисовка не должна терять клавиатурный фокус.
        const sameControl = list.querySelector(`button[data-id="${id}"][data-action="${action}"]:not(:disabled)`);
        const alternative = list.querySelector(`button[data-id="${id}"]:not(:disabled)`);
        const nextRow = list.children[Math.min(index, list.children.length - 1)];
        const focusTarget = sameControl ?? alternative ?? nextRow?.querySelector('button:not(:disabled)') ?? document.querySelector('#cart-continue');
        focusTarget.focus();
        notify(action === 'remove' ? 'Товар удалён из корзины' : 'Количество обновлено');
    });

    openButton.addEventListener('click', open);
    document.querySelector('#cart-close').addEventListener('click', close);
    document.querySelector('#cart-continue').addEventListener('click', close);
    dialog.addEventListener('click', (event) => {
        if (event.target !== dialog) return;
        const bounds = dialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close();
    });
    dialog.addEventListener('close', () => {
        document.body.classList.remove('cart-is-open');
        document.body.style.top = '';
        window.scrollTo({top: scrollPosition, behavior: 'instant'});
        previousFocus?.focus({preventScroll: true});
    });
    window.addEventListener('storage', (event) => {
        if (event.key !== STORAGE_KEY && event.key !== null) return;
        items = readCart(knownProducts, onStorageError);
        render();
    });

    render();
    return {add};
}
