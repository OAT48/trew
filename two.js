// ===== Configuration =====
const CONFIG = {
    startDate: new Date(2025, 11, 1), // 1 December 2025 (2568 BE)
    endDate: new Date(2026, 3, 11),   // 11 April 2026 (2569 BE)
    totalSquares: 136,
    columnsPerRow: 8,
    storageKey: 'snakeLadderActivities'
};

// ===== Thai Holidays & Special Days (2568-2569 BE) =====
const SPECIAL_DAYS = {
    '2025-12-05': { name: 'วันพ่อแห่งชาติ', type: 'holiday', icon: '👑' },
    '2025-12-10': { name: 'วันรัฐธรรมนูญ', type: 'holiday', icon: '📜' },
    '2025-12-25': { name: 'วันคริสต์มาส', type: 'special', icon: '🎄' },
    '2025-12-31': { name: 'วันสิ้นปี', type: 'holiday', icon: '🎉' },
    '2026-01-01': { name: 'วันขึ้นปีใหม่', type: 'holiday', icon: '🎊' },
    '2026-01-02': { name: 'หยุดชดเชยปีใหม่', type: 'holiday', icon: '🎊' },
    '2026-01-11': { name: 'วันเด็กแห่งชาติ', type: 'special', icon: '👶' },
    '2026-01-16': { name: 'วันครู', type: 'special', icon: '👩‍🏫' },
    '2026-02-12': { name: 'วันมาฆบูชา', type: 'holiday', icon: '🙏' },
    '2026-02-14': { name: 'วันวาเลนไทน์', type: 'special', icon: '💕' },
    '2026-02-26': { name: 'วันช้างไทย', type: 'special', icon: '🐘' },
    '2026-03-08': { name: 'วันสตรีสากล', type: 'special', icon: '👩' },
    '2026-04-06': { name: 'วันจักรี', type: 'holiday', icon: '👑' },
    '2026-04-11': { name: 'วันสิ้นสุดเทอม', type: 'special', icon: '🎓' },
    // ช่วงสอบ
    '2026-02-23': { name: 'เริ่มสอบกลางภาค', type: 'exam', icon: '📝' },
    '2026-02-24': { name: 'สอบกลางภาค', type: 'exam', icon: '📝' },
    '2026-02-25': { name: 'สอบกลางภาค', type: 'exam', icon: '📝' },
    '2026-02-27': { name: 'สิ้นสุดสอบกลางภาค', type: 'exam', icon: '📝' },
    '2026-03-30': { name: 'เริ่มสอบปลายภาค', type: 'exam', icon: '📋' },
    '2026-03-31': { name: 'สอบปลายภาค', type: 'exam', icon: '📋' },
    '2026-04-01': { name: 'สอบปลายภาค', type: 'exam', icon: '📋' },
    '2026-04-02': { name: 'สอบปลายภาค', type: 'exam', icon: '📋' },
    '2026-04-03': { name: 'สิ้นสุดสอบปลายภาค', type: 'exam', icon: '📋' }
};

// ===== Day Icons - Different icon for each day type =====
const DAY_ICONS = {
    monday: ['📚', '✏️', '📖', '🔬', '💻', '📐'],
    tuesday: ['🎨', '🔧', '🧪', '📊', '🎯', '🖥️'],
    wednesday: ['🎵', '⚽', '🏃', '🎭', '🎪', '🎠'],
    thursday: ['🔭', '🧬', '🌍', '🧮', '📏', '🗺️'],
    friday: ['🎮', '🎲', '🎳', '🎪', '🎨', '🎭'],
    saturday: ['🏖️', '🛋️', '📺', '🎬', '🎮', '🍕'],
    sunday: ['😴', '🌅', '🏠', '👨‍👩‍👧', '🍳', '📱']
};

const WEEKDAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

// ===== Thai Names =====
const THAI_DAYS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
const THAI_DAYS_SHORT = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
const THAI_MONTHS_SHORT = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
const THAI_MONTHS = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

// ===== State =====
let activities = {};
let selectedSquare = null;
let currentPosition = 1;

// ===== Utility Functions =====
function formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getDateFromSquare(squareIndex) {
    const date = new Date(CONFIG.startDate);
    date.setDate(date.getDate() + squareIndex - 1);
    return date;
}

function getSquareFromDate(date) {
    const diffTime = date - CONFIG.startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
}

function formatThaiDate(date) {
    const day = date.getDate();
    const month = THAI_MONTHS[date.getMonth()];
    const year = date.getFullYear() + 543;
    const dayName = THAI_DAYS[date.getDay()];
    return `วัน${dayName}ที่ ${day} ${month} ${year}`;
}

