'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  // --- ESTADOS (Apenas para filmes, sem login aqui) ---
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Estados para as recomendações
  const [selectedMovie, setSelectedMovie] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);

  // 1. Buscar filmes à TMDB
  const searchMovies = async () => {
    if (!query) return;
    setLoading(true);
    setRecommendations([]); 
    setSelectedMovie(null);
    
    const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&language=pt-PT`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      setMovies(data.results || []);
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

// 2. Pedir Recomendações ao Python
  const getRecommendations = async (displayTitle: string, searchTitle: string) => {
    // Mostramos o título em Português na caixa preta
    setSelectedMovie(displayTitle); 
    setLoadingRecs(true);
    
    try {
      // Mas enviamos o título Original (Inglês) para o Python procurar
      // Usamos 'searchTitle' aqui
      const res = await fetch(`http://127.0.0.1:8000/recommend?movie=${encodeURIComponent(searchTitle)}`);
      const data = await res.json();
      
      // Se o Python devolver erro, mostramos uma lista vazia ou mensagem
      if (data.recommendations) {
        setRecommendations(data.recommendations);
      }
    } catch (error) {
      console.error("Erro ao falar com o Python:", error);
    } finally {
      setLoadingRecs(false);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-background p-8 font-sans">
      
      {
      }

      <div className="max-w-6xl mx-auto space-y-12 py-10">
        
        {/* CABEÇALHO DA PÁGINA */}
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Encontra o teu próximo filme 🍿
          </h1>
          <p className="text-muted-foreground max-w-lg">
            Pesquisa um filme que adoras e a IA sugere o próximo.
          </p>
          
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input 
              placeholder="Ex: Matrix..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchMovies()}
            />
            <Button onClick={searchMovies} disabled={loading}>
              {loading ? "..." : "Buscar"}
            </Button>
          </div>
        </div>

        {/* ÁREA DE RECOMENDAÇÕES (Aparece quando clicas) */}
        {selectedMovie && (
          <div className="bg-secondary/50 p-6 rounded-xl border border-border animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-bold mb-4">
              Porque gostaste de <span className="text-primary">"{selectedMovie}"</span>:
            </h2>
            
            {loadingRecs ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="animate-spin h-4 w-4 border-2 border-primary rounded-full border-t-transparent"></div>
                A pensar...
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {recommendations.map((rec, index) => (
                  <span key={index} className="px-4 py-2 bg-background rounded-full text-sm font-medium border shadow-sm">
                    {rec}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* GRELHA DE PESQUISA */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies.map((movie) => (
            <Card 
              key={movie.id} 
              onClick={() => getRecommendations(movie.title, movie.original_title)}
              className="overflow-hidden hover:scale-105 transition-transform cursor-pointer hover:ring-2 hover:ring-primary group"
            >
              {movie.poster_path ? (
                <img 
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                  alt={movie.title}
                  className="w-full h-auto object-cover aspect-[2/3]"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center aspect-[2/3]">
                  <span className="text-xs text-muted-foreground">Sem Imagem</span>
                </div>
              )}
              <CardContent className="p-3">
                <h2 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                  {movie.title}
                </h2>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </main>
  );
}