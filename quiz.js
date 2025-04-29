const questions = [
    {
        question: "How do you typically approach challenges?",
        answers: [
            { text: "With determination and bravery", trait: "brave" },
            { text: "With creativity and intelligence", trait: "smart" },
            { text: "With kindness and compassion", trait: "kind" },
            { text: "With optimism and humor", trait: "cheerful" }
        ]
    },
    {
        question: "What's your ideal way to spend a day?",
        answers: [
            { text: "Going on an adventure", trait: "adventurous" },
            { text: "Learning something new", trait: "curious" },
            { text: "Helping others", trait: "helpful" },
            { text: "Creating or performing", trait: "creative" }
        ]
    },
    {
        question: "What quality do others admire most in you?",
        answers: [
            { text: "My leadership abilities", trait: "leader" },
            { text: "My inner strength", trait: "strong" },
            { text: "My loyalty to friends", trait: "loyal" },
            { text: "My sense of wonder", trait: "dreamer" }
        ]
    },
    {
        question: "How do you handle difficult decisions?",
        answers: [
            { text: "Follow my heart", trait: "passionate" },
            { text: "Consider all perspectives", trait: "wise" },
            { text: "Trust my instincts", trait: "intuitive" },
            { text: "Seek advice from others", trait: "collaborative" }
        ]
    },
    {
        question: "What's your biggest dream?",
        answers: [
            { text: "Making a difference in the world", trait: "altruistic" },
            { text: "Finding true love", trait: "romantic" },
            { text: "Discovering who I really am", trait: "self-aware" },
            { text: "Going on epic adventures", trait: "adventurous" }
        ]
    },
    {
        question: "What's your response to injustice?",
        answers: [
            { text: "Stand up and fight", trait: "brave" },
            { text: "Find a clever solution", trait: "smart" },
            { text: "Protect those affected", trait: "protective" },
            { text: "Unite people for change", trait: "leader" }
        ]
    },
    {
        question: "What's your greatest strength?",
        answers: [
            { text: "My determination", trait: "determined" },
            { text: "My imagination", trait: "creative" },
            { text: "My compassion", trait: "kind" },
            { text: "My wisdom", trait: "wise" }
        ]
    },
    {
        question: "How do you prefer to solve problems?",
        answers: [
            { text: "Take immediate action", trait: "active" },
            { text: "Think it through carefully", trait: "thoughtful" },
            { text: "Work with others", trait: "teamwork" },
            { text: "Trust my gut feeling", trait: "intuitive" }
        ]
    },
    {
        question: "What motivates you most?",
        answers: [
            { text: "Making others happy", trait: "kind" },
            { text: "Personal growth", trait: "ambitious" },
            { text: "Adventure and excitement", trait: "adventurous" },
            { text: "Creating something new", trait: "creative" }
        ]
    },
    {
        question: "What's your biggest fear?",
        answers: [
            { text: "Letting others down", trait: "responsible" },
            { text: "Being powerless", trait: "strong" },
            { text: "Being misunderstood", trait: "authentic" },
            { text: "Missing opportunities", trait: "ambitious" }
        ]
    }
];

const characters = {
    mulan: {
        name: "Mulan",
        image: "https://example.com/mulan.jpg",
        traits: ["brave", "determined", "strong"],
        description: "Like Mulan, you're brave, determined, and willing to fight for what's right. You have a strong sense of duty and aren't afraid to challenge conventions."
    },
    belle: {
        name: "Belle",
        image: "https://example.com/belle.jpg",
        traits: ["smart", "kind", "authentic"],
        description: "Like Belle, you're intelligent, compassionate, and true to yourself. You see beyond appearances and value knowledge and inner beauty."
    },
    elsa: {
        name: "Elsa",
        image: "https://example.com/elsa.jpg",
        traits: ["strong", "protective", "self-aware"],
        description: "Like Elsa, you're powerful, protective of loved ones, and on a journey of self-discovery. You learn to embrace your true self."
    },
    moana: {
        name: "Moana",
        image: "https://example.com/moana.jpg",
        traits: ["adventurous", "brave", "leader"],
        description: "Like Moana, you're adventurous, brave, and a natural leader. You follow your heart and aren't afraid to chart your own course."
    },
    aladdin: {
        name: "Aladdin",
        image: "https://example.com/aladdin.jpg",
        traits: ["clever", "dreamer", "kind"],
        description: "Like Aladdin, you're clever, ambitious, and have a good heart. You dream big and aren't afraid to take risks for what you want."
    }
};

let currentQuestionIndex = 0;
let userTraits = {};

// DOM Elements
const questionContainer = document.getElementById('question-container');
const answerButtonsElement = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const restartButton = document.getElementById('restart-btn');
const quizContainer = document.getElementById('quiz-container');
const resultContainer = document.getElementById('result-container');

// Initialize quiz
function startQuiz() {
    currentQuestionIndex = 0;
    userTraits = {};
    resultContainer.classList.add('hide');
    quizContainer.classList.remove('hide');
    showQuestion(questions[0]);
}

// Display question and answers
function showQuestion(question) {
    questionContainer.querySelector('#question').textContent = question.question;
    answerButtonsElement.innerHTML = '';
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.textContent = answer.text;
        button.classList.add('btn');
        button.addEventListener('click', () => selectAnswer(answer));
        answerButtonsElement.appendChild(button);
    });
}

// Handle answer selection
function selectAnswer(answer) {
    userTraits[answer.trait] = (userTraits[answer.trait] || 0) + 1;
    const buttons = answerButtonsElement.getElementsByClassName('btn');
    Array.from(buttons).forEach(button => {
        button.disabled = true;
        if (button.textContent === answer.text) {
            button.style.backgroundColor = 'var(--disney-blue)';
            button.style.color = 'white';
        }
    });
    nextButton.style.display = 'block';
}

// Show next question or results
function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion(questions[currentQuestionIndex]);
    } else {
        showResult();
    }
}

// Calculate and display results
function showResult() {
    quizContainer.classList.add('hide');
    resultContainer.classList.remove('hide');
    
    const matchedCharacter = findMatchingCharacter();
    document.getElementById('character-name').textContent = matchedCharacter.name;
    document.getElementById('character-image').src = matchedCharacter.image;
    document.getElementById('character-description').textContent = matchedCharacter.description;
    
    const traitsContainer = document.getElementById('character-traits');
    traitsContainer.innerHTML = '';
    matchedCharacter.traits.forEach(trait => {
        const traitElement = document.createElement('span');
        traitElement.classList.add('trait-tag');
        traitElement.textContent = trait;
        traitsContainer.appendChild(traitElement);
    });

    // Store result for chat room
    localStorage.setItem('quizResult', matchedCharacter.name);
}

// Find best matching character based on traits
function findMatchingCharacter() {
    let bestMatch = { character: null, score: 0 };
    
    for (const [id, character] of Object.entries(characters)) {
        let score = 0;
        character.traits.forEach(trait => {
            if (userTraits[trait]) {
                score += userTraits[trait];
            }
        });
        
        if (score > bestMatch.score) {
            bestMatch = { character: character, score: score };
        }
    }
    
    return bestMatch.character;
}

// Event listeners
nextButton.addEventListener('click', handleNextButton);
restartButton.addEventListener('click', startQuiz);

// Start the quiz when page loads
startQuiz();