from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Variáveis globais para guardar a memória da IA
df = None
embeddings = None
model = None

@app.on_event("startup")
async def startup_event():
    global df, embeddings, model
    print("⏳ A carregar base de dados de 5000 filmes...")
    
    # Carregar o CSV ignorando linhas com erros
    df = pd.read_csv("movies.csv")
    
    # Limpar dados: garantir que temos títulos e descrições (overview)
    # Removemos filmes que não tenham descrição
    df = df.dropna(subset=['overview', 'title'])
    df = df.reset_index(drop=True)
    
    print(f"✅ Carregados {len(df)} filmes com sucesso!")

    print("⏳ A carregar o cérebro da IA...")
    model = SentenceTransformer('all-MiniLM-L6-v2')

    print("⏳ A calcular vetores (isto vai demorar uns 30 segundos)...")
    embeddings = model.encode(df['overview'].tolist(), show_progress_bar=True)
    print("✅ IA pronta a usar!")

@app.get("/recommend")
def recommend(movie: str):
    global df, embeddings
    
    if df is None or embeddings is None:
        return {"error": "O servidor ainda está a arrancar..."}

    # 1. Procurar o filme (case insensitive)
    # Tenta encontrar onde o título contém o texto pesquisado
    mask = df['title'].str.contains(movie, case=False, na=False)
    matches = df[mask]
    
    if matches.empty:
        return {
            "movie": movie,
            "recommendations": ["Filme não encontrado na base de dados :("]
        }

    # Pegamos no primeiro resultado que encontramos
    idx = matches.index[0]
    real_title = df.iloc[idx]['title']
    
    # 2. Calcular similaridade
    target_embedding = embeddings[idx].reshape(1, -1)
    scores = cosine_similarity(target_embedding, embeddings)[0]

    # 3. Pegar no Top 5 (excluindo o próprio filme)
    # O argsort ordena do menor para o maior, por isso invertemos [::-1]
    top_indices = scores.argsort()[-6:-1][::-1]
    
    recommended_titles = df.iloc[top_indices]['title'].tolist()

    return {
        "movie": real_title, # Devolvemos o nome correto do filme
        "recommendations": recommended_titles
    }