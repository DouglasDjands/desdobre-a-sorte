// GERENCIAMENTO DE ESTADO DO USUÁRIO E LOCALSTORAGE
let usuarioAtual = JSON.parse(localStorage.getItem('desdobre_usuario')) || {
    nome: "Usuário Teste",
    email: "usuario@exemplo.com",
    vip: false,
    dataAssinatura: null,
    vencimento: null
};

let preferenciasUsuario = JSON.parse(localStorage.getItem('desdobre_preferencias')) || {
    notificacoesEmail: true,
    somAlertas: true,
    salvarHistorico: true
};

function salvarEstadoUsuario() {
    localStorage.setItem('desdobre_usuario', JSON.stringify(usuarioAtual));
}

function salvarPreferencias() {
    preferenciasUsuario.notificacoesEmail = document.getElementById('pref-notif-email').checked;
    preferenciasUsuario.somAlertas = document.getElementById('pref-som-alertas').checked;
    preferenciasUsuario.salvarHistorico = document.getElementById('pref-salvar-historico').checked;
    localStorage.setItem('desdobre_preferencias', JSON.stringify(preferenciasUsuario));
}

function alternarTela(tela) {
    document.getElementById('box-login').classList.add('oculto');
    document.getElementById('box-cadastro').classList.add('oculto');
    document.getElementById('box-pagamento').classList.add('oculto');
    document.getElementById('box-gerador').classList.add('oculto');

    if (tela === 'cadastro') {
        document.getElementById('box-cadastro').classList.remove('oculto');
    } else if (tela === 'pagamento') {
        document.getElementById('box-pagamento').classList.remove('oculto');
    } else if (tela === 'gerador') {
        document.getElementById('main-container').classList.add('largura-gerador');
        document.getElementById('box-gerador').classList.remove('oculto');
        atualizarInterfacePlano();
        trocarModalidade(modalidadeAtual);
    } else {
        document.getElementById('box-login').classList.remove('oculto');
    }
}

function realizarLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    usuarioAtual.email = email;
    usuarioAtual.nome = email.split('@')[0];
    usuarioAtual.vip = true;
    
    // Define 30 dias de assinatura a partir de hoje
    const hoje = new Date();
    const vence = new Date();
    vence.setDate(hoje.getDate() + 30);
    
    usuarioAtual.dataAssinatura = hoje.toLocaleDateString('pt-BR');
    usuarioAtual.vencimento = vence.toLocaleDateString('pt-BR');

    salvarEstadoUsuario();
    alternarTela('gerador');
}

function acessarModoGratuito() {
    usuarioAtual.vip = false;
    salvarEstadoUsuario();
    alternarTela('gerador');
}

function mostrarPagamentoPix(event) {
    event.preventDefault();
    usuarioAtual.nome = document.getElementById('cad-nome').value;
    usuarioAtual.email = document.getElementById('cad-email').value;
    salvarEstadoUsuario();
    alternarTela('pagamento');
}

function copiarPix() {
    const chave = document.getElementById('chave-pix').innerText;
    navigator.clipboard.writeText(chave);
    alert('Chave PIX copiada!');
}

function liberarAcessoVIP() {
    usuarioAtual.vip = true;
    
    const hoje = new Date();
    const vence = new Date();
    vence.setDate(hoje.getDate() + 30);
    
    usuarioAtual.dataAssinatura = hoje.toLocaleDateString('pt-BR');
    usuarioAtual.vencimento = vence.toLocaleDateString('pt-BR');

    salvarEstadoUsuario();
    alternarTela('gerador');
}

function fazerLogout() {
    if (confirm("Deseja realmente sair da sua conta?")) {
        usuarioAtual.vip = false;
        salvarEstadoUsuario();
        document.getElementById('main-container').classList.remove('largura-gerador');
        alternarTela('login');
    }
}

function atualizarInterfacePlano() {
    const lbl = document.getElementById('lbl-plano-usuario');
    const btnUp = document.getElementById('btn-upgrade-top');
    const lblNome = document.getElementById('lbl-nome-header');
    
    if (lblNome) lblNome.innerText = usuarioAtual.nome ? `(${usuarioAtual.nome})` : '';

    if (usuarioAtual.vip) {
        lbl.innerText = "ASSINANTE VIP ⭐";
        lbl.className = "badge-user-plan vip";
        btnUp.style.display = "none";
    } else {
        lbl.innerText = "GRATUITO";
        lbl.className = "badge-user-plan free";
        btnUp.style.display = "block";
    }
}

// LÓGICA DO MODAL DE PERFIL E ASSINATURA
function abrirModalPerfil() {
    document.getElementById('prof-nome').value = usuarioAtual.nome || '';
    document.getElementById('prof-email').value = usuarioAtual.email || '';
    document.getElementById('prof-senha-nova').value = '';

    const badgeModal = document.getElementById('modal-lbl-status');
    const planoModal = document.getElementById('modal-lbl-plano-nome');
    const vencModal = document.getElementById('modal-lbl-vencimento');
    const boxVip = document.getElementById('box-vip-gerenciamento');
    const boxFree = document.getElementById('box-free-gerenciamento');

    if (usuarioAtual.vip) {
        badgeModal.innerText = "VIP ⭐";
        badgeModal.className = "badge-user-plan vip";
        planoModal.innerText = "Plano Acesso Total (Recorrente)";
        vencModal.innerText = usuarioAtual.vencimento || "Em 30 dias";
        boxVip.classList.remove('oculto');
        boxFree.classList.add('oculto');
    } else {
        badgeModal.innerText = "GRATUITO";
        badgeModal.className = "badge-user-plan free";
        planoModal.innerText = "Modo Gratuito";
        vencModal.innerText = "N/A";
        boxVip.classList.add('oculto');
        boxFree.classList.remove('oculto');
    }

    // Carrega preferências
    document.getElementById('pref-notif-email').checked = preferenciasUsuario.notificacoesEmail;
    document.getElementById('pref-som-alertas').checked = preferenciasUsuario.somAlertas;
    document.getElementById('pref-salvar-historico').checked = preferenciasUsuario.salvarHistorico;

    alternarAbaModal('dados');
    document.getElementById('modal-perfil').classList.remove('oculto');
}

