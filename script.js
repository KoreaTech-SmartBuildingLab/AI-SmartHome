const menuBtn = document.querySelector('.menu-toggle');
const menu = document.querySelector('.nav-menu');
if (menuBtn && menu) {
  menuBtn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.textContent = open ? '✕' : '☰';
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.textContent = '☰';
  }));
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// One FAQ at a time for a cleaner mobile experience.
const faqItems = [...document.querySelectorAll('.accordion details')];
faqItems.forEach(item => item.addEventListener('toggle', () => {
  if (!item.open) return;
  faqItems.forEach(other => { if (other !== item) other.open = false; });
}));


// Highlight the current section in the desktop/mobile navigation.
const sectionLinks = [...document.querySelectorAll('.nav-menu a[href^="#"]')];
const navSections = sectionLinks
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if (navSections.length) {
  const navObserver = new IntersectionObserver(entries => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    sectionLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`));
  }, { rootMargin: '-28% 0px -58% 0px', threshold: [0, 0.15, 0.35] });
  navSections.forEach(section => navObserver.observe(section));
}


// Mobile-only swipe guidance for horizontally scrollable content.
// The HTML stays common to desktop and mobile; CSS changes the presentation.
const mobileCarouselSelectors = [
  '.overview-grid',
  '.research-grid',
  '.cooperation-grid',
  '.feature-grid',
  '.arch-card',
  '.timeline',
  '.data-grid'
];

const mobileMedia = window.matchMedia('(max-width: 700px)');

function setupMobileSwipeHints() {
  document.querySelectorAll('.mobile-swipe-hint').forEach(el => el.remove());

  if (!mobileMedia.matches) return;

  mobileCarouselSelectors.forEach(selector => {
    const scroller = document.querySelector(selector);
    if (!scroller) return;

    const hint = document.createElement('div');
    hint.className = 'mobile-swipe-hint';
    hint.setAttribute('aria-hidden', 'true');
    hint.innerHTML = '<span>←</span><span>좌우로 넘겨보세요</span><span>→</span>';
    scroller.parentNode.insertBefore(hint, scroller);

    let used = false;
    scroller.addEventListener('scroll', () => {
      if (used || scroller.scrollLeft < 12) return;
      used = true;
      hint.classList.add('is-used');
    }, { passive: true });
  });
}

setupMobileSwipeHints();

if (mobileMedia.addEventListener) {
  mobileMedia.addEventListener('change', setupMobileSwipeHints);
} else if (mobileMedia.addListener) {
  mobileMedia.addListener(setupMobileSwipeHints);
}
