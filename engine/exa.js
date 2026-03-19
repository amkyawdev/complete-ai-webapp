/**
 * AmkyawDev Exam Engine
 * Quiz and exam functionality
 */

class ExamEngine {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.answers = [];
        this.timer = null;
        this.timeLeft = 0;
    }

    /**
     * Initialize exam with questions
     */
    init(questions) {
        this.questions = questions;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.answers = [];
    }

    /**
     * Load questions from JSON
     */
    async loadQuestions(lang, category = 'questions') {
        try {
            const response = await fetch(`/data/${lang}/${category}.json`);
            const data = await response.json();
            this.questions = data.questions || [];
            return this.questions;
        } catch (error) {
            console.error('Error loading questions:', error);
            return [];
        }
    }

    /**
     * Get current question
     */
    getCurrentQuestion() {
        return this.questions[this.currentQuestionIndex];
    }

    /**
     * Get total questions
     */
    getTotalQuestions() {
        return this.questions.length;
    }

    /**
     * Get current question number (1-based)
     */
    getCurrentQuestionNumber() {
        return this.currentQuestionIndex + 1;
    }

    /**
     * Submit answer
     */
    submitAnswer(answer) {
        const question = this.getCurrentQuestion();
        const isCorrect = answer === question.correctAnswer;
        
        this.answers.push({
            questionId: question.id,
            answer: answer,
            correct: isCorrect
        });

        if (isCorrect) {
            this.score++;
        }

        return {
            isCorrect,
            correctAnswer: question.correctAnswer
        };
    }

    /**
     * Move to next question
     */
    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            return true;
        }
        return false;
    }

    /**
     * Move to previous question
     */
    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            return true;
        }
        return false;
    }

    /**
     * Go to specific question
     */
    goToQuestion(index) {
        if (index >= 0 && index < this.questions.length) {
            this.currentQuestionIndex = index;
            return true;
        }
        return false;
    }

    /**
     * Start timer
     */
    startTimer(duration, onTick, onComplete) {
        this.timeLeft = duration;
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            
            if (onTick) {
                onTick(this.timeLeft);
            }
            
            if (this.timeLeft <= 0) {
                this.stopTimer();
                if (onComplete) {
                    onComplete();
                }
            }
        }, 1000);
    }

    /**
     * Stop timer
     */
    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    /**
     * Get formatted time
     */
    getFormattedTime() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    /**
     * Get results
     */
    getResults() {
        const totalQuestions = this.questions.length;
        const answeredQuestions = this.answers.length;
        const correctAnswers = this.score;
        const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

        return {
            totalQuestions,
            answeredQuestions,
            correctAnswers,
            incorrectAnswers: answeredQuestions - correctAnswers,
            percentage,
            answers: this.answers,
            passed: percentage >= 60
        };
    }

    /**
     * Reset exam
     */
    reset() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.answers = [];
        this.stopTimer();
    }

    /**
     * Shuffle questions
     */
    shuffleQuestions() {
        for (let i = this.questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
        }
    }

    /**
     * Filter questions by category
     */
    filterByCategory(category) {
        return this.questions.filter(q => q.category === category);
    }

    /**
     * Filter questions by difficulty
     */
    filterByDifficulty(difficulty) {
        return this.questions.filter(q => q.difficulty === difficulty);
    }

    /**
     * Get question by ID
     */
    getQuestionById(id) {
        return this.questions.find(q => q.id === id);
    }

    /**
     * Create new question
     */
    createQuestion(questionData) {
        const newQuestion = {
            id: Date.now(),
            ...questionData
        };
        this.questions.push(newQuestion);
        return newQuestion;
    }

    /**
     * Delete question
     */
    deleteQuestion(id) {
        this.questions = this.questions.filter(q => q.id !== id);
    }

    /**
     * Export questions to JSON
     */
    exportQuestions() {
        return JSON.stringify(this.questions, null, 2);
    }
}

// Export the Exam Engine
window.ExamEngine = ExamEngine;

// Initialize default instance
window.examEngine = new ExamEngine();
