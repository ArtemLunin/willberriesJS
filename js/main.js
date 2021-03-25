const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});


//cart

const buttonCart = document.querySelector('.button-cart');
const modalCart = document.querySelector('#modal-cart');
const modalClose = document.querySelector('.modal-close');

const openModal = function() {
	modalCart.classList.add('show');
};

const closeModal = function() {
	modalCart.classList.remove('show');
};

buttonCart.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);

//  scroll smooth

// оборачиваем в function, чтобы ограничить область видимости объявеленной переменной
// либо просто в фигруные скобки {} - для новых браузеров
{
	const scrollLinks = document.querySelectorAll('a.scroll-link');
	for (const scrollLink of scrollLinks) {
		scrollLink.addEventListener('click', function (event) {
			event.preventDefault();
			const id = scrollLink.getAttribute('href');
			document.querySelector(id).scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		});
	}
}

//goods 

const more = document.querySelector('.more');
const navigationLink = document.querySelectorAll('.navigation-link');
const longGoodsList = document.querySelector('.long-goods-list');

const getGoods = async function () {
	const result = await fetch('db/db.json');
	if (!result.ok) {
		throw 'Ошибка: ' + result.status;
	}
	return result.json();
}

// создаем карточку товара
const createCard = function ({label, img, name, description, id, price}) {
	// создаем новый элемент в dom-дереве
	const card = document.createElement('div');
	// добавили css-классы
	card.className = 'col-lg-3 col-sm-6';
	card.innerHTML = `
		<div class="goods-card">
			${label ? `<span class="label">${label}</span>` : ''}
			<img src="db/${img}" alt="${name}" class="goods-image">
			<h3 class="goods-title">${name}</h3>
			<p class="goods-description">${description}</p>
			<button class="button goods-card-btn add-to-cart" data-id="${id}">
				<span class="button-price">$${price}</span>
			</button>
		</div>
	`;
	return card;
}

const renderCards = function(data) {
	longGoodsList.textContent = '';
	// перебираем массив и вызываем для каждого createCard
	const cards = data.map(createCard);
	// распарсиваем массив и все его элементы (карточки) добавляем в список
	longGoodsList.append(...cards);
	document.body.classList.add('show-goods');
};

more.addEventListener('click', function(event) {
	event.preventDefault();
	getGoods().then(renderCards);
});

//фильтрация товаров
const filterCards = function (field, value) {
	// получим товары
	getGoods()
		.then(function (data) {
			// применим фильтр к каждому товару, если он совпадает с заданным значением, добавим его в фильтрованный список
			const filteredGoods = data.filter(function (good) {
				return good[field] === value
			});
			return filteredGoods;
		})
		.then(renderCards);
};

// навесим событие ниа каждый тип товара, внутри ссылки есть его категория и название
navigationLink.forEach(function (link) {
	link.addEventListener('click', function (event) {
		event.preventDefault();
		const field = link.dataset.field;
		const value = link.textContent;
		filterCards(field, value);
	});
});