const categories = [
  {
    name: "Patrimonio",
    words: [
      "Mote con huesillo",
      "Humitas",
      "Porotos",
      "Humita",
      "Dulces de La Ligua",
      "Melón",
      "Digüeñes",
      "Manguereo",
      "Paletas",
      "Carioca",
      "Castillo de arena",
      "Chungungo",
      "Vizcacha",
      "Zorro",
      "Gato güiña",
      "Huemul",
      "Araucaria",
      "Palma chilena",
      "Parrón de uvas",
      "Museo"
    ],
  },
];

const screens = {
  start: document.getElementById("screen-start"),
  instructions: document.getElementById("screen-instructions"),
  draw: document.getElementById("screen-draw"),
  game: document.getElementById("screen-game"),
  end: document.getElementById("screen-end"),
};

const startButton = document.getElementById("start-button");
const howtoToCategories = document.getElementById("howto-to-categories");
const timerEl = document.getElementById("timer");
const currentWordEl = document.getElementById("current-word");
const questionImageEl = document.getElementById("question-image");
const scoreEl = document.getElementById("score");
const finalScoreEl = document.getElementById("final-score");
const playAgain = document.getElementById("play-again");
const wordCard = document.getElementById("word-card");
const correctBtn = document.getElementById("correct-btn");
const wrongBtn = document.getElementById("wrong-btn");

let activeCategory = null;
let wordsQueue = [];
let timerId = null;
let timeLeft = 60;
let score = 0;
let touchStartX = 0;
let mouseStartX = 0;
let isMouseDown = false;
let drawTimeoutId = null;

function showScreen(target) {
  Object.values(screens).forEach((screen) => {
    screen.classList.remove("active");
  });
  screens[target].classList.add("active");
  screens[target].classList.add("fade-in");
  setTimeout(() => screens[target].classList.remove("fade-in"), 400);
}

function startDraw() {
  const randomIndex = Math.floor(Math.random() * categories.length);
  activeCategory = categories[randomIndex];
  showScreen("draw");
  clearTimeout(drawTimeoutId);
  drawTimeoutId = setTimeout(() => startGame(), 1200);
}

function startGame() {
  wordsQueue = shuffle([...activeCategory.words]);
  score = 0;
  timeLeft = 60;
  timerEl.textContent = timeLeft;
  scoreEl.textContent = score;
  showScreen("game");
  nextWord();
  startTimer();
}

function startTimer() {
  clearInterval(timerId);
  timerId = setInterval(() => {
    timeLeft -= 1;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  clearInterval(timerId);
  finalScoreEl.textContent = score;
  showScreen("end");
}

function nextWord() {
  if (wordsQueue.length === 0) {
    endGame();
    return;
  }
  const currentWord = wordsQueue.shift();
  currentWordEl.textContent = currentWord;

  // Update the question image
  if (currentWord) {
    questionImageEl.src = `questionimages/${currentWord}.png`;
    questionImageEl.alt = currentWord;
  }
}

function shuffle(list) {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

function handleSwipe(startX, endX) {
  const swipeDistance = endX - startX;
  const threshold = 50; // Minimum swipe distance in pixels

  if (Math.abs(swipeDistance) < threshold) return;

  // Add visual feedback
  wordCard.style.transform = `translateX(${swipeDistance > 0 ? '10px' : '-10px'})`;
  wordCard.style.transition = 'transform 0.2s ease';

  setTimeout(() => {
    wordCard.style.transform = '';
    wordCard.style.transition = '';
  }, 200);

  nextWord();
}

startButton.addEventListener("click", () => showScreen("instructions"));
howtoToCategories.addEventListener("click", () => startDraw());
playAgain.addEventListener("click", () => showScreen("start"));

// Correct and wrong button handlers
correctBtn.addEventListener("click", () => {
  // Add visual feedback
  correctBtn.style.transform = 'scale(1.2)';
  setTimeout(() => {
    correctBtn.style.transform = '';
  }, 150);

  // Increment score and move to next word
  score++;
  scoreEl.textContent = score;
  nextWord();
});

wrongBtn.addEventListener("click", () => {
  // Add visual feedback
  wrongBtn.style.transform = 'scale(1.2)';
  setTimeout(() => {
    wrongBtn.style.transform = '';
  }, 150);

  // Move to next word WITHOUT incrementing score
  nextWord();
});

wordCard.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].clientX;
});

wordCard.addEventListener("touchend", (event) => {
  handleSwipe(touchStartX, event.changedTouches[0].clientX);
});

// Mouse events for PC users
wordCard.addEventListener("mousedown", (event) => {
  isMouseDown = true;
  mouseStartX = event.clientX;
  wordCard.style.cursor = 'grabbing';
  event.preventDefault(); // Prevent text selection
});

wordCard.addEventListener("mousemove", (event) => {
  if (!isMouseDown) return;

  const currentX = event.clientX;
  const diff = currentX - mouseStartX;

  // Visual feedback during drag
  if (Math.abs(diff) > 5) {
    wordCard.style.transform = `translateX(${diff * 0.3}px)`;
    wordCard.style.transition = 'none';
  }
});

wordCard.addEventListener("mouseup", (event) => {
  if (!isMouseDown) return;

  isMouseDown = false;
  wordCard.style.cursor = 'grab';

  const mouseEndX = event.clientX;
  handleSwipe(mouseStartX, mouseEndX);
});

wordCard.addEventListener("mouseleave", () => {
  if (isMouseDown) {
    isMouseDown = false;
    wordCard.style.cursor = 'grab';
    wordCard.style.transform = '';
    wordCard.style.transition = '';
  }
});

// Keyboard navigation for desktop
document.addEventListener("keydown", (event) => {
  // Only handle keyboard navigation when game screen is active
  if (!screens.game.classList.contains("active")) return;

  if (event.key === "ArrowRight") {
    event.preventDefault();

    // Add visual feedback similar to swipe
    wordCard.style.transform = 'translateX(-10px)';
    wordCard.style.transition = 'transform 0.2s ease';

    setTimeout(() => {
      wordCard.style.transform = '';
      wordCard.style.transition = '';
    }, 200);

    nextWord();
  }
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js");
  });
}
