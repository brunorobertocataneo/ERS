// Alternância de tema claro/escuro
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const body = document.body;
function setTheme(light) {
    if (light) {
        body.classList.add('light-theme');
        themeIcon.textContent = '🌙';
    } else {
        body.classList.remove('light-theme');
        themeIcon.textContent = '☀️';
    }
}
if (themeToggle && themeIcon) {
    themeToggle.addEventListener('click', () => {
        const isLight = !body.classList.contains('light-theme');
        setTheme(isLight);
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
    // Persistência do tema
    if (localStorage.getItem('theme') === 'light') setTheme(true);
}

// Menu hambúrguer responsivo
const menuToggle = document.getElementById('menu-toggle');
const navbar = document.getElementById('navbar');

if (menuToggle && navbar) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navbar.classList.toggle('active');
    });

    // Fechar menu ao clicar em um link
    const navLinks = navbar.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navbar.classList.remove('active');
        });
    });

    // Fechar menu ao clicar fora dele
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            navbar.classList.remove('active');
        }
    });
}

// Cotação WhatsApp: dados apresentados ao usuário para envio manual
const whatsappForm = document.getElementById('whatsapp-form');
if (whatsappForm) {
    const insuranceType = document.getElementById('tipo-seguro');
    const insuranceHint = document.getElementById('quote-type-hint');
    const descriptions = {
        'Automóvel':'Conte o modelo do veículo e o tipo de proteção que procura.',
        'Moto':'Conte o modelo da moto e qual cobertura deseja.',
        'Caminhão e transporte':'Descreva se precisa proteger o veículo, a carga ou ambos.',
        'Residencial':'Conte se o seguro é para casa ou apartamento.',
        'Vida e acidentes pessoais':'Conte que tipo de proteção deseja conhecer.',
        'Empresarial':'Conte o ramo de atuação e a necessidade da empresa.',
        'Rural':'Conte o que deseja proteger na sua atividade rural.',
        'Viagem':'Informe o destino e o período aproximado da viagem.',
        'Certificado digital':'Conte qual tipo de certificado deseja conhecer.',
        'Outro seguro / orientação':'Explique brevemente o que você procura.'
    };
    insuranceType.addEventListener('change', () => {
        insuranceHint.textContent = descriptions[insuranceType.value] || 'Descreva sua necessidade.';
    });
    whatsappForm.addEventListener('submit', function(event) {
        event.preventDefault();
        if (!this.reportValidity()) return;
        const nome = document.getElementById('nome').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        const mensagem = document.getElementById('mensagem').value.trim();
        const modalidade = insuranceType.value;
        const texto = [
            'Olá, equipe ERS! Gostaria de solicitar uma cotação.',
            '',
            'Nome: ' + nome,
            'Telefone: ' + telefone,
            'Tipo de seguro: ' + modalidade,
            'Detalhes: ' + mensagem
        ].join('\\n');
        const url = 'https://wa.me/5549984099411?text=' + encodeURIComponent(texto);
        // Não afirmar que foi enviado: o cliente deve confirmar no WhatsApp.
        window.location.href = url;
    });
}

