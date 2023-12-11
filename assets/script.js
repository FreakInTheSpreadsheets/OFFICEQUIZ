let timeRemaining = 60;
let timerInterval;
let score = 0;
let displayedQuestionsIndices = [];
let questionarr = [
     {question:"Bears, Beats or Battlestart Galactica?",choices:["Yes","No","Bears"],answer:"Bears"},
        {question:"What is the secret ingredient to Kevins world famous chili?",choices:["Jalepenos","Tomatoes","Slow Roasted Onions"],answer:"Slow Roasted Onions",},
            {question:"Whatis Jim's last name",choices:["Schrute","Hudson","Halpert"],answer:"Halpert"},
                {question:"Are you uder an umberella?",choices:["Yes","No","Maybe"],answer:"Maybe"},
                     {question:"When is 5:00?", choices:["all the time","Later","Never"],answer:"all the time"},
];

document.getElementById('start-btn').addEventListener('click', startQuiz);

function startQuiz() {
    document.getElementById('start').classList.add('hidden');
    document.getElementById('quiz-questions').classList.remove('hidden');
    document.getElementById('high-scores').classList.add('hidden');
    const firstQuestion = getRandomQuestion();
    if (firstQuestion) {
        showNextQuestion(firstQuestion);
    }
    startTimer();
}

function restartQuiz() {
    score = 0;
    displayedQuestionsIndices = [];
    timeRemaining = 60;
    clearInterval(timerInterval);
    document.getElementById("timer").textContent = `Time Remaining: ${timeRemaining}s`;
    document.getElementById("score").textContent = `Score: ${score}`;
    document.getElementById('initials').value = '';
    document.getElementById('start').classList.remove('hidden');
    document.getElementById('high-scores').classList.add('hidden');
    document.getElementById('quiz-questions').classList.add('hidden');
}

function showNextQuestion(question) {
    document.getElementById("question").textContent = question.question;
    question.choices.forEach((choice, index) => {
        let choiceButton = document.getElementById(`q${index + 1}`);
        choiceButton.textContent = choice;
        choiceButton.onclick = () => handleAnswerClick(choice, question);
    });
}

function getRandomQuestion() {
    let remainingQuestions = questionarr.filter((_, index) => !displayedQuestionsIndices.includes(index));
    if (remainingQuestions.length === 0) {
        return null;
    }
    const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
    const selectedQuestion = remainingQuestions[randomIndex];
    displayedQuestionsIndices.push(questionarr.indexOf(selectedQuestion));
    return selectedQuestion;
}

function handleAnswerClick(selectedChoice, question) {
    if (selectedChoice === question.answer) {
        score += 20;
        document.getElementById("score").textContent = score;
    } else {
        timeRemaining -= 10;
    }

    let nextQuestion = getRandomQuestion();
    if (nextQuestion) {
        showNextQuestion(nextQuestion);
    } else {
        endQuiz();
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeRemaining--;
        document.getElementById("timer").textContent = `Time Remaining: ${timeRemaining}s`;
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            endQuiz();
        }
    }, 1000);
}

function endQuiz() {
    clearInterval(timerInterval);
    document.getElementById('quiz-questions').classList.add('hidden');
    document.getElementById('high-scores').classList.remove('hidden');
    document.getElementById("final-score").textContent = `Your final score is: ${score}`;
    document.getElementById('high-scores').classList.remove('hidden');
    document.getElementById('score-form').classList.remove('hidden');
    loadHighScores();
}

function viewHighScores() {
    clearInterval(timerInterval);
    document.getElementById('quiz-questions').classList.add('hidden');
    document.getElementById('high-scores').classList.remove('hidden');
    document.getElementById('score-form').classList.add('hidden');
}
function loadHighScores() {
    const highScoresList = document.getElementById('scores-list');
    highScoresList.innerHTML = '';

    const highScores = JSON.parse(localStorage.getItem('high-scores')) || [];
    highScores.sort((a, b) => b.score - a.score);
 

    highScores.slice(0, 10).forEach(scoreEntry => {
        const li = document.createElement('li');
        li.textContent = `${scoreEntry.initials}: ${scoreEntry.score}`;
        highScoresList.appendChild(li);
    });
}

document.getElementById('score-form').addEventListener('submit', function(event) {
    // event.preventDefault(); //By removing thi line the quiz restarts when the button is clicked. Same effectas line 243
    const initials = document.getElementById('initials').value;

    if (initials) {
        const newScore = { initials: initials, score: score };
        const highScores = JSON.parse(localStorage.getItem('high-scores')) || [];
        highScores.push(newScore);
        localStorage.setItem('high-scores', JSON.stringify(highScores));
        loadHighScores(); // Refresh the high scores displayed

    }
});

// Call loadHighScores at the start to display any existing high scores
loadHighScores();

document.getElementById('restart-quiz').addEventListener('click', restartQuiz);
document.getElementById('view-high-scores').addEventListener('click', viewHighScores);
