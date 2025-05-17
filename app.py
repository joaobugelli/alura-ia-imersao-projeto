import os
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS # Necessário se rodar frontend e backend em portas diferentes durante o desenvolvimento
import google.generativeai as genai
import base64
from google.genai import types
from dotenv import load_dotenv # Para carregar a API Key de .env


load_dotenv() # Carrega variáveis do .env

app = Flask(__name__)
# Permite requisições do frontend se estiver rodando em porta diferente (desenvolvimento)
CORS(app)

# Configura a API Key do Google
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    print("ERRO FATAL: GOOGLE_API_KEY não encontrada nas variáveis de ambiente.")
    print("Crie um arquivo .env na mesma pasta com GOOGLE_API_KEY=SUA_CHAVE_AQUI")
    exit() # Sai se a chave não estiver configurada

genai.configure(api_key=GOOGLE_API_KEY)


# --- Configuração do Modelo Gemini (Sem Tools) ---

# Usa o modelo gemini-2.0-flash conforme solicitado.
# Não passamos a lista de tools_spec, pois não vamos usar ferramentas.
model = genai.GenerativeModel(model_name='gemini-2.0-flash')


# --- Rotas do Flask ---

@app.route('/')
def index():
    """Rota para servir o arquivo HTML principal."""
    # Ao usar render_template, Flask injeta o {{ url_for }} correto para static files
    return render_template('index.html')

@app.route('/recommend', methods=['POST'])
def recommend():
    """Rota para receber a entrada do usuário, interagir com a IA e retornar recomendações."""
    data = request.json
    series_favoritas = data.get('favoritas', '')
    vibe_atual = data.get('vibe', '')

    # Adiciona log para ver a entrada recebida
    print(f"Recebida requisição POST:")
    print(f"  Séries Favoritas: {series_favoritas}")
    print(f"  Vibe Atual: {vibe_atual}")

    if not series_favoritas or not vibe_atual:
        print("Erro: Séries favoritas ou Vibe atual faltando.")
        return jsonify({"error": "Por favor, forneça suas séries favoritas e sua vibe atual."}), 400



    # --- Interação com a IA (Geração de Texto Direta ---

    try:
        # Cria uma sessão de chat
        chat_session = model.start_chat()

        # Prepara o prompt inicial para o modelo
        # É crucial que este prompt instrua a IA a usar as ferramentas quando necessário
        prompt = f"""
        Você é um Especialista em Séries. Sua tarefa é recomendar 3 séries para o usuário, baseando-se nas séries favoritas que ele mencionou e na vibe atual que ele descreveu.

        Séries Favoritas do Usuário: {series_favoritas}
        Vibe Atual do Usuário: {vibe_atual}

        Instruções para a recomendação:

        1. Analise as séries favoritas para entender o estilo, gênero e temas que o usuário gosta.
        2. Considere a vibe atual do usuário para ajustar as recomendações (ex: algo leve para vibe tranquila, algo complexo para vibe reflexiva).
        3. Se precisar de informações sobre as séries mencionadas ou sobre as séries que você pretende recomendar para garantir que se encaixam.
        4. Recomende APENAS 3 opções de séries, sendo as mais relevantes.
        5. Para cada recomendação, forneça:
                - O Título.
                - Uma Sinopse MUITO breve (máximo 2 frases).
                - Um "Porquê Você Vai Amar": Explique ESPECIFICAMENTE por que aquela sériecombina com as séries favoritas e a vibe atual do usuário. Seja personalizado!
        6. Formate a resposta de forma clara e fácil de ler. Use marcadores ou listas.

        Siga estritamente o template a seguir para o formato de saída e não adicione nada mais (nem mesmo um texto de introdução ou conclusão):

        1. Nome da Série 1
        - Sinopse: [breve sinpse]
        - Porquê você vai amar: [breve explicação personalizada conectando com séries favoritas e vibe].

        2. Nome da Série 2
        - Sinopse: [breve sinpse]
        - Porquê você vai amar: [breve explicação personalizada conectando com séries favoritas e vibe].

        3. Nome da Série 3
        - Sinopse: [breve sinpse]
        - Porquê você vai amar: [breve explicação personalizada conectando com séries favoritas e vibe].

        
        Seja criativo e útil!
        """

        print("Enviando prompt para a IA...")

        # Envia a primeira mensagem para a IA
        response = model.generate_content(prompt)

        print(f"Resposta da IA recebida. Conteúdo completo: {response}")

        # Verifica se a resposta contém texto gerado
        if response.candidates and response.candidates[0].content.parts and response.candidates[0].content.parts[0].text:
            final_response_text = response.candidates[0].content.parts[0].text
            print(f"Resposta FINAL da IA (texto):\n{final_response_text}")
            # Retorna a resposta final da IA para o frontend
            return jsonify({"recommendations": final_response_text})
        else:
             # Caso a resposta final não seja texto por algum motivo inesperado
             print("ERRO: A resposta da IA não contém texto esperado.")
             # Se a IA retornar um BlockedPromptException ou algo similar, pode ser útil logar aqui
             if response.prompt_feedback:
                 print(f"Feedback do Prompt: {response.prompt_feedback}")
             print(f"Conteúdo completo da resposta: {response}") # Loga a resposta completa para entender o que veio
             return jsonify({"error": "A IA não conseguiu gerar as recomendações. Tente ajustar sua descrição de vibe ou séries favoritas."}), 500


    except Exception as e:
        print(f"ERRO GERAL na interação com a IA ou na rota /recommend: {e}")
        # Retorna um erro amigável para o frontend
        return jsonify({"error": f"Desculpe, ocorreu um erro interno ao buscar recomendações: {e}"}), 500

if __name__ == '__main__':
    # Use debug=True apenas em desenvolvimento.
    # host='127.0.0.1' garante que só é acessível localmente.
    app.run(debug=True, host='127.0.0.1', port=5000) # Rodar localmente na porta 5000