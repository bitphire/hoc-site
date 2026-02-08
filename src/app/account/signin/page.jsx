import { useState } from "react";
import useAuth from "@/utils/useAuth";
import { Terminal, Mail, Lock } from "lucide-react";

export default function SignInPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signInWithCredentials } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("MISSING_CREDENTIALS_ERROR");
      setLoading(false);
      return;
    }

    try {
      await signInWithCredentials({
        email,
        password,
        callbackUrl: "/admin",
        redirect: true,
      });
    } catch (err) {
      const errorMessages = {
        CredentialsSignin: "INVALID_CREDENTIALS_ERROR - CHECK_YOUR_DATA",
        AccessDenied: "ACCESS_DENIED - UNAUTHORIZED_USER",
        Configuration: "SYSTEM_ERROR - TRY_AGAIN_LATER",
      };

      setError(errorMessages[err.message] || "UNKNOWN_ERROR - CONTACT_ADMIN");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#c084fc] font-vt323 flex items-center justify-center p-4">
      {/* CRT Overlay Effect */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(124,58,237,0.06),rgba(192,132,252,0.02),rgba(147,51,234,0.06))] bg-[length:100%_2px,3px_100%]"></div>

      <div className="w-full max-w-md relative z-10">
        <form
          noValidate
          onSubmit={onSubmit}
          className="border-4 border-purple-500 p-8 bg-black shadow-[10px_10px_0px_#a78bfa,0_0_30px_rgba(192,132,252,0.3)]"
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <Terminal className="text-purple-400 w-10 h-10 drop-shadow-[0_0_8px_#c084fc]" />
            <h1 className="text-4xl font-bold uppercase drop-shadow-[0_0_10px_#a78bfa]">
              Admin_Access
            </h1>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-2xl uppercase flex items-center gap-2 text-purple-300">
                <Mail size={20} /> Email_ID
              </label>
              <input
                required
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ADMIN@DOMAIN.SYS"
                className="w-full bg-black border-2 border-purple-800 p-3 text-2xl outline-none focus:border-purple-500 focus:shadow-[0_0_10px_#c084fc] text-purple-400 placeholder:text-purple-900"
              />
            </div>

            <div className="space-y-2">
              <label className="text-2xl uppercase flex items-center gap-2 text-purple-300">
                <Lock size={20} /> Access_Key
              </label>
              <input
                required
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black border-2 border-purple-800 p-3 text-2xl outline-none focus:border-purple-500 focus:shadow-[0_0_10px_#c084fc] text-purple-400 placeholder:text-purple-900"
              />
            </div>

            {error && (
              <div className="border-2 border-red-500 bg-red-900/20 p-4 text-xl text-red-400 font-bold uppercase animate-pulse">
                &gt; {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-500 text-white p-4 text-3xl font-bold uppercase hover:bg-purple-400 transition-colors disabled:opacity-50 shadow-[0_0_10px_#c084fc]"
            >
              {loading ? "AUTHENTICATING..." : "GRANT_ACCESS"}
            </button>

            <div className="text-center text-xl text-purple-600 border-t-2 border-purple-900 pt-4">
              <p>
                NO_ACCOUNT?{" "}
                <a
                  href={`/account/signup${
                    typeof window !== "undefined" ? window.location.search : ""
                  }`}
                  className="text-purple-400 hover:text-white underline"
                >
                  CREATE_NEW
                </a>
              </p>
            </div>

            <div className="text-center">
              <a
                href="/"
                className="text-purple-700 hover:text-purple-400 text-xl uppercase"
              >
                &lt; RETURN_TO_MAIN
              </a>
            </div>
          </div>
        </form>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
        .font-vt323 { font-family: 'VT323', monospace; }
        body { background-color: black; }
      `}</style>
    </div>
  );
}
