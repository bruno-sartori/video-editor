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
const getChaptersElement = () => document.getElementById('chapters');

const secondsToHours = (seconds) => seconds / 3600;
const secondsToMinutes = (seconds) => seconds / 60;


const isFloat = (n) => {
  return Number(n) === n && n % 1 !== 0;
}

const floatToHHMM = (number) => {
  let sign = (number >= 0) ? 1 : -1;
  number = number * sign;

  const hour = Math.floor(number);
  let decpart = number - hour;
  const min = 1 / 60;
  decpart = min * Math.round(decpart / min);
  let minute = Math.floor(decpart * 60) + '';

  if (minute.length < 2) {
    minute = '0' + minute;
  }
  sign = sign == 1 ? '' : '-';
  time = sign + hour + ':' + minute;

  return time;
}

const floatToMMSS = (number) => {
  let sign = (number >= 0) ? 1 : -1;
  number = number * sign;

  let minute = Math.floor(number);
  decpart = number - minute;
  const sec = 1 / 60;
  decpart = sec * Math.floor(decpart / sec);
  let second = Math.floor(decpart * 60) + '';

  if (minute.length < 2) {
    minute = '0' + minute;
  }

  if (second.length < 2) {
    second = '0' + second;
  }

  sign = sign == 1 ? '' : '-';
  time = sign + minute + ':' + second;

  return time;
}

