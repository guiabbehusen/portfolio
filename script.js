const languageMap = { en: 'pt', pt: 'en' };
let currentLanguage = 'en';
const toggle = document.getElementById('language-toggle');
const translatable = document.querySelectorAll('[data-en][data-pt]');
const typewriteElement = document.querySelector('.typewrite');
let activeTypewriter = null;

const typewriterText = {
  en: [
    'AI & machine learning systems.',
    'GenAI, RAG and LLM agents.',
    'Computer vision and embedded AI.',
    'Cloud, data and automation.'
  ],
  pt: [
    'Sistemas de IA e machine learning.',
    'GenAI, RAG e agentes com LLMs.',
    'Visão computacional e IA embarcada.',
    'Cloud, dados e automação.'
  ]
};

function setLanguage(language) {
  currentLanguage = language;
  document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en';
  translatable.forEach((element) => { element.textContent = element.dataset[language]; });
  document.querySelectorAll('.hover-item').forEach((element) => {
    const key = language === 'pt' ? 'messagePt' : 'messageEn';
    const message = element.dataset[key];
    if (message) element.dataset.message = message;
  });
  toggle.textContent = language === 'en' ? 'PT' : 'EN';
  restartTypewriter(language);
}

toggle.addEventListener('click', () => setLanguage(languageMap[currentLanguage]));

const messageBox = document.getElementById('message-box');
document.querySelectorAll('.hover-item').forEach((item) => {
  item.addEventListener('mouseenter', (event) => {
    const message = event.currentTarget.dataset.message;
    if (!message) return;
    messageBox.textContent = message;
    messageBox.style.display = 'block';
  });
  item.addEventListener('mouseleave', () => { messageBox.style.display = 'none'; });
});

function Typewriter(el, phrases, period) {
  this.phrases = phrases;
  this.el = el;
  this.loopNum = 0;
  this.period = period || 1850;
  this.txt = '';
  this.isDeleting = false;
  this.stopped = false;
  this.tick();
}

Typewriter.prototype.stop = function () {
  this.stopped = true;
};

Typewriter.prototype.tick = function () {
  if (this.stopped) return;
  const i = this.loopNum % this.phrases.length;
  const fullTxt = this.phrases[i];
  this.txt = this.isDeleting ? fullTxt.substring(0, this.txt.length - 1) : fullTxt.substring(0, this.txt.length + 1);
  this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';
  let delta = 70 - Math.random() * 45;
  if (this.isDeleting) delta /= 1.7;
  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum += 1;
    delta = 350;
  }
  setTimeout(() => this.tick(), delta);
};

function restartTypewriter(language) {
  if (activeTypewriter) activeTypewriter.stop();
  if (!typewriteElement) return;
  activeTypewriter = new Typewriter(typewriteElement, typewriterText[language], 1850);
}

window.addEventListener('load', () => {
  window.scroll({ top: 0, left: 0, behavior: 'instant' });
  setLanguage('en');
});

const canvas = document.getElementById('particles-js');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
}

function createParticles() {
  const count = window.innerWidth < 720 ? 28 : 52;
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.38,
    vy: (Math.random() - 0.5) * 0.38,
    r: Math.random() * 1.4 + 0.8
  }));
}

function drawParticles() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
    if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(84, 110, 158, 0.46)';
    ctx.fill();
  }
  for (let i = 0; i < particles.length; i += 1) {
    for (let j = i + 1; j < particles.length; j += 1) {
      const a = particles[i], b = particles[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 125) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(138, 163, 200, ${0.28 * (1 - distance / 125)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}

window.addEventListener('resize', () => { resizeCanvas(); createParticles(); });
resizeCanvas();
createParticles();
drawParticles();
