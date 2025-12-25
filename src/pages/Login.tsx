import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Flame, Lock, Mail, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido").min(1, "E-mail é obrigatório"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

const signupSchema = loginSchema.extend({
  confirmPassword: z.string().min(6, "Confirmação de senha é obrigatória"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

const resetSchema = z.object({
  email: z.string().email("E-mail inválido").min(1, "E-mail é obrigatório"),
});

type LoginForm = z.infer<typeof loginSchema>;
type SignupForm = z.infer<typeof signupSchema>;
type ResetForm = z.infer<typeof resetSchema>;

const Login = () => {
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/admin/dashboard";

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const resetForm = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  });

  const handleLogin = async (data: LoginForm) => {
    setLoading(true);
    try {
      // Try to sign in
      const res: any = await (supabase as any).auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      // Log full response for debugging
      console.debug("signInWithPassword response:", res);

      const authData = res.data;
      const error = res.error;

      if (error) {
        // show detailed error to user
        throw error;
      }

      // Ensure session/user is available (some environments need explicit getUser/getSession)
      const waitForSession = async (retries = 10, delay = 300) => {
        for (let i = 0; i < retries; i++) {
          const sessionRes: any = await (supabase as any).auth.getSession();
          console.debug("getSession attempt", i, sessionRes);
          if (sessionRes?.data?.session) return sessionRes;
          await new Promise((r) => setTimeout(r, delay));
        }
        return await (supabase as any).auth.getSession();
      };

      const sessionRes: any = await waitForSession(10, 300);
      console.debug("getSession response after sign-in (final):", sessionRes);

      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta.",
      });

      navigate(from, { replace: true });
    } catch (error: any) {
      let errorMessage = error.message || JSON.stringify(error);

      // Traduzir mensagens de erro comuns
      if (error.message?.includes("Invalid login credentials")) {
        errorMessage = "Credenciais inválidas. Verifique seu e-mail e senha.";
      } else if (error.message?.includes("Email not confirmed")) {
        errorMessage = "E-mail não confirmado. Verifique sua caixa de entrada e confirme seu e-mail.";
      } else if (error.message?.includes("User not found")) {
        errorMessage = "Usuário não encontrado. Crie uma conta primeiro.";
      }

      console.error("Login error details:", error);

      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (data: SignupForm) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      toast({
        title: "Conta criada com sucesso!",
        description: "Verifique seu e-mail para confirmar sua conta.",
      });
      setMode("login");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao criar conta",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (data: ResetForm) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) throw error;

      toast({
        title: "E-mail enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
      setMode("login");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar e-mail",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 bg-muted/30">
        <div className="container max-w-md">
          <Card className="shadow-glow animate-fade-in">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-hero">
                  <Flame className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>
              <CardTitle className="text-2xl">
                {mode === "login" && "Área Administrativa"}
                {mode === "signup" && "Criar Nova Conta"}
                {mode === "reset" && "Recuperar Senha"}
              </CardTitle>
              <CardDescription>
                {mode === "login" && "Faça login para acessar o painel de gestão"}
                {mode === "signup" && "Preencha os dados para criar sua conta"}
                {mode === "reset" && "Enviaremos instruções para seu e-mail"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {mode === "login" && (
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">E-mail</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu@email.com"
                      {...loginForm.register("email")}
                    />
                    {loginForm.formState.errors.email && (
                      <p className="text-sm text-destructive">{loginForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Senha</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      {...loginForm.register("password")}
                    />
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-destructive">{loginForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <Button variant="hero" size="lg" className="w-full" type="submit" disabled={loading}>
                    <Lock className="mr-2 h-4 w-4" />
                    {loading ? "Entrando..." : "Entrar"}
                  </Button>

                  <div className="space-y-2 text-center text-sm">
                    <button
                      type="button"
                      onClick={() => setMode("reset")}
                      className="text-muted-foreground hover:text-primary transition-colors block w-full"
                    >
                      Esqueceu sua senha?
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("signup")}
                      className="text-muted-foreground hover:text-primary transition-colors block w-full"
                    >
                      Não tem conta? Criar nova conta
                    </button>
                  </div>
                </form>
              )}

              {mode === "signup" && (
                <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">E-mail</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="seu@email.com"
                      {...signupForm.register("email")}
                    />
                    {signupForm.formState.errors.email && (
                      <p className="text-sm text-destructive">{signupForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Senha</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      {...signupForm.register("password")}
                    />
                    {signupForm.formState.errors.password && (
                      <p className="text-sm text-destructive">{signupForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm">Confirmar Senha</Label>
                    <Input
                      id="signup-confirm"
                      type="password"
                      placeholder="••••••••"
                      {...signupForm.register("confirmPassword")}
                    />
                    {signupForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-destructive">{signupForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <Button variant="hero" size="lg" className="w-full" type="submit" disabled={loading}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    {loading ? "Criando conta..." : "Criar Conta"}
                  </Button>

                  <div className="text-center text-sm">
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      Já tem conta? Fazer login
                    </button>
                  </div>
                </form>
              )}

              {mode === "reset" && (
                <form onSubmit={resetForm.handleSubmit(handleReset)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">E-mail</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="seu@email.com"
                      {...resetForm.register("email")}
                    />
                    {resetForm.formState.errors.email && (
                      <p className="text-sm text-destructive">{resetForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <Button variant="hero" size="lg" className="w-full" type="submit" disabled={loading}>
                    <Mail className="mr-2 h-4 w-4" />
                    {loading ? "Enviando..." : "Enviar Instruções"}
                  </Button>

                  <div className="text-center text-sm">
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      Voltar para login
                    </button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Acesso restrito a funcionários autorizados
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
