const levels = [
  {
    name: 'Beginner',
    description: 'Start with 2-3 letter words.',
    words: ['cat', 'dog', 'sun', 'hat', 'pig', 'bat', 'top', 'red', 'run', 'box']
  },
  {
    name: 'Growing',
    description: 'Move to 4-letter words and practice new sounds.',
    words: ['play', 'jump', 'time', 'boat', 'food', 'book', 'rain', 'cold', 'fish', 'bell']
  },
  {
    name: 'More Words',
    description: 'Try longer words and keep building reading confidence.',
    words: ['happy', 'apple', 'house', 'water', 'train', 'smile', 'sleep', 'light', 'bread', 'green']
  }
];

const targetWordEl = document.getElementById('targetWord');
const letterButtonsEl = document.getElementById('letterButtons');
const answerDisplayEl = document.getElementById('answerDisplay');
const messageEl = document.getElementById('message');
const scoreEl = document.getElementById('score');
const levelDescriptionEl = document.getElementById('levelDescription');
const levelButtons = document.querySelectorAll('.level-btn');

let activeLevel = 0;
let currentWord = '';
let currentAnswer = '';
let score = 0;

function shuffle(array) {
  return array.slice().sort(() => Math.random() - 0.5);
}

function setActiveLevel(index) {
  activeLevel = index;
  score = 0;
  scoreEl.textContent = score;
  levelButtons.forEach((button, idx) => {
    button.classList.toggle('active', idx === index);
  });
  levelDescriptionEl.textContent = levels[index].description;
  messageEl.textContent = '';
  nextWord();
}

function nextWord() {
  const wordList = levels[activeLevel].numbers ? levels[activeLevel].numbers : levels[activeLevel].words;
  currentWord = wordList[Math.floor(Math.random() * wordList.length)];
  currentAnswer = '';
  targetWordEl.textContent = '?';
  answerDisplayEl.textContent = '';
  messageEl.textContent = '';
  renderLetters();
}

function renderLetters() {
  const letters = shuffle(currentWord.split(''));
  letterButtonsEl.innerHTML = '';
  letters.forEach((letter, index) => {
    const button = document.createElement('button');
    button.textContent = letter.toUpperCase();
    button.className = 'letter-btn';
    button.type = 'button';
    button.addEventListener('click', () => addLetter(letter, button));
    letterButtonsEl.appendChild(button);
  });
}

function addLetter(letter, button) {
  if (currentAnswer.length >= currentWord.length) return;
  currentAnswer += letter;
  answerDisplayEl.textContent = currentAnswer.toUpperCase();
  button.disabled = true;
}

function clearAnswer() {
  currentAnswer = '';
  answerDisplayEl.textContent = '';
  document.querySelectorAll('.letter-btn').forEach((btn) => {
    btn.disabled = false;
  });
  messageEl.textContent = '';
}

function checkAnswer() {
  if (!currentAnswer) {
    messageEl.textContent = 'Try building the word first.';
    return;
  }

  if (currentAnswer.toLowerCase() === currentWord) {
    targetWordEl.textContent = currentWord.toUpperCase();
    score += 1;
    scoreEl.textContent = score;
    messageEl.textContent = 'Great job! That word is correct. Tap Next to keep learning.';
    speakWord(currentWord);
  } else {
    messageEl.textContent = 'Almost there! Check the letters and try again.';
  }
}

function showHint() {
  targetWordEl.textContent = currentWord[0].toUpperCase() + ' ' + '_'.repeat(currentWord.length - 1);
  messageEl.textContent = 'Here is the first letter. Keep going!';
}

function speakWord(word) {
  if (!window.speechSynthesis) return;
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

document.getElementById('submitBtn').addEventListener('click', checkAnswer);
document.getElementById('clearBtn').addEventListener('click', clearAnswer);
document.getElementById('hintBtn').addEventListener('click', showHint);
document.getElementById('sayBtn').addEventListener('click', () => speakWord(currentWord));
document.getElementById('nextBtn').addEventListener('click', nextWord);

levelButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setActiveLevel(Number(button.dataset.level));
  });
});

setActiveLevel(activeLevel);
