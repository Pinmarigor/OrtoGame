// variaveis globais das funções;
// pega as divs do html
const tabuleiro = document.getElementById('tabuleiro');
const msgElement = document.getElementById('mensagem');

let turno = "azul"; // decide o turno, ou seja, de quem é a vez. valor padrão azul, ou seja, começa azul
let jogoAtivo = true; // cria uma variavel que gurda se o jogo está ativo.
let pecaSelecionada = null; //vê a peça selecionada pelo jogador. por padrão vem vazia já que o jogador ainda não selecionou nenhuma peça
let grid = [
    ['A', 'V', 'A', 'V'],
    ['V', 'B', 'B', 'A'],
    ['A', 'B', 'B', 'V'],
    ['V', 'A', 'V', 'A']
]; // matriz que inicializa as posições azul, vermelho e branco

// funções
function renderizar() {
    tabuleiro.innerHTML = ""; // inicializa a div vazia
    for(let linha = 0; linha < 4; linha++){ // cria as linhas do tabuleiro
        for(let coluna = 0; coluna < 4; coluna++) { // cria as colunas do tabuleiro
            const celula = document.createElement('div'); // cria uma div
            celula.className = "celula"; // define uma classe para a div criada
            celula.dataset.linha = linha; // define um atributo para classe criada, no caso linha
            celula.dataset.coluna = coluna; // define um atributo para classe criada, no caso coluna

            const peca = document.createElement('div'); // cria outra div
            peca.className = 'peca ' + 
            (grid[linha][coluna] === 'A' ? 'azul' : 
             grid[linha][coluna] === 'V' ? 'vermelho' 
             : 'branca'); // adiciona a classe peça e outra classe com base no valor do grid
            celula.appendChild(peca); // adiciona peca ao div pai celula
            
            celula.addEventListener('click',() => {celulaEscolhida(linha, coluna)}); //  se celula for clicada chama a função celulaEscolhida
            tabuleiro.appendChild(celula); // adiciona celula no div pai tabuleiro
        }
    }
}

function reiniciarJogo() {
    // reinicia a matriz para o estado inicial
    grid = [
        ['A', 'V', 'A', 'V'],
        ['V', 'B', 'B', 'A'],
        ['A', 'B', 'B', 'V'],
        ['V', 'A', 'V', 'A']
    ];

    // reinicia as variáveis de controle
    turno = "azul";
    jogoAtivo = true;
    pecaSelecionada = null;

    // Atualizamos a interface
    atualizarMensagem("Jogo reiniciado! Vez do jogador AZUL");
    renderizar();
}

function atualizarMensagem(texto, tipo = '') { // recebe uma mensagem e um tipo que seria uma classe
    msgElement.innerText = texto; // mensagem passada
    msgElement.className = tipo; // classe da mensagem, tem formatação no css dependendo da mensagem
}

function celulaEscolhida (linha, coluna) { // recebe o atrinuto linha e coluna da div celula
    if(!jogoAtivo) return; // verifica se há atividade no jogo, se não ativo para imeditamente

    const pecaClicada = grid[linha][coluna]; // pega a peça clicada no grid
    if ((turno === 'azul' && pecaClicada === 'A') || (turno === 'vermelho' && pecaClicada === 'V')) { // se a peça do turno for clicada
        pecaSelecionada = {linha, coluna}; // guada posição da peça clicada
        renderizar(); // renderiza
        destacarAlvo(linha, coluna); // chama uma função que destaca a peça clicada
    } 
    else if ((turno === 'azul' && pecaClicada === 'V') || (turno === 'vermelho' && pecaClicada === 'A')){ // se a peça fora do turno for clicada apresenta uma mensagem de erro
        atualizarMensagem("Erro: Você não pode mover a peça do oponente!", "erro");
    }
    else if (pecaClicada === 'B' && pecaSelecionada) { //  se a peça clicada, segundo clique, for branca
        if (linha === pecaSelecionada.linha || coluna === pecaSelecionada.coluna) { // verifica se a linha e a coluna são as mesmas
            realizarJogada(pecaSelecionada.linha, pecaSelecionada.coluna, linha, coluna); // chama a função que realiza a jogada
        } else { // caso a peça branca não esteja na mesma linha ou coluna
            atualizarMensagem("Erro: A peça branca deve estar na mesma linha ou coluna!", "erro");
        }
    }
}

