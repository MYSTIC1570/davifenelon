const recapData = {
  topMoments: [
    "Nosso primeiro café do ano",
    "Viagem surpresa de fim de semana",
    "Noite de filmes + pizza",
    "Aniversário com carta à mão",
    "Pôr do sol na praia"
  ],
  monthlyIntensity: [48, 56, 62, 71, 80, 88, 93, 86, 91, 95, 97, 99],
  monthlyLabels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
  badges: ["Conexão Máxima", "Zero Tédio", "Top Risadas", "Playlist do Amor", "Sem Pausa", "Modo Parceiros"],
  relationshipStart: "2023-02-14"
};

const themes = [
  { bg1: "#11051d", bg2: "#220b35", bg3: "#39105a", a1: "#ff4db8", a2: "#8b55ff", a3: "#45ffd2", a4: "#d8ff42" },
  { bg1: "#120810", bg2: "#2c1022", bg3: "#4d1736", a1: "#ff6a47", a2: "#ff2ca0", a3: "#ffd74a", a4: "#6affda" },
  { bg1: "#07101a", bg2: "#0e2340", bg3: "#15305e", a1: "#38e1ff", a2: "#4d80ff", a3: "#74ffcb", a4: "#c2ff4d" },
  { bg1: "#13081e", bg2: "#2b0f39", bg3: "#41135a", a1: "#ff4d7f", a2: "#a658ff", a3: "#4dfff3", a4: "#e3ff56" }
];

const screens = [...document.querySelectorAll(".story-screen")];
const nextButtons = [...document.querySelectorAll("[data-next]")];
const prevButton = document.getElementById("prevButton");
const restartButton = document.getElementById("restartButton");
const progressBar = document.getElementById("progressBar");
const topList = document.getElementById("topList");
const chartBars = document.getElementById("chartBars");
const badgeList = document.getElementById("badgeList");

let current = 0;
let locked = false;
let touchStartY = 0;

function setTheme() {
  const theme = themes[Math.floor(Math.random() * themes.length)];
  Object.entries({
    "--bg-1": theme.bg1,
    "--bg-2": theme.bg2,
    "--bg-3": theme.bg3,
    "--accent-1": theme.a1,
    "--accent-2": theme.a2,
    "--accent-3": theme.a3,
    "--accent-4": theme.a4
  }).forEach(([key, value]) => document.documentElement.style.setProperty(key, value));
}

function renderTop5() {
  topList.innerHTML = recapData.topMoments
    .map(
      (item, index) => `
      <li>
        <strong>${index + 1}</strong>
        <p>${item}</p>
      </li>
    `
    )
    .join("");
}

function renderChart() {
  chartBars.innerHTML = recapData.monthlyIntensity
    .map(
      (value, index) => `
      <div class="bar-wrap">
        <div class="bar" style="height:${value}%"></div>
        <span>${recapData.monthlyLabels[index]}</span>
      </div>
    `
    )
    .join("");
}

function renderBadges() {
  badgeList.innerHTML = recapData.badges.map((badge) => `<span class="badge">${badge}</span>`).join("");
}

function updateDays() {
  const start = new Date(`${recapData.relationshipStart}T00:00:00`);
  const now = new Date();
  const days = Math.max(0, Math.floor((now - start) / (1000 * 60 * 60 * 24)));
  const daysNode = document.getElementById("daysTogether");
  if (daysNode) daysNode.textContent = days;
}

function animateCounts(scope) {
  scope.querySelectorAll("[data-count]").forEach((node) => {
    const end = Number(node.dataset.count);
    gsap.fromTo(
      node,
      { textContent: 0 },
      {
        textContent: end,
        duration: 1.2,
        ease: "power2.out",
        snap: { textContent: 1 },
        onUpdate: () => {
          const n = Number(node.textContent);
          node.textContent = Number.isFinite(n) ? n.toLocaleString("pt-BR") : "0";
        }
      }
    );
  });
}

function animateScreen(index) {
  const screen = screens[index];
  const inner = screen.querySelector(".screen-inner");
  const items = screen.querySelectorAll(".kicker, .headline, .support, .mega-number, .cta, .ghost, .top-list li, .bar-wrap, .badge, .share-grid p");

  gsap.fromTo(
    inner,
    { scale: 0.96, opacity: 0, y: 24, rotateX: 8 },
    { scale: 1, opacity: 1, y: 0, rotateX: 0, duration: 0.55, ease: "back.out(1.2)" }
  );

  gsap.fromTo(
    items,
    { opacity: 0, y: 20, scale: 0.98 },
    { opacity: 1, y: 0, scale: 1, stagger: 0.04, duration: 0.52, ease: "power2.out", delay: 0.08 }
  );

  animateCounts(screen);
}

function goTo(next) {
  if (locked) return;
  const target = Math.max(0, Math.min(next, screens.length - 1));
  if (target === current) return;

  locked = true;
  const oldScreen = screens[current];
  const newScreen = screens[target];

  oldScreen.classList.remove("active");
  newScreen.classList.add("active");

  gsap.fromTo(
    oldScreen,
    { rotateY: 0, xPercent: 0, opacity: 1 },
    { rotateY: -24, xPercent: -6, opacity: 0, duration: 0.4, ease: "power2.in" }
  );

  gsap.fromTo(
    newScreen,
    { rotateY: 26, xPercent: 6, opacity: 0 },
    {
      rotateY: 0,
      xPercent: 0,
      opacity: 1,
      duration: 0.52,
      ease: "back.out(1.1)",
      onComplete: () => {
        current = target;
        updateProgress();
        animateScreen(current);
        locked = false;
      }
    }
  );
}

function updateProgress() {
  const percent = ((current + 1) / screens.length) * 100;
  gsap.to(progressBar, { width: `${percent}%`, duration: 0.3, ease: "power1.out" });
}

function pulseBackground() {
  gsap.to(".orb-a", { x: 40, y: -20, duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut" });
  gsap.to(".orb-b", { x: -35, y: 28, duration: 7, repeat: -1, yoyo: true, ease: "sine.inOut" });
  gsap.to(".orb-c", { x: 18, y: -30, duration: 8, repeat: -1, yoyo: true, ease: "sine.inOut" });
}

function wireInteractions() {
  nextButtons.forEach((button) => button.addEventListener("click", () => goTo(current + 1)));
  if (prevButton) prevButton.addEventListener("click", () => goTo(current - 1));
  if (restartButton) restartButton.addEventListener("click", () => goTo(0));

  window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") goTo(current + 1);
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") goTo(current - 1);
  });

  window.addEventListener(
    "wheel",
    (event) => {
      if (Math.abs(event.deltaY) < 22) return;
      if (event.deltaY > 0) goTo(current + 1);
      else goTo(current - 1);
    },
    { passive: true }
  );

  window.addEventListener("touchstart", (event) => {
    touchStartY = event.changedTouches[0].clientY;
  });

  window.addEventListener("touchend", (event) => {
    const endY = event.changedTouches[0].clientY;
    const delta = touchStartY - endY;
    if (Math.abs(delta) < 45) return;
    if (delta > 0) goTo(current + 1);
    else goTo(current - 1);
  });
}

setTheme();
renderTop5();
renderChart();
renderBadges();
updateDays();
updateProgress();
pulseBackground();
animateScreen(0);
wireInteractions();
