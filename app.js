/* ============================================================
   EL SUPER ODONTÓLOGO – Interactive JavaScript Engine
   ============================================================ */

/* ── PRELOADER ─────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
    startCounters();
    revealObserver();
  }, 1200);
});

/* ── NAVBAR ────────────────────────────────────────────── */
const navbar   = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');

  // Scroll-to-top button
  const btn = document.getElementById('scrollTopBtn');
  if (window.scrollY > 400) btn.classList.add('visible');
  else btn.classList.remove('visible');
});

hamburger.addEventListener('click', () => {
  navbar.classList.toggle('mobile-open');
  hamburger.textContent = navbar.classList.contains('mobile-open') ? '✕' : '☰';
});

// Close mobile menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navbar.classList.remove('mobile-open');
    hamburger.textContent = '☰';
  });
});

// Nav CTA scrolls to services
document.getElementById('navCta').addEventListener('click', () => {
  document.getElementById('servicios').scrollIntoView({ behavior: 'smooth' });
});

/* ── SMOOTH SCROLL UTILITY ─────────────────────────────── */
function scrollTo(selector) {
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

/* ── COUNTER ANIMATION ─────────────────────────────────── */
function startCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.target);
    const duration = 1800;
    const step     = Math.ceil(duration / target);
    let current    = 0;
    const timer = setInterval(() => {
      current += Math.ceil(target / 60);
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = current;
    }, step);
  });
}

/* ── REVEAL ON SCROLL ──────────────────────────────────── */
function revealObserver() {
  // Add reveal class to section items
  const targets = [
    ...document.querySelectorAll('.service-card'),
    ...document.querySelectorAll('.channel-card'),
    ...document.querySelectorAll('.phase'),
    ...document.querySelectorAll('.strategy-item'),
    ...document.querySelectorAll('.result-card'),
    ...document.querySelectorAll('.section-header'),
  ];
  targets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
}

/* ── SERVICES TABS ─────────────────────────────────────── */
document.getElementById('serviciosTabs').addEventListener('click', (e) => {
  const btn = e.target.closest('.tab-btn');
  if (!btn) return;

  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));

  btn.classList.add('active');
  const tabId = 'tab-' + btn.dataset.tab;
  const tab = document.getElementById(tabId);
  if (tab) {
    tab.classList.add('active');
    // Animate demand bars
    tab.querySelectorAll('.demand-fill').forEach(bar => {
      const pct = bar.style.getPropertyValue('--pct');
      bar.style.width = '0%';
      setTimeout(() => { bar.style.width = pct; }, 100);
    });
  }
});

// Animate initial tab bars
setTimeout(() => {
  document.querySelectorAll('.tab-content.active .demand-fill').forEach(bar => {
    const pct = bar.style.getPropertyValue('--pct');
    bar.style.width = pct;
  });
}, 1500);

/* ── MARKETING CHANNEL ACCORDION ──────────────────────── */
function toggleChannel(card) {
  const isOpen = card.classList.contains('open');
  // Close all
  document.querySelectorAll('.channel-card').forEach(c => c.classList.remove('open'));
  if (!isOpen) card.classList.add('open');
}

// Open first channel by default
setTimeout(() => {
  const first = document.querySelector('.channel-card');
  if (first) first.classList.add('open');
}, 100);

/* ── LANDING PAGE ANATOMY ──────────────────────────────── */
function showElement(btn, elemId) {
  document.querySelectorAll('.anatomy-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.anatomy-elem').forEach(e => e.classList.remove('active'));
  btn.classList.add('active');
  const el = document.getElementById(elemId);
  if (el) el.classList.add('active');
}

/* ── CONVERSION SCORE TOOL ─────────────────────────────── */
let scoreTotal = 0;
let answeredCount = 0;
const totalQuestions = document.querySelectorAll('.score-question').length;

function scoreAnswer(btn) {
  const question = btn.closest('.score-question');
  const prevSelected = question.querySelector('.score-btn.selected');

  if (prevSelected) {
    scoreTotal -= parseInt(prevSelected.dataset.points);
    prevSelected.classList.remove('selected');
  } else {
    answeredCount++;
  }

  btn.classList.add('selected');
  scoreTotal += parseInt(btn.dataset.points);

  if (answeredCount >= totalQuestions) {
    showScoreResult();
  }
}

