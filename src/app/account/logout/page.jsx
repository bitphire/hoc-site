import useAuth from "@/utils/useAuth";
import { Terminal, Power } from "lucide-react";

export default function LogoutPage() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  return (
    <div className="min-h-screen bg-black text-[#c084fc] font-vt323 flex items-center justify-center p-4">
      {/* CRT Overlay Effect */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(124,58,237,0.06),rgba(192,132,252,0.02),rgba(147,51,234,0.06))] bg-[length:100%_2px,3px_100%]"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="border-4 border-purple-500 p-8 bg-black shadow-[10px_10px_0px_#a78bfa,0_0_30px_rgba(192,132,252,0.3)]">
          <div className="flex items-center justify-center gap-4 mb-8">
            <Terminal className="text-purple-400 w-10 h-10 drop-shadow-[0_0_8px_#c084fc]" />
            <h1 className="text-4xl font-bold uppercase drop-shadow-[0_0_10px_#a78bfa]">
              System_Logout
            </h1>
          </div>

          <div className="space-y-6">
            <p className="text-2xl text-center text-purple-300 leading-relaxed">
              TERMINATE_CURRENT_SESSION?
            </p>

            <button
              onClick={handleSignOut}
              className="w-full bg-purple-500 text-white p-4 text-3xl font-bold uppercase hover:bg-purple-400 transition-colors shadow-[0_0_10px_#c084fc] flex items-center justify-center gap-3"
            >
              <Power size={28} />
              DISCONNECT
            </button>

            <div className="text-center">
              <a
                href="/admin"
                className="text-purple-700 hover:text-purple-400 text-xl uppercase"
              >
                &lt; CANCEL_LOGOUT
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
        .font-vt323 { font-family: 'VT323', monospace; }
        body { background-color: black; }
      `}</style>
    </div>
  );
}
