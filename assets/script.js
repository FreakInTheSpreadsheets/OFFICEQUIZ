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
// Event listener for the start button
document.getElementById('start-btn').addEventListener('click', startQuiz);
// Function to start the quiz
function startQuiz() {
    document.getElementById('start').classList.add('hidden');
    document.getElementById('quiz-questions').classList.remove('hidden');
    const firstQuestion = getRandomQuestion();
    if (firstQuestion) {showNextQuestion(firstQuestion);}
    startTimer();
}

function restartQuiz() {
    score = 0; // Resets score
    displayedQuestionsIndices = []; // Clear array of asked questions
    timeRemaining = 60; // Resets the timer
    clearInterval(timerInterval); // Cleasr existing timer
    document.getElementById("timer").textContent = `Time Remaining: ${timeRemaining}s`;
    document.getElementById("score").textContent = `Score: ${score}`;
    document.getElementById('initials').value = '';
    document.getElementById('start').classList.remove('hidden'); 
    document.getElementById('high-scores').classList.add('hidden'); 
    document.getElementById('quiz-questions').classList.add('hidden'); 
    
}

// Function to show the next question. WORKS DO NOT TOUCH!!
function showNextQuestion(question) {
    document.getElementById("question").textContent = question.question;
    question.choices.forEach((choice, index) => {
        let choiceButton = document.getElementById(`q${index + 1}`);
        choiceButton.textContent = choice;
        choiceButton.onclick = () => handleAnswerClick(choice, question);
    });
}
// Function to get a random question
function getRandomQuestion() {
    let remainingQuestions = questionarr.filter((_, index) => !displayedQuestionsIndices.includes(index));
//specifies that if no more questions remian unasked, stop the loop
    if (remainingQuestions.length === 0) {
        return null;
    }
    const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
    const selectedQuestion = remainingQuestions[randomIndex];
    displayedQuestionsIndices.push(questionarr.indexOf(selectedQuestion));
    return selectedQuestion;
}
// Function to handle answer click. THIS WORKS REGARDLESS OF WETHER THE ANSWER IS CORRCT OR NOT.
        // If the selected choice is correct then add points
            //if the time runs oput, the test ends. Works!
               // If the selected choice is incorrect, deduct 10 seconds from the timer.Works!!!
function handleAnswerClick(selectedChoice, question) {
    if (selectedChoice === question.answer) {score += 20;
        document.getElementById("score").textContent = score;
    } else {timeRemaining -= 10;
    
        }
//This specifies that if there are nor more questions within the array that have not been asked, then execute the end quiz function.
    let nextQuestion = getRandomQuestion();
    if (nextQuestion) {
        showNextQuestion(nextQuestion);
    } else {
        endQuiz();
    }
}
// Function to start the timer
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
// Function to end the quiz
function endQuiz() {
    clearInterval(timerInterval); // Stop the timer
    document.getElementById('quiz-questions').classList.add('hidden');
    document.getElementById('high-scores').classList.remove('hidden');
    document.getElementById("final-score").textContent = `Your final score is: ${score}`;
    // Prompt the user to enter their initials
    document.getElementById('initials').focus(); 
}

document.getElementById('score-form').addEventListener('submit', function(event) {
    event.preventDefault(); // This prevents the page from reloading when the submit button is clicked
    const initials = document.getElementById('initials').value;
    const newScore = { initials: initials, score: score };

    // Get existing scores from localStorage
    const highScores = JSON.parse(localStorage.getItem('high-scores')) || [];
    highScores.push(newScore);

    },
    function loadHighScores() {
        document.getElementById('scores-list').textContent=highScores // this is supposed to get the 'ul' element
    
        // Retrieve high scores from localStorage or initialize to an empty array if none exist
        const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    
                                        
        // Create a list item for each high score and append to the 'ul' element
        highScores.forEach(scoreEntry => {
            const li = document.createElement('scores-list');
            li.textContent = `${scoreEntry.initials}: ${scoreEntry.score}`;
            highScores.appendChild(li);
        });
    

    // Store scores in local
    localStorage.setItem('highScores', JSON.stringify(highScores))
    

    })
    document.getElementById('submit-score').addEventListener('click', restartQuiz);
    