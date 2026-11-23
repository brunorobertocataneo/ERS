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

// Formulário WhatsApp
const whatsappForm = document.getElementById('whatsapp-form');
if (whatsappForm) {
    whatsappForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Adicionar estado de loading
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        
        var nome = document.getElementById('nome').value;
        var telefone = document.getElementById('telefone').value;
        var mensagem = document.getElementById('mensagem').value;
        var texto = encodeURIComponent('Olá, meu nome é ' + nome + '%0AContato: ' + telefone + '%0A' + mensagem);
        var numero = '5549984099411';
        
        // Simular um pequeno delay para mostrar o loading
        setTimeout(() => {
            window.open('https://wa.me/' + numero + '?text=' + texto, '_blank');
            
            // Restaurar o botão
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            
            // Limpar o formulário
            this.reset();
            
            // Mostrar notificação de sucesso
            showNotification('Formulário enviado com sucesso!', 'success');
        }, 1000);
    });
}

// Carrossel acessível e suave da equipe ERS
const teamCarousel = document.querySelector('.team-carousel');
if (teamCarousel) {
    const track = teamCarousel.querySelector('.carousel-track');
    const photos = Array.from(track.querySelectorAll('.carousel-img'));
    const previous = teamCarousel.querySelector('.team-carousel-prev');
    const next = teamCarousel.querySelector('.team-carousel-next');
    const dotsContainer = teamCarousel.querySelector('.team-carousel-dots');
    const counter = teamCarousel.querySelector('.team-carousel-counter');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let index = 0;
    let timer = null;
    let startX = null;
    const dots = photos.map((_, i) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'team-carousel-dot';
        button.setAttribute('aria-label', 'Mostrar foto ' + (i + 1));
        dotsContainer.appendChild(button);
        button.addEventListener('click', () => goTo(i));
        return button;
    });
    function update() {
        track.style.transform = 'translate3d(-' + (index * 100) + '%, 0, 0)';
        counter.textContent = (index + 1) + ' / ' + photos.length;
        dots.forEach((dot, i) => {
            dot.classList.toggle('is-active', i === index);
            dot.setAttribute('aria-current', String(i === index));
        });
        photos.forEach((photo, i) => photo.setAttribute('aria-hidden', String(i !== index)));
    }
    function pause() {
        if (timer !== null) clearInterval(timer);
        timer = null;
    }
    function play() {
        pause();
        if (document.hidden || reducedMotion.matches ||
            teamCarousel.matches(':hover') || teamCarousel.matches(':focus-within')) return;
        timer = setInterval(() => {
            index = (index + 1) % photos.length;
            update();
        }, 5500);
    }
    function goTo(nextIndex) {
        index = (nextIndex + photos.length) % photos.length;
        update();
        play();
    }
    previous.addEventListener('click', () => goTo(index - 1));
    next.addEventListener('click', () => goTo(index + 1));
    teamCarousel.addEventListener('mouseenter', pause);
    teamCarousel.addEventListener('mouseleave', play);
    teamCarousel.addEventListener('focusin', pause);
    teamCarousel.addEventListener('focusout', () => requestAnimationFrame(play));
    document.addEventListener('visibilitychange', play);
    reducedMotion.addEventListener('change', play);
    teamCarousel.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
            goTo(index + (e.key === 'ArrowRight' ? 1 : -1));
        }
    });
    teamCarousel.addEventListener('touchstart', e => {
        startX = e.changedTouches[0].screenX;
        pause();
    }, {passive: true});
    teamCarousel.addEventListener('touchend', e => {
        if (startX !== null) {
            const diff = e.changedTouches[0].screenX - startX;
            if (Math.abs(diff) > 45) goTo(index + (diff < 0 ? 1 : -1));
            startX = null;
        }
        play();
    }, {passive: true});
    update();
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
