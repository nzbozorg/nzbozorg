const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const progress = document.querySelector('.progress span');
const updateProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const amount = scrollable > 0 ? window.scrollY / scrollable : 0;
  progress.style.transform = `scaleX(${Math.min(1, Math.max(0, amount))})`;
};
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

document.getElementById('year').textContent = new Date().getFullYear();

const revealItems = document.querySelectorAll('.reveal');
if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    observer.observe(item);
  });
}

const portrait = document.querySelector('.living-portrait');
const frames = Object.fromEntries(
  [...document.querySelectorAll('.portrait-frame')].map((frame) => [frame.dataset.frame, frame])
);
let activeFrame = 'neutral';
let expressionTimer;
let blinkTimer;

function showFrame(name, instant = false) {
  if (!frames[name] || name === 'blink' || name === activeFrame) return;
  ['smile', 'focus'].forEach((key) => {
    if (instant) frames[key].style.transitionDuration = '0s';
    frames[key].classList.toggle('is-active', key === name);
  });
  frames.neutral.classList.add('is-active');
  activeFrame = name;
  if (instant) requestAnimationFrame(() => ['smile', 'focus'].forEach((key) => frames[key].style.removeProperty('transition-duration')));
}

function scheduleExpression() {
  const states = activeFrame === 'smile' ? ['neutral', 'focus'] : activeFrame === 'focus' ? ['neutral', 'smile'] : ['smile', 'focus'];
  const next = states[Math.floor(Math.random() * states.length)];
  expressionTimer = window.setTimeout(() => {
    showFrame(next);
    scheduleExpression();
  }, 7200 + Math.random() * 3200);
}

function blinkOnce(duration = 320) {
  frames.blink.classList.add('is-blinking');
  window.setTimeout(() => frames.blink.classList.remove('is-blinking'), duration);
}

function scheduleBlink() {
  blinkTimer = window.setTimeout(() => {
    blinkOnce();
    if (Math.random() > .78) window.setTimeout(() => blinkOnce(270), 620);
    scheduleBlink();
  }, 3400 + Math.random() * 4200);
}

if (!prefersReducedMotion && portrait) {
  scheduleExpression();
  scheduleBlink();
  document.addEventListener('visibilitychange', () => {
    clearTimeout(expressionTimer);
    clearTimeout(blinkTimer);
    if (document.hidden) return;
    showFrame('neutral');
    scheduleExpression();
    scheduleBlink();
  });
}

const tilt = document.querySelector('[data-tilt]');
if (tilt && !prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
  tilt.addEventListener('pointermove', (event) => {
    const rect = tilt.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - .5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - .5) * 2;
    tilt.style.transform = `perspective(900px) rotateY(${x * 2.8}deg) rotateX(${-y * 2.8}deg)`;
  });
  tilt.addEventListener('pointerleave', () => {
    tilt.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg)';
  });
}
