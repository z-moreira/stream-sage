'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const searchMovies = async () => {
    if (!query) return;
    setLoading(true);

    // Vai buscar a chave ao ficheiro .env.local
    const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&language=pt-PT`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      setMovies(data.results || []);
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            StreamSage 🎥
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-lg">
            Pesquisa os teus filmes favoritos.
          </p>
          
          {/* Barra de Pesquisa */}
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input 
              type="text" 
              placeholder="Ex: Matrix, Inception..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchMovies()}
            />
            <Button onClick={searchMovies} disabled={loading}>
              {loading ? "..." : "Buscar"}
            </Button>
          </div>
        </div>

        {/* Grelha de Filmes */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies.map((movie) => (
            <Card key={movie.id} className="overflow-hidden hover:shadow-lg transition-all cursor-pointer border-zinc-200 dark:border-zinc-800">
              {movie.poster_path ? (
                <img 
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                  alt={movie.title}
                  className="w-full h-auto object-cover aspect-[2/3]"
                />
              ) : (
                <div className="w-full h-full bg-zinc-200 flex items-center justify-center aspect-[2/3]">
                  <span className="text-xs text-zinc-500">Sem Imagem</span>
                </div>
              )}
              <CardContent className="p-3">
                <h2 className="font-semibold text-sm truncate">{movie.title}</h2>
                <p className="text-xs text-zinc-500">
                  {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </main>
  );
}