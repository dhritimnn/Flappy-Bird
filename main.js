const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Documents items declaration
const display = document.querySelector("#display");
const bird = document.querySelector("#bird");
const initialMenu = document.querySelector("#initial-menu");
const menuHeading = document.querySelector("#initial-menu > h2");
const playbtn = document.querySelector("#playbtn");
const scoreScreen = document.querySelector("#scoreScreen");
const obstacleContainer = document.querySelector("#obstacleContainer");
const jumpSound = new Audio("sounds/jump.mp3");
const overSound = new Audio("sounds/over.mp3");
const bgSound = new Audio("sounds/bg.mp3");

// default declarations/variables

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let isCounting = false;
let isColliding;
let gameSessionId = 0;

function defaults() {
  bird.style.setProperty("top", "45%");
  bird.style.setProperty("transform", "rotate(-15deg)");
  score = 0;
  bgSound.play();
  bgSound.currentTime = 0;
  bgSound.volume = 0.05;
  bgSound.loop = true;
}
defaults();
let loop234 = 0;
let bgmovebool = true;
async function bgmove() {
  while (bgmovebool) {
    display.style.setProperty("background-position", `-${loop234}px`);
    loop234++;
    const obstacles = document.querySelectorAll(".obstacle");
    isColliding = Array.from(obstacles).some((obstacle) => {
      return elementsOverlap(bird, obstacle);
    });
    await delay(9);
    // Game over check
    let y_inst = parseInt(bird.style.getPropertyValue("top"));
    if (y_inst >= 90 || y_inst <= 0 || isColliding) {
      console.log(y_inst);
      gameover();
      return;
    }
    if (!bgmovebool) return;
  }
}
bgmove();

let isFallingLoopRunning = true;

// freefall
async function freefall() {
  isFallingLoopRunning = false;
  jumpSound.currentTime = 0;
  jumpSound.volume = 0.3;
  jumpSound.play();
  // Jump
  let y = parseInt(bird.style.getPropertyValue("top"));
  for (let i = 0; i <= 10; i++) {
    bird.style.setProperty("top", `${y - 4 * i ** (1 / 4)}%`);
    bird.style.setProperty("transform", `rotate(-${50 - i}deg)`);
    await delay(30);
  }

  // Falling
  isFallingLoopRunning = true;
  await delay(30);
  y = parseInt(bird.style.getPropertyValue("top"));
  let i = 0;
  while (isFallingLoopRunning) {
    i++;
    bird.style.setProperty("top", `${y + 0.07 * i ** 2}%`);
    bird.style.setProperty("transform", `rotate(${-45 + 3.5 * i}deg)`);

    await delay(30);

    // preventing jumping when it is already
    if (!isFallingLoopRunning || !bgmovebool) return;
  }
}

// score count
async function scoreCount() {
  while (isCounting) {
    score = score + 1;
    scoreScreen.innerHTML = score;
    if (!isCounting) return;
    await delay(1000);
  }
}

// obstacles
async function obstacles(currentSession) {
  while (isCounting) {
    let obstacleUp = document.createElement("div");
    let obstacleDown = document.createElement("div");
    let displace = randomDisplace(-120, 120);
    console.log(displace);

    obstacleUp.setAttribute("class", "up obstacle");
    obstacleDown.setAttribute("class", "down obstacle");
    obstacleUp.style.setProperty(
      "animation",
      "obstacleAnimation 4s forwards linear",
    );
    obstacleDown.style.setProperty(
      "animation",
      "obstacleAnimation 4s forwards linear",
    );
    obstacleUp.style.setProperty("transform", `translateY(${displace}px)`);
    obstacleDown.style.setProperty("transform", `translateY(${displace}px)`);
    obstacleContainer.appendChild(obstacleUp);
    obstacleContainer.appendChild(obstacleDown);
    await delay(1500);
    if (gameSessionId !== currentSession) return;
  }
}
function randomDisplace(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// play/replay
async function play() {
  gameSessionId++;
  defaults();
  isCounting = true;
  obstacles(gameSessionId);
  scoreCount();
  bird.style.animation = "none";
  initialMenu.style.display = "none";
  if (!bgmovebool) {
    bgmovebool = true;
    bgmove();
  } else {
    bgmovebool = false;
    await delay(10);
    bgmovebool = true;
    bgmove();
  }
  freefall();
  window.addEventListener("keydown", keyboardEvent);
  display.addEventListener("click", touchEvent);
}

//gameover
function gameover() {
  overSound.currentTime = 0;
  overSound.volume = 0.3;
  overSound.play();
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }
  initialMenu.style.display = "flex";
  playbtn.innerHTML = "Replay";
  menuHeading.innerHTML = `Game Over <br> <p>Your Score is: ${score}<p/><p>High Score: ${highScore}<p/>`;
  document.querySelector("#homebtn").style.display = "block";
  menuHeading.style.setProperty("font-size", "6rem");
  bgmovebool = false;
  isCounting = false;
  obstacleContainer.innerHTML = "";
  const obstacles = document.querySelectorAll(".obstacle");
  obstacles.forEach((e) => {
    e.style.animation = " none";
  });
  display.removeEventListener("click", touchEvent);
  window.removeEventListener("keydown", keyboardEvent);
}

// touhing or overlapping of elements
function elementsOverlap(element1, element2) {
  const rect1 = element1.getBoundingClientRect();
  const rect2 = element2.getBoundingClientRect();
  return !(
    rect1.right - 20 < rect2.left ||
    rect1.left + 20 > rect2.right ||
    rect1.bottom - 20 < rect2.top ||
    rect1.top + 20 > rect2.bottom
  );
}

// Events
playbtn.addEventListener("click", play);

function keyboardEvent(event) {
  if (event.key === " " || event.key === "ArrowUp") {
    event.preventDefault();

    if (isFallingLoopRunning) {
      freefall();
    }
  }
}

function touchEvent() {
  if (isFallingLoopRunning) {
    freefall();
  }
}