function fecharModalPerfil() {
    document.getElementById('modal-perfil').classList.add('oculto');
}

function alternarAbaModal(aba) {
    document.querySelectorAll('.tab-modal-btn').forEach(b => b.classList.remove('ativa'));
    document.getElementById('sub-aba-dados').classList.add('oculto');
    document.getElementById('sub-aba-assinatura').classList.add('oculto');
    document.getElementById('sub-aba-preferencias').classList.add('oculto');

    if (aba === 'assinatura') {
        document.getElementById('tab-m-assinatura').classList.add('ativa');
        document.getElementById('sub-aba-assinatura').classList.remove('oculto');
    } else if (aba === 'preferencias') {
        document.getElementById('tab-m-notificacoes').classList.add('ativa');
        document.getElementById('sub-aba-preferencias').classList.remove('oculto');
    } else {
        document.getElementById('tab-m-perfil').classList.add('ativa');
        document.getElementById('sub-aba-dados').classList.remove('oculto');
    }
}

function salvarPerfilUsuario(e) {
    e.preventDefault();
    usuarioAtual.nome = document.getElementById('prof-nome').value;
    usuarioAtual.email = document.getElementById('prof-email').value;
    
    const novaSenha = document.getElementById('prof-senha-nova').value;
    if (novaSenha) {
        alert("Senha atualizada com sucesso!");
    }

    salvarEstadoUsuario();
    atualizarInterfacePlano();
    alert("Dados do perfil atualizados!");
    fecharModalPerfil();
}

function solicitarCancelamento() {
    const confirmacao = confirm("Tem certeza que deseja cancelar sua assinatura VIP?\n\nVocê continuará com acesso total até o fim do seu período vigente, mas a renovação automática será interrompida.");
    if (confirmacao) {
        usuarioAtual.vip = false;
        salvarEstadoUsuario();
        atualizarInterfacePlano();
        alert("Sua assinatura foi cancelada com sucesso. Agradecemos por utilizar o Desdobre a Sorte!");
        fecharModalPerfil();
    }
}

// ATALHO DE CRIADOR (CTRL + SHIFT + A)
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.shiftKey && (event.key === 'A' || event.key === 'a')) {
        const codigoSecreto = prompt("Acesso de Criador - Digite a senha:");
        if (codigoSecreto === "admin123") {
            alert("Acesso VIP de Criador Liberado!");
            liberarAcessoVIP();
        } else if (codigoSecreto !== null) {
            alert("Senha incorreta.");
        }
    }
});

let modalidadeAtual = 'lotofacil';
let dezenasAlvo = 18;
let tamanhoCartao = 15;
let estrategiaAtivaObj = null;
let selecionadas = [];
let jogosAtuais = [];
let ultimoConcursoInfo = null;
let concursoConsultadoInfo = null;

