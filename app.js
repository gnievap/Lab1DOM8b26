'use strict';

// Declaración de utilidades y referencias
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const buildcard = ({title, text, tags}) => {
    const article = document.createElement('article');
    article.className = 'card';
    article.dataset.tags = tags;
    article.innerHTML = `
        <h3 class="card-title"></h3>
        <p class="card-text"></p>
        <div class="card-actions">
              <button class="btn small" type="button" data-action="like">👍 Like</button>
              <button class="btn small ghost" type="button" data-action="remove">Eliminar</button>
              <span class="badge" aria-label="likes">0</span>
        </div>
    `;
    article.querySelector('.card-title').textContent = title;
    article.querySelector('.card-text').textContent = text;
    return article;
};


const estadoUI = $('#estadoUI');
const setEstado = (msg) => { estadoUI.textContent = msg; };
setEstado('Listo');

// Referencias a elementos del DOM
const btnCambiarMensaje = $('#btnCambiarMensaje');
const titulo = $('#tituloPrincipal');
const subtitulo = $('#subtitulo');

// Manejador de eventos
btnCambiarMensaje.addEventListener('click', () => {
    const alt = titulo.dataset.alt === '1';

    titulo.textContent = alt
        ? '¡Bienvenido a la Aplicación!'
        : '¡Hola, mundo!';

    subtitulo.textContent = alt
        ? 'Explora las funcionalidades disponibles.'
        : 'Hoy veremos cómo manipular el DOM.';

    titulo.dataset.alt = alt  ? '0' : '1';
    setEstado('Textos actualizados');
});

const listaArticulos = $('#listaArticulos');
listaArticulos.addEventListener('mouseover', (event) => {
    const card = event.target.closest('.card');
    if (!card) return;
    card.classList.add('is-highlight');
    
 });
 listaArticulos.addEventListener('mouseout', (event) => {
    const card = event.target.closest('.card');
    if (!card) return;
    card.classList.remove('is-highlight');
 });

 // Agregar elementos al DOM
 const btnAgregarCard = $('#btnAgregarCard');
 const listaArticulos2 = $('#listaArticulos');

btnAgregarCard.addEventListener('click', () => {
    const article = buildcard({
        title: 'Nuevo Artículo',
        text: 'Este es un nuevo artículo agregado al DOM.',
        tags: 'nuevo artículo'
    });

    listaArticulos2.append(article);
    setEstado('Nueva card agregada');
});

// Eliminar elementos agregados al DOM
const btnEliminarCard = $('#btnLimpiar');
btnEliminarCard.addEventListener('click', () => {
    const cards = $$('#listaArticulos .card');
    let removed = 0;
    cards.forEach(card => { 
        if ( card.dataset.seed == 'true' ) return;
        card.remove();
        removed++;
    });
    setEstado('Artículos eliminados: ' + removed);
});

// Manejador para los botones like
// const likeButtons = document.querySelectorAll('#listaArticulos button[data-action="like"]');
// likeButtons.forEach(btn => {
//     btn.addEventListener('click', () => { 
//         const card = btn.closest('.card');
//         hacerLike(card);
//     });
// });

// Delegación de eventos para los botones like
const listaArticulos3 = $('#listaArticulos');
listaArticulos3.addEventListener('click', (e) => {
    // ¿Se hizo click en un botón ?
    const btn = e.target.closest('button[data-action]');
    if (!btn) return; // No es un botón de like, ignorar
    const card = btn.closest('.card');
    if (!card) return; // No se encontró la card, ignorar
    const action = btn.dataset.action;
    if (action === 'like')  doLike(card);
    if (action === 'remove') doRemove(card);
 });

const doLike = (card) => {
    const badge = card.querySelector('.badge');
    const currentLikes = Number(badge.textContent) || 0;
    badge.textContent = currentLikes + 1;
    setEstado('Like + 1');
};

const doRemove = (card) => {
    const badge = card.querySelector('.badge');
    const currentLikes = Number(badge.textContent) || 0;
    currentLikes > 0 
        ? badge.textContent = currentLikes - 1 
        : badge.textContent = 0;
    setEstado('Se eliminó un like de un artículo');
};


// Evento input: filtrar mientras se escribe en la caja de texto
const filtro = $('#filtro');

const matchText = (card, q) => {
    const title = card.querySelector('.card-title')?.textContent ?? '';
    const text = card.querySelector('.card-text')?.textContent ?? '';
    const haystack = (title + ' ' + text).toLowerCase();
    return haystack.includes(q);
}


filtro.addEventListener('input', ()=>{
    // q: lo que el usuario escribe en el input
    // const q = filtro.value.trim().toLowerCase();
    // const cards = $$('#listaArticulos .card');

    // cards.forEach((card) => {
    //     const ok = q === '' ? true : matchText(card, q);
    //     card.hidden = !ok;
    // });

    // setEstado( q === '' ? 'Filtro vacío' : `Filtro texto: "${q}"`);

    filterState.q = filtro.value.trim().toLowerCase();
    applyFilters();
});

const chips = $('#chips');
chips.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;

    const tag = (chip.dataset.tag || '').toLowerCase();
    filterState.tag = (filterState.tag === tag) 
      ? '' 
      : tag; 
    applyFilters();

    // const cards = $$('#listaArticulos .card');
    // cards.forEach((card) => {
    //     // const tags = (card.dataset.tags || '').toLowerCase();
    //     // card.hidden = !tags.includes(tag);

    //     const ok = q === '' ? true : matchTag(card, q);
    //     card.hidden = !ok;
    // });
    // setEstado(`Filtro por etiqueta: "${tag}"`);
});

const filterState = {
      q: '',
    tag: '',
};

const matchTag = (card, tag) => { 
    if (!tag) return true;
    const tags = (card.dataset.tags || '').toLowerCase();
    return tags.includes(tag.toLowerCase());
};

const applyFilters = () => {
    const cards = $$('#listaArticulos .card');
    cards.forEach((card) => {
        const okText = filterState.q 
            ? matchText(card, filterState.q) 
            : true;
        const okTag = matchTag(card, filterState.tag);
        card.hidden = !(okText && okTag);
    });

    const parts = [];
    if (filterState.q) parts.push(`texto: "${filterState.q}"`);
    if (filterState.tag) parts.push(`tag: "${filterState.tag}"`);
    setEstado(parts.length > 0 
        ? `Filtros :  ${parts.join(' + ')}` 
        : 'Filtros: ninguno');
};