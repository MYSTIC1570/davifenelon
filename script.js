const experienceData = {
  personNameFallback: "Meu amor",
  partnerName: "Amor",
  relationshipStartDate: "2023-02-14",
  music: {
    title: "Perfect",
    artist: "Ed Sheeran",
    // Coloque a capa da música localmente na raiz do projeto.
    // Exemplo: capa-musica.jpeg
    cover: "capa-musica.jpeg",
    // Adicione seu arquivo local de áudio, ex: "musica.mp3"
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
    {
      caption: "Nós dois em nosso lugar favorito",
      photo: "img4.jpeg"
    },
    {
      caption: "Um pôr do sol, dois corações",
      photo: "img5.jpeg"
    },
    {
      caption: "Rindo da vida juntos",
      photo: "img6.jpeg"
    }
  ],
  poeticText: "O universo conspirou para nos unir ✨",
  finalMessage:
    "Obrigado por ser minha pessoa, meu lar e minha melhor escolha em todos os dias."
};

const screens = [...document.querySelectorAll(".screen")];
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
const cards = [...document.querySelectorAll(".card")];

let currentScreen = 0;
let quoteIndex = 0;

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
      <article class="timeline-item">
        <div>
          <small>${item.date}</small>
          <p>${item.description}</p>
        </div>
        ${
          item.photo
            ? `<img src="${item.photo}" alt="Momento de ${item.date}" onerror="this.style.display='none'" />`
            : ""
        }
      </article>
    `
    )
    .join("");

  galleryGrid.innerHTML = experienceData.gallery
    .map((item, index) => {
      const tilt = index % 2 === 0 ? "-1.5deg" : "1.8deg";
      return `
      <article class="photo-card" style="--tilt:${tilt}">
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

function goToScreen(index) {
  screens[currentScreen].classList.remove("active");
  currentScreen = Math.min(Math.max(index, 0), screens.length - 1);
  screens[currentScreen].classList.add("active");
}

function setQuote() {
  quoteText.style.opacity = "0";
  quoteText.style.transform = "translateY(6px)";
  setTimeout(() => {
    quoteText.textContent = `“${experienceData.messages[quoteIndex]}”`;
    quoteText.style.opacity = "1";
    quoteText.style.transform = "translateY(0)";
  }, 160);
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
  setTimeout(() => burst.remove(), 520);
}

function attachInteractiveEffects() {
  document.addEventListener("click", (event) => {
    createClickBurst(event.clientX, event.clientY);
  });

  cards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      if (window.innerWidth < 900) return;
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * 4;
      const rotateX = (0.5 - py) * 3;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
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
    playerHint.textContent = "Adicione seu arquivo em experienceData.music.audioSrc, por exemplo: musica.mp3";
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

renderExperience();
updatePersonalizedTexts();
attachInteractiveEffects();
