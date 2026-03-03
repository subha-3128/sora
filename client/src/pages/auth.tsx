import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff } from "lucide-react";

export default function AuthPage() {
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [signupMessage, setSignupMessage] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const emailRegex = /^\S+@\S+\.\S+$/;

  const handleLogin = async () => {
    const newErrors: { [key: string]: string } = {};

    if (!loginEmail) newErrors.email = "Email is required";
    if (loginEmail && !emailRegex.test(loginEmail)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!loginPassword) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    try {
      await login.mutateAsync({ email: loginEmail, password: loginPassword });
    } catch {
      // Error is already handled by mutation state
    }
  };

  const handleRegister = async () => {
    const newErrors: { [key: string]: string } = {};

    if (!registerEmail) newErrors.email = "Email is required";
    if (registerEmail && !emailRegex.test(registerEmail)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!registerPassword) newErrors.password = "Password is required";
    if (registerPassword.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (registerPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSignupMessage("");
    try {
      await register.mutateAsync({
        email: registerEmail.trim(),
        password: registerPassword,
      });
      setSignupMessage(
        "Account created. If email confirmation is enabled in Supabase, verify email before login."
      );
      setRegisterEmail("");
      setRegisterPassword("");
      setConfirmPassword("");
      setActiveTab("login");
    } catch {
      // Error is already handled by mutation state
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/40 flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-md border-border/60 shadow-lg">
        <CardHeader className="text-center space-y-3">
          <img src="/logo.svg" alt="sora" className="mx-auto h-16 w-auto" />
          <CardDescription>
            Sign in to manage your daily focus, habits, and reviews
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value as "login" | "register");
              setErrors({});
              setSignupMessage("");
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 h-11">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Create Account</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 mt-4">
              {signupMessage && (
                <Alert>
                  <AlertDescription>{signupMessage}</AlertDescription>
                </Alert>
              )}

              {login.error && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {login.error instanceof Error
                      ? login.error.message
                      : "Login failed"}
                  </AlertDescription>
                </Alert>
              )}

              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    placeholder="your@email.com"
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      if (errors.email) {
                        const newErrors = { ...errors };
                        delete newErrors.email;
                        setErrors(newErrors);
                      }
                    }}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showLoginPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        if (errors.password) {
                          const newErrors = { ...errors };
                          delete newErrors.password;
                          setErrors(newErrors);
                        }
                      }}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={login.isPending}
                  className="w-full h-11"
                >
                  {login.isPending ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                New here?{" "}
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => setActiveTab("register")}
                >
                  Create an account
                </button>
              </p>
            </TabsContent>

            <TabsContent value="register" className="space-y-4 mt-4">
              {register.error && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {register.error instanceof Error
                      ? register.error.message
                      : "Registration failed"}
                  </AlertDescription>
                </Alert>
              )}

              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRegister();
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    autoComplete="email"
                    placeholder="your@email.com"
                    value={registerEmail}
                    onChange={(e) => {
                      setRegisterEmail(e.target.value);
                      if (errors.email) {
                        const newErrors = { ...errors };
                        delete newErrors.email;
                        setErrors(newErrors);
                      }
                    }}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="register-password"
                      type={showRegisterPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      value={registerPassword}
                      onChange={(e) => {
                        setRegisterPassword(e.target.value);
                        if (errors.password) {
                          const newErrors = { ...errors };
                          delete newErrors.password;
                          setErrors(newErrors);
                        }
                      }}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showRegisterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) {
                          const newErrors = { ...errors };
                          delete newErrors.confirmPassword;
                          setErrors(newErrors);
                        }
                      }}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <p className="text-xs text-muted-foreground">
                  Use at least 8 characters for a secure password.
                </p>

                <Button
                  type="submit"
                  disabled={register.isPending}
                  className="w-full h-11"
                >
                  {register.isPending ? "Creating account..." : "Create Account"}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => setActiveTab("login")}
                >
                  Sign in
                </button>
              </p>
            </TabsContent>
          </Tabs>

          <p className="text-center text-xs text-muted-foreground px-2">
            By continuing, you agree to securely use your sora account on this device.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