// Carrossel ERS: três blocos, navegação manual e reprodução opcional
const teamCarousel = document.querySelector('#team .team-carousel');
if (teamCarousel) {
    const section = document.getElementById('team');
    const photos = Array.from(teamCarousel.querySelectorAll('.carousel-img'));
    const prev = section.querySelector('.team-carousel-prev');
    const next = section.querySelector('.team-carousel-next');
    const dotsContainer = section.querySelector('.team-carousel-dots');
    const counter = section.querySelector('.team-carousel-counter');
    const toggle = section.querySelector('.team-carousel-toggle');
    const nameEl = section.querySelector('.team-person-name');
    const roleEl = section.querySelector('.team-person-role');
    const descriptionEl = section.querySelector('.team-person-description');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    // Preencher nomes, cargos e descrições reais quando a equipe fornecer os dados.
    // Índices seguem a ordem das fotografias existentes no repositório.
    const teamInfo = [];
    let current = 0;
    let timer = null;
    let automatic = !reducedMotion.matches;
    const dots = photos.map((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'team-carousel-dot';
        dot.setAttribute('aria-label', 'Ver colaborador ' + (i + 1));
        dot.addEventListener('click', () => moveTo(i));
        dotsContainer.appendChild(dot);
        return dot;
    });
    function render() {
        photos.forEach((photo, i) => {
            const active = i === current;
            photo.classList.toggle('is-current', active);
            photo.classList.remove('is-previous', 'is-next');
            photo.setAttribute('aria-hidden', String(!active));
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('is-active', i === current);
            dot.setAttribute('aria-current', String(i === current));
        });
        const info = teamInfo[current];
        nameEl.textContent = info?.name || 'Colaborador ' + (current + 1);
        roleEl.textContent = info?.role || 'Equipe ERS';
        descriptionEl.textContent = info?.description || 'Conheça quem faz parte da nossa equipe e contribui para um atendimento próximo e de confiança.';
        counter.textContent = (current + 1) + ' de ' + photos.length;
        toggle.setAttribute('aria-pressed', String(automatic));
        toggle.setAttribute('aria-label', automatic ? 'Pausar carrossel' : 'Ativar carrossel automático');
        toggle.innerHTML = '<span aria-hidden="true">' + (automatic ? 'Ⅱ' : '▶') + '</span> ' + (automatic ? 'Pausar' : 'Automático');
    }
    function stop() { if (timer !== null) clearInterval(timer); timer = null; }
    function play() {
        stop();
        if (!automatic || document.hidden || section.matches(':hover') || section.matches(':focus-within')) return;
        timer = setInterval(() => { current = (current + 1) % photos.length; render(); }, 5500);
    }
    function moveTo(index) { current = (index + photos.length) % photos.length; render(); play(); }
    prev.addEventListener('click', () => moveTo(current - 1));
    next.addEventListener('click', () => moveTo(current + 1));
    toggle.addEventListener('click', () => { automatic = !automatic; render(); play(); });
    section.addEventListener('mouseenter', stop);
    section.addEventListener('mouseleave', play);
    section.addEventListener('focusin', stop);
    section.addEventListener('focusout', () => requestAnimationFrame(play));
    document.addEventListener('visibilitychange', play);
    section.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            moveTo(current + (event.key === 'ArrowRight' ? 1 : -1));
        }
    });
    let startX = null;
    teamCarousel.addEventListener('touchstart', e => { startX = e.changedTouches[0].screenX; stop(); }, { passive: true });
    teamCarousel.addEventListener('touchend', e => {
        if (startX !== null) {
            const diff = e.changedTouches[0].screenX - startX;
            if (Math.abs(diff) > 45) moveTo(current + (diff < 0 ? 1 : -1));
        }
        startX = null;
        play();
    }, { passive: true });
    render();
    play();
}

// Pop-up LGPD
const lgpdPopup = document.getElementById('lgpd-popup');
const lgpdClose = document.getElementById('lgpd-close');
const lgpdAccept = document.getElementById('lgpd-accept');
const lgpdReject = document.getElementById('lgpd-reject');

function showLgpdPopup() {
    // Verificar se o usuário já fez uma escolha
    const lgpdChoice = localStorage.getItem('lgpd-choice');
    if (!lgpdChoice) {
        setTimeout(() => {
            lgpdPopup.classList.add('show');
        }, 1000); // Mostrar após 1 segundo
    }
}

function hideLgpdPopup() {
    lgpdPopup.classList.remove('show');
}

function setLgpdChoice(choice) {
    localStorage.setItem('lgpd-choice', choice);
    localStorage.setItem('lgpd-date', new Date().toISOString());
    hideLgpdPopup();

    // Mostrar mensagem de confirmação
    const message = choice === 'accept' ? 'Cookies aceitos com sucesso!' : 'Cookies rejeitados.';
    showNotification(message, choice === 'accept' ? 'success' : 'info');
}

function showNotification(message, type = 'info') {
    // Criar notificação temporária
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        font-size: 1.3rem;
        z-index: 10001;
        animation: slideInRight 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Event listeners para o pop-up LGPD
if (lgpdPopup && lgpdClose && lgpdAccept && lgpdReject) {
    lgpdClose.addEventListener('click', hideLgpdPopup);

    lgpdAccept.addEventListener('click', () => {
        setLgpdChoice('accept');
    });

    lgpdReject.addEventListener('click', () => {
        setLgpdChoice('reject');
    });

    // Fechar ao clicar fora do pop-up
    lgpdPopup.addEventListener('click', (e) => {
        if (e.target === lgpdPopup) {
            hideLgpdPopup();
        }
    });

    // Mostrar pop-up quando a página carregar
    showLgpdPopup();
}

// Botão para redefinir preferências LGPD
const resetLgpdBtn = document.getElementById('reset-lgpd');
if (resetLgpdBtn) {
    resetLgpdBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remover dados do localStorage
        localStorage.removeItem('lgpd-choice');
        localStorage.removeItem('lgpd-date');
        
        // Mostrar pop-up novamente
        showLgpdPopup();
        
        // Mostrar notificação
        showNotification('Preferências de cookies redefinidas!', 'info');
    });
}

