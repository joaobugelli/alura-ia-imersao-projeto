// script.js

document.addEventListener("DOMContentLoaded", () => {
  // Obter referências para as telas
  const telaInicial = document.getElementById("tela-inicial");
  const telaFavoritas = document.getElementById("tela-favoritas");
  const telaVibe = document.getElementById("tela-vibe");
  const telaCarregando = document.getElementById("tela-carregando");
  const telaResultado = document.getElementById("tela-resultado");

  // Obter referências para os inputs e botões principais
  const btnComecar = document.getElementById("btn-comecar");
  const inputFavoritas = document.getElementById("input-favoritas");
  const btnEnviarFavoritas = document.getElementById("btn-enviar-favoritas");
  const inputVibe = document.getElementById("input-vibe");
  const btnEnviarVibe = document.getElementById("btn-enviar-vibe");
  const resultadoRecomendacoesDiv = document.getElementById(
    "resultado-recomendacoes"
  );

  // Obter referências para os botões "Voltar"
  const botoesVoltarInicio = document.getElementById("btn-voltar"); // Botões Voltar para o Início
  const btnVoltarVibe = document.getElementById("btn-voltar-vibe"); // Botão Voltar da tela de vibe
  const btnRecomecar = document.getElementById("btn-recomecar"); // Botão Voltar da tela de vibe

  // --- Funções para transição de telas ---

  function showScreen(screenToShow) {
    // Esconde todas as telas
    const screens = [
      telaInicial,
      telaFavoritas,
      telaVibe,
      telaCarregando,
      telaResultado,
    ];
    screens.forEach((screen) => screen.classList.add("hidden"));
    // Mostra a tela desejada
    screenToShow.classList.remove("hidden");
  }

  // --- Função para resetar tudo e voltar ao início ---
  function resetAndGoHome() {
    // Limpa todos os inputs e variáveis temporárias
    inputFavoritas.value = "";
    inputVibe.value = ""; // Limpa a vibe também ao recomeçar
    window.seriesFavoritas = null;
    resultadoRecomendacoesDiv.innerHTML = ""; // Limpa resultados anteriores
    showScreen(telaInicial); // Volta para a tela inicial
  }

  // --- Função para voltar da tela de vibe para favoritas ---
  function goBackToFavorites() {
    // inputVibe.value = ""; // Limpa apenas o input da vibe ao voltar
    inputFavoritas.value = window.seriesFavoritas || ""; // Pega o valor armazenado e coloca no input
    showScreen(telaFavoritas); // Volta para a tela de favoritas
    // inputFavoritas.focus(); // Foca no input de favoritas (opcional)
  }

  // --- Event Listeners ---

  btnComecar.addEventListener("click", () => {
    showScreen(telaFavoritas);
    inputFavoritas.focus(); // Coloca o foco no primeiro input
  });

  btnEnviarFavoritas.addEventListener("click", () => {
    const favoritas = inputFavoritas.value.trim();
    if (favoritas) {
      // Armazena em uma variável temporária (poderia ser localStorage para persistir)
      window.seriesFavoritas = favoritas;
      showScreen(telaVibe);
      inputVibe.focus(); // Coloca o foco no próximo input
    } else {
      alert("Por favor, diga quais são suas séries favoritas!");
    }
  });

  btnEnviarVibe.addEventListener("click", async () => {
    const vibe = inputVibe.value.trim();
    const favoritas = window.seriesFavoritas || ""; // Pega as favoritas armazenadas

    if (vibe && favoritas) {
      showScreen(telaCarregando); // Mostra tela de carregando

      try {
        // Envia os dados para o backend
        const response = await fetch("/recommend", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ favoritas: favoritas, vibe: vibe }),
        });

        const data = await response.json();

        if (response.ok) {
          // Se a resposta for bem-sucedida, exibe as recomendações
          displayRecommendations(data.recommendations);
          showScreen(telaResultado);
        } else {
          // Se houver erro no backend
          alert(
            "Erro ao buscar recomendações: " +
              (data.error || "Erro desconhecido")
          );
          showScreen(telaFavoritas); // Volta para o início ou uma tela de erro
        }
      } catch (error) {
        console.error("Erro na comunicação com o backend:", error);
        alert("Ocorreu um erro ao comunicar com o servidor.");
        showScreen(telaFavoritas); // Volta em caso de erro de rede
      }
    } else if (!vibe) {
      alert("Por favor, descreva sua vibe atual!");
    } else if (!favoritas) {
      // Este caso não deve ocorrer se a navegação for correta, mas é um fallback
      alert(
        "Erro: séries favoritas não foram informadas. Por favor, recomece."
      );
      showScreen(telaInicial);
    }
  });

  //   // Adiciona listener para todos os botões "Voltar para o Início"
  //   botoesVoltarInicio.forEach((button) => {
  //     button.addEventListener("click", resetAndGoHome);
  //   });

  if (botoesVoltarInicio) {
    // Verifica se o elemento existe
    botoesVoltarInicio.addEventListener("click", resetAndGoHome);
  }

  // Adiciona listener específico para o botão "Voltar" na tela de vibe
  if (btnVoltarVibe) {
    // Verifica se o elemento existe
    btnVoltarVibe.addEventListener("click", goBackToFavorites);
  }

  if (btnRecomecar) {
    // Verifica se o elemento existe
    btnRecomecar.addEventListener("click", resetAndGoHome);
  }

  // --- Função para exibir as recomendações ---

  function displayRecommendations(recommendationsText) {
    // A resposta da IA já vem formatada como texto com os marcadores/lista.
    // Podemos simplesmente colocar esse texto na div de resultado.
    // Se a IA retornasse JSON, precisaríamos parsear e formatar aqui.
    // Garante que o conteúdo é tratado como texto antes de substituir quebras de linha
    resultadoRecomendacoesDiv.innerHTML = String(recommendationsText).replace(
      /\n/g,
      "<br>"
    );
  }

  // Inicializa mostrando a primeira tela ao carregar a página
  showScreen(telaInicial);
});
