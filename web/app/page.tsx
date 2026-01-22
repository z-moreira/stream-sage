'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase'; // O nosso ligador
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { User } from '@supabase/supabase-js'; // Tipo para o TypeScript não reclamar

export default function Home() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Novos estados para o utilizador
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // 1. Verificar se existe utilizador logado ao carregar a página
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  // 2. Função de Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); // Limpa o estado local
    router.refresh(); // Atualiza a página
  };

  const searchMovies = async () => {
    if (!query) return;
    setLoading(true);
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

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8 font-sans">
      
      {/* --- BARRA DE NAVEGAÇÃO SUPERIOR --- */}
      <nav className="flex justify-end mb-8">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-600">Olá, <b>{user.email}</b></span>
            <Button variant="outline" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        ) : (
          <Button onClick={() => router.push('/login')}>
            Entrar / Criar Conta
          </Button>
        )}
      </nav>

      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            StreamSage 🎥
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-lg">
            Pesquisa os teus filmes favoritos.
          </p>
          
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