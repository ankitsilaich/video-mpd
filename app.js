const slots = page1.RESPONSE.slots.concat(
  page2.RESPONSE.slots,
  page3.RESPONSE.slots,
  page4.RESPONSE.slots,
  page5.RESPONSE.slots,
  page6.RESPONSE.slots
);

const getImageUrl = (originalUrl, width = '100', height = '100', quality = '80', enableDpr = true) => {
	const devicePixelRatio = (typeof window !== 'undefined' && window.devicePixelRatio) || 1;

	width = enableDpr ? Math.round(devicePixelRatio * width) : Math.round(width);
	height = enableDpr ? Math.round(devicePixelRatio * height) : Math.round(height);

	return originalUrl && originalUrl.replace('http://rukmini1', 'https://rukminim1').replace('{@width}', width).replace('{@height}', height).replace('{@quality}', quality);
};

(function () {
  let muted = true;
  var player = null;

  const getVideoTag = (index) => {
    const videoElement = document.createElement("video");
    videoElement.className = "video-js";
    videoElement.controls = false;
    videoElement.id = `video-${index}`;
    const source = document.createElement("source");
    const videosArr =
      slots[index].widget.data.contentDetailsComponent.value.videoInfo;
    const supportedVideo = videosArr.find((video) =>
      video.mediaUrl.endsWith(".mpd")
    ) || { mediaUrl: "" };
    const posterUrl = slots[index].widget.data.contentDetailsComponent.value.thumbnailImage.dynamicImageUrl;
    //source.src = supportedVideo.mediaUrl;
	  source.src = 'https://www.bok.net/dash/tears_of_steel/cleartext/stream.mpd';
    source.type = "application/dash+xml";
    videoElement.autoplay = false;
    videoElement.preload = true;
    videoElement.muted = true;
    videoElement.width = window.innerWidth;
    videoElement.height = window.innerHeight;
    videoElement.poster = getImageUrl(posterUrl, 100, 100, 100)
    videoElement.appendChild(source);
    return videoElement;
  }
  const getSlide = (index) => {
    const container = document.createElement("div");
    container.className = "swiper-slide";
    container.id = `slide-${index}`;
    const videoElement = getVideoTag(index);
    container.appendChild(videoElement);
    return container;
  };

  const mySwiper = new Swiper(".swiper-container", {
    // Optional parameters
    direction: "vertical",
    loop: false,
    slidesPerView: 1,
    virtual: {
      addSlidesBefore: 2,
      addSlidesAfter: 2,
      slides: (function () {
        const slides = [];
        for (var i = 0; i < 600; i += 1) {
          slides.push(i);
        }
        return slides;
      })(),
      cache: false,
      renderSlide: function (slide, index) {
        return getSlide(index);
      },
    },
  });

  const mute = document.getElementById("mute");
  const muteButton = document.getElementById("muted");
  const unmuteButton = document.getElementById("unmuted");
  muteButton.style.display = "none";
  
  mute.addEventListener("click", () => {
    muted = !muted;
    if (muted) {
      muteButton.style.display = "none";
      unmuteButton.style.display = "block";
    } else {
      unmuteButton.style.display = "none";
      muteButton.style.display = "block";
    }
    const currentVideo = document.getElementById(`video-${mySwiper.activeIndex}`);
    currentVideo.children[0].muted = muted;
  });

  player = videojs('video-0', {
    width: window.innerWidth,
    height: window.innerHeight,
    controls: false,
    preload: false,
    // autoplay: true,
    muted: muted,
  });


  mySwiper.on("transitionEnd", () => {
    const currenVideoId = `video-${mySwiper.activeIndex}`;
    const nextVideoId = `video-${mySwiper.activeIndex + 1}`;
    const prevVideoId = `video-${mySwiper.activeIndex - 1}`;
    player = videojs(currenVideoId, {
      width: window.innerWidth,
      height: window.innerHeight,
      preload: false,
      autoplay: true,
      muted,
    });

    if(videojs.players[prevVideoId]) {
        videojs(prevVideoId).dispose();
        const prevSlide = document.getElementById(`slide-${mySwiper.activeIndex - 1}`);
        prevSlide.appendChild(getVideoTag(mySwiper.activeIndex - 1));
    }
    if(videojs.players[nextVideoId]) {
        videojs(nextVideoId).dispose();
        const prevSlide = document.getElementById(`slide-${mySwiper.activeIndex + 1}`);
        prevSlide.appendChild(getVideoTag(mySwiper.activeIndex + 1));
    }
    player.play();
  });

  mySwiper.on("tap", () => {
    if(player.paused()) {
        player.play();
    } else {
        player.pause();
    }
  });
})();
