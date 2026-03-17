const experienceData = {
  personNameFallback: "Meu amor",
  relationshipStartDate: "2023-02-14",
  music: {
    title: "Perfect",
    artist: "Ed Sheeran",
    cover: "capa-musica.jpeg",
    audioSrc: ""
  },
  timeline: [
    {
      date: "14/02/2023",
      description: "Nosso primeiro encontro, com borboletas no estômago e sorrisos tímidos.",
      photo: "img1.jpeg"
    },
    {
      date: "30/04/2023",
      description: "A viagem de fim de semana que virou uma memória eterna.",
      photo: "img2.jpeg"
    },
    {
      date: "25/12/2023",
      description: "Nosso primeiro natal juntos, cheio de carinho e planos para o futuro.",
      photo: "img3.jpeg"
    }
  ],
  messages: [
    "Desde que você chegou, meus dias ganharam mais cor e sentido.",
    "Você é meu abraço favorito e o meu lugar de paz.",
    "Em cada capítulo, eu escolheria você de novo, mil vezes."
  ],
  gallery: [
    { caption: "Nós dois em nosso lugar favorito", photo: "img4.jpeg" },
    { caption: "Um pôr do sol, dois corações", photo: "img5.jpeg" },
    { caption: "Rindo da vida juntos", photo: "img6.jpeg" }
  ],
  poeticText: "O universo conspirou para nos unir ✨",
  finalMessage: "Obrigado por ser minha pessoa, meu lar e minha melhor escolha em todos os dias."
};

const colorThemes = [
  { bg1: "#0b0616", bg2: "#1f0633", bg3: "#25084a", a1: "#ff4fa8", a2: "#7e5bff", a3: "#35f2d0" },
  { bg1: "#0f0712", bg2: "#2d0e22", bg3: "#3f122e", a1: "#ff6a3d", a2: "#ff2d9b", a3: "#ffe15a" },
  { bg1: "#06131a", bg2: "#082735", bg3: "#0c3447", a1: "#2ee6ff", a2: "#4298ff", a3: "#83ffce" },
  { bg1: "#110910", bg2: "#2a0f20", bg3: "#381531", a1: "#ff4c74", a2: "#b056ff", a3: "#62ffe3" },
  { bg1: "#0d0f1b", bg2: "#1b1e38", bg3: "#2b2456", a1: "#7d7dff", a2: "#ff5db8", a3: "#60ffe7" }
];

const screens = [...document.querySelectorAll(".screen")];
const cards = [...document.querySelectorAll(".card")];
const nextButtons = [...document.querySelectorAll("[data-next]")];
const nameInput = document.getElementById("nameInput");
const welcomeText = document.getElementById("welcomeText");
const finalTitle = document.getElementById("finalTitle");
const finalMessage = document.getElementById("finalMessage");
const daysTogether = document.getElementById("daysTogether");
const timelineList = document.getElementById("timelineList");
const galleryGrid = document.getElementById("galleryGrid");
const quoteText = document.getElementById("quoteText");
const prevQuote = document.getElementById("prevQuote");
const nextQuote = document.getElementById("nextQuote");
const musicCover = document.getElementById("musicCover");
const musicName = document.getElementById("musicName");
const musicArtist = document.getElementById("musicArtist");
const audioPlayer = document.getElementById("audioPlayer");
const playButton = document.getElementById("playButton");
const playerHint = document.getElementById("playerHint");
const poeticText = document.getElementById("poeticText");
const restartButton = document.getElementById("restartButton");

let currentScreen = 0;
let quoteIndex = 0;
let isTurning = false;

function applyRandomTheme() {
  const theme = colorThemes[Math.floor(Math.random() * colorThemes.length)];
  document.documentElement.style.setProperty("--bg-1", theme.bg1);
  document.documentElement.style.setProperty("--bg-2", theme.bg2);
  document.documentElement.style.setProperty("--bg-3", theme.bg3);
  document.documentElement.style.setProperty("--accent-1", theme.a1);
  document.documentElement.style.setProperty("--accent-2", theme.a2);
  document.documentElement.style.setProperty("--accent-3", theme.a3);
}

function renderExperience() {
  musicCover.src = experienceData.music.cover;
  musicName.textContent = experienceData.music.title;
  musicArtist.textContent = experienceData.music.artist;

  if (experienceData.music.audioSrc) {
    audioPlayer.querySelector("source").src = experienceData.music.audioSrc;
    audioPlayer.load();
    playerHint.textContent = "Toque para ouvir a música especial de vocês.";
  }

  timelineList.innerHTML = experienceData.timeline
    .map(
      (item) => `
      <article class="timeline-item animate__animated animate__fadeInUp">
        <div>
          <small>${item.date}</small>
          <p>${item.description}</p>
        </div>
        ${item.photo ? `<img src="${item.photo}" alt="Momento de ${item.date}" onerror="this.style.display='none'" />` : ""}
      </article>
    `
    )
    .join("");

  galleryGrid.innerHTML = experienceData.gallery
    .map((item, index) => {
      const tilt = index % 2 === 0 ? "-1.4deg" : "1.6deg";
      return `
      <article class="photo-card animate__animated animate__fadeIn" style="--tilt:${tilt}">
        <img src="${item.photo}" alt="${item.caption}" onerror="this.style.display='none'" />
        <p>${item.caption}</p>
      </article>
    `;
    })
    .join("");

  poeticText.textContent = experienceData.poeticText;
  finalMessage.textContent = experienceData.finalMessage;
  setQuote();
  updateRelationshipCounter();
}

