'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // Alternar entre Login e Registo
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault(); // Não deixa a página recarregar
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        // --- LOGICA DE CRIAR CONTA ---
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        // Se correu bem, faz login automático ou avisa
        router.push('/'); 
      } else {
        // --- LOGICA DE ENTRAR ---
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push('/');
      }
      
      router.refresh();
    } catch (err: any) {
      setError(err.message); // Mostra o erro no ecrã
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <Card className="w-full max-w-sm shadow-lg border-zinc-200 dark:border-zinc-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {isSignUp ? "Criar Conta" : "Bem-vindo de volta"}
          </CardTitle>
          <CardDescription>
            {isSignUp 
              ? "Preenche os dados para começares." 
              : "Insere o teu email para entrar na tua conta."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            
            {/* Campo Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="exemplo@email.com" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Campo Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Mensagem de Erro (se houver) */}
            {error && (
              <div className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading 
                ? "A carregar..." 
                : (isSignUp ? "Criar Conta" : "Entrar")}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <Button 
            variant="link" 
            className="w-full text-zinc-600" 
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp 
              ? "Já tens conta? Entrar" 
              : "Não tens conta? Registar"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}