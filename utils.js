const logger = {
  info: (label, message) => console.log(
    `%c ${label} %c ${message}`,
    `background-color: blue; color: #FFFFFF`,
    `background-color: inherit; color: inherit`
  ),
  success: (label, message) => console.log(
    `%c ${label} %c ${message}`,
    `background-color: green; color: #FFFFFF`,
    `background-color: inherit; color: inherit`
  ),
  warn: (label, message) => console.warn(
    `%c ${label} %c ${message}`,
    `background-color: orange; color: #FFFFFF`,
    `background-color: inherit; color: inherit`
  ),
  error: (label, message) => console.error(
    `%c ${label} %c ${message}`,
    `background-color: red; color: #FFFFFF`,
    `background-color: inherit; color: inherit`
  )
};

const getVideoElement = () => document.getElementById('video');
const getProgressElement = () => document.getElementById('progress');
const getPlaybackElement = () => document.getElementById('playback');
const getSeekableElement = () => document.getElementById('seekable');
const getGrabbersElement = () => document.getElementById('grabbers');
const getFooterElement = () => document.getElementById('footer');
const getTimeInfoElement = () => document.getElementById('timeInfo');
const getSnapshotsElement = () => document.getElementById('snapshots');
const getTimelineInfoElement = () => document.getElementById('timelineInfo');

const secondsToHours = (seconds) => seconds / 3600;
const secondsToMinutes = (seconds) => seconds / 60;