function animateScreenElements(screen) {
  const nodes = screen.querySelectorAll("h1, h2, p, .btn, .ghost-btn, .music-player, .timeline-item, .photo-card, .quote");
  nodes.forEach((node, idx) => {
    node.classList.remove("animate__animated", "animate__fadeInUp", "animate__fadeIn", "animate__zoomIn");
    void node.offsetWidth;
    node.classList.add("animate__animated", idx % 3 === 0 ? "animate__fadeInUp" : idx % 3 === 1 ? "animate__fadeIn" : "animate__zoomIn");
    node.style.setProperty("--animate-duration", `${0.45 + idx * 0.04}s`);
  });
}

function goToScreen(index) {
  if (isTurning) return;
  const target = Math.min(Math.max(index, 0), screens.length - 1);
  if (target === currentScreen) return;

  isTurning = true;
  const current = screens[currentScreen];
  const next = screens[target];

  current.classList.add("turn-out");
  next.classList.add("active", "turn-in");

  setTimeout(() => {
    current.classList.remove("active", "turn-out");
    next.classList.remove("turn-in");
    currentScreen = target;
    animateScreenElements(next);
    isTurning = false;
  }, 790);
}

function setQuote() {
  quoteText.style.opacity = "0";
  quoteText.style.transform = "translateY(8px)";
  setTimeout(() => {
    quoteText.textContent = `“${experienceData.messages[quoteIndex]}”`;
    quoteText.style.opacity = "1";
    quoteText.style.transform = "translateY(0)";
  }, 170);
}

function updateRelationshipCounter() {
  const today = new Date();
  const start = new Date(experienceData.relationshipStartDate + "T00:00:00");
  const diffMs = today - start;
  const diffDays = Math.max(Math.floor(diffMs / (1000 * 60 * 60 * 24)), 0);
  daysTogether.textContent = `Já estamos juntos há ${diffDays} dias ❤️`;
}

function updatePersonalizedTexts() {
  const enteredName = nameInput.value.trim();
  const person = enteredName || experienceData.personNameFallback;
  welcomeText.textContent = `${person}, preparei algo especial para você ❤️`;
  finalTitle.textContent = `Obrigado por viver essa história comigo, ${person}.`;
}

function createClickBurst(x, y) {
  const burst = document.createElement("span");
  burst.className = "click-burst";
  burst.style.left = `${x}px`;
  burst.style.top = `${y}px`;
  document.body.appendChild(burst);
  setTimeout(() => burst.remove(), 560);
}

function attachInteractiveEffects() {
  document.addEventListener("click", (event) => {
    createClickBurst(event.clientX, event.clientY);
  });

  cards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      if (window.innerWidth < 920) return;
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * 3.8;
      const rotateX = (0.5 - py) * 2.6;
      card.style.transform = `perspective(1500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1500px) rotateX(0deg) rotateY(0deg)";
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") goToScreen(currentScreen + 1);
    if (event.key === "ArrowLeft") goToScreen(currentScreen - 1);
  });
}

nextButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    updatePersonalizedTexts();

    if (currentScreen === 0 && experienceData.music.audioSrc) {
      audioPlayer.play().catch(() => {
        playerHint.textContent = "Seu navegador bloqueou o autoplay. Toque no play manualmente.";
      });
    }

    goToScreen(currentScreen + 1);
  });
});

playButton.addEventListener("click", () => {
  if (!experienceData.music.audioSrc) {
    playerHint.textContent = "Adicione seu arquivo local em experienceData.music.audioSrc (ex: musica.mp3).";
    return;
  }

  if (audioPlayer.paused) {
    audioPlayer.play();
    playButton.textContent = "❚❚";
  } else {
    audioPlayer.pause();
    playButton.textContent = "▶";
  }
});

prevQuote.addEventListener("click", () => {
  quoteIndex = (quoteIndex - 1 + experienceData.messages.length) % experienceData.messages.length;
  setQuote();
});

nextQuote.addEventListener("click", () => {
  quoteIndex = (quoteIndex + 1) % experienceData.messages.length;
  setQuote();
});

restartButton.addEventListener("click", () => {
  goToScreen(0);
});

applyRandomTheme();
renderExperience();
updatePersonalizedTexts();
animateScreenElements(screens[currentScreen]);
attachInteractiveEffects();