function destacarAlvo(linha, coluna) { // recebe a linha e coluna da peça clicada
    const celulas = document.querySelectorAll('.celula'); // pega todas as divs com a classe celula
    celulas.forEach(celula => { // para cada div celulas execute
        const celulaLinha = parseInt(celula.dataset.linha); // variavel que recebe o atributo linha de uma div de celulas, no caso celula, e coverte para um inteiro
        const celulaColuna = parseInt(celula.dataset.coluna); // mesma coisa só que com a coluna
        if((celulaLinha === linha || celulaColuna === coluna) && grid[celulaLinha][celulaColuna] === 'B') { //  verifica se a célula é 'B' no caso branca de acordo com o grid
            celula.classList.add('destaque'); // adiciona uma nova classe chamada destaque
        }
        if(celulaLinha === linha && celulaColuna === coluna) celula.style.outline = "3px solid black";
    }); // verifica se está na mesma linha e coluna e adiciona uma borda preta de 3px solid.
}

function realizarJogada(linha1, coluna1, linha, coluna) { // recebe a linha e coluna da div original, primeiro clique e a linha e coluna da div branco
    const temp = grid[linha1][coluna1]; // cópia o valor da primeira peça clicada para a variável temp
    grid[linha1][coluna1] = grid[linha][coluna]; // troca a peça original pela última peça clicada
    grid[linha][coluna] = temp; // troca a peça selecionada pela peça original

    pecaSelecionada = null; // limpa a variável para a próxima rodada

    if (verificarVitoria(temp)){ // verifica se o jogadoe venceu
        renderizar(); // renderiza o tabuleiro
        atualizarMensagem(`FIM DE JOGO! O jogador ${temp === 'A' ? 'AZUL' : 'VERMELHO'} venceu!`, "sucesso"); // mostra mensagem de vitória
        jogoAtivo = false; // para o jogo
    } else {
        turno = (turno === 'azul') ? 'vermelho' : 'azul'; // troca o turno
        renderizar(); // renderiza o tabuleiro
        atualizarMensagem(`Vez do jogador: ${turno.toUpperCase()}`); // Informa de quem é a vez
    }

    function verificarVitoria(cor) { // recebe a cor de quem se moveu
        let pecas = [];
        for(let linha = 0; linha < 4; linha++){ // percorre as linhas
            for(let coluna = 0; coluna < 4; coluna++){ // percorre as colunas
                if(grid[linha][coluna] === cor) pecas.push(`${linha},${coluna}`); // se na posição atual for igual a cor do útimo jogador coloca a posição no array
            }
        } 
        if(pecas.length === 0) return false; // se o array pecas estiver vazio ele acaba

        let visitados = new Set(); // cria uma variavel que recebe o objeto set para armazenar valores únicos
        let fila = [pecas[0]]; // cria uma fila com pecas
        visitados.add(pecas[0]); // adiciona pecas na posição 0 ao objeto set

        let contagem = 0;
        while(fila.length > 0) { // se a fila for maior que zero
            let atual = fila.shift(); // remove o primeiro elemento e o armazena em atual
            contagem++; // aumenta o contador
            let [linha, coluna] = atual.split(',').map(Number); // converte o atributo linha e coluna de string para Number

            let vizinhos = [
                `${linha-1},${coluna}`, `${linha+1},${coluna}`, `${linha},${coluna-1}`, `${linha},${coluna+1}`
            ]; // vizinho armazena o valor das linha de cima e de baixo e das colunas esquerda e direita

            for (let v of vizinhos) { // para cada item de vizinho
                if (pecas.includes(v) && !visitados.has(v)) {  // verifica se o elemento existe no array
                    visitados.add(v); // se sim adiciona
                    fila.push(v); // adiciona um novo elemento na fila
                }
            }
        }

        return contagem === 6; // se contador atigir 6 há um vencedor
    }
}

atualizarMensagem("Vez do jogador AZUL"); // chama a função atualizarMensagem pasando a string "Vez do jogador AZUL"
renderizar(); // renderiza o tabuleiro na tela
document.getElementById('btn-reset').addEventListener('click', reiniciarJogo); // Vincula o botão ao clique