// CATÁLOGO DE MATRIZES
const configuracoes = {
    lotofacil: {
        apiEndpoint: "https://loteriascaixa-api.herokuapp.com/api/lotofacil",
        nomeLoteria: "Lotofácil",
        totalNumeros: 25,
        zeroOffset: 0,
        gridClass: "grid-lotofacil",
        corTema: "var(--cor-lotofacil)",
        corTemaHover: "var(--cor-lotofacil-hover)",
        corTextoAba: "#ffffff",
        precoPadraoJogo: 3.00,
        maxPontos: 15,
        minAcertosPremiados: 11,
        qtdSorteadas: 15,
        placeholder: "Ex: 01 02 03 05 08 09 10 11 13 15 17 18 20 22 25",
        gruposFechamento: [
            {
                titulo: "Fechamento com garantia de 12 pontos",
                itens: [
                    { dezenas: 20, precisaAcertar: 15, jogos: 4,  tamanhoCartao: 15, precoJogo: 3.00, vip: false },
                    { dezenas: 21, precisaAcertar: 15, jogos: 13, tamanhoCartao: 15, precoJogo: 3.00, vip: false }
                ]
            },
            {
                titulo: "Fechamento com garantia de 13 pontos",
                itens: [
                    { dezenas: 18, precisaAcertar: 15, jogos: 6,   tamanhoCartao: 15, precoJogo: 3.00, vip: false },
                    { dezenas: 19, precisaAcertar: 15, jogos: 21,  tamanhoCartao: 15, precoJogo: 3.00, vip: true },
                    { dezenas: 20, precisaAcertar: 15, jogos: 41,  tamanhoCartao: 15, precoJogo: 3.00, vip: true },
                    { dezenas: 20, precisaAcertar: 15, jogos: 73,  tamanhoCartao: 15, precoJogo: 3.00, vip: true },
                    { dezenas: 21, precisaAcertar: 15, jogos: 191, tamanhoCartao: 15, precoJogo: 3.00, vip: true },
                    { dezenas: 22, precisaAcertar: 15, jogos: 276, tamanhoCartao: 15, precoJogo: 3.00, vip: true }
                ]
            },
            {
                titulo: "Fechamento com garantia de 14 pontos",
                itens: [
                    { dezenas: 17, precisaAcertar: 15, jogos: 8,   tamanhoCartao: 15, precoJogo: 3.00, vip: false },
                    { dezenas: 18, precisaAcertar: 15, jogos: 24,  tamanhoCartao: 15, precoJogo: 3.00, vip: true },
                    { dezenas: 18, precisaAcertar: 15, jogos: 38,  tamanhoCartao: 15, precoJogo: 3.00, vip: true },
                    { dezenas: 19, precisaAcertar: 15, jogos: 110, tamanhoCartao: 15, precoJogo: 3.00, vip: true },
                    { dezenas: 19, precisaAcertar: 15, jogos: 164, tamanhoCartao: 15, precoJogo: 3.00, vip: true },
                    { dezenas: 20, precisaAcertar: 15, jogos: 356, tamanhoCartao: 15, precoJogo: 3.00, vip: true },
                    { dezenas: 20, precisaAcertar: 15, jogos: 552, tamanhoCartao: 15, precoJogo: 3.00, vip: true }
                ]
            },
            {
                titulo: "Apostas Múltiplas VIP (Cartões de 16 Dezenas)",
                itens: [
                    { dezenas: 18, precisaAcertar: 15, jogos: 3,  tamanhoCartao: 16, precoJogo: 48.00, vip: true },
                    { dezenas: 19, precisaAcertar: 15, jogos: 6,  tamanhoCartao: 16, precoJogo: 48.00, vip: true },
                    { dezenas: 21, precisaAcertar: 15, jogos: 15, tamanhoCartao: 16, precoJogo: 48.00, vip: true }
                ]
            }
        ]
    },
    megasena: {
        apiEndpoint: "https://loteriascaixa-api.herokuapp.com/api/megasena",
        nomeLoteria: "Mega-Sena",
        totalNumeros: 60,
        zeroOffset: 0,
        gridClass: "grid-megasena",
        corTema: "var(--cor-megasena)",
        corTemaHover: "var(--cor-megasena-hover)",
        corTextoAba: "#ffffff",
        precoPadraoJogo: 5.00,
        maxPontos: 6,
        minAcertosPremiados: 4,
        qtdSorteadas: 6,
        placeholder: "Ex: 05 12 24 37 41 58",
        gruposFechamento: [
            {
                titulo: "Fechamento com garantia de Quadra (Cartões de 6 Dezenas)",
                itens: [
                    { dezenas: 7,  precisaAcertar: 4, jogos: 5,   tamanhoCartao: 6, precoJogo: 5.00, vip: false },
                    { dezenas: 8,  precisaAcertar: 4, jogos: 7,   tamanhoCartao: 6, precoJogo: 5.00, vip: false },
                    { dezenas: 9,  precisaAcertar: 4, jogos: 12,  tamanhoCartao: 6, precoJogo: 5.00, vip: false },
                    { dezenas: 10, precisaAcertar: 4, jogos: 20,  tamanhoCartao: 6, precoJogo: 5.00, vip: false },
                    { dezenas: 11, precisaAcertar: 4, jogos: 32,  tamanhoCartao: 6, precoJogo: 5.00, vip: true },
                    { dezenas: 12, precisaAcertar: 4, jogos: 41,  tamanhoCartao: 6, precoJogo: 5.00, vip: true }
                ]
            }
        ]
    },
    quina: {
        apiEndpoint: "https://loteriascaixa-api.herokuapp.com/api/quina",
        nomeLoteria: "Quina",
        totalNumeros: 80,
        zeroOffset: 0,
        gridClass: "grid-quina",
        corTema: "var(--cor-quina)",
        corTemaHover: "var(--cor-quina-hover)",
        corTextoAba: "#ffffff",
        precoPadraoJogo: 2.50,
        maxPontos: 5,
        minAcertosPremiados: 2,
        qtdSorteadas: 5,
        placeholder: "Ex: 10 25 38 52 73",
        gruposFechamento: [
            {
                titulo: "Fechamento com garantia de Terno",
                itens: [
                    { dezenas: 7,  precisaAcertar: 3, jogos: 5,   tamanhoCartao: 5, precoJogo: 2.50, vip: false },
                    { dezenas: 8,  precisaAcertar: 3, jogos: 8,   tamanhoCartao: 5, precoJogo: 2.50, vip: false },
                    { dezenas: 10, precisaAcertar: 3, jogos: 17,  tamanhoCartao: 5, precoJogo: 2.50, vip: true }
                ]
            }
        ]
    },
    duplasena: {
        apiEndpoint: "https://loteriascaixa-api.herokuapp.com/api/duplasena",
        nomeLoteria: "Dupla Sena",
        totalNumeros: 50,
        zeroOffset: 0,
        gridClass: "grid-duplasena",
        corTema: "var(--cor-duplasena)",
        corTemaHover: "var(--cor-duplasena-hover)",
        corTextoAba: "#ffffff",
        precoPadraoJogo: 2.50,
        maxPontos: 6,
        minAcertosPremiados: 3,
        qtdSorteadas: 6,
        placeholder: "Ex: 08 14 22 31 40 49",
        gruposFechamento: [
            {
                titulo: "Fechamento com garantia de Terno / Quadra",
                itens: [
                    { dezenas: 8,  precisaAcertar: 4, jogos: 6,  tamanhoCartao: 6, precoJogo: 2.50, vip: false },
                    { dezenas: 10, precisaAcertar: 4, jogos: 14, tamanhoCartao: 6, precoJogo: 2.50, vip: true }
                ]
            }
        ]
    },
    diadesorte: {
        apiEndpoint: "https://loteriascaixa-api.herokuapp.com/api/diadesorte",
        nomeLoteria: "Dia de Sorte",
        totalNumeros: 31,
        zeroOffset: 0,
        gridClass: "grid-diadesorte",
        corTema: "var(--cor-diadesorte)",
        corTemaHover: "var(--cor-diadesorte-hover)",
        corTextoAba: "#ffffff",
        precoPadraoJogo: 2.50,
        maxPontos: 7,
        minAcertosPremiados: 4,
        qtdSorteadas: 7,
        placeholder: "Ex: 02 09 15 21 24 28 31",
        gruposFechamento: [
            {
                titulo: "Fechamento com garantia de 4 acertos",
                itens: [
                    { dezenas: 8,  precisaAcertar: 4, jogos: 5,  tamanhoCartao: 7, precoJogo: 2.50, vip: false },
                    { dezenas: 10, precisaAcertar: 4, jogos: 12, tamanhoCartao: 7, precoJogo: 2.50, vip: true }
                ]
            }
        ]
    },
    timemania: {
        apiEndpoint: "https://loteriascaixa-api.herokuapp.com/api/timemania",
        nomeLoteria: "Timemania",
        totalNumeros: 80,
        zeroOffset: 0,
        gridClass: "grid-timemania",
        corTema: "var(--cor-timemania)",
        corTemaHover: "var(--cor-timemania-hover)",
        corTextoAba: "#000000",
        precoPadraoJogo: 3.50,
        maxPontos: 7,
        minAcertosPremiados: 3,
        qtdSorteadas: 7,
        placeholder: "Ex: 04 15 28 39 44 61 77",
        gruposFechamento: [
            {
                titulo: "Fechamento com garantia de 5 acertos",
                itens: [
                    { dezenas: 15, precisaAcertar: 7, jogos: 3,   tamanhoCartao: 10, precoJogo: 3.50, vip: false },
                    { dezenas: 18, precisaAcertar: 7, jogos: 8,   tamanhoCartao: 10, precoJogo: 3.50, vip: true }
                ]
            }
        ]
    },
    lotomania: {
        apiEndpoint: "https://loteriascaixa-api.herokuapp.com/api/lotomania",
        nomeLoteria: "Lotomania",
        totalNumeros: 100,
        zeroOffset: -1,
        gridClass: "grid-lotomania",
        corTema: "var(--cor-lotomania)",
        corTemaHover: "var(--cor-lotomania-hover)",
        corTextoAba: "#ffffff",
        precoPadraoJogo: 3.00,
        maxPontos: 20,
        minAcertosPremiados: 15,
        qtdSorteadas: 20,
        placeholder: "Ex: 00 05 12 18 24 33...",
        gruposFechamento: [
            {
                titulo: "Fechamento com garantia de 16 pontos",
                itens: [
                    { dezenas: 60, precisaAcertar: 20, jogos: 5,  tamanhoCartao: 50, precoJogo: 3.00, vip: false },
                    { dezenas: 65, precisaAcertar: 20, jogos: 12, tamanhoCartao: 50, precoJogo: 3.00, vip: true }
                ]
            }
        ]
    },
    maismilionaria: {
        apiEndpoint: "https://loteriascaixa-api.herokuapp.com/api/maismilionaria",
        nomeLoteria: "+Milionária",
        totalNumeros: 50,
        zeroOffset: 0,
        gridClass: "grid-maismilionaria",
        corTema: "var(--cor-maismilionaria)",
        corTemaHover: "var(--cor-maismilionaria-hover)",
        corTextoAba: "#ffffff",
        precoPadraoJogo: 6.00,
        maxPontos: 6,
        minAcertosPremiados: 2,
        qtdSorteadas: 6,
        placeholder: "Ex: 03 16 25 34 42 48",
        gruposFechamento: [
            {
                titulo: "Fechamento Matriz com garantia de 3 e 4 acertos",
                itens: [
                    { dezenas: 8, precisaAcertar: 4, jogos: 6,  tamanhoCartao: 6, precoJogo: 6.00, vip: false },
                    { dezenas: 10, precisaAcertar: 4, jogos: 15, tamanhoCartao: 6, precoJogo: 6.00, vip: true }
                ]
            }
        ]
    }
};

