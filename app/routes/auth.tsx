import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { usePuterStore } from "~/lib/puter";

export const meta = () => ([
  { title: "Resumind | Auth" },
  { name: "description", content: "Login Into your Resumind Account" }
]);

const Auth = () => {
  const { isLoading, auth } = usePuterStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const next = searchParams.get("next") || "/";

  const didLoginRef = useRef(false);

  useEffect(() => {
    if (!isLoading && auth.isAuthenticated && didLoginRef.current) {
      navigate(next, { replace: true });
    }
  }, [isLoading, auth.isAuthenticated, next, navigate]);

  const handleLogin = async () => {
    didLoginRef.current = true;
    await auth.signIn();
  };

  const handleLogout = async () => {
    didLoginRef.current = false;
    await auth.signOut();
  };

  return (
    <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
      <div className="gradient-border shadow-lg">
        <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1>Welcome</h1>
            <h2>Log In to Continue Your Job Journey</h2>
          </div>

          <div>
            {isLoading ? (
              <button className="auth-button animate-pulse">
                <p>Signing you in...</p>
              </button>
            ) : auth.isAuthenticated ? (
              <button className="auth-button" onClick={handleLogout}>
                <p>Log Out</p>
              </button>
            ) : (
              <button className="auth-button" onClick={handleLogin}>
                <p>Log In</p>
              </button>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Auth;
