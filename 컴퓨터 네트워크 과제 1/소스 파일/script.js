// ======================================================
// Park Jong-Eun Personal Website - Common Script
// ======================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Start Real-time Clock
    updateClock();
    setInterval(updateClock, 1000);

    // 2. Initialize Theme from localStorage
    initTheme();

});

// Real-time Clock function
function updateClock() {
    const clockElement = document.getElementById('top-clock');
    if (!clockElement) return;

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    clockElement.textContent = `${hours}:${minutes}:${seconds}`;
}

// Theme Handling
function initTheme() {
    const savedTheme = localStorage.getItem('jong-eun-theme');
    const themeBtn = document.getElementById('theme-toggle');
    if (savedTheme === 'light') {
        document.body.setAttribute('data-theme', 'light');
        if (themeBtn) themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        document.body.removeAttribute('data-theme');
        if (themeBtn) themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const body = document.body;
    const themeBtn = document.getElementById('theme-toggle');
    const currentTheme = body.getAttribute('data-theme');

    if (currentTheme === 'light') {
        body.removeAttribute('data-theme');
        localStorage.setItem('jong-eun-theme', 'dark');
        if (themeBtn) themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    } else {
        body.setAttribute('data-theme', 'light');
        localStorage.setItem('jong-eun-theme', 'light');
        if (themeBtn) themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
}

// Lightbox Modal Functions (gallery.html)
function openLightbox(imgSrc, title, desc) {
    const modal = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    const titleEl = document.getElementById('lightbox-title');
    const descEl = document.getElementById('lightbox-desc');

    if (!modal || !img) return;

    img.src = imgSrc;
    titleEl.textContent = title || '사진 보기';
    descEl.textContent = desc || '';

    modal.classList.add('active');
}

function closeLightbox() {
    const modal = document.getElementById('lightbox');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Guestbook Post-it Functions (guestbook.html)
function addPostIt(event) {
    event.preventDefault();

    const nameInput = document.getElementById('gb-name');
    const colorSelect = document.getElementById('gb-color');
    const contentInput = document.getElementById('gb-content');
    const board = document.getElementById('postit-board');

    if (!nameInput || !contentInput || !board) return;

    const name = nameInput.value.trim();
    const color = colorSelect.value;
    const content = contentInput.value.trim();

    if (!name || !content) return;

    const postit = document.createElement('div');
    postit.className = `postit ${color}`;
    
    // Subtle rotation between -3deg and 3deg
    const randomRot = (Math.random() * 6 - 3).toFixed(1);
    postit.style.transform = `rotate(${randomRot}deg)`;

    postit.innerHTML = `
        <span class="postit-topic">메모 및 방명록</span>
        <div class="postit-pin">📌</div>
        <p class="postit-text">${escapeHtml(content)}</p>
        <span class="postit-author">- ${escapeHtml(name)} (방금 전)</span>
    `;

    const emptyMessage = board.querySelector('.postit-empty');
    if (emptyMessage) emptyMessage.remove();
    board.prepend(postit);

    nameInput.value = '';
    contentInput.value = '';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Filter Travel Album in gallery.html
function filterGallery(category, btn) {
    const buttons = document.querySelectorAll('.album-folder-btn');
    buttons.forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const cards = document.querySelectorAll('.gallery-card');
    cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