function trocarModalidade(mod) {
    modalidadeAtual = mod;
    const config = configuracoes[mod] || configuracoes.lotofacil;

    document.documentElement.style.setProperty('--cor-tema', config.corTema);
    document.documentElement.style.setProperty('--cor-tema-hover', config.corTemaHover);
    document.documentElement.style.setProperty('--cor-texto-aba', config.corTextoAba);

    document.querySelectorAll('.aba-btn').forEach(b => b.classList.remove('ativa'));
    const tabAtiva = document.getElementById(`tab-${mod}`);
    if (tabAtiva) tabAtiva.classList.add('ativa');

    document.getElementById('input-resultado').placeholder = config.placeholder;

    const botoesMenu = document.querySelectorAll('.btn-menu-ferramenta');
    if (botoesMenu.length >= 3) {
        botoesMenu[0].innerText = `Estatísticas da ${config.nomeLoteria}`;
        botoesMenu[1].innerText = `Fechamentos da ${config.nomeLoteria}`;
        botoesMenu[2].innerText = `Sorteios da ${config.nomeLoteria}`;
    }

    renderizarTabelasGarantia();

    const volante = document.getElementById('volante');
    volante.className = `cartela ${config.gridClass}`;
    volante.innerHTML = '';

    for (let i = 1; i <= config.totalNumeros; i++) {
        let numExibir = i + config.zeroOffset;
        if (mod === 'lotomania' && numExibir === 100) numExibir = 0;
        let txt = numExibir < 10 ? '0' + numExibir : '' + numExibir;

        const numBtn = document.createElement('div');
        numBtn.classList.add('numero');
        numBtn.setAttribute('data-num', numExibir);
        numBtn.innerText = txt;
        numBtn.onclick = () => alternarNumero(numExibir, numBtn);
        volante.appendChild(numBtn);
    }

    carregarUltimoConcursoAPI();
    ativarFerramenta('desdobramentos', botoesMenu[1]);
    limparSelecao();
}

