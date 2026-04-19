/* ============================================
   AI Decoded — Main JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Deep Dive (Expandable Sections) ---
  document.querySelectorAll('.deep-dive-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      btn.classList.toggle('open');
      content.classList.toggle('open');
      btn.setAttribute('aria-expanded', content.classList.contains('open'));
    });
  });

  // --- Quiz Logic ---
  const allQuizzes = document.querySelectorAll('.quiz');
  const quizResults = new Map(); // track correct/incorrect per quiz

  allQuizzes.forEach((quiz, index) => {
    const options = quiz.querySelectorAll('.quiz-option');
    const radios = quiz.querySelectorAll('.quiz-option input[type="radio"]');
    const submitBtn = quiz.querySelector('.quiz-submit');
    const feedbackCorrect = quiz.querySelector('.quiz-feedback.correct');
    const feedbackIncorrect = quiz.querySelector('.quiz-feedback.incorrect');
    const correctAnswer = quiz.dataset.answer;
    let selectedAnswer = null;
    let answered = false;

    // Create "Try Again" button (hidden initially)
    const retryBtn = document.createElement('button');
    retryBtn.className = 'quiz-submit';
    retryBtn.textContent = 'Try Again';
    retryBtn.style.display = 'none';
    retryBtn.style.marginLeft = '0.5rem';
    if (submitBtn && submitBtn.parentNode) {
      submitBtn.parentNode.insertBefore(retryBtn, submitBtn.nextSibling);
    }

    quizResults.set(index, false); // not yet correct

    radios.forEach(radio => {
      radio.addEventListener('change', () => {
        if (answered) return;
        options.forEach(o => o.classList.remove('selected'));
        radio.closest('.quiz-option').classList.add('selected');
        selectedAnswer = radio.value;
        if (submitBtn) submitBtn.disabled = false;
      });
    });

    function resetQuiz() {
      answered = false;
      selectedAnswer = null;
      options.forEach(option => {
        option.classList.remove('selected', 'correct', 'incorrect');
        option.style.cursor = 'pointer';
      });
      radios.forEach(r => r.checked = false);
      submitBtn.disabled = true;
      submitBtn.style.display = '';
      retryBtn.style.display = 'none';
      if (feedbackCorrect) feedbackCorrect.style.display = 'none';
      if (feedbackIncorrect) feedbackIncorrect.style.display = 'none';
    }

    retryBtn.addEventListener('click', resetQuiz);

    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        if (!selectedAnswer || answered) return;
        answered = true;
        submitBtn.disabled = true;

        options.forEach(option => {
          option.style.cursor = 'default';
          if (option.dataset.value === correctAnswer) {
            option.classList.add('correct');
          } else if (option.classList.contains('selected') && option.dataset.value !== correctAnswer) {
            option.classList.add('incorrect');
          }
        });

        if (selectedAnswer === correctAnswer) {
          if (feedbackCorrect) feedbackCorrect.style.display = 'block';
          if (feedbackIncorrect) feedbackIncorrect.style.display = 'none';
          quizResults.set(index, true);
          retryBtn.style.display = 'none';
        } else {
          if (feedbackIncorrect) feedbackIncorrect.style.display = 'block';
          if (feedbackCorrect) feedbackCorrect.style.display = 'none';
          retryBtn.style.display = 'inline-block';
        }

        // Check if all quizzes are answered correctly
        checkAllQuizzesCorrect();
      });
    }
  });

  // --- Lesson Completion Checkbox ---
  const checkbox = document.querySelector('.lesson-complete-check input[type="checkbox"]');
  const checkboxLabel = document.querySelector('.lesson-complete-check span');

  function checkAllQuizzesCorrect() {
    if (!checkbox || allQuizzes.length === 0) return;
    const allCorrect = Array.from(quizResults.values()).every(v => v === true);
    if (allCorrect) {
      checkbox.disabled = false;
      checkbox.closest('.lesson-complete-check').classList.remove('locked');
      if (checkboxLabel) checkboxLabel.textContent = checkboxLabel.textContent.replace(' (answer all questions correctly to unlock)', '');
    }
  }

  if (checkbox) {
    const lessonId = checkbox.dataset.lesson;

    // Load saved state
    const progress = JSON.parse(localStorage.getItem('ai-decoded-progress') || '{}');
    if (progress[lessonId]) {
      checkbox.checked = true;
      checkbox.disabled = false;
    } else if (allQuizzes.length > 0) {
      // Lock checkbox until all quizzes are correct
      checkbox.disabled = true;
      checkbox.closest('.lesson-complete-check').classList.add('locked');
      if (checkboxLabel) checkboxLabel.textContent += ' (answer all questions correctly to unlock)';
    }

    checkbox.addEventListener('change', () => {
      const progress = JSON.parse(localStorage.getItem('ai-decoded-progress') || '{}');
      progress[lessonId] = checkbox.checked;
      localStorage.setItem('ai-decoded-progress', JSON.stringify(progress));
    });
  }

  // --- Course Feedback ---
  const feedbackBtns = document.querySelectorAll('.feedback-btn');
  const feedbackThanks = document.getElementById('feedback-thanks');
  const feedbackButtonsContainer = document.getElementById('feedback-buttons');

  if (feedbackBtns.length > 0) {
    // Check if already submitted
    const savedFeedback = localStorage.getItem('ai-decoded-feedback');
    if (savedFeedback) {
      if (feedbackButtonsContainer) feedbackButtonsContainer.style.display = 'none';
      if (feedbackThanks) feedbackThanks.style.display = 'block';
    }

    feedbackBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        localStorage.setItem('ai-decoded-feedback', btn.dataset.feedback);
        if (feedbackButtonsContainer) feedbackButtonsContainer.style.display = 'none';
        if (feedbackThanks) feedbackThanks.style.display = 'block';
      });
    });
  }

  // --- Landing Page: Update Progress ---
  const progressBar = document.querySelector('.progress-bar-fill');
  const progressText = document.querySelector('.progress-text');
  const lessonCards = document.querySelectorAll('.lesson-card');

  if (progressBar && lessonCards.length > 0) {
    const progress = JSON.parse(localStorage.getItem('ai-decoded-progress') || '{}');
    const totalLessons = lessonCards.length;
    let completedCount = 0;

    lessonCards.forEach(card => {
      const lessonId = card.dataset.lesson;
      if (progress[lessonId]) {
        card.classList.add('completed');
        const badge = card.querySelector('.completion-badge');
        if (badge) badge.style.display = 'flex';
        completedCount++;
      }
    });

    const percent = Math.round((completedCount / totalLessons) * 100);
    progressBar.style.width = percent + '%';
    if (progressText) {
      progressText.textContent = `${completedCount} of ${totalLessons} lessons completed`;
    }
  }

});
