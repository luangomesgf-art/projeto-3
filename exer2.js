const form = document.getElementById("formDespesa");
const descricaoInput = document.getElementById("descricao");
const valorInput = document.getElementById("valor");
const dataInput = document.getElementById("data");

const filtroData = document.getElementById("filtroData");
const listaDespesas = document.getElementById("listaDespesas");
const totalElemento = document.getElementById("total");
const mensagem = document.getElementById("mensagem");

const botaoRestaurar = document.getElementById("restaurar");
const botaoLimpar = document.getElementById("limpar");

const CHAVE = "despesas";

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const descricao = descricaoInput.value.trim();
    const valor = Number(valorInput.value);
    const data = dataInput.value;

    if (
        descricao === "" ||
        !Number.isFinite(valor) ||
        valor <= 0 ||
        data === ""
    ) {
        mensagem.textContent = "Preencha todos os campos corretamente.";
        return;
    }

    if (descricao.includes(":") || descricao.includes("||")) {
        mensagem.textContent =
            "A descrição não pode conter ':' ou '||'.";
        return;
    }

    const novoRegistro = descricao + ":" + valor.toFixed(2) + ":" + data;

    const registrosExistentes = localStorage.getItem(CHAVE);

    if (registrosExistentes === null || registrosExistentes === "") {
        localStorage.setItem(CHAVE, novoRegistro);
    } else {
        localStorage.setItem(
            CHAVE,
            registrosExistentes + "||" + novoRegistro
        );
    }

    mensagem.textContent = "Despesa cadastrada com sucesso!";

    form.reset();

    renderizarDespesas();
});

function renderizarDespesas() {
    const textoArmazenado = localStorage.getItem(CHAVE);

    listaDespesas.innerHTML = "";

    let total = 0;

    if (textoArmazenado === null || textoArmazenado === "") {
        totalElemento.textContent = "Total: R$ 0,00";
        return;
    }

    const despesas = textoArmazenado.split("||");

    for (const despesa of despesas) {
        if (despesa === "") {
            continue;
        }

        const campos = despesa.split(":");

        if (campos.length !== 3) {
            continue;
        }

        const descricao = campos[0];
        const valor = Number(campos[1]);
        const data = campos[2];

        if (
            !Number.isFinite(valor) ||
            !/^\d{4}-\d{2}-\d{2}$/.test(data)
        ) {
            continue;
        }

        if (
            filtroData.value !== "" &&
            data !== filtroData.value
        ) {
            continue;
        }

        total += valor;

        const linha = document.createElement("tr");

        const celulaDescricao = document.createElement("td");
        celulaDescricao.textContent = descricao;

        const celulaValor = document.createElement("td");
        celulaValor.textContent = valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

        const celulaData = document.createElement("td");
        const partesData = data.split("-");
        celulaData.textContent =
            partesData[2] + "/" + partesData[1] + "/" + partesData[0];

        linha.appendChild(celulaDescricao);
        linha.appendChild(celulaValor);
        linha.appendChild(celulaData);

        listaDespesas.appendChild(linha);
    }

    totalElemento.textContent =
        "Total: " + total.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
}

filtroData.addEventListener("change", function() {
    renderizarDespesas();
});

botaoRestaurar.addEventListener("click", function() {
    filtroData.value = "";
    renderizarDespesas();
    mensagem.textContent = "Exibindo todas as despesas.";
});

botaoLimpar.addEventListener("click", function() {
    const confirmar = confirm(
        "Tem certeza de que deseja apagar todas as despesas?"
    );

    if (confirmar) {
        localStorage.removeItem(CHAVE);
        filtroData.value = "";
        renderizarDespesas();
        mensagem.textContent = "Todas as despesas foram apagadas.";
    }
});

renderizarDespesas();