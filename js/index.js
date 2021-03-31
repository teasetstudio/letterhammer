/* header logic */
const menuBtn = document.getElementById('menu-btn'),
      menu = document.getElementById('menu');
      
menuBtn.onmouseover = function(){
    menu.style.top = 0;
};
menu.onmouseleave = function(){
    this.style.top = '-100px';
};

/* game logic
==================================================================================== */
const wordsArr = ['соль','сахар', 'кошка', 'собака', 'поршень', 'клен', 'дача', 'рождество', 'зима', 'весна',
                  'маяк','любовь', 'цветок', 'туча', 'деньги', 'монета', 'звезда', 'платье', 'арбуз',
                  'молоко', 'кефир', 'церковь', 'крест', 'ананас', 'апельсин', 'август', 'дорога', 'успех',
                  'урожай', 'добро', 'сердце', 'погода', 'счастье', 'здание', 'слон', 'кенгуру', 'буква',
                  'злодей', 'радость', 'море', 'камень', 'песок', 'зерно', 'монитор', 'клавиатура', 'спасение',
                  'вифлеем', 'город', 'компьютер', 'голгофа', 'евангелие', 'вода', 'огонь', 'молния', 'слово', 
                  'скамейка', 'дрова', 'дверь', 'солнце', 'поведение', 'цвет', 'свет', 'книга', 'заповедь',
                  'образование', 'пони', 'лошадь', 'песня', 'разум', 'мудрость', 'банан', 'столица', 'осел',
                  'крокодил', 'аптека', 'мастерская', 'магистраль', 'сказка', 'лиса', 'волк', 'аптека', 'пасха',
                  'жатва', 'лето', 'осень', 'жизнь', 'велосипед', 'узник', 'конец', 'кошка', 'шпион', 'галерея',
                  'грохот', 'кровать', 'садовник', 'водитель', 'крыша', 'фестиваль', 'жалюзи', 'хроника', 'фильм',
                  'клавиша', 'галстук', 'служба', 'одеяло'],

      attemptDiv = document.getElementById('attempts'),
      hammer = document.getElementById('pic-hammer'),
      hidedWord = document.getElementById('hided-word'),
      letterBtn = document.getElementById('letter-btn'),
      letterInput = document.getElementById('letter-input'),
      recordsLvl1 = document.getElementById('level-1'),
      recordsLvl2 = document.getElementById('level-2'),
      regexRu = /[а-яА-ЯЁё]/,
      scoreDiv = document.getElementById('score'),
      scoreBlock = document.getElementById('score-div'),
      score2Div = document.getElementById('score2'),
      score2Block = document.getElementById('score-div2'),
      timer = document.getElementById('timer'),
      usedLettersDiv = document.getElementById('usedLetters'),
      wordWindow = document.getElementById('word-window'),
      wordInput = document.getElementById('input-word'),
      wordsDiv = document.getElementById('words-guessed');

let attemptDivsList = [],
    complexity = 13,
    currentLetter,
    curScore = 0,
    guessedLetters = 0,
    guessedWords = 0,
    lettersArr = [],
    letterDivsList = [],
    players = 1,
    curPlayer = 1,
    score = 0,
    score2 = 0, 
    seconds = 0,
    startPlayer,
    timerVar = 0,
    usedLetters = [],
    varSecondForInfo = 0,
    wrongLetters = [],
    wordLength;