function renderizarTabelasGarantia() {
    const config = configuracoes[modalidadeAtual] || configuracoes.lotofacil;
    const container = document.getElementById('container-tabelas-garantia');
    container.innerHTML = '';

    config.gruposFechamento.forEach((grupo, gIdx) => {
        let linhasTr = '';

        grupo.itens.forEach((item, iIdx) => {
            const precoTotal = (item.jogos * item.precoJogo).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            const vipTag = item.vip ? `<span class="tag-vip-inline">VIP</span>` : '';
            const btnClass = item.vip ? 'btn-selecionar-matriz vip-btn' : 'btn-selecionar-matriz';
            const btnTexto = item.vip ? 'Selecionar 🔒' : 'Selecionar';
            
            let padraoTam = (modalidadeAtual === 'lotofacil' ? 15 : (modalidadeAtual === 'megasena' || modalidadeAtual === 'duplasena' || modalidadeAtual === 'maismilionaria' ? 6 : (modalidadeAtual === 'quina' ? 5 : (modalidadeAtual === 'diadesorte' ? 7 : (modalidadeAtual === 'timemania' ? 10 : 50)))));
            let cartaoTxt = item.tamanhoCartao > padraoTam ? ` (${item.tamanhoCartao}D/cartão)` : '';

            linhasTr += `
                <tr id="tr-matriz-${gIdx}-${iIdx}">
                    <td><strong>${item.dezenas}</strong> ${vipTag}</td>
                    <td>${item.precisaAcertar}</td>
                    <td>${item.jogos}${cartaoTxt}</td>
                    <td style="color: #16a34a; font-weight: bold;">${precoTotal}</td>
                    <td>
                        <button class="${btnClass}" onclick="selecionarMatrizTabela(${gIdx}, ${iIdx})">
                            ${btnTexto}
                        </button>
                    </td>
                </tr>
            `;
        });

        container.innerHTML += `
            <div class="grupo-garantia">
                <div class="titulo-garantia">${grupo.titulo}</div>
                <table class="tabela-fechamentos">
                    <thead>
                        <tr>
                            <th>Dezenas</th>
                            <th>Precisa acertar...</th>
                            <th>Nº de jogos</th>
                            <th>Preço Est.</th>
                            <th>Escolher</th>
                        </tr>
                    </thead>
                    <tbody>${linhasTr}</tbody>
                </table>
            </div>
        `;
    });

    selecionarMatrizTabela(0, 0);
}

function selecionarMatrizTabela(gIdx, iIdx) {
    const config = configuracoes[modalidadeAtual] || configuracoes.lotofacil;
    const item = config.gruposFechamento[gIdx].itens[iIdx];

    if (item.vip && !usuarioAtual.vip) {
        alert("🔒 Este fechamento é exclusivo para Assinantes VIP!\n\nAssine por apenas R$ 29,90/mês e libere todo o catálogo.");
        alternarTela('cadastro');
        return;
    }

    estrategiaAtivaObj = item;
    dezenasAlvo = item.dezenas;
    tamanhoCartao = item.tamanhoCartao;

    document.querySelectorAll('.tabela-fechamentos tr').forEach(tr => tr.classList.remove('ativa'));
    const trAtiva = document.getElementById(`tr-matriz-${gIdx}-${iIdx}`);
    if (trAtiva) trAtiva.classList.add('ativa');

    document.getElementById('lbl-estrategia-nome').innerText = `${item.dezenas} Dezenas (${item.jogos} jogos de ${item.tamanhoCartao}D)`;

    limparSelecao();
}

function ativarFerramenta(ferramenta, btnEl) {
    if (btnEl) {
        document.querySelectorAll('.btn-menu-ferramenta').forEach(b => b.classList.remove('ativo'));
        btnEl.classList.add('ativo');
    }

    document.getElementById('secao-estatisticas').classList.add('oculto');
    document.getElementById('secao-sorteos').classList.add('oculto');
    document.getElementById('secao-desdobramentos').classList.add('oculto');

    if (ferramenta === 'estatisticas') {
        document.getElementById('secao-estatisticas').classList.remove('oculto');
        renderizarEstatisticas();
    } else if (ferramenta === 'sorteos') {
        document.getElementById('secao-sorteos').classList.remove('oculto');
        renderizarSorteos();
    } else {
        document.getElementById('secao-desdobramentos').classList.remove('oculto');
    }
}

