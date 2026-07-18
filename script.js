let currentPage = 1;
let selectedWish = '';
const memories = [
    { title: 'princess', text: 'but somehow i keep coming back to this one.', image: 'foto-2/princes-v5.png' },
    { title: 'another one', text: 'because one photo isn t enough', image: 'foto-2/princes-v2.jpeg' },
    { title: 'this one >>>', text: 'i like this photo.', image: 'foto princes/princes.jpeg' },
    { title: 'yeaha', text: 'this one s staying.', image: 'foto-2/princes-v4.jpeg' }
];

const gallerySlides = [
    { title: 'princess', subtitle: 'you re really pretty, you know that?', emoji: '💕', image: 'foto princes/princes15.png' },
    { title: 'pretty.', subtitle: 'as always.', emoji: '🤍', image: 'foto princes/princes-1.jpeg' },
    { title: 'this one.', subtitle: 'i dont know why, i just love it.', emoji: '💍', image: 'foto princes/princes-2.jpeg' },
    { title: 'her.', subtitle: 'the reason this website exists.', emoji: '💟', image: 'foto princes/princes-4.jpeg' },
    { title: 'random but cute', subtitle: 'no explanation needed.', emoji: '🌅', image: 'foto princes/princes-3.jpeg' },
    { title: 'Rent Free', subtitle: 'Living in my head since day one.', emoji: '✈️', image: 'foto princes/princes-6.jpeg' },
    { title: 'Soft Launch', subtitle: 'My favorite person btw.', emoji: '⭐', image: 'foto princes/princes-7.jpeg' },
    { title: 'Princess Behavior', subtitle: 'As expected.', emoji: '🩰', image: 'foto princes/princes-8.jpeg' },
    { title: 'Just Her', subtitle: 'Somehow that s enough..', emoji: '🎐 ', image: 'foto princes/princes-9.jpeg' },
    { title: 'Soft Spot', subtitle: 'Every time, without fail.', emoji: '🦋', image: 'foto princes/princes-10.jpeg' },
    { title: 'Lucky Me', subtitle: 'That s all I have to say.', emoji: '🎀', image: 'foto princes/princes-11.jpeg' }
];
let galleryDragging = false;
let galleryDragStartX = 0;          
let galleryDragStartY = 0;
let galleryCurrentCard = null;
let galleryCurrentIndex = 0;

function openEnvelope() {
    nextPage(1);
}

function nextPage(page) {
    if (page === 6 && document.getElementById('giftContent').textContent.trim() === 'Pilih hadiah untuk melihat isinya.') {
        // allow go next anyway
    }
    const current = document.getElementById(`page${page}`);
    const next = document.getElementById(`page${page + 1}`);
    if (!next) return;
    current.classList.remove('active');
    next.classList.add('active');
    updateProgress(page + 1);
}

function prevPage(page) {
    const current = document.getElementById(`page${page}`);
    const prev = document.getElementById(`page${page - 1}`);
    if (!prev) return;
    current.classList.remove('active');
    prev.classList.add('active');
    updateProgress(page - 1);
}

function updateProgress(page) {
    const cake = document.querySelector('.cake');
    const glow = document.querySelector('.cake-glow');
    if (!cake || !glow) return;

    if (page === 3) {
        cake.classList.add('cake-animated');
        glow.classList.add('active');
    } else {
        cake.classList.remove('cake-animated');
        glow.classList.remove('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    showLoading();
    const row = document.getElementById('memoryRow');
    memories.forEach((memory, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.innerHTML = `<h3>${memory.title}</h3><p>${memory.text}</p>`;
        card.onclick = () => openMemory(index);
        row.appendChild(card);
    });
    initGallery();
    initCakeEffect();
    // make envelope accessible and give touch feedback
    const envelopeEl = document.querySelector('.envelope');
    if (envelopeEl) {
        envelopeEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openEnvelope();
            }
        });
        envelopeEl.addEventListener('pointerdown', () => envelopeEl.classList.add('tap'));
        envelopeEl.addEventListener('pointerup', () => setTimeout(() => envelopeEl.classList.remove('tap'), 220));
        envelopeEl.addEventListener('pointercancel', () => envelopeEl.classList.remove('tap'));
    }

    setTimeout(hideLoading, 1500);
    initMusic();
});