// Adicionar estilos CSS para as animações das notificações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// FAQ - Funcionalidade de expansão/colapso
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const toggle = item.querySelector('.faq-toggle');
    
    if (question && toggle) {
        question.addEventListener('click', () => {
            // Fechar outros itens abertos (opcional - comportamento accordion)
            const currentlyActive = document.querySelector('.faq-item.active');
            if (currentlyActive && currentlyActive !== item) {
                currentlyActive.classList.remove('active');
            }
            
            // Alternar o item atual
            item.classList.toggle('active');
        });
    }
}); 
function openModal(event, type) {
  event.preventDefault(); // <- Isso evita que o link leve para o topo

  var modal = document.getElementById("modal");
  var text = document.getElementById("modal-text");

  if (type === 'terms') {
    text.innerHTML = `
      <h2>Termos de Uso</h2>
      <p>Estes são os termos de uso padrão do site ERS Seguros. Ao acessar ou usar nosso site, você concorda em cumprir estes termos.</p>
      <p>...</p>
    `;
  } else if (type === 'privacy') {
    text.innerHTML = `
      <h2>Política de Privacidade</h2>
      <p>Esta política descreve como coletamos, usamos e protegemos as informações dos usuários do site ERS Seguros.</p>
      <p>...</p>
    `;
  }

  modal.style.display = "block";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

window.onclick = function(event) {
  var modal = document.getElementById("modal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
}

// ERS: entrada suave nas seções e navegação inteligente
(() => {
    const header = document.querySelector('.header');
    const links = Array.from(document.querySelectorAll('.header .navbar a[href^="#"]'));
    const sections = Array.from(document.querySelectorAll('section[id]'));
    const updateHeader = () => {
        if (header) header.classList.toggle('is-scrolled', window.scrollY > 28);
    };
    updateHeader();
    window.addEventListener('scroll', updateHeader, {passive:true});

    const setCurrentSection = () => {
        let activeId = 'home';
        for (const section of sections) {
            if (section.getBoundingClientRect().top <= 180) activeId = section.id;
        }
        links.forEach(link => {
            const isActive = link.getAttribute('href') === '#' + activeId;
            link.classList.toggle('active', isActive);
            if (isActive) link.setAttribute('aria-current','location');
            else link.removeAttribute('aria-current');
        });
    };
    setCurrentSection();
    window.addEventListener('scroll', setCurrentSection, {passive:true});

    const menuButton = document.getElementById('menu-toggle');
    const nav = document.getElementById('navbar');
    if (menuButton && nav) {
        const syncMenu = () => {
            const expanded = nav.classList.contains('active');
            menuButton.setAttribute('aria-expanded', String(expanded));
            menuButton.setAttribute('aria-label', expanded ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
        };
        menuButton.addEventListener('click', syncMenu);
        nav.addEventListener('click', syncMenu);
        document.addEventListener('click', syncMenu);
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && nav.classList.contains('active')) {
                nav.classList.remove('active');
                menuButton.classList.remove('active');
                syncMenu();
                menuButton.focus();
            }
        });
        syncMenu();
    }

    const motionDisabled = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!motionDisabled && 'IntersectionObserver' in window) {
        const items = document.querySelectorAll('#about .container > *, #services .container > .section-kicker, #services .container > h2, #services .container > .section-lead, #services .service-card, #beneficios .benefit-card, #team .container > *, #faq .faq-item, #contact .container > .section-kicker, #contact .container > h2, #contact .container > .section-lead, #contact .contact-showcase');
        const revealObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            });
        }, {threshold:0.08,rootMargin:'0px 0px -30px 0px'});
        items.forEach((element,i) => {
            element.classList.add('reveal-item');
            // Pequeno intervalo apenas dentro da grade de cards.
            if (element.classList.contains('service-card') || element.classList.contains('benefit-card')) {
                element.style.setProperty('--reveal-delay', (i % 3)*75 + 'ms');
            }
            revealObserver.observe(element);
        });
        document.body.classList.add('motion-ready');
        // Conteúdo já visível deve aparecer imediatamente.
        requestAnimationFrame(() => items.forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight * 0.9) el.classList.add('is-visible');
        }));
    }
})();
