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

// Carrossel automático da equipe
const carouselTrack = document.querySelector('.carousel-track');
const carouselImgs = document.querySelectorAll('.carousel-img');
let carouselIndex = 0;
function showCarouselImage(idx) {
    if (!carouselTrack) return;
    carouselTrack.style.transform = `translateX(-${idx * 100}%)`;
}
function nextCarouselImage() {
    carouselIndex = (carouselIndex + 1) % carouselImgs.length;
    showCarouselImage(carouselIndex);
}
if (carouselTrack && carouselImgs.length > 0) {
    setInterval(nextCarouselImage, 2500);
    showCarouselImage(0);
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