function initGallery() {
    galleryCurrentIndex = 0;
    renderGallery();
}

function showLoading() {
    const loading = document.getElementById('loadingScreen');
    if (loading) {
        loading.classList.remove('hide');
    }
}

function hideLoading() {
    const loading = document.getElementById('loadingScreen');
    if (loading) {
        loading.classList.add('hide');
    }
    document.body.classList.add('loaded');
}

function renderGallery() {
    const stack = document.getElementById('galleryStack');
    stack.innerHTML = '';
    const maxCardsVisible = 4;
    const order = [...gallerySlides].slice(0, maxCardsVisible).reverse();
    
    order.forEach((slide, index) => {
        const depth = order.length - 1 - index;
        const card = document.createElement('div');
        card.className = 'gallery-card';
        card.style.setProperty('--offset-x', `${depth * 8}px`);
        card.style.setProperty('--offset-y', `${depth * 8}px`);
        card.style.setProperty('--rotation', `${depth % 2 === 0 ? 2 : -2}deg`);
        card.style.setProperty('--scale', `${depth * 0.04}`);
        const imageBlock = slide.image
            ? `<div class="photo-image"><img src="${slide.image}" alt="${slide.title}"></div>`
            : `<div class="photo-badge">${slide.emoji}</div>`;
        card.innerHTML = `
            ${imageBlock}
            <h3>${slide.title}</h3>
            <p>${slide.subtitle}</p>
            <div class="gallery-tag">Geser untuk melihat foto berikutnya</div>
        `;

        if (depth === 0) {
            card.classList.add('top');
            card.addEventListener('pointerdown', onGalleryPointerDown, false);
        }

        stack.appendChild(card);
    });
    updateGalleryCaption();
}

function updateGalleryCaption() {
    const caption = document.getElementById('galleryCaption');
    const current = gallerySlides[0];
    const position = (galleryCurrentIndex % gallerySlides.length) + 1;
    caption.textContent = `Foto ${position} dari ${gallerySlides.length}: ${current.title}`;
}

function onGalleryPointerDown(event) {
    if (galleryDragging) return;
    galleryDragging = true;
    galleryDragStartX = event.clientX;
    galleryDragStartY = event.clientY;
    galleryCurrentCard = event.currentTarget;
    galleryCurrentCard.style.transition = 'none';
    galleryCurrentCard.setPointerCapture(event.pointerId);
    document.addEventListener('pointermove', onGalleryPointerMove);
    document.addEventListener('pointerup', onGalleryPointerUp);
    document.addEventListener('pointercancel', onGalleryPointerUp);
}

function onGalleryPointerMove(event) {
    if (!galleryDragging || !galleryCurrentCard) return;
    const dx = event.clientX - galleryDragStartX;
    const dy = event.clientY - galleryDragStartY;
    const rotate = dx / 18;
    galleryCurrentCard.style.transform = `translate(${dx}px, ${dy}px) rotate(${rotate}deg)`;
}

function onGalleryPointerUp(event) {
    if (!galleryDragging || !galleryCurrentCard) return;
    const dx = event.clientX - galleryDragStartX;
    const dy = event.clientY - galleryDragStartY;
    const absX = Math.abs(dx);
    const direction = dx >= 0 ? 1 : -1;

    galleryCurrentCard.releasePointerCapture?.(event.pointerId);
    document.removeEventListener('pointermove', onGalleryPointerMove);
    document.removeEventListener('pointerup', onGalleryPointerUp);
    document.removeEventListener('pointercancel', onGalleryPointerUp);

    if (absX > 110) {
        galleryCurrentCard.style.transition = 'transform 0.35s ease, opacity 0.35s ease';
        galleryCurrentCard.style.transform = `translate(${direction * 1200}px, ${dy}px) rotate(${direction * 18}deg)`;
        galleryCurrentCard.style.opacity = '0';

        setTimeout(() => {
            galleryCurrentCard.style.transition = 'none';
            galleryCurrentCard.style.opacity = '1';
            galleryCurrentCard.style.transform = 'none';
            gallerySlides.push(gallerySlides.shift());
            galleryCurrentIndex++;
            renderGallery();
            galleryDragging = false;
            galleryCurrentCard = null;
        }, 360);
    } else {
        galleryCurrentCard.style.transition = 'transform 0.25s ease';
        galleryCurrentCard.style.transform = 'none';
        galleryDragging = false;
        galleryCurrentCard = null;
    }
}

