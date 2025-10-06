const questions = [
    { image: 'images/1.png', options: ['Inter', 'Itaú', 'Intel', 'iFood'], answer: 'Itaú' },
    { image: 'images/2.png', options: ['Santander', 'Bancoob', 'Sicoob', 'Bradesco'], answer: 'Bradesco' },
    { image: 'images/3.png', options: ['Natura', 'Nivea', 'O Boticário', 'Eudora'], answer: 'Natura' },
    { image: 'images/4.png', options: ['Riachuelo', 'Renault', 'Renner', 'Risqué'], answer: 'Renner' },
    { image: 'images/5.png', options: ['Ipiranga', 'Itaú', 'Shell', 'Itaipava'], answer: 'Ipiranga' },
    { image: 'images/6.png', options: ['Max Love', 'Magazine Luiza', 'Mentos', 'Motorola'], answer: 'Magazine Luiza' },
    { image: 'images/7.png', options: ['Habibs', 'Hugo Boss', 'Havaianas', 'Hermès'], answer: 'Havaianas' },
    { image: 'images/8.png', options: ['Blue Fit', 'Sky Fit', 'Black Fit', 'Smart Fit'], answer: 'Smart Fit' },
    { image: 'images/9.png', options: ['Sukita', 'Guaraná Antarctica', 'Guaraná Kuat', 'Dolly Guaraná'], answer: 'Guaraná Antarctica' },
    { image: 'images/10.png', options: ['Seara', 'Skol', 'Sadia', 'Seda'], answer: 'Sadia' },
];

let currentQuestion = 0;
let score = 0;
let userAnswers = [];
let showingResults = false;


const quiz = document.getElementById('quiz');
const nextBtn = document.getElementById('nextBtn');

function showQuestion(index) {
    const q = questions[index];
    const user = userAnswers[index];

    const feedbackHTML = showingResults
        ? `<div class="toast-msg ${user.correct ? 'toast-success' : 'toast-error'}">${user.correct ? '✅ Acertou' : `❌ Errou (Você marcou: ${user.selected})`}</div>`
        : `<div id="toast"></div>`;

    quiz.innerHTML = `
        <div class="fade-in">
          <img src="${q.image}" alt="Questão ${index + 1}" class="question-img img-fluid"/>
          <div class="text-center mb-3">${feedbackHTML}</div>
          <div class="d-grid gap-2">
            ${q.options.map(option => {
            let btnClass = "btn-outline-dark";
            let attr = "";

            if (showingResults) {
                // usar border-only feedback nas respostas ao mostrar resultados
                if (option === q.answer) {
                    btnClass = "answer-correct";
                } else if (user && option === user.selected) {
                    btnClass = "answer-wrong";
                }
                attr = "disabled";
            } else {
                attr = `data-answer="${option}"`;
            }

            return `<button class="btn ${btnClass} option-btn" ${attr}>${option}</button>`;
        }).join('')}
          </div>
        </div>
      `;

    if (!showingResults) {
        const toast = document.getElementById('toast');
        const btns = document.querySelectorAll('.option-btn');
        btns.forEach(btn => {
            btn.addEventListener('click', function () {
                const selected = this.getAttribute('data-answer');
                const correct = q.answer;
                const acertou = selected === correct;

                if (acertou) {
                    // manter .btn, remover variantes e adicionar classe customizada de acerto (borda verde)
                    this.classList.remove('btn-outline-dark', 'btn-primary', 'btn-success', 'btn-danger');
                    this.classList.add('answer-correct', 'bg-transparent');
                    toast.className = "toast-msg toast-success";
                    score += 10;
                } else {
                    // marcar escolhido com classe customizada de erro (borda vermelha)
                    this.classList.remove('btn-outline-dark', 'btn-primary', 'btn-success', 'btn-danger');
                    this.classList.add('answer-wrong', 'bg-transparent');
                    const rightBtn = document.querySelector(`.option-btn[data-answer="${correct}"]`);
                    if (rightBtn) {
                        rightBtn.classList.remove('btn-outline-dark', 'btn-primary', 'btn-success', 'btn-danger');
                        rightBtn.classList.add('answer-correct', 'bg-transparent');
                    }
                    toast.className = "toast-msg toast-error";
                }

                userAnswers.push({ selected, correctAnswer: correct, correct: acertou });
                btns.forEach(b => b.disabled = true);
                nextBtn.classList.remove('d-none');
            });
        });
    }

    // atualiza a barra de progresso (0..100)
    updateProgress(index);
}