/* reset function */
function reset (){
    currentLetter;
    guessedLetters = 0;
    lettersArr = [];
    letterDivsList = [];
    seconds = 0;
    timerVar = 0;
    usedLetters = [];
    wrongLetters = [];
    wordLength;
    attemptDiv.innerHTML = "";
    hammer.style.left = '45%';
    hidedWord.innerHTML = "";
    timer.innerHTML = "0";
    usedLettersDiv.innerHTML = "";
    wordWindow.style.display = 'none';
    clearInterval(timerClock);    
};
/* score */
function calcScore (score){
    curScore = 1 + (Math.round((guessedWords*15 + 500)/(1.3 + (wrongLetters.length) + (seconds/20))/100));
    score = score + curScore;
    return score; 
};
/*timer*/
let timerClock;
function clock(){
    seconds++;
    timer.innerHTML = seconds;
};
/* start game ========================================= */
let start = {
    addElement:function(letter){
        let newLetter = document.createElement('div');
        newLetter.className = 'letter-box';
        newLetter.innerHTML = `<div class='letter-wrapper'>
                                    <div class='letter'>${letter}</div>
                                    <div class='backface'></div>
                                </div>`;
        hidedWord.appendChild(newLetter);
    },
    addAttemptElement:function(){
        let newAttempt = document.createElement('div');
        newAttempt.className = 'attempt-box';
        attemptDiv.appendChild(newAttempt);
    },
    randomWord:function(){
        let indexLength = wordsArr.length - 1,
            wordIndex = Math.ceil(Math.random() * indexLength);
        return wordsArr[wordIndex];
    },
    lettersArray:function(word){
        lettersArr = word.split('');
        wordLength = lettersArr.length;
    },
    createWordTable:function(){
        for (let i = 0; i < complexity; i++){
            this.addAttemptElement();
        };
        attemptDivsList = document.querySelectorAll(".attempt-box");

        for (let i = 0; i < wordLength; i++){
            this.addElement(lettersArr[i]);
        }
        letterDivsList = document.querySelectorAll(".letter-wrapper");
        letterInput.disabled = false;
        letterInput.focus();
    }
};
start.lettersArray(start.randomWord());
start.createWordTable();
/* game proceed ========================================= */
let gameActions = {
    getLetter:function(){
        currentLetter = letterInput.value.toLowerCase();
        this.checkLetter();
        letterInput.value = '';

    },
    checkLetter:function(){
        let isRepeat = this.inputLetterRepeat(),
            isFindLet = false;
        if(regexRu.test(currentLetter) == true && !isRepeat){
            lettersArr.forEach((element, index) => {
                if (element == currentLetter){
                    this.openLetter(index);
                    isFindLet = true;
                }
            });
            usedLetters.push (currentLetter);
            if (!isFindLet){
                this.addUsedLetter(currentLetter);
                wrongLetters.push (currentLetter);
                this.breakAttemptDiv();
            };
            if (timerVar == 0) {
                timerVar = 1;
                timerClock = setInterval(() => clock(), 2000);
            }
        }else if (isRepeat){
            alert ('Вы уже вводили эту букву.\nПожалуйста, введите другую!');
        }else alert('Введите одну Русскую БУКВУ.\nПроверьте язык раскладки клавиатуры.');
    },
    inputLetterRepeat: function (){
        let x = false;
        usedLetters.forEach ((element) =>{
            if (element == currentLetter) {
                x = true;
            }
        })
        return x;
    },
    openLetter:function(index){
        letterDivsList[index].style.transform = 'translateY(0px)';
        guessedLetters++;
        if (guessedLetters === wordLength) {
            letterDivsList[index].addEventListener('transitionend', () => {
                if(players == 1){
                    this.winWord();
                }else{
                    this.twoWinWord();
                }
            });
        }
    },
    addUsedLetter:function(usedLetter){
        let newLetter = document.createElement('p');
        newLetter.className = 'usedLetter-item';
        newLetter.innerHTML = usedLetter;
        usedLettersDiv.appendChild(newLetter);
    },
    breakAttemptDiv:function(){
        let leftPos = attemptDivsList[wrongLetters.length-1].offsetLeft + 23;
        letterInput.blur();
        hammer.style.left = leftPos + 'px';
        hammer.animate ([
            {transform: 'rotate(0deg)'},
            {transform: 'rotate(-47deg)'},
            {transform: 'rotate(-24deg)'},
            {transform: 'rotate(0deg)'}
        ],  {
        duration: 1000,
        easing: 'ease-in',
        iterations: 1
        });
        attemptDivsList[wrongLetters.length-1].style.background = 'rgb(36, 28, 65)';
        attemptDivsList[wrongLetters.length-1].style.borderColor = 'rgb(25, 16, 58)';
        attemptDivsList[wrongLetters.length-1].style.boxShadow = '-1px 0 20px rgb(29, 0, 32), 0 1px 60px var(--border4)';
        attemptDivsList[wrongLetters.length-1].addEventListener('transitionend', () => {
            letterInput.focus();
            if (wrongLetters.length >= complexity && event.propertyName == "box-shadow"){
                this.looseWord();
            };
        });
    },
    winWord:function(){
        guessedWords++;
        score = calcScore(score);
        scoreDiv.innerHTML = score;
        wordsDiv.innerHTML = guessedWords;
        alert ('Ты отгадал слово, поздравляю!!\n+' + curScore + ' очков(а)');
        this.restart();
    },
    twoWinWord:function(){
        guessedWords++;
        wordsDiv.innerHTML = guessedWords;
        this.changeCurPlayer(false);
        alert ('Отгадал, поздравляю!!\n+' + curScore + ' очков(а)');
        if (startPlayer == 0) {
            this.endTwoPlayersGame();
        } else  {
            this.restart();
        };
    },
    changeCurPlayer:function(loose){
        if (curPlayer == 1) {
            if (!loose){
                score = calcScore(score);
                scoreDiv.innerHTML = score;
            }
            curPlayer = 2;
        } else {
            if(!loose){
                score2 = calcScore(score2);
                score2Div.innerHTML = score2;
            }
            curPlayer = 1;
        };
    },
    looseWord:function(){
        if (players == 1){
            alert ('Ты проиграл, набрав '+ score + ' очков(а), поздравляю...\nСлово: ' + lettersArr.join(''));
            this.clearScore();
            this.restart();
        } else if (startPlayer === curPlayer){
            alert ('Слово: ' + lettersArr.join('') + '\nИгра закончится после следующего игрока');
            this.changeCurPlayer(true);
            startPlayer = 0;
            this.restart();
        } else {
            alert ('Слово: ' + lettersArr.join(''));
            this.endTwoPlayersGame();
        };
    },
    clearScore:function(){
        guessedWords = 0;
        score = 0;
        score2 = 0;
        scoreDiv.innerHTML = 0;
        score2Div.innerHTML = 0;
        wordsDiv.innerHTML = guessedWords;
    },
    restart:function(){
        reset();
        start.lettersArray(start.randomWord());
        start.createWordTable();
        if (players == 2){
            setTimeout (function (){
                gameActions.showCurPlayer();
            }, 0);
            this.inputWord();
        };
    },
    showCurPlayer:function(){
        if (curPlayer == 1){
            scoreBlock.style.border = '2px solid rgb(68, 0, 255)';
            scoreBlock.style.boxShadow = '-5px 0 15px var(--border4) inset, 0 5px 15px var(--border4) inset, 5px 0 15px var(--border4) inset, 0 -5px 15px var(--border4) inset';
            score2Block.style.border = '2px solid transparent';
            score2Block.style.boxShadow = '0 0 0';
        } else {
            score2Block.style.border = '2px solid rgb(204, 0, 255)';
            score2Block.style.boxShadow = '-5px 0 15px var(--border2) inset, 0 5px 15px var(--border2) inset, 5px 0 15px var(--border2) inset, 0 -5px 15px var(--border2) inset';
            scoreBlock.style.border = '2px solid transparent';
            scoreBlock.style.boxShadow = '0 0 0';
        }
    },
    inputWord:function(){
        letterInput.disabled = true;
        wordInput.value = '';
        wordWindow.style.display = 'block';
        setTimeout (function (){
            wordWindow.style.top = '35%';
        }, 100)
        wordInput.focus();
    },
    getWord:function(btn){
        let currentWord = wordInput.value.toLowerCase(),
            curWorLength = currentWord.length;
        if(regexRu.test(currentWord) == true && curWorLength > 3){
            wordWindow.style.top = '-30%';
            setTimeout (function (){
                wordWindow.style.display = 'none';
                gameActions.twoPlaRestart(currentWord);    
            }, 400);
        } else {
            alert('Вы ввели слово неправильно!\nВведите слово на русском от 4 до 10 букв.');
            btn.blur();
        };
    },
    twoPlaRestart:function (word){ //inin in btn
        reset();
        start.lettersArray(word);
        start.createWordTable();
    },
    endTwoPlayersGame:function(){
        if(score > score2){
            alert('Выйграл синий игрок');
        } else if (score2 > score){
            alert ('Выйграл фиолетовый игрок');
        } else alert('Ничья...');
        twoPlayers();
    }
};
letterInput.addEventListener("keyup", function(event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        letterBtn.click();
    };
});
wordInput.addEventListener("keyup", function(event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        gameActions.getWord();
    };
});
letterBtn.onclick = function(){
    gameActions.getLetter();
};
/* complexity level btns */
function normLevel(){
    complexity = 13;
    gameActions.clearScore();
    gameActions.restart();
    recordsLvl1.style.display = 'block';
    recordsLvl2.style.display = 'none';
};
function hardLevel(){
    complexity = 8;
    gameActions.clearScore();
    gameActions.restart();
    recordsLvl1.style.display = 'none';
    recordsLvl2.style.display = 'block';
};
/* players */
function onePlayer(){
    players = 1;
    gameActions.clearScore();
    gameActions.restart();
    score2Block.style.display = 'none';
};
function twoPlayers(){
    players = 2;
    startPlayer = curPlayer = Math.ceil (Math.random() * 2);
    gameActions.clearScore();
    gameActions.restart();
    score2Block.style.display = 'block';
};
function showText() {
    wordInput.type = "text";
};
function hideText (btn){
    wordInput.type = 'password';
    btn.blur();
};
function info (){
    console.log('');
    console.log('Current word: ' + lettersArr.join(''));
    console.log('Score: ' + score);
    console.log('Score per last round: ' + curScore);
    console.log('');
    console.log('Score per round formula: 1 + (Math.round((guessedWords*15 + 500)/(1.5 + (wrongLettersNum/2.5) + (seconds/20))/100))');
    console.log('');
};