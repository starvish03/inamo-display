var DEFAULT_SCREEN_SECONDS = 10;
onload = function () {
    var screens = extract(document.getElementsByClassName("screen"));
    var currentIndex = -1;
    var currentScreen;
    var timeout;
    var req;
    var showMatch = document.location.search.match(/show=([\w,]+)/);
    var show = (showMatch ? showMatch[1] : "video,text,logo").split(",");
    var videoSpeedMatch = document.location.search.match(/videoSpeed=([^&]+)/) || [];
    var videoSpeed = parseFloat(videoSpeedMatch[1]) || 1;
    showNextScreen();
    if (/large/i.test(document.location.search)) {
        document.body.classList.add("large");
    }
    document.addEventListener("keydown", function (e) {
        if (e.keyCode === 39) {
            showNextScreen();
        }
    });
    for (var _i = 0, screens_1 = screens; _i < screens_1.length; _i++) {
        var screen_1 = screens_1[_i];
        screen_1.classList.add("animated");
    }
    var _loop_1 = function(video) {
        video.onended = function () {
            video.style.visibility = "hidden";
        };
        video.playbackRate = videoSpeed;
    };
    for (var _a = 0, _b = extract(document.getElementsByTagName("video")); _a < _b.length; _a++) {
        var video = _b[_a];
        _loop_1(video);
    }
    function showNextScreen() {
        clearTimeout(timeout);
        currentIndex++;
        for (var i = 0; i < screens.length; i++) {
            var proposed = (currentIndex + i) % screens.length;
            if (shouldShowScreen(screens[proposed])) {
                currentIndex = proposed;
                currentScreen = screens[currentIndex];
                break;
            }
        }
        for (var _i = 0, screens_2 = screens; _i < screens_2.length; _i++) {
            var screen_2 = screens_2[_i];
            if (screen_2 === currentScreen) {
                screen_2.classList.add("current");
                var seconds = parseFloat(screen_2.getAttribute("data-seconds")) || DEFAULT_SCREEN_SECONDS;
                timeout = setTimeout(showNextScreen, seconds * 1000 / videoSpeed);
                for (var _a = 0, _b = extract(screen_2.getElementsByTagName("video")); _a < _b.length; _a++) {
                    var video = _b[_a];
                    video.currentTime = 0;
                    video.play();
                    video.style.visibility = "";
                }
                var url = "http://localhost:12083/?status=screen" + currentIndex + "&errors=&cachebuster=" + Math.round(Math.random() * 999999);
                req = new Image();
                req.src = url;
                console.log("Sent heartbeat to " + url);
            }
            else {
                screen_2.classList.remove("current");
            }
        }
    }
    function shouldShowScreen(screen) {
        if (screen.getElementsByTagName("video").length > 0) {
            return show.indexOf("video") !== -1;
        }
        if (screen.classList.contains("logo")) {
            return show.indexOf("logo") !== -1;
        }
        return show.indexOf("text") !== -1;
    }
};
function extract(nodeList) {
    return Array.prototype.slice.call(nodeList);
}