function updateProgress(index) {
    const bar = document.getElementById('quizProgress');
    if (!bar) return;
    const pct = Math.round((index / (questions.length - 1)) * 100);
    bar.style.width = pct + '%';
}

function showResultsPage() {
    showingResults = true;
    nextBtn.classList.add('d-none');

    // HTML dos resultados estilo coluna
    let resultsHTML = `<div class="d-flex flex-column align-items-center gap-3">
        <button id="finishTop" class="btn btn-primary mb-3 default-buttons">Finalizar</button>
      `;

    userAnswers.forEach((user, index) => {
        const q = questions[index];
        const correctClass = user.correct ? 'toast-success' : 'toast-error';
        resultsHTML += `
          <div class="card w-100 p-3">
            <div class="text-center mb-2 ${correctClass}">
              ${user.correct ? '✅ Acertou' : `❌ Errou (Você marcou: ${user.selected})`}
            </div>
            <img src="${q.image}" alt="Questão ${index + 1}" class="question-img img-fluid mb-2"/>
            <h5 class="text-center mb-1">Questão ${index + 1}</h5>
            <div class="d-grid gap-2">
              ${q.options.map(option => {
            let btnClass = "option-btn";
            if (option === user.correctAnswer) btnClass += " border border-success text-success";
            else if (option === user.selected && !user.correct) btnClass += " border border-danger text-danger";
            // garantir fundo transparente (classe btn mantida para spacing)
            return `<button class="btn ${btnClass} bg-transparent" disabled>${option}</button>`;
        }).join('')}
            </div>
          </div>
        `;
    });

    resultsHTML += `<button id="finishBottom" class="btn btn-primary mt-3 default-buttons">Finalizar</button></div>`;
    quiz.innerHTML = resultsHTML;

    // Botões finalizar levam à pontuação final
    document.getElementById('finishTop').addEventListener('click', showFinalScore);
    document.getElementById('finishBottom').addEventListener('click', showFinalScore);
}

function finalizeQuiz() {
    quiz.innerHTML = `<h4 class="text-center mt-5">✅ Quiz finalizado! Você fez ${score} de 100 pontos</h4>`;
}

nextBtn.addEventListener('click', () => {
    currentQuestion++;
    if (!showingResults && currentQuestion < questions.length) {
        showQuestion(currentQuestion);
        nextBtn.classList.add('d-none');
    } else if (!showingResults && currentQuestion === questions.length) {
        showResultsPage();
    } else if (showingResults && currentQuestion < questions.length) {
        showQuestion(currentQuestion);
        if (currentQuestion === questions.length - 1) {
            nextBtn.textContent = "Finalizar";
        }
    } else {
        quiz.innerHTML = `<h4 class="text-center mt-5">✅ Quiz finalizado! Você fez ${score} de 100 pontos</h4>`;
        nextBtn.classList.add('d-none');
    }
});

function showFinalScore() {
    nextBtn.classList.add('d-none');

    // Calcula quantas respostas corretas e incorretas
    const correctCount = userAnswers.filter(u => u.correct).length;
    const incorrectCount = userAnswers.length - correctCount;

    quiz.innerHTML = `
    <h4 class="text-center mt-5">Quiz finalizado! Você fez ${score} de 100 pontos</h4>
    <div class="my-4 d-flex justify-content-center">
      <canvas id="scoreChart" width="250" height="250"></canvas>
    </div>
    <div class="text-center mt-4">
      <button id="restartBtn" class="btn btn-success default-buttons">Recomeçar</button>
    </div>
  `;

    // Cria o gráfico
    const ctx = document.getElementById('scoreChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Acertos', 'Erros'],
            datasets: [{
                label: 'Resultado do Quiz',
                data: [correctCount, incorrectCount],
                backgroundColor: ['#198754', '#dc3545'],
                borderColor: ['#198754', '#dc3545'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#fff' : '#000'
                    }
                }
            }
        }
    });

    // Botão de recomeçar
    document.getElementById('restartBtn').addEventListener('click', restartQuiz);
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    userAnswers = [];
    showingResults = false;
    nextBtn.textContent = "Avançar";
    showQuestion(currentQuestion);
    nextBtn.classList.add('d-none');
}

function toggleTheme() {
    const html = document.documentElement;
    const body = document.body;
    const isDark = html.getAttribute("data-theme") === "dark";

    html.setAttribute("data-theme", isDark ? "light" : "dark");
    body.classList.toggle("bg-dark", !isDark);
    body.classList.toggle("text-light", !isDark);
    body.classList.toggle("bg-light", isDark);
    body.classList.toggle("text-dark", isDark);
}

showQuestion(currentQuestion);