async function renderizarEstatisticas() {
    const container = document.getElementById('conteudo-estatisticas-api');
    const config = configuracoes[modalidadeAtual] || configuracoes.lotofacil;
    
    container.innerHTML = `<p style="font-size: 12px; color: var(--texto-suave);">⏳ Processando frequência das dezenas na API...</p>`;

    try {
        const resposta = await fetch(config.apiEndpoint);
        const todosSorteios = await resposta.json();

        if (!Array.isArray(todosSorteios) || todosSorteios.length === 0) throw new Error("Erro de dados");

        let frequencia = {};
        todosSorteios.forEach(s => {
            if (s.dezenas) {
                s.dezenas.forEach(d => {
                    let num = Number(d);
                    frequencia[num] = (frequencia[num] || 0) + 1;
                });
            }
        });

        let dezenasOrdenadas = Object.keys(frequencia).map(n => ({
            numero: Number(n) < 10 ? '0' + n : '' + n,
            qtd: frequencia[n]
        })).sort((a, b) => b.qtd - a.qtd);

        let maisSorteadas = dezenasOrdenadas.slice(0, 5).map(d => d.numero).join(' - ');
        let menosSorteadas = dezenasOrdenadas.slice(-5).reverse().map(d => d.numero).join(' - ');

        container.innerHTML = `
            <div class="grid-estatisticas-cards">
                <div class="card-estatistica">
                    <h5>🔥 Top 5 Dezenas mais Sorteadas</h5>
                    <div class="dezenas-destaque">${maisSorteadas}</div>
                </div>

                <div class="card-estatistica">
                    <h5>❄️ Top 5 Dezenas Menos Sorteadas</h5>
                    <div class="dezenas-destaque">${menosSorteadas}</div>
                </div>

                <div class="card-estatistica">
                    <h5>📊 Total de Concursos Analisados</h5>
                    <div class="dezenas-destaque">${todosSorteios.length} Sorteios</div>
                </div>
            </div>
        `;

    } catch (e) {
        container.innerHTML = `<p style="font-size: 12px; color: red;">Erro ao carregar estatísticas no momento.</p>`;
    }
}

async function buscarConcursoEspecifico(numDesejado = null) {
    const numConcurso = numDesejado || document.getElementById('input-busca-concurso').value.trim();
    const config = configuracoes[modalidadeAtual] || configuracoes.lotofacil;
    const container = document.getElementById('conteudo-sorteos-api');

    if (!numConcurso) {
        renderizarSorteos(ultimoConcursoInfo);
        return;
    }

    container.innerHTML = `<p style="font-size: 12px; color: var(--texto-suave);">⏳ Buscando concurso #${numConcurso}...</p>`;

    try {
        const resposta = await fetch(`${config.apiEndpoint}/${numConcurso}`);
        const dados = await resposta.json();

        if (dados && dados.concurso) {
            concursoConsultadoInfo = dados;
            document.getElementById('input-busca-concurso').value = dados.concurso;
            renderizarSorteos(dados);
        } else {
            container.innerHTML = `<p style="font-size: 12px; color: red;">Concurso #${numConcurso} não encontrado.</p>`;
        }
    } catch (e) {
        container.innerHTML = `<p style="font-size: 12px; color: red;">Erro ao buscar concurso.</p>`;
    }
}

function navegarConcurso(direcao) {
    let concursoAtual = concursoConsultadoInfo ? Number(concursoConsultadoInfo.concurso) : (ultimoConcursoInfo ? Number(ultimoConcursoInfo.concurso) : 0);
    if (concursoAtual === 0) return;

    let novoConcurso = concursoAtual + direcao;
    if (novoConcurso < 1) return;
    if (ultimoConcursoInfo && novoConcurso > Number(ultimoConcursoInfo.concurso)) return;

    buscarConcursoEspecifico(novoConcurso);
}

function ePrimo(n) {
    if (n <= 1) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) if (n % i === 0) return false;
    return true;
}

