const DEFAULT_SCREEN_SECONDS = 10;

onload = () => {
  let screens: Element[] = extract(document.getElementsByClassName("screen"));
  let currentIndex = -1;
  let currentScreen: Element;
  let timeout: number;
  let req: HTMLImageElement;
  let showMatch = document.location.search.match(/show=([\w,]+)/);
  let show = (showMatch ? showMatch[1] : "video,text,logo").split(",");

  let videoSpeedMatch = document.location.search.match(/videoSpeed=([^&]+)/) || [];
  let videoSpeed = parseFloat(videoSpeedMatch[1]) || 1;

  showNextScreen();


  if (/large/i.test(document.location.search)) {
    document.body.classList.add("large");
  }

  document.addEventListener("keydown", e => {
    if (e.keyCode === 39) {
      showNextScreen();
    }
  });

  for (let screen of screens) {
    screen.classList.add("animated");
  }

  for (let video of extract(document.getElementsByTagName("video"))) {
    video.onended = () => {
      video.style.visibility = "hidden";
    };
    video.playbackRate = videoSpeed;
  }

  function showNextScreen() {
    clearTimeout(timeout);
    currentIndex++;
    for (let i = 0; i < screens.length; i++) {
      let proposed = (currentIndex + i) % screens.length;
      if (shouldShowScreen(screens[proposed])) {
        currentIndex = proposed;
        currentScreen = screens[currentIndex];
        break;
      }
    }
    for (let screen of screens) {
      if (screen === currentScreen) {
        screen.classList.add("current");
        let seconds = parseFloat(screen.getAttribute("data-seconds")) || DEFAULT_SCREEN_SECONDS;
        timeout = setTimeout(showNextScreen, seconds * 1000 / videoSpeed);
        for (let video of extract(screen.getElementsByTagName("video"))) {
          video.currentTime = 0;
          video.play();
          video.style.visibility = "";
        }
        let url = `http://localhost:12083/?status=screen${currentIndex}&errors=&cachebuster=${Math.round(Math.random() * 999999)}`;
        req = new Image();
        req.src = url;
        console.log("Sent heartbeat to " + url);
      } else {
        screen.classList.remove("current");
      }
    }
  }

  function shouldShowScreen(screen: Element): boolean {
    if (screen.getElementsByTagName("video").length > 0) {
      return show.indexOf("video") !== -1;
    }
    if (screen.classList.contains("logo")) {
      return show.indexOf("logo") !== -1;
    }
    return show.indexOf("text") !== -1;
  }
};

function extract<T extends Node>(nodeList: NodeListOf<T>): T[] {
  return Array.prototype.slice.call(nodeList);
}