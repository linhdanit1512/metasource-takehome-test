const svg = {
  pause: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-fill" viewBox="0 0 16 16"><path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/></svg>`,
  play: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" /></svg>`,
  sound: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="16" fill="currentColor" class="bi bi-volume-down-fill" viewBox="0 0 16 16"><path d="M9 4a.5.5 0 0 0-.812-.39L5.825 5.5H3.5A.5.5 0 0 0 3 6v4a.5.5 0 0 0 .5.5h2.325l2.363 1.89A.5.5 0 0 0 9 12V4zm3.025 4a4.486 4.486 0 0 1-1.318 3.182L10 10.475A3.489 3.489 0 0 0 11.025 8 3.49 3.49 0 0 0 10 5.525l.707-.707A4.486 4.486 0 0 1 12.025 8z"/></svg>`,
  mute: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="16" fill="currentColor" class="bi bi-volume-mute-fill" viewBox="0 0 16 16"><path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"/></svg>`,
  fullscreen: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M5,5H10V7H7V10H5V5M14,5H19V10H17V7H14V5M17,14H19V19H14V17H17V14M10,17V19H5V14H7V17H10Z" /></svg>`,
  closeFullscreen: `<svg style = "width: 30px; height: 30px" viewBox = "0 0 24 24"><path fill = "currentColor" d = "M14,14H19V16H16V19H14V14M5,14H10V19H8V16H5V14M8,5H10V10H5V8H8V5M19,8V10H14V5H16V8H19Z" /></svg>`
}

const ScreenBreakPoint = {
  xs: 416,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
}

