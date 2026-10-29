export const products = [
    {
        id: 1,
        name: 'Тихое утро',
        price: 3900,
        category: 'bouquets',
        description: 'Розы, эустома и эвкалипт',
        image: './assets/images/bouquet-1.svg',
        label: 'Выбор BLOOM'
    },
    {
        id: 2,
        name: 'Розовый шёпот',
        price: 4500,
        category: 'mono',
        description: 'Пионовидные розы · 15 стеблей',
        image: './assets/images/bouquet-2.svg',
        label: ''
    },
    {
        id: 3,
        name: 'Летнее письмо',
        price: 3200,
        category: 'bouquets',
        description: 'Ромашки, розы и полевая зелень',
        image: './assets/images/bouquet-3.svg',
        label: ''
    },
    {
        id: 4,
        name: 'Облако нежности',
        price: 5200,
        category: 'compositions',
        description: 'Нежная композиция в вазе',
        image: './assets/images/bouquet-4.svg',
        label: 'Особенный повод'
    },
    {
        id: 5,
        name: 'Просто любовь',
        price: 2900,
        category: 'mono',
        description: 'Розовые тюльпаны · 15 стеблей',
        image: './assets/images/bouquet-5.svg',
        label: ''
    },
    {
        id: 6,
        name: 'Солнечный день',
        price: 3600,
        category: 'bouquets',
        description: 'Персиковые розы и белая эустома',
        image: './assets/images/bouquet-6.svg',
        label: ''
    },
    {
        id: 7,
        name: 'Белая поэзия',
        price: 4200,
        category: 'mono',
        description: 'Белые розы · 15 стеблей',
        image: './assets/images/bouquet-7.svg',
        label: ''
    },
    {
        id: 8,
        name: 'Сад внутри',
        price: 5900,
        category: 'compositions',
        description: 'Цветочный сад в керамической чаше',
        image: './assets/images/bouquet-8.svg',
        label: 'Выбор BLOOM'
    },
    {
        id: 9,
        name: 'Лавандовый сон',
        price: 3800,
        category: 'bouquets',
        description: 'Сиреневая эустома и эвкалипт',
        image: './assets/images/bouquet-9.svg',
        label: ''
    },
];

const priceFormatter = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
});

export function formatPrice(price) {
    return priceFormatter.format(price);
}
