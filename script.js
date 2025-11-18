
const EMAILJS_CONFIG = {
    serviceID: 'service_v8abypr',     
    templateID: 'template_u45vt9h',    
    publicKey: 'CEP96huntQFGFQemg'       
};
// ============================================

// Função para fechar modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Restaurar scroll
    }
}

// Aguardar o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle do menu hambúrguer
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Fechar menu ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Fechar menu ao clicar fora dele
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu && navMenu.contains(event.target);
        const isClickOnHamburger = hamburger && hamburger.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnHamburger && navMenu && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                // Obter altura real do header
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 75;
                const headerOffset = headerHeight + 10; // Adiciona 10px de espaçamento extra
                
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: Math.max(0, offsetPosition),
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form submission com EmailJS
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnLoading = document.getElementById('btn-loading');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Verificar se EmailJS está carregado
            if (typeof emailjs === 'undefined') {
                alert('Erro: EmailJS não foi carregado. Verifique sua conexão com a internet.');
                return;
            }

            // Verificar se as credenciais foram configuradas
            if (EMAILJS_CONFIG.serviceID === 'YOUR_SERVICE_ID' || 
                EMAILJS_CONFIG.templateID === 'YOUR_TEMPLATE_ID' || 
                EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY') {
                alert('⚠️ EmailJS não configurado! Por favor, configure suas credenciais no arquivo script.js. Veja INSTRUCOES_EMAILJS.md para mais detalhes.');
                return;
            }

            // Mostrar estado de loading
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';

            // Pegar o nome do usuário do input
            const userName = document.getElementById('user_name').value;
            const userEmail = document.getElementById('user_email').value;
            const userPhone = document.getElementById('user_phone').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Exibir no console (para debug)
            console.log('Nome do usuário:', userName);
            console.log('Email do usuário:', userEmail);
            console.log('Telefone do usuário:', userPhone);
            console.log('Assunto:', subject);
            console.log('Mensagem:', message);
            
            // Você pode usar essas variáveis para qualquer coisa:
            // - Exibir em uma mensagem personalizada
            // - Enviar para outro serviço
            // - Usar no subject ou corpo do email
            // - etc.

            // Inicializar EmailJS com a chave pública
            emailjs.init(EMAILJS_CONFIG.publicKey);

            // Elemento para mensagem de sucesso/erro
            const formMessage = document.getElementById('form-message');
            
            // Verificar se o elemento existe
            if (!formMessage) {
                console.error('Elemento form-message não encontrado!');
            }
            
            // Enviar email usando EmailJS
            emailjs.sendForm(EMAILJS_CONFIG.serviceID, EMAILJS_CONFIG.templateID, this)
                .then(function(response) {
                    // Sucesso - Email enviado para edfran.105@gmail.com
                    console.log('Email enviado com sucesso para edfran.105@gmail.com!', response);
                    console.log('Edfran receberá o email com os dados do cliente:', {
                        nome: userName,
                        email: userEmail,
                        telefone: userPhone,
                        assunto: subject,
                        mensagem: message
                    });
                    
                    // Mostrar modal de sucesso
                    const successModal = document.getElementById('success-modal');
                    const modalMessage = document.getElementById('modal-message');
                    
                    if (successModal && modalMessage) {
                        modalMessage.innerHTML = `
                            Olá <strong>${userName}</strong>!<br><br>
                            Sua mensagem foi enviada e recebida com sucesso.<br><br>
                            Entraremos em contato em breve através do:<br>
                            📧 Email: <strong>${userEmail}</strong><br>
                            📱 Telefone: <strong>${userPhone}</strong><br><br>
                            <em>Obrigado por entrar em contato com a Speed Fibra!</em>
                        `;
                        
                        successModal.classList.add('show');
                        document.body.style.overflow = 'hidden'; // Prevenir scroll
                    }
                    
                    // Resetar botão
                    submitBtn.disabled = false;
                    btnText.style.display = 'inline';
                    btnLoading.style.display = 'none';
                    
                    // Limpar formulário após sucesso
                    contactForm.reset();
                }, function(error) {
                    // Erro
                    submitBtn.disabled = false;
                    btnText.style.display = 'inline';
                    btnLoading.style.display = 'none';
                    
                    console.error('Erro ao enviar email:', error);
                    console.error('Detalhes do erro:', {
                        status: error.status,
                        text: error.text,
                        message: error.message
                    });
                    
                    let errorMessage = '❌ Erro ao enviar mensagem. ';
                    let errorDetails = '';
                    
                    // Mensagens de erro mais específicas
                    if (error.status === 400) {
                        errorMessage += 'Verifique se todos os campos estão preenchidos corretamente.';
                        errorDetails = 'Por favor, verifique se todos os campos foram preenchidos corretamente e tente novamente.';
                    } else if (error.status === 401) {
                        errorMessage += 'Erro de autenticação. Verifique as credenciais do EmailJS.';
                        errorDetails = 'Erro de configuração. Por favor, entre em contato pelo WhatsApp: (75) 9 9117-1455';
                    } else if (error.status === 404) {
                        errorMessage += 'Template ou Service não encontrado. Verifique as configurações.';
                        errorDetails = 'Erro de configuração. Por favor, entre em contato pelo WhatsApp: (75) 9 9117-1455';
                    } else {
                        errorMessage += 'Por favor, tente novamente ou entre em contato pelo WhatsApp: (75) 9 9117-1455';
                        errorDetails = 'Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente ou entre em contato diretamente pelo WhatsApp: (75) 9 9117-1455';
                    }
                    
                    // Mostrar modal de erro
                    const errorModal = document.getElementById('error-modal');
                    const errorModalMessage = document.getElementById('error-modal-message');
                    
                    if (errorModal && errorModalMessage) {
                        errorModalMessage.textContent = errorDetails;
                        errorModal.classList.add('show');
                        document.body.style.overflow = 'hidden'; // Prevenir scroll
                    } else {
                        // Fallback para alert se modal não existir
                        alert(errorMessage);
                    }
                });
        });
    }

    // Fechar modais ao clicar no botão de fechar
    const closeSuccessModal = document.getElementById('close-modal');
    const closeErrorModal = document.getElementById('close-error-modal');
    const modalOkBtn = document.getElementById('modal-ok-btn');
    const errorModalOkBtn = document.getElementById('error-modal-ok-btn');
    const successModal = document.getElementById('success-modal');
    const errorModal = document.getElementById('error-modal');

    if (closeSuccessModal) {
        closeSuccessModal.addEventListener('click', function() {
            closeModal('success-modal');
        });
    }

    if (closeErrorModal) {
        closeErrorModal.addEventListener('click', function() {
            closeModal('error-modal');
        });
    }

    if (modalOkBtn) {
        modalOkBtn.addEventListener('click', function() {
            closeModal('success-modal');
        });
    }

    if (errorModalOkBtn) {
        errorModalOkBtn.addEventListener('click', function() {
            closeModal('error-modal');
        });
    }

    // Fechar modal ao clicar fora dele
    if (successModal) {
        successModal.addEventListener('click', function(e) {
            if (e.target === successModal) {
                closeModal('success-modal');
            }
        });
    }

    if (errorModal) {
        errorModal.addEventListener('click', function(e) {
            if (e.target === errorModal) {
                closeModal('error-modal');
            }
        });
    }

    // Fechar modal com tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal('success-modal');
            closeModal('error-modal');
        }
    });
});
