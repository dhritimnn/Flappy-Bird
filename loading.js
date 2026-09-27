const loaderScreen = document.querySelector("#loader-screen");

function preloadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve();
    img.onerror = () => reject(`Failed to load image: ${url}`);
  });
}

function preloadAudio(audioObject) {
  return new Promise((resolve) => {
    audioObject.addEventListener("canplaythrough", () => resolve(), {
      once: true,
    });

    if (audioObject.readyState >= 4) resolve();
  });
}
{
  const jumpSound = new Audio("sounds/jump.mp3");
  const overSound = new Audio("sounds/over.mp3");
  Promise.all([
    preloadImage("imgs/background.png"),
    preloadAudio(jumpSound),
    preloadAudio(overSound),
  ])
    .then(() => {
      loaderScreen.style.opacity = "0";
      setTimeout(() => {
        loaderScreen.style.display = "none";
      }, 400);
    })
    .catch((error) => {
      console.error("Asset Preloading Failed:", error);
      loaderScreen.style.display = "none";
    });
}
