from fastapi import FastAPI

# Criar a aplicação
app = FastAPI(title="StreamSage AI")

# Rota Principal (Health Check)
@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "StreamSage AI Service is running! 🚀"
    }

# Rota de Teste de Recomendação (Simulação)
@app.get("/recommend")
def recommend(movie_name: str):
    # Aqui entrará a lógica de IA real no futuro
    return {
        "original_movie": movie_name,
        "recommendations": [
            "Oppenheimer",
            "Interstellar",
            "The Prestige"
        ],
        "note": "Isto é uma resposta hardcoded para teste."
    }