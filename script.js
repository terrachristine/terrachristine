/* 
   Terra Hall
   IT 3203 Web Development
   DevTools Website
   Description: External JavaScript for website.
*/

/*
   PART 1: MOBILE NAVIGATION TOGGLE
*/
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        var menuToggle = document.getElementById('menuToggle');
        var mainNav = document.getElementById('mainNav');

        if (menuToggle && mainNav) {
            menuToggle.addEventListener('click', function () {
                var isOpen = mainNav.classList.toggle('nav-open');
                menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                var icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.toggle('fa-bars', !isOpen);
                    icon.classList.toggle('fa-times', isOpen);
                }
            });

            var navLinks = mainNav.querySelectorAll('a');
            for (var i = 0; i < navLinks.length; i++) {
                navLinks[i].addEventListener('click', function () {
                    if (mainNav.classList.contains('nav-open')) {
                        mainNav.classList.remove('nav-open');
                        menuToggle.setAttribute('aria-expanded', 'false');
                        var icon = menuToggle.querySelector('i');
                        if (icon) {
                            icon.classList.add('fa-bars');
                            icon.classList.remove('fa-times');
                        }
                    }
                });
            }
        }
    });
})();

/*
   PART 2: QUIZ LOGIC
*/
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        var quizForm = document.getElementById('quiz-form');
        if (!quizForm) return;

        var timeLeft = 600;
        var timerInterval;
        var quizStarted = false;
        var timerDisplay = document.getElementById('timer');

        function startTimer() {
            if (quizStarted) return;
            quizStarted = true;
            timerInterval = setInterval(function () {
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    alert('Time is up! Submitting your quiz now.');
                    submitQuiz();
                    return;
                }
                timeLeft--;
                var minutes = Math.floor(timeLeft / 60);
                var seconds = timeLeft % 60;
                if (timerDisplay) {
                    timerDisplay.innerText = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
                }
            }, 1000);
        }

        var allInputs = quizForm.querySelectorAll('input');
        for (var i = 0; i < allInputs.length; i++) {
            allInputs[i].addEventListener('click', startTimer);
            allInputs[i].addEventListener('keydown', startTimer);
        }

        function submitQuiz() {
            clearInterval(timerInterval);
            quizStarted = false;

            var points = { q1: 1, q2: 1, q3: 2, q4: 1, q5: 1, q6: 1, q7: 1, q8: 1, q9: 1, q10: 1 };
            var maxScore = 11;
            var score = 0;
            var resultsHTML = '';

            function val(id) {
                var el = document.getElementById(id);
                return el ? el.value.trim().toLowerCase() : '';
            }
            function radio(name) {
                var el = document.querySelector('input[name="' + name + '"]:checked');
                return el ? el.value : undefined;
            }

            var q1 = val('q1');
            var q2 = val('q2');
            var q3Checked = Array.prototype.slice.call(
                document.querySelectorAll('input[name="q3"]:checked')
            ).map(function (el) { return el.value; });
            var q3Correct = q3Checked.length === 3 &&
                            q3Checked.indexOf('A') !== -1 &&
                            q3Checked.indexOf('B') !== -1 &&
                            q3Checked.indexOf('D') !== -1;
            var q4 = radio('q4'), q5 = radio('q5'), q6 = radio('q6'),
                q7 = radio('q7'), q8 = radio('q8'), q9 = radio('q9'), q10 = radio('q10');

            if (q1 === 'console') {
                score += points.q1;
                resultsHTML += "<p>1. <span class='correct-answer'>Correct!</span> The Console panel is used to see error messages and run JavaScript commands.</p>";
            } else {
                resultsHTML += "<p>1. <span class='incorrect-answer'>Incorrect.</span> You answered: <em>" + (q1 || 'Nothing') + "</em>. The correct answer is <strong>Console</strong>.</p>";
            }
            if (q2 === 'network') {
                score += points.q2;
                resultsHTML += "<p>2. <span class='correct-answer'>Correct!</span> The Network panel shows every file that a webpage downloads.</p>";
            } else {
                resultsHTML += "<p>2. <span class='incorrect-answer'>Incorrect.</span> You answered: <em>" + (q2 || 'Nothing') + "</em>. The correct answer is <strong>Network</strong>.</p>";
            }
            if (q3Correct) {
                score += points.q3;
                resultsHTML += "<p>3. <span class='correct-answer'>Correct!</span> A, B, and D are all valid ways to open DevTools.</p>";
            } else {
                resultsHTML += "<p>3. <span class='incorrect-answer'>Incorrect.</span> You answered: <em>" + (q3Checked.join(', ') || 'Nothing') + "</em>. The correct answers are <strong>A, B, D</strong>.</p>";
            }

            var mc = [
                { q: 4, got: q4, correct: 'A', expl: 'The Elements panel is for viewing and editing HTML & CSS.' },
                { q: 5, got: q5, correct: 'A', expl: 'The Client-Server Model is browser requesting data from a server.' },
                { q: 6, got: q6, correct: 'B', expl: 'DevTools are built-in features in modern browsers.' },
                { q: 7, got: q7, correct: 'B', expl: 'Device Mode simulates mobile screen sizes.' },
                { q: 8, got: q8, correct: 'B', expl: 'Lighthouse runs automated audits for performance, accessibility, and SEO.' },
                { q: 9, got: q9, correct: 'B', expl: 'DOM stands for Document Object Model.' },
                { q: 10, got: q10, correct: 'B', expl: 'The Elements panel is used to view HTML structure and edit CSS live.' }
            ];
            mc.forEach(function (item) {
                if (item.got === item.correct) {
                    score += points['q' + item.q];
                    resultsHTML += "<p>" + item.q + ". <span class='correct-answer'>Correct!</span> (" + item.correct + ") " + item.expl + "</p>";
                } else {
                    resultsHTML += "<p>" + item.q + ". <span class='incorrect-answer'>Incorrect.</span> You answered: <em>" + (item.got || 'Nothing') + "</em>. The correct answer is <strong>" + item.correct + "</strong>. " + item.expl + "</p>";
                }
            });

            var percentage = (score / maxScore) * 100;
            var passed = percentage >= 70;
            var statusText = passed ? 'PASSED' : 'FAILED';
            var statusClass = passed ? 'pass-text' : 'fail-text';

            var timeSpentSeconds = 600 - timeLeft;
            var timeSpentMins = Math.floor(timeSpentSeconds / 60);
            var timeSpentSecs = timeSpentSeconds % 60;

            document.getElementById('result-status').innerText = statusText;
            document.getElementById('result-status').className = statusClass;
            document.getElementById('result-score').innerText =
                'Score: ' + score + ' / ' + maxScore + ' (' + percentage.toFixed(1) + '%)';
            document.getElementById('result-score').className = 'score-display ' + statusClass;
            document.getElementById('result-time').innerText =
                'Time spent: ' + timeSpentMins + ' mins, ' + timeSpentSecs + ' secs';
            document.getElementById('detailed-results').innerHTML = resultsHTML;

            document.getElementById('results-modal').style.display = 'flex';
        }

        function resetQuiz() {
            document.getElementById('results-modal').style.display = 'none';
            quizForm.reset();
            clearInterval(timerInterval);
            timeLeft = 600;
            quizStarted = false;
            if (timerDisplay) timerDisplay.innerText = '10:00';
        }

        var submitBtn = quizForm.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', function (e) {
                e.preventDefault();
                submitQuiz();
            });
        }
        var retakeBtn = document.querySelector('.retake-btn');
        if (retakeBtn) {
            retakeBtn.addEventListener('click', resetQuiz);
        }
    });
})();