function formatShortThaiDate(date) {
    const day = date.getDate();
    const month = THAI_MONTHS_SHORT[date.getMonth()];
    const year = (date.getFullYear() + 543) % 100;
    return `${day} ${month} ${year}`;
}

function isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6;
}

function getSpecialDay(date) {
    const key = formatDateKey(date);
    return SPECIAL_DAYS[key] || null;
}

function getDayIcon(date, squareIndex) {
    const specialDay = getSpecialDay(date);
    if (specialDay) return specialDay.icon;

    const dayName = WEEKDAY_NAMES[date.getDay()];
    const icons = DAY_ICONS[dayName];
    return icons[squareIndex % icons.length];
}

// ===== Storage Functions =====
function loadActivities() {
    try {
        const saved = localStorage.getItem(CONFIG.storageKey);
        if (saved) {
            activities = JSON.parse(saved);
        }
    } catch (e) {
        console.error('Error loading activities:', e);
        activities = {};
    }
}

function saveActivities() {
    try {
        localStorage.setItem(CONFIG.storageKey, JSON.stringify(activities));
    } catch (e) {
        console.error('Error saving activities:', e);
    }
}

// ===== Board Rendering =====
function renderBoard() {
    const board = document.getElementById('gameBoard');
    board.innerHTML = '';

    for (let i = 1; i <= CONFIG.totalSquares; i++) {
        const date = getDateFromSquare(i);
        const dateKey = formatDateKey(date);
        const specialDay = getSpecialDay(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const squareDate = new Date(date);
        squareDate.setHours(0, 0, 0, 0);

        const isToday = formatDateKey(today) === dateKey;
        const isPassed = squareDate < today;
        const hasActivity = activities[dateKey] && activities[dateKey].trim() !== '';

        const square = document.createElement('div');
        square.className = 'board-square';
        square.dataset.square = i;
        square.dataset.date = dateKey;

        // Add type classes
        if (isToday) {
            square.classList.add('today');
            currentPosition = i;
        }
        if (isPassed) square.classList.add('passed');
        if (hasActivity) square.classList.add('has-activity');

        if (specialDay) {
            square.classList.add(specialDay.type);
        } else if (isWeekend(date)) {
            square.classList.add('weekend');
        }

        // Get icon for this day
        const icon = getDayIcon(date, i);

        // Square content
        let eventHtml = '';
        if (specialDay) {
            eventHtml = `<div class="square-event">${specialDay.name}</div>`;
        }

        square.innerHTML = `
            <span class="square-number">#${i}</span>
            <span class="square-icon">${icon}</span>
            <span class="square-date">${formatShortThaiDate(date)}</span>
            ${eventHtml}
        `;

        // Click handler
        square.addEventListener('click', () => openActivityModal(i, date, specialDay));

        board.appendChild(square);
    }

    // Scroll to today
    scrollToToday();
}

function scrollToToday() {
    const todaySquare = document.querySelector('.board-square.today');
    if (todaySquare) {
        todaySquare.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// ===== Activity Modal =====
function openActivityModal(squareNum, date, specialDay) {
    selectedSquare = { squareNum, date, specialDay };

    const modal = document.getElementById('activityModal');
    const title = document.getElementById('modalTitle');
    const dateInfo = document.getElementById('modalDateInfo');
    const eventInfo = document.getElementById('modalEventInfo');
    const input = document.getElementById('activityInput');

    title.textContent = formatThaiDate(date);
    dateInfo.textContent = `ช่องที่ ${squareNum} จาก ${CONFIG.totalSquares}`;

    if (specialDay) {
        eventInfo.innerHTML = `${specialDay.icon} ${specialDay.name}`;
    } else if (isWeekend(date)) {
        eventInfo.innerHTML = '📅 วันหยุดสุดสัปดาห์';
    } else {
        eventInfo.innerHTML = '';
    }

    // Load existing activity
    const dateKey = formatDateKey(date);
    input.value = activities[dateKey] || '';

    modal.classList.remove('hidden');
    input.focus();
}

function closeActivityModal() {
    document.getElementById('activityModal').classList.add('hidden');
    selectedSquare = null;
}

function saveActivity() {
    if (!selectedSquare) return;

    const input = document.getElementById('activityInput');
    const dateKey = formatDateKey(selectedSquare.date);

    activities[dateKey] = input.value;
    saveActivities();

    // Update square appearance
    const square = document.querySelector(`.board-square[data-square="${selectedSquare.squareNum}"]`);
    if (square) {
        if (input.value.trim()) {
            square.classList.add('has-activity');
        } else {
            square.classList.remove('has-activity');
        }
    }

    updateStats();
    showNotification('บันทึกกิจกรรมเรียบร้อย! ✅');
    closeActivityModal();
}

function clearActivity() {
    if (!selectedSquare) return;

    const input = document.getElementById('activityInput');
    const dateKey = formatDateKey(selectedSquare.date);

    input.value = '';
    delete activities[dateKey];
    saveActivities();

    // Update square appearance
    const square = document.querySelector(`.board-square[data-square="${selectedSquare.squareNum}"]`);
    if (square) {
        square.classList.remove('has-activity');
    }

    updateStats();
    showNotification('ล้างกิจกรรมแล้ว! 🗑️');
}

// ===== Warp Modal =====
function openWarpModal() {
    document.getElementById('warpModal').classList.remove('hidden');
}

function closeWarpModal() {
    document.getElementById('warpModal').classList.add('hidden');
}

function warpTo(target) {
    let squareNum;

    switch (target) {
        case 'today':
            const today = new Date();
            squareNum = getSquareFromDate(today);
            if (squareNum < 1) squareNum = 1;
            if (squareNum > CONFIG.totalSquares) squareNum = CONFIG.totalSquares;
            break;
        case 'start':
            squareNum = 1;
            break;
        case 'end':
            squareNum = CONFIG.totalSquares;
            break;
        default:
            squareNum = parseInt(target);
    }

    if (isNaN(squareNum) || squareNum < 1 || squareNum > CONFIG.totalSquares) {
        showNotification('กรุณาระบุช่องที่ถูกต้อง (1-136) ❌');
        return;
    }

    const square = document.querySelector(`.board-square[data-square="${squareNum}"]`);
    if (square) {
        square.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Highlight effect
        square.style.animation = 'none';
        square.offsetHeight; // Trigger reflow
        square.style.animation = 'highlight 1s ease';
    }

    closeWarpModal();
}

// ===== Stats Update =====
function updateStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(CONFIG.startDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(CONFIG.endDate);
    endDate.setHours(0, 0, 0, 0);

    let daysElapsed = 0;
    if (today >= startDate) {
        const diffTime = Math.min(today, endDate) - startDate;
        daysElapsed = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
        daysElapsed = Math.min(daysElapsed, CONFIG.totalSquares);
    }

    if (today < startDate) {
        daysElapsed = 0;
    }

    const daysRemaining = Math.max(0, CONFIG.totalSquares - daysElapsed);
    const activitiesCount = Object.keys(activities).filter(k => activities[k].trim()).length;
    const progress = (daysElapsed / CONFIG.totalSquares) * 100;

    document.getElementById('daysElapsed').textContent = daysElapsed;
    document.getElementById('daysRemaining').textContent = daysRemaining;
    document.getElementById('activitiesCount').textContent = activitiesCount;
    document.getElementById('progressPercent').textContent = `${Math.round(progress)}%`;
    document.getElementById('progressFill').style.width = `${progress}%`;
}

// ===== Notification =====
function showNotification(message) {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

// ===== Event Listeners =====
function setupEventListeners() {
    // Activity Modal
    document.getElementById('closeModal').addEventListener('click', closeActivityModal);
    document.getElementById('modalOverlay').addEventListener('click', closeActivityModal);
    document.getElementById('saveActivityBtn').addEventListener('click', saveActivity);
    document.getElementById('clearActivityBtn').addEventListener('click', clearActivity);

    // Warp Modal
    document.getElementById('warpBtn').addEventListener('click', openWarpModal);
    document.getElementById('closeWarpModal').addEventListener('click', closeWarpModal);
    document.getElementById('warpModalOverlay').addEventListener('click', closeWarpModal);

    document.querySelectorAll('.warp-option').forEach(btn => {
        btn.addEventListener('click', () => warpTo(btn.dataset.target));
    });

    document.getElementById('warpGoBtn').addEventListener('click', () => {
        const input = document.getElementById('warpSquareInput');
        warpTo(input.value);
    });

    // Go to today button
    document.getElementById('goTodayBtn').addEventListener('click', () => warpTo('today'));

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeActivityModal();
            closeWarpModal();
        }
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            if (selectedSquare) saveActivity();
        }
    });
}

// ===== Highlight Animation =====
const style = document.createElement('style');
style.textContent = `
    @keyframes highlight {
        0%, 100% { box-shadow: none; }
        50% { box-shadow: 0 0 20px 5px rgba(74, 222, 128, 0.6); }
    }
`;
document.head.appendChild(style);

// ===== Initialize =====
function init() {
    loadActivities();
    renderBoard();
    updateStats();
    setupEventListeners();

    console.log('🎯 Mission: ฝึกสอนวิทย์ - Calendar initialized!');
}

document.addEventListener('DOMContentLoaded', init);
