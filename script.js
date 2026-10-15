const root = document.documentElement;

// ===== Харанхуй / гэрэл горим =====
const themeBtn = document.getElementById('themeToggle');
themeBtn.setAttribute('aria-pressed', root.dataset.theme === 'dark');

themeBtn.addEventListener('click', () => {
  const dark = root.dataset.theme !== 'dark';
  root.dataset.theme = dark ? 'dark' : 'light';
  localStorage.setItem('theme', root.dataset.theme);
  themeBtn.setAttribute('aria-pressed', dark);

  // Төхөөрөмжийн харагдац нээлттэй бол тэнд ч адил горимыг тавина
  try { frame.contentDocument.documentElement.dataset.theme = root.dataset.theme; } catch (err) {}
});

// ===== Гар утасны цэс =====
const menuBtn = document.getElementById('menuToggle');
const menu = document.getElementById('menu');

menuBtn.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});

menu.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    menu.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
});

// ===== Төхөөрөмжийн хувилбар руу шилжих (ikon tovch) =====
const view = document.getElementById('deviceView');
const device = document.getElementById('dvDevice');
const frame = document.getElementById('dvFrame');
const buttons = [...document.querySelectorAll('.vs-btn')];

const SIZE = { phone: [375, 720], tablet: [768, 1024] };
const PAD = 28;                      // хүрээ + padding: iframe-ийн хэмжээ яг 375 / 768 болно
let current = 'desktop';

// Дэлгэцэнд багтаахаар жижигрүүлнэ
function fit() {
  if (current === 'desktop') return;
  const [w, h] = SIZE[current];
  const s = Math.min(1, (innerWidth - 40) / (w + PAD), (innerHeight - 110) / (h + PAD));
  device.style.setProperty('--s', s);
}

function setView(name) {
  current = name;
  buttons.forEach((b) => b.setAttribute('aria-pressed', b.dataset.view === name));

  if (name === 'desktop') {
    view.hidden = true;
    document.body.classList.remove('lock');
    frame.src = 'about:blank';
    return;
  }

  const [w, h] = SIZE[name];
  device.style.width = (w + PAD) + 'px';
  device.style.height = (h + PAD) + 'px';
  device.classList.toggle('is-tablet', name === 'tablet');

  if (view.hidden) {
    view.hidden = false;
    document.body.classList.add('lock');
    const url = new URL(location.href);
    url.hash = '';
    url.search = '?embed=1';
    frame.src = url.href;            // одоогийн хуудсыг iframe-д ачаална
  }
  fit();
}

buttons.forEach((b) => b.addEventListener('click', () => setView(b.dataset.view)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && current !== 'desktop') setView('desktop'); });
window.addEventListener('resize', fit);

// Дэлгэц 768px-ээс жижиг болбол энгийн харагдац руу буцна
matchMedia('(max-width: 767px)').addEventListener('change', (e) => { if (e.matches) setView('desktop'); });