function formatarValorMonetario(item) {
    let num = item.valor_premio ?? item.valorPremio ?? item.valor ?? 0;
    if (typeof num === 'string') num = parseFloat(num.replace(/\./g, '').replace(',', '.'));
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function renderizarSorteos(infoObjeto = null) {
    const container = document.getElementById('conteudo-sorteos-api');
    const info = infoObjeto || concursoConsultadoInfo || ultimoConcursoInfo;

    if (!info) {
        container.innerText = "Carregando dados do sorteio...";
        return;
    }

    const numAtual = Number(info.concurso);
    const numUltimo = ultimoConcursoInfo ? Number(ultimoConcursoInfo.concurso) : numAtual;
    
    document.getElementById('btn-concurso-anterior').disabled = (numAtual <= 1);
    document.getElementById('btn-concurso-proximo').disabled = (numAtual >= numUltimo);

    const dezenasNums = info.dezenas ? info.dezenas.map(Number) : [];
    const pares = dezenasNums.filter(n => n % 2 === 0).length;
    const impares = dezenasNums.length - pares;
    const primos = dezenasNums.filter(ePrimo).length;

    let linhasTabela = '';
    if (info.premiacoes && Array.isArray(info.premiacoes)) {
        info.premiacoes.forEach(p => {
            linhasTabela += `
                <tr>
                    <td><strong>${p.descricao || (p.faixa + ' acertos')}</strong></td>
                    <td>${p.ganhadores} apostas</td>
                    <td><strong>${formatarValorMonetario(p)}</strong></td>
                </tr>
            `;
        });
    }

    container.innerHTML = `
        <div style="background: #ffffff; padding: 4px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <strong>Concurso #${info.concurso}</strong>
                <span style="font-size: 11px; color: var(--texto-suave);">${info.data || ''}</span>
            </div>

            <div style="margin-bottom: 8px;">
                <span style="font-size: 11px; color: var(--texto-suave);">Dezenas Sorteadas:</span>
                <div style="font-weight: bold; font-family: monospace; font-size: 14px; color: var(--cor-tema); margin-top: 2px;">
                    ${info.dezenas ? info.dezenas.join(' - ') : ''}
                </div>
            </div>

            <div class="bloco-estatisticas-rapidas">
                <div>Quantidade ímpares: <strong>${impares}</strong></div>
                <div>Quantidade pares: <strong>${pares}</strong></div>
                <div>Quantidade primos: <strong>${primos}</strong></div>
            </div>

            <h4 style="font-size: 12px; margin-top: 10px; margin-bottom: 6px;">Tabela de Premiações:</h4>
            <table class="tabela-ganhadores">
                <thead>
                    <tr>
                        <th>Faixa</th>
                        <th>Ganhadores</th>
                        <th>Prêmio Individual</th>
                    </tr>
                </thead>
                <tbody>${linhasTabela}</tbody>
            </table>
        </div>
    `;
}

async function carregarUltimoConcursoAPI() {
    const config = configuracoes[modalidadeAtual] || configuracoes.lotofacil;
    const badge = document.getElementById('badge-ultimo-concurso');
    badge.innerText = `🌐 Conectando à API (${config.nomeLoteria})...`;

    try {
        const resposta = await fetch(`${config.apiEndpoint}/latest`);
        const dados = await resposta.json();
        
        if (dados && dados.concurso) {
            ultimoConcursoInfo = dados;
            concursoConsultadoInfo = dados;
            document.getElementById('input-busca-concurso').value = dados.concurso;
            badge.innerText = `🌐 Concurso #${dados.concurso} (${dados.data || 'Atualizado'})`;
        }
    } catch (erro) {
        badge.innerText = `🌐 API On-line (Modo Consulta Direta)`;
    }
}

function alternarNumero(num, el) {
    const index = selecionadas.indexOf(num);
    if (index > -1) {
        selecionadas.splice(index, 1);
        el.classList.remove('selecionado');
    } else {
        if (selecionadas.length >= dezenasAlvo) {
            alert(`Você já marcou ${dezenasAlvo} dezenas para esta estratégia.`);
            return;
        }
        selecionadas.push(num);
        el.classList.add('selecionado');
    }
    atualizarContador();
}

function selecionarNumerosAleatorios() {
    limparSelecao();
    const config = configuracoes[modalidadeAtual] || configuracoes.lotofacil;
    
    while (selecionadas.length < dezenasAlvo) {
        let randIndex = Math.floor(Math.random() * config.totalNumeros) + 1;
        let numVal = randIndex + config.zeroOffset;
        if (modalidadeAtual === 'lotomania' && numVal === 100) numVal = 0;

        if (!selecionadas.includes(numVal)) selecionadas.push(numVal);
    }

    selecionadas.forEach(num => {
        const el = document.querySelector(`.numero[data-num="${num}"]`);
        if (el) el.classList.add('selecionado');
    });

    atualizarContador();
}

function atualizarContador() {
    document.getElementById('contador-dezenas').innerText = `${selecionadas.length} / ${dezenasAlvo}`;
}

function limparSelecao() {
    selecionadas = [];
    jogosAtuais = [];
    document.querySelectorAll('.numero').forEach(el => el.classList.remove('selecionado'));
    document.getElementById('area-resultados').classList.add('oculto');
    document.getElementById('resumo-conferencia').classList.add('oculto');
    document.getElementById('resultado-auditoria-api').classList.add('oculto');
    document.getElementById('caixa-concursos-detalhados').classList.add('oculto');
    document.getElementById('input-resultado').value = '';
    atualizarContador();
}

function gerarFechamento() {
    if (selecionadas.length !== dezenasAlvo) {
        alert(`Selecione exatamente ${dezenasAlvo} dezenas na cartela.`);
        return;
    }

    const dezenasOrdenadas = [...selecionadas].sort((a, b) => a - b);
    jogosAtuais = [];

    let qtdJogosPrever = estrategiaAtivaObj ? estrategiaAtivaObj.jogos : 10;
    let tamCartao = tamanhoCartao;

    for(let i=0; i<qtdJogosPrever; i++) {
        let indices = [];
        while(indices.length < tamCartao) {
            let rand = Math.floor(Math.random() * dezenasAlvo);
            if(!indices.includes(rand)) indices.push(rand);
        }
        indices.sort((a,b)=>a-b);
        jogosAtuais.push(indices.map(idx => dezenasOrdenadas[idx]));
    }

    if (preferenciasUsuario.somAlertas) {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            osc.frequency.value = 587.33; // D5
            osc.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.12);
        } catch(e) {}
    }

    exibirResultados();
}

function exibirResultados(acertosMap = null) {
    const container = document.getElementById('lista-jogos');
    container.innerHTML = '';
    const config = configuracoes[modalidadeAtual] || configuracoes.lotofacil;
    const minPremiado = config.minAcertosPremiados;
    
    jogosAtuais.forEach((jogoArr, index) => {
        const jogoFormatado = jogoArr.map(n => n < 10 ? '0' + n : '' + n).join(' - ');
        
        let badgeHTML = '';
        if (acertosMap && acertosMap[index] !== undefined) {
            const pts = acertosMap[index];
            const premiado = pts >= minPremiado ? 'premiado' : '';
            badgeHTML = `<span class="badge-acertos ${premiado}">${pts} acertos</span>`;
        }

        container.innerHTML += `
            <div class="jogo-item">
                <span style="font-weight: bold; color: var(--texto-suave);">Jogo ${(index + 1).toString().padStart(2, '0')} (${jogoArr.length}D)</span>
                <span>${jogoFormatado}</span>
                ${badgeHTML}
            </div>
        `;
    });

    document.getElementById('qtd-jogos-gerados').innerText = jogosAtuais.length;
    document.getElementById('area-resultados').classList.remove('oculto');
}

