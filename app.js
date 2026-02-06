'use strict';

// Declaración de utilidades y referencias
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

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
    const new_article = document.createElement('article');
    new_article.className = 'card';
    new_article.dataset.tags = 'agentes';
    new_article.innerHTML = `
        <h3 class="card-title">Nueva card: Agentes de IA</h3>
        <p class="card-text">
            Los agentes de IA pueden interactuar con su entorno
             para lograr objetivos específicos.
        </p>
        <div class="card-actions">
              <button class="btn small" type="button" data-action="like">👍 Like</button>
              <button class="btn small ghost" type="button" data-action="remove">Eliminar</button>
              <span class="badge" aria-label="likes">0</span>
        </div>
    `;
    listaArticulos2.append(new_article);
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