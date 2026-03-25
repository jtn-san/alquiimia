document.addEventListener("DOMContentLoaded", function () {
// Função para abrir e fechar o menu hambúrguer
function menuOnClick() {
    document.getElementById("menuBar").classList.toggle("change");
    document.getElementById("nav").classList.toggle("change");
    document.getElementById("menuBg").classList.toggle("changeBg");
}

// Seleciona todos os links do menu
const navLinks = document.querySelectorAll("#nav a");
const nav = document.getElementById("nav");
const menuBar = document.getElementById("menuBar");
const menuBg = document.getElementById("menuBg");

// Adiciona evento de clique para fechar o menu
navLinks.forEach(link => {
    link.addEventListener("click", (event) => {
        // Previna o comportamento padrão para que o menu só feche depois da navegação
        event.preventDefault();

        // Obtém o href do link (pode ser uma âncorazão ou URL de outra página)
        const targetId = link.getAttribute("href");

        if (targetId.startsWith("#")) {
            // Se o link for uma âncorazão dentro da mesma página, realiza a rolagem suave

            const targetElement = document.querySelector(targetId); // Seleciona o elemento da seção

            if (targetElement) {
                // Navega suavemente até a seção
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: "smooth"
                });
            }
        } else {
            // Se for uma URL de outra página, permite o comportamento padrão de navegação
            window.location.href = targetId;
        }

        // Fecha o menu após a navegação
        setTimeout(() => {
            menuBar.classList.remove("change");  // Fecha o ícone do menu
            nav.classList.remove("change");      // Fecha o menu principal
            menuBg.classList.remove("changeBg"); // Remove o fundo do menu
        }, 500);  // Delay de 500ms para garantir que a navegação ocorra antes do fechamento
    });
});

});

// Seleciona os links da navegação externa (segunda <nav>)
const externalLinks = document.querySelectorAll(".navBar a");

// Adiciona evento de clique para permitir navegação externa sem interferir no menu
externalLinks.forEach(link => {
    link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");
        if (targetId.startsWith("#")) {
            // Navega suavemente até a seção interna
            event.preventDefault();
            const targetElement = document.querySelector(targetId);
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: "smooth"
            });
        }
    });
});