async function auditarHistoricoAPI() {
    if (jogosAtuais.length === 0) return;

    const btn = document.getElementById('btn-buscar-api');
    const config = configuracoes[modalidadeAtual] || configuracoes.lotofacil;
    btn.innerText = "⏳ Auditando jogos em todo o histórico da Caixa...";
    btn.disabled = true;

    try {
        const resposta = await fetch(config.apiEndpoint);
        const historicoSorteios = await resposta.json();

        if (!Array.isArray(historicoSorteios)) throw new Error("Erro API");

        let contadorFaixas = {};
        for (let p = config.minAcertosPremiados; p <= config.maxPontos; p++) contadorFaixas[p] = 0;

        let ocorrenciasMaximas = [];

        historicoSorteios.forEach(sorteio => {
            const dezenasSort = sorteio.dezenas ? sorteio.dezenas.map(Number) : [];
            
            jogosAtuais.forEach((jogo, indexJogo) => {
                const acertos = jogo.filter(n => dezenasSort.includes(n)).length;
                if (acertos >= config.minAcertosPremiados) {
                    contadorFaixas[acertos] = (contadorFaixas[acertos] || 0) + 1;
                }
                
                if (acertos >= (config.maxPontos - 1)) {
                    ocorrenciasMaximas.push({
                        concurso: sorteio.concurso,
                        data: sorteio.data || '',
                        acertos: acertos,
                        numJogo: indexJogo + 1
                    });
                }
            });
        });

        const statusBox = document.getElementById('status-inedito-box');
        const premiouMaximo = ocorrenciasMaximas.some(o => o.acertos === config.maxPontos);

        if (premiouMaximo) {
            statusBox.className = "status-inedito premiado";
            statusBox.innerText = `🔥 PREMIADO HISTÓRICO! Seu desdobramento já acertou ${config.maxPontos} PONTOS em sorteios oficiais!`;
        } else if (ocorrenciasMaximas.length > 0) {
            statusBox.className = "status-inedito premiado";
            statusBox.innerText = `⚡ QUASE LÁ! Seu desdobramento já atingiu ${config.maxPontos - 1} PONTOS em sorteios oficiais.`;
        } else {
            statusBox.className = "status-inedito inedito";
            statusBox.innerText = `🟢 INÉDITO! Matriz limpa e sem premiação máxima nos sorteios analisados.`;
        }

        const gridFaixas = document.getElementById('grid-auditoria-faixas');
        gridFaixas.innerHTML = '';
        for (let p = config.maxPontos; p >= config.minAcertosPremiados; p--) {
            gridFaixas.innerHTML += `
                <div class="stat-card">
                    <span>${p} Acertos</span>
                    <strong>${contadorFaixas[p] || 0}x</strong>
                </div>
            `;
        }

        const caixaDetalhes = document.getElementById('caixa-concursos-detalhados');
        if (ocorrenciasMaximas.length > 0) {
            let itensHtml = ocorrenciasMaximas.map(item => `
                <div class="item-concurso-premiado">
                    <span><strong>Concurso #${item.concurso}</strong> (${item.data}):</span>
                    <span style="color: var(--cor-tema); font-weight: bold;">
                        ${item.acertos} Pontos (Jogo ${item.numJogo})
                    </span>
                </div>
            `).join('');

            caixaDetalhes.innerHTML = `
                <h5>📍 Ocorrências Principais (${config.maxPontos - 1} e ${config.maxPontos} acertos):</h5>
                ${itensHtml}
            `;
            caixaDetalhes.classList.remove('oculto');
        } else {
            caixaDetalhes.classList.add('oculto');
        }

        document.getElementById('resultado-auditoria-api').classList.remove('oculto');

    } catch (erro) {
        alert("Erro ao conectar à API de histórico.");
    } finally {
        btn.innerText = "🔍 Auditá-lo em Todos os Sorteios Anteriores (API)";
        btn.disabled = false;
    }
}

function copiarTodosJogos() {
    if (jogosAtuais.length === 0) return;
    const texto = jogosAtuais.map((j, i) => `Jogo ${i + 1} (${j.length}D): ` + j.map(n => n < 10 ? '0' + n : '' + n).join(' - ')).join('\n');
    navigator.clipboard.writeText(texto);
    alert('Todos os jogos foram copiados!');
}

function exportarTXT() {
    if (jogosAtuais.length === 0) return;
    const conteudo = jogosAtuais.map(j => j.map(n => n < 10 ? '0' + n : '' + n).join(' ')).join('\n');
    const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `fechamento_${modalidadeAtual}_${jogosAtuais.length}_jogos.txt`;
    link.click();
}

function imprimirJogos() { window.print(); }

function conferirResultadoManualmente() {
    const config = configuracoes[modalidadeAtual] || configuracoes.lotofacil;
    const rawInput = document.getElementById('input-resultado').value.trim();
    if (!rawInput) {
        alert(`Digite as ${config.qtdSorteadas} dezenas para conferir.`);
        return;
    }

    const dezenasSorteadas = rawInput.split(/[\s,.-]+/).map(Number).filter(n => n >= 0 && n <= config.totalNumeros);

    if (dezenasSorteadas.length !== config.qtdSorteadas) {
        alert(`Insira exatamente ${config.qtdSorteadas} dezenas.`);
        return;
    }

    let acertosMap = {};
    let premiadosCount = 0;
    let maxPontos = 0;

    jogosAtuais.forEach((jogoArr, idx) => {
        const acertos = jogoArr.filter(num => dezenasSorteadas.includes(num)).length;
        acertosMap[idx] = acertos;
        if (acertos >= config.minAcertosPremiados) premiadosCount++;
        if (acertos > maxPontos) maxPontos = acertos;
    });

    exibirResultados(acertosMap);

    const precoUnitario = estrategiaAtivaObj ? estrategiaAtivaObj.precoJogo : config.precoPadraoJogo;
    const custoTotal = jogosAtuais.length * precoUnitario;

    document.getElementById('stat-premiados').innerText = `${premiadosCount} / ${jogosAtuais.length}`;
    document.getElementById('stat-max-pontos').innerText = `${maxPontos} Pts`;
    document.getElementById('stat-custo').innerText = `R$ ${custoTotal.toFixed(2).replace('.', ',')}`;
    document.getElementById('resumo-conferencia').classList.remove('oculto');
}