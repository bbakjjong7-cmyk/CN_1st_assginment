// Highest z-index for active window stack
let highestZIndex = 200;

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Start real-time top clock
    updateClock();
    setInterval(updateClock, 1000);

    // Make all windows draggable
    const windows = document.querySelectorAll('.os-window');
    windows.forEach(win => {
        makeDraggable(win);
        win.addEventListener('mousedown', () => bringToFront(win));
        win.addEventListener('touchstart', () => bringToFront(win));
    });

    // Dark / Light Theme Toggle Listener
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }

    // Auto-open Profile window on first load for great initial experience
    setTimeout(() => {
        openWindow('win-profile');
    }, 400);
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

// Bring clicked window to front stack
function bringToFront(winElement) {
    highestZIndex += 1;
    winElement.style.zIndex = highestZIndex;
}

// Open / Focus Window
function openWindow(winId) {
    const win = document.getElementById(winId);
    const dot = document.getElementById(`dot-${winId}`);
    
    if (!win) return;

    if (!win.classList.contains('active')) {
        win.classList.add('active');
    }
    
    bringToFront(win);

    if (dot) {
        dot.classList.add('active');
    }
}

// Close Window
function closeWindow(winId) {
    const win = document.getElementById(winId);
    const dot = document.getElementById(`dot-${winId}`);

    if (win) {
        win.classList.remove('active');
        win.classList.remove('maximized');
    }

    if (dot) {
        dot.classList.remove('active');
    }
}

// Minimize Window
function minimizeWindow(winId) {
    closeWindow(winId);
}

// Maximize Window
function maximizeWindow(winId) {
    const win = document.getElementById(winId);
    if (!win) return;

    win.classList.toggle('maximized');
    bringToFront(win);
}

// Make Window Draggable
function makeDraggable(win) {
    const header = win.querySelector('.window-header');
    if (!header) return;

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    // Mouse Events
    header.addEventListener('mousedown', (e) => {
        if (win.classList.contains('maximized')) return;
        isDragging = true;
        offsetX = e.clientX - win.offsetLeft;
        offsetY = e.clientY - win.offsetTop;
        bringToFront(win);
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;

        // Prevent dragging outside top bar
        if (newY < 34) newY = 34;
        
        win.style.left = `${newX}px`;
        win.style.top = `${newY}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Touch Events for Mobile
    header.addEventListener('touchstart', (e) => {
        if (win.classList.contains('maximized')) return;
        const touch = e.touches[0];
        isDragging = true;
        offsetX = touch.clientX - win.offsetLeft;
        offsetY = touch.clientY - win.offsetTop;
        bringToFront(win);
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        let newX = touch.clientX - offsetX;
        let newY = touch.clientY - offsetY;

        if (newY < 34) newY = 34;

        win.style.left = `${newX}px`;
        win.style.top = `${newY}px`;
    });

    document.addEventListener('touchend', () => {
        isDragging = false;
    });
}

// Theme Toggle Function
function toggleTheme() {
    const body = document.body;
    const themeBtn = document.getElementById('theme-toggle');
    const currentTheme = body.getAttribute('data-theme');

    if (currentTheme === 'light') {
        body.removeAttribute('data-theme');
        if (themeBtn) themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    } else {
        body.setAttribute('data-theme', 'light');
        if (themeBtn) themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
}

// Lightbox Modal Functions
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

// Add Post-It Guestbook Note
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
    
    // Random subtle rotation (-3deg to 3deg) for realistic sticky note look
    const randomRot = (Math.random() * 6 - 3).toFixed(1);
    postit.style.transform = `rotate(${randomRot}deg)`;

    postit.innerHTML = `
        <div class="postit-pin">📌</div>
        <p class="postit-text">${escapeHtml(content)}</p>
        <span class="postit-author">- ${escapeHtml(name)}</span>
    `;

    board.prepend(postit);

    // Reset Form
    nameInput.value = '';
    contentInput.value = '';
}

// Helper to escape HTML tags in guestbook to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
