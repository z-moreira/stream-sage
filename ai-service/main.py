from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Criar a aplicação
app = FastAPI(title="StreamSage AI")

# Isto permite que o Next.js (localhost:3000) fale com o Python
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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