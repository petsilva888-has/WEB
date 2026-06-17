document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const forgotForm = document.getElementById('forgotForm');
    const resetForm = document.getElementById('resetForm');

    // Toggle da visibilidade da senha para todos os botões de senha
    document.querySelectorAll('.password-toggle').forEach(button => {
        button.addEventListener('click', () => {
            const input = button.closest('.password-field').querySelector('input');
            const type = input.type === 'password' ? 'text' : 'password';
            input.type = type;
            button.textContent = type === 'password' ? '👁️' : '🙈';
        });
    });

    const dashboardPanel = document.getElementById('dashboardPanel');
    const logoutBtn = document.getElementById('logoutBtn');

    // Tabs navigation
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            btn.classList.add('active');
            const activeContent = document.getElementById(`${tabName}-tab`);
            if (activeContent) activeContent.classList.add('active');
        });
    });

    if (loginForm) {
        initLoginForm(loginForm);
    }

    if (registerForm) {
        initRegisterForm(registerForm);
    }

    if (forgotForm) {
        initForgotForm(forgotForm);
    }

    if (resetForm) {
        initResetForm(resetForm);
    }

    if (dashboardPanel) {
        initDashboard(dashboardPanel, logoutBtn);
        initQuiz();
    }

    function initLoginForm(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            clearErrors(form);

            let isValid = true;
            const email = form.querySelector('#email').value.trim();
            const password = form.querySelector('#password').value.trim();

            if (!email) {
                showError(form.querySelector('#email'), 'E-mail é obrigatório');
                isValid = false;
            } else if (!isValidEmail(email)) {
                showError(form.querySelector('#email'), 'E-mail inválido');
                isValid = false;
            }

            if (!password) {
                showError(form.querySelector('#password'), 'Senha é obrigatória');
                isValid = false;
            } else if (password.length < 6) {
                showError(form.querySelector('#password'), 'Senha deve ter no mínimo 6 caracteres');
                isValid = false;
            }

            if (isValid) {
                const user = findUserByEmail(email);
                if (!user) {
                    showError(form.querySelector('#email'), 'Conta não encontrada');
                    return;
                }
                if (user.password !== password) {
                    showError(form.querySelector('#password'), 'Senha incorreta');
                    return;
                }

                setCurrentUser(email);
                window.location.href = 'dashboard.html';
            }
        });
    }

    function initRegisterForm(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            clearErrors(form);

            let isValid = true;
            const fullName = form.querySelector('#fullName').value.trim();
            const email = form.querySelector('#email').value.trim();
            const password = form.querySelector('#password').value.trim();
            const confirmPassword = form.querySelector('#confirmPassword').value.trim();

            if (!fullName) {
                showError(form.querySelector('#fullName'), 'Nome completo é obrigatório');
                isValid = false;
            }

            if (!email) {
                showError(form.querySelector('#email'), 'E-mail é obrigatório');
                isValid = false;
            } else if (!isValidEmail(email)) {
                showError(form.querySelector('#email'), 'E-mail inválido');
                isValid = false;
            }

            if (!password) {
                showError(form.querySelector('#password'), 'Senha é obrigatória');
                isValid = false;
            } else if (password.length < 6) {
                showError(form.querySelector('#password'), 'Senha deve ter no mínimo 6 caracteres');
                isValid = false;
            }

            if (!confirmPassword) {
                showError(form.querySelector('#confirmPassword'), 'Confirmação de senha é obrigatória');
                isValid = false;
            } else if (password !== confirmPassword) {
                showError(form.querySelector('#confirmPassword'), 'As senhas não coincidem');
                isValid = false;
            }

            if (isValid) {
                const existingUser = findUserByEmail(email);
                if (existingUser) {
                    showError(form.querySelector('#email'), 'E-mail já cadastrado');
                    return;
                }

                saveUser({ fullName, email, password });
                alert(`✅ Cadastro realizado com sucesso!\nBem-vindo(a), ${fullName}!`);
                form.reset();
            }
        });
    }

    /* - Forgot password (request) - */
    function initForgotForm(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            clearErrors(form);
            const email = form.querySelector('#forgotEmail').value.trim();
            if (!email) {
                showError(form.querySelector('#forgotEmail'), 'E-mail é obrigatório');
                return;
            }
            if (!isValidEmail(email)) {
                showError(form.querySelector('#forgotEmail'), 'E-mail inválido');
                return;
            }

            const user = findUserByEmail(email);
            const resultEl = document.getElementById('forgotResult');
            if (!user) {
                // For privacy, show generic message but do not create token
                if (resultEl) resultEl.textContent = 'Se o e-mail estiver cadastrado, você receberá instruções por e-mail (simulado).';
                return;
            }

            // generate token and store
            const token = Math.random().toString(36).slice(2, 10);
            saveResetToken(email, token);
            const link = `reset_password.html?token=${token}`;
            if (resultEl) {
                resultEl.innerHTML = `Link de redefinição (simulação): <a href="${link}">${link}</a>`;
            }
            form.reset();
        });
    }

    /* - Reset password (consume token) - */
    function initResetForm(form) {
        // prefill token from query
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const resultEl = document.getElementById('resetResult');

        if (!token) {
            if (resultEl) resultEl.textContent = 'Token ausente. Peça um novo link de recuperação.';
            return;
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            clearErrors(form);
            const pw = form.querySelector('#newPassword').value.trim();
            const pw2 = form.querySelector('#confirmNewPassword').value.trim();

            if (!pw) {
                showError(form.querySelector('#newPassword'), 'Senha é obrigatória');
                return;
            }
            if (pw.length < 6) {
                showError(form.querySelector('#newPassword'), 'Senha deve ter no mínimo 6 caracteres');
                return;
            }
            if (pw !== pw2) {
                showError(form.querySelector('#confirmNewPassword'), 'As senhas não coincidem');
                return;
            }

            const email = findEmailByToken(token);
            if (!email) {
                if (resultEl) resultEl.textContent = 'Token inválido ou expirado.';
                return;
            }

            // update user password
            const users = getUsers();
            const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
            if (idx === -1) {
                if (resultEl) resultEl.textContent = 'Conta não encontrada.';
                return;
            }
            users[idx].password = pw;
            localStorage.setItem('spfcUsers', JSON.stringify(users));
            clearResetToken(token);
            // auto-login the user and redirect to dashboard
            setCurrentUser(email);
            if (resultEl) resultEl.textContent = 'Senha redefinida com sucesso. Redirecionando para o painel...';
            form.reset();
            setTimeout(() => { window.location.href = 'dashboard.html'; }, 900);
        });
    }

    function showError(input, message) {
        const errorSpan = input.closest('.field').querySelector('.error-message');
        if (errorSpan) {
            errorSpan.textContent = message;
        }
    }

    function clearErrors(form) {
        form.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    }

    function initDashboard(panel, logoutBtn) {
        const user = getCurrentUser();
        if (!user) {
            window.location.href = 'index.html';
            return;
        }

        // populate topbar
        const avatarEl = document.getElementById('userAvatar');
        const greetingEl = document.getElementById('userGreeting');
        const emailEl = document.getElementById('userEmail');

        if (greetingEl) {
            const displayName = (user.fullName && user.fullName.split(' ')[0]) || (user.email.split('@')[0]);
            greetingEl.textContent = `Olá, ${displayName}!`;
        }
        if (emailEl) emailEl.textContent = user.email;
        if (avatarEl) {
            // initials from fullName or email
            let initials = '';
            if (user.fullName) {
                const parts = user.fullName.trim().split(' ');
                initials = (parts[0][0] || '') + (parts.length > 1 ? (parts[1][0] || '') : '');
            } else {
                initials = user.email.split('@')[0].slice(0,2);
            }
            avatarEl.textContent = initials.toUpperCase();
        }

        // dropdown menu behavior
        const userButton = document.getElementById('userButton');
        const userMenu = document.getElementById('userMenu');
        const menuLogout = document.getElementById('menuLogout');
        const profileLink = document.getElementById('profileLink');

        function closeMenu() {
            if (userMenu) userMenu.classList.remove('show');
            if (userButton) userButton.setAttribute('aria-expanded', 'false');
        }

        function openMenu() {
            if (userMenu) userMenu.classList.add('show');
            if (userButton) userButton.setAttribute('aria-expanded', 'true');
        }

        if (userButton && userMenu) {
            userButton.addEventListener('click', (ev) => {
                ev.stopPropagation();
                if (userMenu.classList.contains('show')) closeMenu(); else openMenu();
            });

            // close when clicking outside
            document.addEventListener('click', (e) => {
                if (!userMenu.contains(e.target) && !userButton.contains(e.target)) closeMenu();
            });
        }

        if (menuLogout) {
            menuLogout.addEventListener('click', (e) => {
                e.preventDefault();
                clearCurrentUser();
                window.location.href = 'index.html';
            });
        }

        if (profileLink) {
            profileLink.addEventListener('click', (e) => {
                e.preventDefault();
                alert(`Perfil de ${user.fullName || user.email} (simulação)`);
                closeMenu();
            });
        }
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                clearCurrentUser();
                window.location.href = 'index.html';
            });
        }
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /* --- Quiz do São Paulo (mini-game) --- */
    function initQuiz() {
        const startBtn = document.getElementById('startQuizBtn');
        const restartBtn = document.getElementById('restartQuizBtn');
        const nextBtn = document.getElementById('nextQuestionBtn');
        const intro = document.getElementById('quizIntro');
        const game = document.getElementById('quizGame');
        const questionBox = document.getElementById('questionBox');
        const optionsBox = document.getElementById('optionsBox');
        const scoreBox = document.getElementById('quizScore');

        if (!startBtn || !questionBox) return;

        const initialQuestions = [
            { q: 'Em que ano o São Paulo foi fundado?', options: ['1928', '1930', '1942', '1919'], a: 1 },
            { q: 'Quantas Copas Libertadores o clube tem?', options: ['1', '2', '3', '4'], a: 2 },
            { q: 'Quem é o goleiro-ídolo e maior goleiro-artilheiro?', options: ['Rogério Ceni', 'Cafu', 'Raí', 'Kempes'], a: 0 },
            { q: 'Qual é o estádio do São Paulo?', options: ['Morumbi', 'Pacaembu', 'Allianz Parque', 'Maracanã'], a: 0 },
            { q: 'Em que década o São Paulo conquistou a Tríplice Coroa com Libertadores e Mundial?', options: ['1980s', '1990s', '2000s', '2010s'], a: 1 }
        ];

        const hardQuestions = [
            { q: 'Quem marcou o gol do título mundial de 2005?', options: ['Luis Fabiano', 'Mineiro', 'Juan', 'Hernanes'], a: 1 },
            { q: 'Quantos gols Rogério Ceni marcou na carreira (aprox)?', options: ['~50', '~100', '~200', '~300'], a: 1 },
            { q: 'Em que ano o São Paulo ganhou a Libertadores pela primeira vez?', options: ['1989', '1992', '1995', '2005'], a: 1 },
            { q: 'Quem foi campeão do Brasileiro pelo São Paulo em 2008 (técnico)?', options: ['Muricy Ramalho', 'Dorival Júnior', 'Levir Culpi', 'Telê Santana'], a: 0 },
            { q: 'Quantos títulos brasileiros (Série A) o clube possui (aprox)?', options: ['3', '6', '9', '12'], a: 1 }
        ];

        let currentSet = initialQuestions;
        let current = 0;
        let score = 0;
        let hardMode = false;

        function showQuestion(idx) {
            const item = currentSet[idx];
            questionBox.textContent = `${idx + 1}. ${item.q}`;
            optionsBox.innerHTML = '';
            item.options.forEach((opt, i) => {
                const btn = document.createElement('button');
                btn.className = 'btn';
                btn.style.width = '100%';
                btn.textContent = opt;
                btn.addEventListener('click', () => selectOption(i));
                optionsBox.appendChild(btn);
            });
            scoreBox.textContent = `Pergunta ${idx+1} de ${currentSet.length} — Pontos: ${score}`;
            if (nextBtn) { nextBtn.textContent = 'Próxima'; nextBtn.style.display = 'inline-block'; nextBtn.onclick = nextQuestion; }
        }

        function selectOption(i) {
            const q = currentSet[current];
            const buttons = Array.from(optionsBox.querySelectorAll('button'));
            buttons.forEach((b, idx) => { b.disabled = true; if (idx === q.a) b.style.border = '2px solid #0a0'; });
            if (i === q.a) { score++; }
            scoreBox.textContent = `Pergunta ${current+1} de ${currentSet.length} — Pontos: ${score}`;
        }

        function nextQuestion() {
            if (current < currentSet.length - 1) {
                current++;
                showQuestion(current);
            } else {
                finishQuiz();
            }
        }

        function finishQuiz() {
            // Show congratulations and allow progressing to hard mode
            questionBox.textContent = `Parabéns! Você marcou ${score} de ${currentSet.length} pontos.`;
            optionsBox.innerHTML = '';
            scoreBox.textContent = '';
            if (!hardMode) {
                // offer hard mode
                if (nextBtn) {
                    nextBtn.textContent = 'Próxima Fase (Difícil)';
                    nextBtn.onclick = startHardMode;
                    nextBtn.style.display = 'inline-block';
                }
            } else {
                // end of hard mode
                if (nextBtn) nextBtn.style.display = 'none';
                // final congrats message
                const congrats = document.createElement('div');
                congrats.style.marginTop = '12px';
                congrats.style.fontWeight = '800';
                congrats.style.color = '#8B0000';
                congrats.textContent = '🎉 Parabéns! Você concluiu o Quiz Difícil!';
                optionsBox.appendChild(congrats);
            }
        }

        function startQuiz() {
            currentSet = initialQuestions;
            current = 0; score = 0; hardMode = false;
            if (intro) intro.style.display = 'none';
            if (game) game.style.display = 'block';
            showQuestion(current);
        }

        function startHardMode() {
            hardMode = true;
            currentSet = hardQuestions;
            current = 0; score = 0;
            showQuestion(current);
        }

        startBtn.addEventListener('click', startQuiz);
        if (nextBtn) nextBtn.onclick = nextQuestion;
        if (restartBtn) restartBtn.addEventListener('click', () => { if (intro) intro.style.display = 'block'; if (game) game.style.display = 'none'; score = 0; current = 0; if (scoreBox) scoreBox.textContent = ''; if (nextBtn) nextBtn.style.display = 'inline-block'; });
    }

    function getUsers() {
        const stored = localStorage.getItem('spfcUsers');
        return stored ? JSON.parse(stored) : [];
    }

    function saveUser(user) {
        const users = getUsers();
        users.push(user);
        localStorage.setItem('spfcUsers', JSON.stringify(users));
    }

    function findUserByEmail(email) {
        const users = getUsers();
        return users.find(user => user.email.toLowerCase() === email.toLowerCase());
    }

    /* Reset token helpers */
    // token time-to-live (ms) — 1 hour
    const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;
    function getResetTokens() {
        const raw = localStorage.getItem('spfcResetTokens');
        return raw ? JSON.parse(raw) : {};
    }

    function saveResetToken(email, token) {
        const store = getResetTokens();
        store[token] = { email, created: Date.now() };
        localStorage.setItem('spfcResetTokens', JSON.stringify(store));
    }

    function findEmailByToken(token) {
        const store = getResetTokens();
        if (!store[token]) return null;
        const entry = store[token];
        const created = entry.created || 0;
        const age = Date.now() - created;
        if (age > RESET_TOKEN_TTL_MS) {
            // token expired — remove and treat as invalid
            clearResetToken(token);
            return null;
        }
        return entry.email;
    }

    function clearResetToken(token) {
        const store = getResetTokens();
        delete store[token];
        localStorage.setItem('spfcResetTokens', JSON.stringify(store));
    }

    function setCurrentUser(email) {
        localStorage.setItem('spfcCurrentUser', email);
    }

    function getCurrentUserEmail() {
        return localStorage.getItem('spfcCurrentUser');
    }

    function clearCurrentUser() {
        localStorage.removeItem('spfcCurrentUser');
    }

    function getCurrentUser() {
        const email = getCurrentUserEmail();
        return email ? findUserByEmail(email) : null;
    }
});