function showScoreResult() {
  document.getElementById('scoreQuestions').style.display = 'none';
  const result = document.getElementById('scoreResult');
  result.style.display = 'block';
  result.style.animation = 'fadeInUp .5s ease';

  document.getElementById('scoreNumber').textContent = scoreTotal;
  const maxScore = 14;
  const pct = Math.round((scoreTotal / maxScore) * 100);

  let feedback = '';
  let color = '';
  if (pct >= 80) {
    feedback = '🎉 ¡Excelente! Tu landing page está muy bien optimizada. Algunos ajustes menores podrían llevarla al siguiente nivel.';
    color = '#10b981';
  } else if (pct >= 55) {
    feedback = '⚡ Buen comienzo. Tienes una base sólida pero hay oportunidades importantes de mejora. Revisa los elementos con ❌ primero.';
    color = '#f59e0b';
  } else if (pct >= 30) {
    feedback = '🔧 Tu landing page necesita trabajo significativo. Aplica los elementos críticos (🔴) de inmediato para ver resultados rápidos.';
    color = '#f97316';
  } else {
    feedback = '🚨 Tu página está perdiendo muchos pacientes potenciales. Reconstruir con la anatomía del Módulo 3 puede ser la mejor inversión.';
    color = '#ef4444';
  }

  document.getElementById('scoreCircle').style.borderColor = color;
  document.getElementById('scoreCircle').style.boxShadow = `0 0 30px ${color}40`;
  document.getElementById('scoreFeedback').innerHTML = feedback;
}

function resetScore() {
  scoreTotal = 0;
  answeredCount = 0;
  document.querySelectorAll('.score-btn.selected').forEach(b => b.classList.remove('selected'));
  document.getElementById('scoreQuestions').style.display = 'flex';
  document.getElementById('scoreQuestions').style.flexDirection = 'column';
  document.getElementById('scoreResult').style.display = 'none';
}

/* ── ROI CALCULATOR ────────────────────────────────────── */
function updateCalc() {
  const pacientes   = parseInt(document.getElementById('visitasmes').value);
  const ticket      = parseInt(document.getElementById('ticketprom').value);
  const inversion   = parseInt(document.getElementById('inversionmkt').value);
  const tasaConv    = parseInt(document.getElementById('tasaconv').value) / 100;

  document.getElementById('visitasmes-val').textContent = pacientes;
  document.getElementById('ticketprom-val').textContent = ticket.toLocaleString();
  document.getElementById('inversionmkt-val').textContent = inversion.toLocaleString();
  document.getElementById('tasaconv-val').textContent = Math.round(tasaConv * 100);

  // Estimate new patients from marketing
  const leadsGenerados   = Math.round(inversion / 15); // $15 cost per lead average dental
  const nuevosMarketing  = Math.round(leadsGenerados * tasaConv);
  const totalPacientes   = pacientes + nuevosMarketing;

  const ingresosActuales = pacientes * ticket;
  const ingresosProyect  = totalPacientes * ticket;
  const gananciaExtra    = ingresosProyect - ingresosActuales - inversion;
  const roi              = inversion > 0 ? Math.round(((ingresosProyect - ingresosActuales) / inversion) * 100) : 0;
  const roiPct           = Math.min(Math.round((gananciaExtra / (ingresosActuales + 1)) * 100), 95);

  // Update result cards
  document.getElementById('res-pacientes').textContent = totalPacientes;
  document.getElementById('res-pacientes-growth').textContent =
    `+${nuevosMarketing} con marketing (+${Math.round((nuevosMarketing / (pacientes||1))*100)}%)`;

  document.getElementById('res-ingresos').textContent = '$' + ingresosActuales.toLocaleString();
  document.getElementById('res-ingresos-growth').textContent = `Proyectado: $${ingresosProyect.toLocaleString()}`;

  document.getElementById('res-roi').textContent = roi + '%';
  document.getElementById('res-roi-label').textContent =
    `$${(roi/100).toFixed(1)} por cada $1 invertido`;

  document.getElementById('res-ganancia').textContent =
    gananciaExtra > 0 ? '$' + gananciaExtra.toLocaleString() : '$0';
  document.getElementById('res-ganancia-label').textContent = 'Ganancia neta adicional/mes';

  // Bar
  document.getElementById('bar-inv').textContent = inversion.toLocaleString();
  document.getElementById('bar-ret').textContent = ingresosProyect.toLocaleString();
  document.getElementById('roiFill').style.width = Math.min(roiPct, 95) + '%';
}