function openMemory(index) {
    const memory = memories[index];
    const overlayImage = document.getElementById('overlayImage');

    document.getElementById('overlayTitle').textContent = memory.title;
    document.getElementById('overlayText').textContent = memory.text;

    if (memory.image) {
        overlayImage.src = memory.image;
        overlayImage.alt = memory.title;
        overlayImage.style.display = 'block';
    } else {
        overlayImage.src = '';
        overlayImage.alt = '';
        overlayImage.style.display = 'none';
    }

    document.getElementById('memoryOverlay').classList.add('active');
}

function closeMemory() {
    document.getElementById('memoryOverlay').classList.remove('active');
}

function initCakeEffect() {
    const cake = document.querySelector('.cake');
    const glow = document.querySelector('.cake-glow');
    const candles = document.querySelectorAll('.candle');
    if (!cake || !glow) return;

    // Cake click animation
    cake.addEventListener('click', () => {
        cake.classList.add('cake-animated');
        glow.classList.add('active');
        cake.classList.add('cake-click');

        window.setTimeout(() => {
            cake.classList.remove('cake-click');
        }, 360);
    });

    // Candle lighting effects - one for each candle
    candles.forEach((candle, index) => {
        const flame = candle.querySelector('.flame');
        if (flame) {
            candle.style.cursor = 'pointer';
            candle.addEventListener('click', (e) => {
                e.stopPropagation();
                lightSingleCandle(flame, candle, index);
            });
        }
    });
}

let candlesLit = [false, false, false];

function initMusic() {
    const musicButton = document.getElementById('playBtn');
    const music = document.getElementById('backgroundMusic');
    if (!musicButton || !music) return;

    const updateButton = () => {
        musicButton.textContent = music.paused ? '🎵 Our Song' : '⏸️ Pause';
    };

    musicButton.addEventListener('click', () => {
        if (music.paused) {
            music.play().catch(() => {
                // Jika audio tidak bisa dimainkan otomatis, tampilkan teks instruksi
                musicButton.textContent = 'Klik lagi untuk memutar';
            }).then(() => {
                updateButton();
                musicButton.style.display = 'none';
            });
        } else {
            music.pause();
            updateButton();
        }
    });

    music.addEventListener('play', () => {
        updateButton();
        musicButton.style.display = 'none';
    });
    music.addEventListener('pause', updateButton);
    updateButton();
}

function lightSingleCandle(flame, candle, index) {
    if (candlesLit[index]) return; // Prevent multiple clicks
    candlesLit[index] = true;

    // Animate flame
    flame.style.animation = 'none';
    void flame.offsetWidth; // Trigger reflow
    flame.style.animation = 'flame-glow 0.6s ease-out forwards';
    flame.classList.add('lit');

    // Create spark particles
    for (let i = 0; i < 6; i++) {
        createSpark(candle, i);
    }

    // Light up the glow after a brief delay
    const glow = document.querySelector('.cake-glow');
    if (glow && candlesLit.every(lit => lit)) {
        setTimeout(() => {
            glow.classList.add('active');
        }, 100);
    }

    // Keep flame lit with enhanced animation
    setTimeout(() => {
        flame.style.animation = 'flame-flicker-intense 0.1s ease-in-out infinite alternate';
    }, 600);
}

function createSpark(container, index) {
    const spark = document.createElement('div');
    spark.style.position = 'absolute';
    spark.style.width = '5px';
    spark.style.height = '5px';
    spark.style.borderRadius = '50%';
    spark.style.pointerEvents = 'none';
    spark.style.left = '50%';
    spark.style.top = '0';
    spark.style.transform = 'translate(-50%, 0)';
    
    const colors = ['#fff8c9', '#ffd166', '#ff8c42', '#ff6f8f'];
    spark.style.background = colors[Math.floor(Math.random() * colors.length)];
    spark.style.boxShadow = `0 0 10px ${spark.style.background}`;
    
    const angle = (index / 6) * Math.PI * 2;
    const velocity = 1.8 + Math.random() * 1.5;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity - 1.2;

    container.appendChild(spark);

    let x = 0;
    let y = 0;
    let life = 1;
    let gravity = 0.08;

    const animateSpark = () => {
        x += vx;
        y += vy;
        vy += gravity;
        life -= 0.025;

        spark.style.transform = `translate(calc(-50% + ${x}px), ${y}px)`;
        spark.style.opacity = life;

        if (life > 0) {
            requestAnimationFrame(animateSpark);
        } else {
            spark.remove();
        }
    };

    requestAnimationFrame(animateSpark);
}

