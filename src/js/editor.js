let timings = [];
let currentlyGrabbed = { index: 0, type: 'none' };
let ranges = [];

const updateProgress = (event) => {
  const videoElement = getVideoElement();
  const progressElement = getProgressElement();
  const playbackRect = getSeekableElement().getBoundingClientRect()

  let seekTime = ((event.clientX - playbackRect.left) / playbackRect.width) * videoElement.duration
  videoElement.pause()
  // find where seekTime is in the segment
  let index = -1
  let counter = 0
  for (let times of timings) {
    if (seekTime >= times.start && seekTime <= times.end) {
      index = counter
    }
    counter += 1
  }
  if (index === -1) {
    return
  }

  currentlyGrabbed = { 'index': index, 'type': 'start' }
  progressElement.style.width = '0%' // Since the width is set later, this is necessary to hide weird UI
  progressElement.style.left = `${timings[index].start / videoElement.duration * 100}%`
  videoElement.currentTime = seekTime
};

const handleMouseMoveWhenGrabbed = (event) => {
  const videoElement = getVideoElement();
  const playbackRect = getSeekableElement().getBoundingClientRect();
  const progressElement = getProgressElement();
  const difference = 0.2;

  videoElement.pause()
  addActiveSegments();
  let seekRatio = (event.clientX - playbackRect.left) / playbackRect.width
  const index = currentlyGrabbed.index
  const type = currentlyGrabbed.type
  let time = timings
  let seek = videoElement.duration * seekRatio

  if ((type === 'start') && (seek > ((index !== 0) ? (time[index - 1].end + difference + 0.2) : 0)) && seek < time[index].end - difference) {
    progressElement.style.left = `${seekRatio * 100}%`
    videoElement.currentTime = seek
    time[index]['start'] = seek
    timings = time;
    const grabberStart = document.getElementById(`grabberStart${index}`);
    grabberStart.style.left = `${seekRatio * 100}%`;
  } else if ((type === 'end')  && (seek > time[index].start + difference) && (seek < (index !== (timings.length - 1) ? time[index].start - difference - 0.2 : videoElement.duration))) {
    progressElement.style.left = `${seekRatio * 100}%`
    time[index]['end'] = seek
    timings = time;
    const grabberEnd = document.getElementById(`grabberEnd${index}`);
    grabberEnd.style.left = `${seekRatio * 100}%`;
  }

  progressElement.style.width = '0%';
}

const removePointerMoveEventListener = () => {
  window.removeEventListener('pointermove', handleMouseMoveWhenGrabbed)
};

const removeMouseMoveEventListener = () => {
  window.removeEventListener('mousemove', handleMouseMoveWhenGrabbed)
};

const handleGrabberMouseDown = (event, index, type) => {
  console.log('HANDLE GRABBER MOUSE DOWN', index, type);
  currentlyGrabbed = { 'index': index, type }
  window.addEventListener('mousemove', handleMouseMoveWhenGrabbed)
  window.addEventListener('mouseup', removeMouseMoveEventListener)
};

const handleGrabberPointerDown = (event, index, type) => {
  console.log('HANDLE GRABBER POINTER DOWN', index, type);
  currentlyGrabbed = { 'index': index, type }
  window.addEventListener('pointermove', handleMouseMoveWhenGrabbed)
  window.addEventListener('pointerup', removePointerMoveEventListener)
};

const addGrabbers = () => {
  const grabbersContainer = getGrabbersElement();
  const videoElement = getVideoElement();

  if (timings.length > 0) {
    grabbersContainer.innerHTML = '';

    for (let i = 0; i < timings.length; i++) {
      grabbersContainer.innerHTML += `
        <div id='grabberStart${i}' class='grabber' style="left: ${timings[0].start / videoElement.duration * 100}%"
          onMouseDown="handleGrabberMouseDown(event, ${i}, 'start')"
          onPointerDown="handleGrabberPointerDown(event, ${i}, 'start')"
        >
          <svg version='1.1' xmlns='http://www.w3.org/2000/svg' x='0' y='0' width='10' height='14' viewBox='0 0 10 14' xmlSpace='preserve'>
            <path class='st0' d='M1 14L1 14c-0.6 0-1-0.4-1-1V1c0-0.6 0.4-1 1-1h0c0.6 0 1 0.4 1 1v12C2 13.6 1.6 14 1 14zM5 14L5 14c-0.6 0-1-0.4-1-1V1c0-0.6 0.4-1 1-1h0c0.6 0 1 0.4 1 1v12C6 13.6 5.6 14 5 14zM9 14L9 14c-0.6 0-1-0.4-1-1V1c0-0.6 0.4-1 1-1h0c0.6 0 1 0.4 1 1v12C10 13.6 9.6 14 9 14z'/>
          </svg>
        </div>
        <div id='grabberEnd${i}' class='grabber' style="left: ${timings[0].end / videoElement.duration * 100}%"
          onMouseDown="handleGrabberMouseDown(event, ${i}, 'end')"
          onPointerDown="handleGrabberPointerDown(event, ${i}, 'end')"
        >
          <svg version='1.1' xmlns='http://www.w3.org/2000/svg' x='0' y='0' width='10' height='14' viewBox='0 0 10 14' xmlSpace='preserve'>
            <path class='st0' d='M1 14L1 14c-0.6 0-1-0.4-1-1V1c0-0.6 0.4-1 1-1h0c0.6 0 1 0.4 1 1v12C2 13.6 1.6 14 1 14zM5 14L5 14c-0.6 0-1-0.4-1-1V1c0-0.6 0.4-1 1-1h0c0.6 0 1 0.4 1 1v12C6 13.6 5.6 14 5 14zM9 14L9 14c-0.6 0-1-0.4-1-1V1c0-0.6 0.4-1 1-1h0c0.6 0 1 0.4 1 1v12C10 13.6 9.6 14 9 14z'/>
          </svg>
        </div>
      `;
    }
  }
};

