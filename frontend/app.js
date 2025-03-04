// Lista para armazenar os endereços que o usuário consultar
const listaEnderecos = [];

// Função para consultar o CEP e buscar as informações do endereço
function consultarCEP() {
    // Pega o valor do CEP inserido no campo de entrada e remove qualquer caractere não numérico
    const cep = document.getElementById('cep').value.replace(/\D/g, '');
    // Pega a div onde serão mostrados os resultados da consulta
    const resultadoDiv = document.getElementById('resultado');

    // Verifica se o CEP tem exatamente 8 dígitos, caso contrário, mostra um alerta
    if (cep.length !== 8) {
        alert("CEP inválido!");
        return; // Se o CEP for inválido, a função é interrompida aqui
    }

    // Requisição à API do backend que vai consultar o CEP na API ViaCEP
    fetch(`/consulta/${cep}`)
        .then(response => response.json())  // Converte a resposta para JSON
        .then(data => {
            // Se a resposta da API contiver um erro, exibe a mensagem de "CEP não encontrado"
            if (data.error) {
                resultadoDiv.innerHTML = "CEP não encontrado.";
            } else {
                // Caso o CEP seja encontrado, mostra os dados do endereço na tela
                resultadoDiv.innerHTML = `
                    <p><strong>Endereço:</strong> ${data.logradouro}</p>
                    <p><strong>Bairro:</strong> ${data.bairro}</p>
                    <p><strong>Cidade:</strong> ${data.localidade}</p>
                    <p><strong>Estado:</strong> ${data.uf}</p>
                `;
                // Adiciona os dados do endereço à lista de endereços
                listaEnderecos.push(data);
                // Atualiza a tabela para mostrar os novos endereços armazenados
                atualizarTabela();
            }
        })
        .catch(error => {
            // Se ocorrer um erro durante a requisição, exibe uma mensagem de erro
            resultadoDiv.innerHTML = "Erro ao consultar o CEP.";
            console.error(error); // Exibe o erro no console para facilitar o debug
        });
}

// Função para atualizar a tabela exibindo os endereços armazenados
function atualizarTabela() {
    // Pega a referência da tabela onde os endereços serão listados
    const tabela = document.getElementById('lista-enderecos');
    // Limpa o conteúdo da tabela antes de adicionar os novos dados
    tabela.innerHTML = '';

    // Itera sobre cada endereço armazenado na lista
    listaEnderecos.forEach(endereco => {
        // Cria uma nova linha (tr) para cada endereço
        const tr = document.createElement('tr');
        // Adiciona as células (td) na linha com os dados do endereço
        tr.innerHTML = `
            <td>${endereco.localidade}</td>  <!-- Cidade -->
            <td>${endereco.bairro}</td>     <!-- Bairro -->
            <td>${endereco.uf}</td>         <!-- Estado -->
            <td>${endereco.logradouro}</td> <!-- Endereço -->
        `;
        // Adiciona a linha criada à tabela
        tabela.appendChild(tr);
    });
}

// Função para ordenar a tabela por um campo específico (cidade, bairro ou estado)
function ordenarTabela(campo) {
    // Pega o valor da ordem de classificação (crescente ou decrescente) selecionado pelo usuário
    const ordemSelecionada = document.getElementById('ordem').value;

    // Ordena a lista de endereços com base no campo selecionado (cidade, bairro ou estado)
    listaEnderecos.sort((a, b) => {
        // Converte os valores dos campos para minúsculas para evitar problemas de ordenação com maiúsculas/minúsculas
        let valorA = a[campo].toLowerCase();
        let valorB = b[campo].toLowerCase();

        // Compara os valores dos campos e retorna:
        // -1 para ordenar em ordem crescente
        // 1 para ordenar em ordem decrescente
        // 0 para indicar que os dois valores são iguais
        if (valorA < valorB) return ordemSelecionada === 'asc' ? -1 : 1;
        if (valorA > valorB) return ordemSelecionada === 'asc' ? 1 : -1;
        return 0; // Se os valores são iguais, não há alteração na ordem
    });

    // Após ordenar, atualiza a tabela para refletir a nova ordem
    atualizarTabela();
}