function showWish(text) {
    selectedWish = text;
    let message = '';

   if (text === 'hmm...') {
    message = 'aku pengen kamu bisa melihat dirimu secantik yang aku lihat.';
}
else if (text === 'trust me') {
    message = 'aku pengen hidup selalu baik sama kamu.';
}
else if (text === 'idk') {
    message = 'aku pengen semua mimpi kamu benar-benar tercapai.';
}
else if (text === 'maybe this one?') {
    message = 'aku pengen kamu selalu merasa dicintai.';
}
else if (text === 'last one') {
    message = 'aku pengen senyum kamu nggak pernah kehilangan alasannya.';
}

    document.getElementById('wishResult').textContent = message;
}

function toggleGift(type) {
    const content = document.getElementById('giftContent');
    let title = '';
    let message = '';
    let icon = '💌';

    if (type === 'letter') {
        title = 'Baca ini dulu. 💌';
        message = 'Hai, Princess. Sebelum kamu buka semuanya, aku cuma mau bilang makasih. Makasih karena udah jadi bagian dari banyak cerita yang bikin hari-hariku lebih seru. Website kecil ini memang nggak sempurna, tapi aku bikin semuanya dengan sepenuh hati. Semoga pas kamu buka satu per satu isinya, kamu bisa senyum sedikit... itu aja udah cukup buat aku. 🤍';
        icon = '💌';
    } else if (type === 'photo') {
        title = 'princess';
        message = 'Nggaa nyangka yaa udah sejauh ini sama kamu. Makasih ya, udah jadi bagian penting di hidupku.';
        icon = '📷';
    } else if (type === 'secret') {
        title = 'Pesan Rahasia';
        message = 'ngga semua hal bisa diomongin langsung, makanya aku tulis di sini: makasih udah bikin hidupku lebih baik.';
        icon = '🔐';
    }

    content.innerHTML = `
        <div class="letter-reveal">
            <div class="letter-card">
                <div class="letter-icon">${icon}</div>
                <strong>${title}</strong>
                <p>${message}</p>
            </div>
        </div>
    `;

    requestAnimationFrame(() => {
        const reveal = content.querySelector('.letter-reveal');
        if (reveal) {
            reveal.classList.add('active');
        }
    });
}

function openPremiumBox() {
    const finalMessage = document.getElementById('finalMessage');
    finalMessage.innerHTML = 'Not the biggest gift, but definitely made with the biggest love. 🫶';
}

function startOver() {
    for (let i = 1; i <= 7; i++) {
        document.getElementById(`page${i}`).classList.remove('active');
    }
    document.getElementById('page1').classList.add('active');
    document.getElementById('wishResult').textContent = 'Tap a wish bubble!';
    document.getElementById('giftContent').textContent = 'Pilih hadiah untuk melihat isinya.';
    document.getElementById('finalMessage').textContent = 'Ketuk kotak hadiah.';
    const btn = document.getElementById('playBtn');
    if (btn) {
        btn.style.display = 'block';
    }
}

function closePage() {
    const qrImage = document.getElementById('qrLoveImage');
    const qrPlaceholder = document.getElementById('qrLovePlaceholder');
    const closeMessage = document.querySelector('#page8 .closing-message');
    const endScreen = document.getElementById('pageEndScreen');

    if (qrImage && qrPlaceholder) {
        qrImage.src = 'foto-2/princes-v5.png';
        qrImage.alt = 'Foto love';
        qrPlaceholder.style.display = 'none';
        qrImage.style.display = 'block';
    }

    if (closeMessage) {
        closeMessage.style.display = 'none';
    }

    if (endScreen) {
        endScreen.classList.add('active');
    }
}