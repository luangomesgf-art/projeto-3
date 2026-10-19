const botao = document.getElementById("iniciar");
const tempoElemento = document.getElementById("tempo");
const pontosElemento = document.getElementById("pontos");
const areaJogo = document.getElementById("areaJogo");
const alvo = document.getElementById("alvo");

let tempo = 10;
let pontos = 0;
let intervalo;

function reposicionarAlvo() {
    const larguraMaxima = areaJogo.clientWidth - alvo.offsetWidth;
    const alturaMaxima = areaJogo.clientHeight - alvo.offsetHeight;
    const x = Math.random() * larguraMaxima;
    const y = Math.random() * alturaMaxima;

    alvo.style.left = x + "px";
    alvo.style.top = y + "px";
    }

function iniciarJogo() {
    tempo = 10;
    pontos = 0;

    tempoElemento.textContent = tempo;
    pontosElemento.textContent = pontos;

    botao.disabled = true;
    alvo.style.display = "block";

    reposicionarAlvo();

    intervalo = setInterval(function () {
        tempo--;
        tempoElemento.textContent = tempo;

        if (tempo <= 0) {
            clearInterval(intervalo);
            alvo.style.display = "none";
            botao.disabled = false;

            alert("Fim de jogo! Sua pontuação final foi: " + pontos);
            }
        }, 1000);
    }

alvo.addEventListener("click", function () {
    if (tempo > 0 && botao.disabled) {
        pontos++;
        pontosElemento.textContent = pontos;
        reposicionarAlvo();
        }
    });

    botao.addEventListener("click", iniciarJogo);