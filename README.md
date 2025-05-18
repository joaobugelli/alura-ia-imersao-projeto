# ▶️ PróximoPlay - Encontre sua próxima série favorita!

[![Watch the video](https://img.youtube.com/vi/dyp5yn_5Abo/hqdefault.jpg)](https://youtu.be/dyp5yn_5Abo)


## ✨ Sobre

**Sabe aquela sensação de vazio e indecisão depois de terminar uma série incrível?** 😩

Com tantos streamings e catálogos infinitos, encontrar a próxima série perfeita pode parecer uma missão impossível, resultando em horas perdidas só rolando ou escolhendo algo que não te agrada.

É por isso que criamos o **▶️ PróximoPlay**!

Ele é o seu novo **Agente Especialista em Recomendações de Séries**, desenvolvido com o poder do Google Gemini. Ele existe para acabar com a sua busca interminável!

Basta dizer quais são suas séries favoritas e qual a **vibe** da série que vocês está buscando, e a IA faz uma recomendação sob medidade para você e até te conta o porque você vai gostar!

Chega de perder tempo! Encontre sua próxima série favorita!


## 💡 Funcionalidades

* Captura suas séries favoritas e sua vibe atual.
* Gera recomendações de séries personalizadas para você usando GenAI.
* Inclui sinopse breve e um "Porquê você vai gostar" para cada sugestão.
* Tudo isso em uma interface web simples em menos de 30s!

## 💻 Tecnologias

* **Modelo:** Gemini 2.5 Flash (Preview)
* **Backend:** Python, Flask, google-generativeai (API Gemini), python-dotenv
* **Frontend:** HTML, CSS, JavaScript, Marked.js
* **DevOps:** Git, GitHub, venv (ambientes virtuais)

## 🛠️ Setup e Como Rodar

1.  **Clone o Repositório:**
    ```bash
    git clone [URL_DO_SEU_REPOSITORIO_GITHUB]
    cd [nome-da-pasta-do-seu-projeto]
    ```

2.  **Configure a API Key:**
    * Obtenha sua chave no Google AI Studio.
    * Crie um arquivo `.env` na raiz do projeto:
        ```dotenv
        GOOGLE_API_KEY=SUA_API_KEY_AQUI
        ```

3.  **Crie e Ative o Ambiente Virtual:**
    ```bash
    python -m venv venv
    # Ative conforme seu OS (Windows: .\venv\Scripts\Activate.ps1 ou .bat; Linux/macOS: source venv/bin/activate)
    ```

4.  **Instale Dependências:**
    ```bash
    pip install -r requirements.txt
    ```

5.  **Inicie o Backend:**
    ```bash
    python app.py
    ```

6.  **Acesse no Navegador:**
    ```
    [http://127.0.0.1:5000/](http://127.0.0.1:5000/)
    ```

---