const handleTimeUpdate = () => {
  const video = getVideoElement();
  const progress = getProgressElement();
  const timeInfo = getTimeInfoElement();

  const seek = video.currentTime / video.duration * 100;
  progress.style.width = `${seek}%`;

  timeInfo.innerText = `${video.currentTime} / ${video.duration}`;
};

const handleTogglePlayer = () => {
  const player = getVideoElement();

  if (player.paused) {
    player.play();
  } else {
    player.pause();
  }
};

const addActiveSegments = () => {
  let colors = ''
  let counter = 0;
  const videoElement = getVideoElement();
  colors += `, rgba(240, 240, 240, 0) 0%, rgba(240, 240, 240, 0) ${timings[0].start / videoElement.duration * 100}%`
  for (let times of timings) {
    if (counter > 0) {
      colors += `, rgba(240, 240, 240, 0) ${timings[counter].end / videoElement.duration * 100}%, rgba(240, 240, 240, 0) ${times.start / videoElement.duration * 100}%`
    }
    colors += `, #655dc2 ${times.start / videoElement.duration * 100}%, #655dc2 ${times.end / videoElement.duration * 100}%`
    counter += 1
  }
  colors += `, rgba(240, 240, 240, 0) ${timings[counter - 1].end / videoElement.duration * 100}%, rgba(240, 240, 240, 0) 100%`
  getSeekableElement().style.background = `linear-gradient(to right${colors})`
};

const capture = () => {
  const height = 90;
  const width = Math.round((16 / 9) * height);

  const snapshotsElement = getSnapshotsElement();
  const canvas = document.createElement("canvas");
  const videoElement = getVideoElement();
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d").drawImage(videoElement, 0, 0, width, height);
  snapshotsElement.appendChild(canvas);
};

const createSnapshotList = () => {
  const videoElement = getVideoElement();
  videoElement.addEventListener('seeked', capture);

  const updateTime = () => {
    let i = 1;
    const interval = setInterval(() => {
      video.currentTime = i * 15;
      i++;

      if (i === 16) {
        clearInterval(interval);
      }
    }, [500]);
  };

  updateTime();
};

const fillTimeline = (duration, metric) => {
  const timelineInfo = getTimelineInfoElement();

  const getTimeString = (timeNumber) => {
    switch (metric) {
      case 'hours':
        return floatToHHMM(timeNumber);
      case 'minutes':
        return floatToMMSS(timeNumber);
      default:
        return floatToMMSS(timeNumber);
    }
  };

  if (timelineInfo) {
    for (let i = 0; i <= duration + 0.5; i = i + 0.5) {
      timelineInfo.innerHTML += `
        <div class="timeline__time ${isFloat(i) ? 'timeline__time--half' : ''}">${getTimeString(i)}</div>
      `;
    }
  }
}

const fillVideoInfo = () => {
  const videoElement = getVideoElement();
  const timeInfoElement = getTimeInfoElement();

  timeInfoElement.innerText = `${videoElement.currentTime} / ${videoElement.duration}`;

  const durationHours = secondsToHours(videoElement.duration);
  const durationMinutes = secondsToMinutes(videoElement.duration);

  if (durationHours > 1) {
    fillTimeline(Math.round(durationHours), 'hours');
  } else if (durationHours < 1) {
    fillTimeline(Math.round(durationMinutes), 'minutes');
  }
}

const saveRange = (title) => {
  const chaptersElement = getChaptersElement();
  const videoElement = getVideoElement();

  const times = timings[0];
  ranges.push({ title, range: { ...times } });
  
  const sizeRange = [
    times.start / videoElement.duration * 100,
    times.end / videoElement.duration * 100
  ];

  const range = document.createElement('div');
  range.className = 'chapters__chapter';
  range.innerHTML = title;
  range.style.left = `${sizeRange[0]}%`
  range.style.width = `${sizeRange[1] - sizeRange[0]}%`;

  chaptersElement.append(range);
};

const exportJson = () => {
  const json = {
    fileName: selectedFile.name,
    chapters: ranges,
  };

  logger.success('[editor]', JSON.stringify(json));

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json));
  const name = 'video-chapters.json';

  const anchor = document.createElement('a');
  anchor.href = dataStr;
  anchor.download = name;
  anchor.click();
}

const initEditor = () => {
  logger.info('[editor]', 'Initializing');
  const videoElement = getVideoElement();

  videoElement.onloadedmetadata = () => {
    if (timings.length === 0) {
      timings.push({ 'start': 0, 'end': 120 });
      addGrabbers();
    }

    fillVideoInfo();
    createSnapshotList();
    addActiveSegments();
  }
};