//PDF
function gerarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });

    // Configuração de margens
    const margemEsquerda = 15;
    const margemSuperior = 20;
    const larguraPagina = doc.internal.pageSize.getWidth();
    const alturaPagina = doc.internal.pageSize.getHeight();
    let y = margemSuperior;

    // Adicionar o Logo (substitua pelo caminho correto)
    const logo = '../img/logoTopo.png';
    try {
        doc.addImage(logo, 'PNG', margemEsquerda, margemSuperior, 50, 20);
    } catch (e) {
        console.warn("Erro ao carregar o logo, continuando sem ele...");
    }

    y += 30; // Ajustar posição para não sobrepor o logo

    // Adicionar título
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Termos de Uso e Serviço da AlQuimia", margemEsquerda, y);
    y += 10;

    // Adicionar a data atual
    const hoje = new Date();
    const dataAtual = hoje.toLocaleDateString("pt-BR");
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Data: ${dataAtual}`, larguraPagina - 40, margemSuperior);

    // Adicionar introdução
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const textoIntro = [
        "Seja Bem-Vindo ao site da AlQuimia. Antes de explorar tudo o que temos a oferecer,",
        "é importante que você entenda e concorde com algumas regras básicas que regem o uso do nosso site.",
        "",
        "Ao usar nosso site e serviços, você automaticamente concorda em seguir as regras que estabelecemos aqui.",
        "Caso não concorde com algo, por favor, considere não usar nossos serviços.",
        "É muito importante para nós que você se sinta seguro e informado a todo momento."
    ];

    let linhasIntro = doc.splitTextToSize(textoIntro.join(" "), larguraPagina - 2 * margemEsquerda);
    linhasIntro.forEach((linha) => {
        if (y + 10 > alturaPagina - 20) {
            doc.addPage();
            y = margemSuperior;
        }
        doc.text(linha, margemEsquerda, y);
        y += 7;
    });

    y += 10; // Espaço após introdução

    // Adicionar cláusulas com controle de quebra de página
    const clauses = [
        { title: "1. Aceitando os Termos", content: "Ao navegar e usar o site da AlQuimia, você concorda automaticamente com nossas regras e condições. Estes termos podem mudar periodicamente e continuar a usar o site significa que você aceita as mudanças." },
        { title: "2. Como Usar o Nosso Site", content: "A maior parte do nosso site está aberta para você sem a necessidade de cadastro. No entanto, algumas seções especiais podem exigir que você crie uma conta. Pedimos que você seja honesto ao fornecer suas informações e que mantenha seus dados seguros e interaja respeitosamente." },
        { title: "3. Sua Privacidade", content: "Na AlQuimia, a privacidade é um valor essencial. Ao interagir com nosso site, você aceita nossa Política de Privacidade, que detalha nossa abordagem responsável e conforme às leis para o manejo dos seus dados pessoais." },
        { title: "4. Direitos de Conteúdo", content: "O conteúdo do site pertence à AlQuimia e é protegido por direitos autorais. Qualquer uso indevido pode resultar em penalidades legais." },
        { title: "5. Cookies e Mais", content: "Utilizamos cookies para melhorar sua experiência. Esses dados nos ajudam a personalizar seu conteúdo, otimizar a navegação, melhorar continuamente o site em design e funcionalidade, e garantir sua segurança online." },
        { title: "6. Explorando Links Externos", content: "Nosso site pode incluir links para sites externos que achamos que podem ser do seu interesse. Note que não temos controle sobre esses sites externos e, portanto, não somos responsáveis pelo seu conteúdo ou políticas." },
        { title: "7. Mudanças e Atualizações", content: "Os Termos de Uso podem ser atualizados. Você sempre encontrará a versão mais recente aqui. Continuar a acessar o site após essas mudanças indica que você concorda com os novos termos." },
    ];

    // Adicionar cláusulas ao PDF com quebra de página
    doc.setFontSize(12);
    clauses.forEach((clause) => {
        doc.setFont("helvetica", "bold");
        if (y + 10 > alturaPagina - 40) {
            doc.addPage();
            y = margemSuperior;
        }
        doc.text(clause.title, margemEsquerda, y);
        y += 7;

        doc.setFont("helvetica", "normal");
        let textLines = doc.splitTextToSize(clause.content, larguraPagina - 2 * margemEsquerda);
        textLines.forEach((linha) => {
            if (y + 10 > alturaPagina - 40) {
                doc.addPage();
                y = margemSuperior;
            }
            doc.text(linha, margemEsquerda, y);
            y += 7;
        });

        y += 5; // Espaço entre cláusulas
    });

    // Adicionar espaço antes da assinatura
    y += 20;

    // Adicionar assinatura após as informações (sem ficar no final da página)
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("Assinado por:", margemEsquerda, y);
    y += 7;
    doc.setFontSize(12);
    doc.text("CEO - AlQuimia", margemEsquerda, y);
    y += 10;

    // Adicionar data da assinatura
    doc.setFontSize(10);
    doc.text(`Data da assinatura: ${dataAtual}`, margemEsquerda, y);
    y += 10;

    // Adicionar imagem da assinatura (invertida em cores)
    const assinaturaImagem = '../img/signiture.png';
    try {
        doc.addImage(assinaturaImagem, 'PNG', margemEsquerda, y, 50, 20);
    } catch (e) {
        console.warn("Erro ao carregar assinatura, continuando sem ela...");
    }

    // Salvar PDF
    try {
        doc.save('Termos_de_Uso_AlQuimia.pdf');
    } catch (e) {
        alert("Erro ao baixar o PDF. Tente novamente.");
        console.error(e);
    }
}
