let selectedFile = {};

const showSelectedFiles = (files) => {
  logger.info('[menu]', `File Count: ${files.length}`);
  
  selectedFile = files[0];

  for (let i = 0; i < files.length; i++) {
    logger.info('[menu]', `File ${i}: (${typeof files[i]}) : <${files[i]}> ${files[i].name} ${files[i].size}`);
  }
};

const playFile = (file) => {
  const player = getVideoElement();
  const fileUrl = URL.createObjectURL(file);

  player.src = fileUrl;
  player.play();
};

const onSelectFile = (event) => {
  event.stopPropagation();
  event.preventDefault();

  const files = event.target.files;
  showSelectedFiles(files);
  playFile(files[0]);
};

const onDrop = (event) => {
  event.stopPropagation();
  event.preventDefault();

  const dt = event.dataTransfer;
  const files = dt.files;
  showSelectedFiles(files);
  playFile(files[0]);
};

const onClick = () => {
  document.getElementById('file').click();
};

const onDragEnter = (event) => {
  document.getElementById('output').textContent = '';
  event.stopPropagation();
  event.preventDefault();
};

const onDragOver = (event) => {
  event.stopPropagation();
  event.preventDefault();
};
