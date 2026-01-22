'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Home() {
  const [message, setMessage] = useState("À espera de conexão...");
  const [loading, setLoading] = useState(false);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/');
      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Erro: O Python parece estar desligado! 💀");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-zinc-50 dark:bg-zinc-900">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex flex-col gap-8">
        
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter text-zinc-800 dark:text-zinc-100 sm:text-5xl">
            StreamSage 🎥
          </h1>
          <p className="text-zinc-500 md:text-xl/relaxed dark:text-zinc-400">
            O teu recomendador de filmes inteligente.
          </p>
        </div>

        <Card className="w-[350px] shadow-lg">
          <CardHeader>
            <CardTitle>Status do Sistema</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-md text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {message}
            </div>
            
            <Button 
              onClick={checkHealth} 
              disabled={loading}
              className="w-full font-bold"
            >
              {loading ? "A conectar..." : "Testar Conexão com Python"}
            </Button>
          </CardContent>
        </Card>

      </div>
    </main>
  );
}