function VideoPlayer() {
  let mediaId = 'your-video'
  let options = {
    defaultVideo: 'video-example-3.mp4',
    defaultThumbnail: 'thumb1.png',
    defaultTitle: 'Take-Home Test for Frontend Developers',
    isFullScreen: false,
    isAddThumbnail: false,
    mediaId: mediaId,
    queryId: '#' + mediaId,
    query: {
      videoElem: `#${mediaId} video`,
      containerElem: `#${mediaId} .group-media-container`,
      controlElem: `#${mediaId} .group-media__control`,
      thumbnailContainer: `#${mediaId} .group-media__thumbnails`,
    },
    hidePlayerDuration: 10000,
    redDotTime: 4, //second
    thumbnailDisplayDuration: 60, // second
    buttonPlayCenterDisplayDuration: 500, // 500ms
  }

  const mediaContainer = document.getElementById(options.mediaId),
    videoElem = document.querySelector(options.query.videoElem),
    containerElem = document.querySelector(options.query.containerElem),
    controlElem = document.querySelector(options.query.controlElem),
    thumbnailContainer = document.querySelector(options.query.thumbnailContainer)
  let _self = this, _intervalCount = 0, _volume = 1, _savedElem = {}, _selectedImage, _selectedVideo;

  this.mediaContainer = mediaContainer

  this.init = async function () {
    await this.bindElem()
    this.bindEvent()
  }

  this.bindElem = function () {
    videoElem.setAttribute('src', options.defaultVideo)
    document.querySelector(options.queryId + ' .video-title').innerHTML = options.defaultTitle
    document.title = options.defaultTitle
  }

  this.bindEvent = function () {
    if (!(videoElem instanceof HTMLVideoElement)) return
    _bindVideoEvent()
    _bindControlEvent()
    _bindInputEvent()
  }

  this.resetVideo = function () {
    _setPause(true)
    _removeAllThumbnail();
    _setTimer()
    _addRedDot()
    _setSound()
    _intervalCount = 0
    options.isAddThumbnail = false
  }

  this.handleResize = function () {
    _setTimer();
    _addRedDot();
  }

  function _bindVideoEvent() {
    // Update seekbar timer & current time
    videoElem.addEventListener('timeupdate', function (e) {
      _setTimer()
      if (videoElem.currentTime >= options.redDotTime
        && videoElem.currentTime < options.redDotTime + options.thumbnailDisplayDuration
        && !options.isAddThumbnail) {

        options.isAddThumbnail = true
        _addThumbnail({ elemId: 'thumbnail-test', thumbnail: _selectedImage || options.defaultThumbnail })
      } else if ((videoElem.currentTime < options.redDotTime
        || videoElem.currentTime > options.redDotTime + options.thumbnailDisplayDuration) && options.isAddThumbnail) {
        options.isAddThumbnail = false
        _removeAllThumbnail()
      }
    })

    // Update duration time
    videoElem.addEventListener('durationchange', function (e) {
      _self.resetVideo()
    })

    // Play/Pause video
    videoElem.addEventListener('click', function () {
      _setPause(!videoElem.paused, true)
    })

    // Show controls, title, shadow
    let controlDuration = null
    mediaContainer.addEventListener('mousemove', function () {
      _showControl(true)
      // if (controlDuration) {
      //   clearTimeout(controlDuration)
      // }
      // controlDuration = setTimeout(function () {
      //   _showControl(false)
      // }, options.hidePlayerDuration)
    })

  }

  function _bindControlEvent() {
    // Play/Pause video by button control
    document.querySelector(options.queryId + ' .svg-icon--pause').addEventListener('click', function () {
      _setPause(!videoElem.paused, true)
    })

    // Show fullscreen
    document.querySelector(options.queryId + ' .svg-icon--fullscreen').addEventListener('click', function () {
      _setFullscreen(!options.isFullScreen)
    })

    document.querySelector(options.queryId + ' .svg-icon--volume .icon').addEventListener('click', function () {
      videoElem.muted = !videoElem.muted
      _setSound(videoElem.muted ? 0 : _volume)
    })

    document.querySelector(options.queryId + ' input[name="volume"]').addEventListener('input', function () {
      _setSound(this.value)
    })

    let _timerChangeObj = [
      options.queryId + ' .group-media__control-seekbar',
      options.queryId + ' .group-media__control-timer',
      options.queryId + ' .group-media__control-timer-loaded'
    ]
    let _dragSeekbar = false, _videoRunning = false;
    _timerChangeObj.forEach((elem) => {

      let element = document.querySelector(elem)

      // Change video timer
      element.addEventListener('click', function (e) {
        let width = e.layerX,
          seekbarWidth = _getSeekbarWidth(),
          duration = videoElem.duration;

        let currentTime = width / seekbarWidth * duration;
        videoElem.currentTime = currentTime
      })

      // Show tooltip timer
      element.addEventListener('mousemove', function (e) {

        let width = e.layerX,
          seekbarWidth = _getSeekbarWidth(),
          duration = videoElem.duration;

        tooltipTime = width / seekbarWidth * duration;

        let tooltip = document.querySelector(options.queryId + ' .group-media__control .video-timer-tooltip');
        if (!tooltip) {
          tooltip = document.createElement('span')
          controlElem.append(tooltip)
        }
        tooltip.innerText = _formatTime(tooltipTime, true)
        tooltip.classList.add('video-timer-tooltip')
        tooltip.style.display = 'block';
        tooltip.style.left = (width - 15) + 'px'
      })

      element.addEventListener('mouseleave', function () {
        document.querySelector(options.queryId + ' .group-media__control .video-timer-tooltip').style.display = 'none'
      })
    })

    document.addEventListener('mousedown', function (e) {
      if (e.target.className.toString().includes('group-media__control-seekbar') || e.target.className.toString().includes('group-media__control-timer')) {
        _dragSeekbar = true
      }
    })

    document.addEventListener('mouseup', function (e) {
      if (_dragSeekbar) {
        _dragSeekbar = false
        if (_videoRunning) {
          videoElem.play()
          _videoRunning = false
        }
      }
    })

    document.addEventListener('mousemove', function (e) {
      if (_dragSeekbar) {
        // Event for tooltip
        let width = e.layerX,
          seekbarWidth = _getSeekbarWidth(),
          duration = videoElem.duration;

        tooltipTime = width / seekbarWidth * duration;

        // Event for seekbar change time
        if (_dragSeekbar == true) {
          if (!_videoRunning) {
            _videoRunning = !videoElem.paused
          }

          videoElem.currentTime = tooltipTime
        }
      }
    })

    // mediaContainer.removeEventListener('mouseleave', function () {
    //   _showControl(false)
    // }, true)
  }

  function _bindInputEvent() {
    // Form
    // Change Video title
    document.querySelector('input[name="video-title"]').addEventListener('input', function (e) {
      let val = e.target.value
      document.querySelector(options.queryId + ' .video-title').innerHTML = val
      document.title = val || options.defaultTitle
    })


    // Change thumbnail for video
    document.querySelector('input[name="thumbnail"]').addEventListener('change', function (e) {
      if (e.target.files && e.target.files[0]) {
        _selectedImage = URL.createObjectURL(e.target.files[0])

        if (options.isAddThumbnail) { // Thumbnail's showing
          _removeAllThumbnail()
          _addThumbnail({ thumbnail: _selectedImage })
        }


      }
    })

    document.querySelector('input[name="video"]').addEventListener('change', function (e) {
      if (e.target?.files && e.target.files[0]) {

        let videoCheck = document.createElement('video');
        videoCheck.preload = 'metadata';

        videoCheck.onloadedmetadata = function () {

          window.URL.revokeObjectURL(videoCheck.src);

          if (videoCheck.duration < 4) {
            alert("Invalid Video! video is less than 4 seconds");
            return;
          } else if (videoCheck.duration > 180) {
            alert("Invalid Video! video is less more than 3 minutes");
          } else {
            _selectedVideo = URL.createObjectURL(e.target.files[0])
            videoElem.setAttribute('src', _selectedVideo)
            videoElem.pause()
          }
        }

        videoCheck.src = URL.createObjectURL(e.target.files[0]);
      }
    })

    document.querySelector('input[name="show_at"]').addEventListener('change', function (e) {
      options.redDotTime = this.value
      _addRedDot(this.value)

      if (this.value > videoElem.currentTime) {
        options.isAddThumbnail = false;
        _removeAllThumbnail()
      }
    })

    document.querySelector('input[name="duration_show"]').addEventListener('change', function (e) {
      let val = parseFloat(this.value)

      if (videoElem.currentTime > options.redDotTime) {
        // new value will extend show
        if (_intervalCount < val) {
          // thumbnail is showing (Object.keys(_savedElem).length > 0)=> ignore 
          // thumbnail was hidden => add thumbnail
          if (Object.keys(_savedElem).length == 0) {
            _addThumbnail({ elemId: 'thumbnail-extended', thumbnail: _selectedImage || options.defaultThumbnail })
          }
        } else if (_intervalCount >= val) {
          _removeAllThumbnail()
        }
      }
      options.thumbnailDisplayDuration = val;
    })
  }

  function _addRedDot() {
    // Create indicator red dot
    document.querySelector(options.queryId + ' .group-media__control .group-media__control-indicator')?.remove()

    let indicator = document.createElement('span');
    let offsetLeft = options.redDotTime / videoElem.duration * _getSeekbarWidth() - 4; // red-dot css has width = 8px
    indicator.style.left = offsetLeft + 'px'
    indicator.classList.add('group-media__control-indicator');
    controlElem.prepend(indicator)
  }

  function _addThumbnail({ elemId, thumbnail }) {
    if (!elemId) elemId = 'img__' + (Math.random().toString().replace('.', ''));
    if (!thumbnail || typeof thumbnail != 'string') thumbnail = options.defaultThumbnail;
    _savedElem[elemId] = thumbnail


    //Insert thumbnail to video
    let thumbnailsContainer = document.querySelector(options.queryId + ' .group-media__thumbnails')
    if (!thumbnailsContainer) {
      thumbnailsContainer = document.createElement('div')
      temp.classList.add('group-media__thumbnails')
      containerElem.prepend(temp)
    }

    let thumbnailElem = document.createElement('div')
    thumbnailElem.id = elemId
    thumbnailElem.classList.add('thumbnail-item')
    thumbnailElem.innerHTML = `<img src="${thumbnail}">`

    document.querySelector(options.queryId + ' .group-media__thumbnails').append(thumbnailElem)
  }

  function _showControl(val) {
    let elems = [
      options.queryId + ' .video-title',
      options.queryId + ' .group-media__control',
      options.queryId + ' .group-media-shadow--bottom',
      options.queryId + ' .group-media-shadow--top'
    ]
    if (val) {
      elems.forEach(elem => {
        document.querySelector(elem).classList.add('show')
      })

    } else {
      elems.forEach(elem => {
        document.querySelector(elem).classList.remove('show')
      })
    }

  }

  function _setTimer() {
    let current = videoElem.currentTime,
      duration = videoElem.duration,
      width = _getSeekbarWidth(),
      currentWidth = current / duration * width + 'px';

    document.querySelector(options.queryId + ' .group-media__control-timer').style.width = currentWidth
    document.querySelector(options.queryId + ' .video-timer__video-length').innerHTML = _formatTime(duration)
    document.querySelector(options.queryId + ' .video-timer__current').innerHTML = _formatTime(current)
    if (current != 0) {
      document.querySelector(options.queryId + ' .group-media__control-timer').classList.add('run')
    }
  }

  function _setSound(val) {
    if (val == undefined) {
      val = videoElem.volume * 10
    }
    if (val > 10) val = 10

    _volume = val;
    if (val < 1) {
      videoElem.volume = 0;
      videoElem.muted = true
      document.querySelector(options.queryId + ' .svg-icon--volume .icon').innerHTML = svg.mute

    } else {
      videoElem.volume = Math.round(val) / 10
      videoElem.muted = false
      document.querySelector(options.queryId + ' .svg-icon--volume .icon').innerHTML = svg.sound
    }
  }

  function _setPause(val, videoControl) {
    videoElem.paused = !videoElem.paused

    if (val) {
      if (videoControl) {
        videoElem.pause()

        let button = document.createElement('button')
        button.className += 'video-center-pause pause'
        button.innerHTML = svg.play
        containerElem.append(button)

        setTimeout(function () {
          button.remove()

        }, options.buttonPlayCenterDisplayDuration)
      }
      document.querySelector(options.queryId + ' .svg-icon--pause').innerHTML = svg.play

    } else {
      if (videoControl) {
        videoElem.play()
        let button = document.createElement('button')
        button.className += 'video-center-pause pause'
        button.innerHTML = svg.pause
        containerElem.append(button)

        setTimeout(function () {
          button.remove()
        }, options.buttonPlayCenterDisplayDuration)
      }
      document.querySelector(options.queryId + ' .svg-icon--pause').innerHTML = svg.pause
    }
  }

  function _setFullscreen(val = false) {
    options.isFullScreen = val;
    let videoFrame = mediaContainer
    if (val) {
      if (videoFrame.requestFullscreen) {
        videoFrame.requestFullscreen();
      } else if (videoFrame.webkitRequestFullscreen) { /* Safari */
        videoFrame.webkitRequestFullscreen();
      } else if (videoFrame.msRequestFullscreen) { /* IE11 */
        videoFrame.msRequestFullscreen();
      }

      document.querySelector(options.queryId + ' .svg-icon--fullscreen').innerHTML = svg.closeFullscreen

      if (window.innerWidth < ScreenBreakPoint.md) {
        screen.orientation.lock("landscape");
      }

    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
      }

      document.querySelector(options.queryId + ' .svg-icon--fullscreen').innerHTML = svg.fullscreen

      if (window.innerWidth < ScreenBreakPoint.md) {
        screen.orientation.lock("portrait");
      }

    }
  }

  function _removeThumbnail(elemId) {
    if (!elemId) return
    document.getElementById(elemId)?.remove()
    if (_savedElem[elemId]?.timeout) {
      clearInterval(_savedElem[elemId].timeout)
      delete _savedElem[elemId]
    }
  }

  function _removeAllThumbnail() {
    for (elemId in _savedElem) {
      _removeThumbnail(elemId)
      thumbnailContainer.innerHTML = ''
    }
  }

  function _getSeekbarWidth() {
    let videoPadding = parseFloat(document.querySelector('#your-video')
      .computedStyleMap()
      .getAll('padding')
      .toString()
      .replace(/px/, ''))
    return videoElem.offsetWidth - videoPadding
  }

  function _formatTime(time) {
    let result = []
    let min = 0, sec = 0;

    if (time / 60 >= 1) {
      min = Math.floor(time / 60)
      time = time % 60
    }

    sec = Math.round(time);

    if (min > 9) result.push(min); else result.push('0' + min)
    if (sec > 9) result.push(sec); else result.push('0' + sec)

    return result.join(':')
  }

  return this
}


let videoPlayer = new VideoPlayer()
window.addEventListener('DOMContentLoaded', function () {
  videoPlayer.init()
})

window.addEventListener('resize', function () {
  videoPlayer.handleResize()
})
