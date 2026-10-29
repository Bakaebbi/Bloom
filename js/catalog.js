import {formatPrice} from './products.js';

function createProductCard(product, onAdd) {
    const card = document.createElement('article');
    card.className = 'product-card';

    const visual = document.createElement('div');
    visual.className = 'product-visual';
    const image = document.createElement('img');
    image.src = product.image;
    image.alt = `${product.name} – ${product.description}`;
    image.width = 600;
    image.height = 660;
    image.loading = 'lazy';
    visual.append(image);

    const details = document.createElement('div');
    details.className = 'product-details';
    const heading = document.createElement('h3');
    heading.textContent = product.name;
    const description = document.createElement('p');
    description.className = 'product-description';
    description.textContent = product.description;

    const bottom = document.createElement('div');
    bottom.className = 'product-bottom';
    const price = document.createElement('span');
    price.className = 'product-price';
    price.textContent = formatPrice(product.price);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'add-button';
    button.textContent = 'В корзину';
    button.setAttribute('aria-label', `Добавить «${product.name}» в корзину`);
    const plus = document.createElement('span');
    plus.textContent = '+';
    plus.setAttribute('aria-hidden', 'true');
    button.append(plus);
    button.addEventListener('click', () => onAdd(product.id));

    bottom.append(price, button);
    details.append(heading, description);
    if (product.label) {
        const label = document.createElement('span');
        label.className = 'product-label';
        label.textContent = product.label;
        details.append(label);
    }
    details.append(bottom);
    card.append(visual, details);
    return card;
}

export function renderCatalog(products, container, onAdd) {
    const fragment = document.createDocumentFragment();
    products.forEach((product) => fragment.append(createProductCard(product, onAdd)));
    container.replaceChildren(fragment);
}
