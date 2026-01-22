'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Importante para mudar de página
import { createClient } from '@/lib/supabase';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  // Este efeito fica à escuta: assim que o login for feito, muda de página
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      console.log("Evento de Auth:", event); // Para vermos no console o que acontece
      if (event === 'SIGNED_IN') {
        router.push('/'); // Força a ida para a Home
        router.refresh(); // Atualiza os dados da página
      }
    });

    return () => subscription.unsubscribe();
  }, [router, supabase]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Entrar no StreamSage 🎥
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={[]} // Apenas Email por enquanto
            showLinks={true} // Garante que mostra o link de "Sign Up"
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email',
                  password_label: 'Password',
                  button_label: 'Entrar',
                },
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}