// Init calculator
updateCalc();

/* ── CHECKLIST PROGRESS ────────────────────────────────── */
function updateProgress(phase) {
  setTimeout(() => {
    const items    = document.querySelectorAll(`[data-phase="${phase}"] .cl-check`);
    const checked  = document.querySelectorAll(`[data-phase="${phase}"] .cl-check:checked`);
    const pct      = Math.round((checked.length / items.length) * 100);

    document.getElementById(`fill-phase${phase}`).style.width = pct + '%';
    document.getElementById(`pct-phase${phase}`).textContent  = pct + '%';

    // Overall
    const allItems   = document.querySelectorAll('.cl-check');
    const allChecked = document.querySelectorAll('.cl-check:checked');
    const totalPct   = Math.round((allChecked.length / allItems.length) * 100);

    document.getElementById('overallFill').style.width = totalPct + '%';
    document.getElementById('overallPct').textContent  = totalPct + '%';

    const msg = document.getElementById('progressMessage');
    if (totalPct === 0)        msg.textContent = 'Comienza marcando las tareas completadas arriba 🚀';
    else if (totalPct < 30)    msg.textContent = '¡Buen inicio! Sigue con los cimientos digitales 💪';
    else if (totalPct < 60)    msg.textContent = '¡Vas a mitad del camino! Tu clínica está creciendo 📈';
    else if (totalPct < 90)    msg.textContent = '¡Casi ahí! Eres todo un Super Odontólogo 🦷⚡';
    else if (totalPct === 100) msg.textContent = '🏆 ¡MISIÓN CUMPLIDA! Eres oficialmente un Super Odontólogo';
  }, 100);
}

/* ── FAB FLOATING ACTION BUTTON ────────────────────────── */
const fabContainer = document.querySelector('.fab-container');
const fabMain      = document.getElementById('fabMain');

fabMain.addEventListener('click', (e) => {
  e.stopPropagation();
  fabContainer.classList.toggle('open');
});

document.addEventListener('click', () => {
  fabContainer.classList.remove('open');
});

fabContainer.addEventListener('click', e => e.stopPropagation());

/* ── ACTIVE NAV LINK ON SCROLL ─────────────────────────── */
const sections = document.querySelectorAll('section[id], header[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.style.color = 'var(--primary)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => sectionObserver.observe(section));

/* ── PARTICLE EFFECT ON HERO ───────────────────────────── */
(function createParticles() {
  const hero = document.getElementById('hero');
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.style.cssText = `
      position:absolute;
      width:${Math.random()*4+2}px;
      height:${Math.random()*4+2}px;
      background:rgba(14,165,233,${Math.random()*0.4+0.1});
      border-radius:50%;
      top:${Math.random()*100}%;
      left:${Math.random()*100}%;
      animation: floatParticle ${Math.random()*8+6}s linear ${Math.random()*6}s infinite;
      pointer-events:none;
    `;
    hero.appendChild(p);
  }

  const style = document.createElement('style');
  style.textContent = `
    @keyframes floatParticle {
      0%   { transform: translateY(0) translateX(0); opacity: 0; }
      10%  { opacity: 1; }
      90%  { opacity: 1; }
      100% { transform: translateY(-80px) translateX(${Math.random() > .5 ? '+' : '-'}40px); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
})();

/* ── DEMAND BAR ANIMATION ON SCROLL ────────────────────── */
const demandObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.demand-fill').forEach(bar => {
        const pct = bar.style.getPropertyValue('--pct');
        bar.style.width = pct;
      });
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.service-card').forEach(card => demandObserver.observe(card));

console.log('%c🦷 El Super Odontólogo Cargado', 'color:#0ea5e9;font-size:18px;font-weight:bold;');
console.log('%cTu clínica dental tiene todo lo que necesita para destacar.', 'color:#94a3b8;font-size:12px;');
