var xterm = new Terminal();
xterm.open(document.body);
xterm.fit();

var cols = xterm.cols - 4;
var rightW = cols < 70 ? 1 : Math.floor(cols / 4);
var leftW = cols - rightW - 3;
var lines = xterm.lines.length - 4;
var footerMessages = [
  'ダンガンロンパのＥＤ 絶望性:ヒーロー治療薬',
  'midi: artarity - https://youtu.be/3XTMzK4SVaI',
  'music synth: webaudio',
  'terminal: xterm',
  'lyrics: animelyrics.com',
  'font: noto sans mono japanese',
  'inspiration: valve\'s portal',
  'blog: https://qgustavor.tk',
  'contact: メール@グスタボ.tk'
];

setTimeout(function loop (i) {
  xterm.write(
    '\x1b[s\u001b[' + (lines + 1) + ';4H\x1b[30m' +
    footerMessages[i].substr(0, leftW - 2) + ' '.repeat(Math.max(0, leftW - footerMessages[i].length - 2)) +
    '\x1b[u\x1b[33m'
  );
  setTimeout(loop, 5e3, (i + 1) % footerMessages.length);
}, 1000, 0);

function createFrame() {
  xterm.write(' /' + '-'.repeat(leftW) + '-' + '-'.repeat(rightW) + '\\\r\n');
  for (var i = 0; i < lines; i++) {
    xterm.write(' |' + ' '.repeat(leftW) + '|' + ' '.repeat(rightW) + '|\r\n');
  }
  xterm.write(' \\' + '-'.repeat(leftW) + '-' + '-'.repeat(rightW) + '/\r\n');
}

function clearLyrics() {
  xterm.write('\x1b[33m\x1b[2j\x1b[0;0f');
  createFrame();
  lyricsPosition = 2;
}

var lyricsPosition = 2;
var queue = [];

clearLyrics();

window.showLyricsLine = function showLyricsLine(line) {
  queue.unshift(line.substr(0, leftW));
  if (queue.length > 1) {
    return;
  }
  xterm.write('\u001b[' + lyricsPosition++ + ';4H');(function loop(i) {
    if (i < line.length) {
      setTimeout(loop, line.length - i, i + 1);
      xterm.cursorHidden = false;
    } else {
      queue.pop();
      if (queue.length) {
        showLyricsLine(queue.pop());
      } else {
        xterm.cursorHidden = true;
      }
    }
    xterm.write(line.charAt(i));
  })(0);
};

window.renderNote = function renderNote(note, on) {
  var strChar = on ? note % 2 ? '=' : '-' : ' ';
  xterm.write('\x1b[s');
  xterm.write('\u001b[' + (Math.floor((note - 22) * (lines / 72)) + 2) + ';' + (leftW + 4) + 'H' + strChar.repeat(rightW));
  xterm.write('\x1b[u');
};