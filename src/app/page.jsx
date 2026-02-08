import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Globe,
  Gamepad2,
  Mail,
  ExternalLink,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Terminal,
  Server,
  Zap,
  Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Helper for fetching data
const fetchDashboardData = async () => {
  const response = await fetch("/api/dashboard/data");
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
};

const submitContactRequest = async (data) => {
  const response = await fetch("/api/contact/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to submit");
  }
  return response.json();
};

export default function RetroDashboard() {
  const [activeTab, setActiveTab] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const queryClient = useQueryClient();

  // Captcha state
  const [captcha, setCaptcha] = useState({ q: "", a: 0 });
  const generateCaptcha = () => {
    const n1 = Math.floor(Math.random() * 10);
    const n2 = Math.floor(Math.random() * 10);
    setCaptcha({ q: `${n1} + ${n2}`, a: n1 + n2 });
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboardData"],
    queryFn: fetchDashboardData,
  });

  const contactMutation = useMutation({
    mutationFn: submitContactRequest,
    onSuccess: () => {
      alert("Request received, Commander!");
      generateCaptcha();
    },
    onError: (err) => {
      alert("Error: " + err.message);
    },
  });

  if (isLoading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0118] via-[#1a0b2e] to-[#16041a] flex items-center justify-center">
        <motion.div
          className="relative"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-16 h-16 border-4 border-t-cyan-400 border-r-purple-500 border-b-pink-500 border-l-blue-500 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-rajdhani text-sm font-bold">
            LOADING
          </div>
        </motion.div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0118] via-[#1a0b2e] to-[#16041a] text-white font-rajdhani selection:bg-cyan-400 selection:text-black overflow-x-hidden">
      {/* Animated background grid */}
      <div className="fixed inset-0 z-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)",
            backgroundSize: "50px 50px",
            animation: "gridMove 20s linear infinite",
          }}
        ></div>
      </div>

      {/* Gradient orbs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/30 rounded-full blur-[100px]"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 -right-40 w-96 h-96 bg-cyan-500/30 rounded-full blur-[100px]"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 left-1/2 w-80 h-80 bg-pink-500/30 rounded-full blur-[100px]"
          animate={{
            x: [0, -50, 0],
            y: [0, 100, 0],
          }}
          transition={{ duration: 25, repeat: Infinity }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-40 backdrop-blur-xl bg-black/40 border-b border-cyan-500/30 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="relative">
              <Shield className="text-cyan-400 w-10 h-10" />
              <div className="absolute inset-0 bg-cyan-400 blur-xl opacity-50"></div>
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                HOUSE OF CUDDLES
              </h1>
              <p className="text-xs text-gray-400 tracking-wider">
                GAMING COMMAND CENTER
              </p>
            </div>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-2">
            {["home", "websites", "servers", "contact"].map((tab, i) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-6 py-2.5 uppercase text-sm font-bold tracking-wider transition-all ${
                  activeTab === tab
                    ? "text-black"
                    : "text-gray-400 hover:text-white"
                }`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </motion.button>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-cyan-400 relative z-10"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 bg-gradient-to-br from-[#0a0118] via-[#1a0b2e] to-[#16041a] z-30 pt-24 px-6 md:hidden backdrop-blur-xl"
          >
            <div className="flex flex-col gap-6">
              {["home", "websites", "servers", "contact"].map((tab, i) => (
                <motion.button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setMobileMenuOpen(false);
                  }}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`text-left text-3xl uppercase font-bold tracking-wider py-4 px-6 rounded-lg border-l-4 ${
                    activeTab === tab
                      ? "border-cyan-400 bg-cyan-400/10 text-cyan-400"
                      : "border-transparent text-gray-400"
                  }`}
                >
                  {tab}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Home Tab */}
        {activeTab === "home" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/40 via-pink-900/40 to-cyan-900/40 p-1">
              <div className="bg-gradient-to-br from-[#1a0b2e]/90 to-[#16041a]/90 backdrop-blur-xl rounded-2xl p-10">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <motion.div
                    className="flex-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Zap className="text-cyan-400" size={32} />
                      <h2 className="text-5xl font-black bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
                        Welcome Commander
                      </h2>
                    </div>
                    <p className="text-xl text-gray-300 leading-relaxed">
                      Your cozy corner of the internet. Explore hosted sites and
                      active game servers.
                    </p>
                  </motion.div>
                  <motion.div
                    className="flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/50"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_#34d399]"></div>
                    <span className="text-emerald-400 font-bold uppercase tracking-wider">
                      System Optimal
                    </span>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-600/20 to-blue-600/20 p-1 cursor-pointer"
                onClick={() => setActiveTab("websites")}
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="bg-gradient-to-br from-[#1a0b2e] to-[#16041a] backdrop-blur-xl rounded-2xl p-8 h-full">
                  <div className="flex items-center justify-between mb-6">
                    <Globe size={48} className="text-cyan-400" />
                    <ChevronRight
                      className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      size={28}
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-white">
                    Hosted Websites
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      {data?.websites?.length || 0}
                    </span>
                    <span className="text-gray-400">active sites</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 p-1 cursor-pointer"
                onClick={() => setActiveTab("servers")}
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="bg-gradient-to-br from-[#1a0b2e] to-[#16041a] backdrop-blur-xl rounded-2xl p-8 h-full">
                  <div className="flex items-center justify-between mb-6">
                    <Gamepad2 size={48} className="text-purple-400" />
                    <ChevronRight
                      className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      size={28}
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-white">
                    Game Servers
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {data?.servers?.length || 0}
                    </span>
                    <span className="text-gray-400">active shards</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Websites Tab */}
        {activeTab === "websites" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {data?.websites?.map((site, i) => (
              <motion.div
                key={site.id}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-600/20 to-purple-600/20 p-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="bg-gradient-to-br from-[#1a0b2e] to-[#16041a] backdrop-blur-xl rounded-2xl p-8 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-2xl font-bold text-white">
                      {site.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_#22d3ee]"></div>
                      <span className="text-xs text-cyan-400 font-bold">
                        ONLINE
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-400 mb-8 flex-1">
                    {site.description}
                  </p>
                  <a
                    href={site.url}
                    target="_blank"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:from-cyan-400 hover:to-blue-400 transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] group-hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]"
                  >
                    Access Site <ExternalLink size={18} />
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Servers Tab */}
        {activeTab === "servers" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {data?.servers?.map((server, i) => (
              <motion.div
                key={server.id}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 p-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="bg-gradient-to-br from-[#1a0b2e] to-[#16041a] backdrop-blur-xl rounded-2xl p-8">
                  {/* Server Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-500/20 rounded-xl">
                        <Server size={32} className="text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-black text-white">
                          {server.name}
                        </h3>
                        <p className="text-purple-400 font-semibold">
                          Engine: {server.game}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/50">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${server.status === "online" ? "bg-emerald-400 shadow-[0_0_10px_#34d399]" : "bg-red-400 shadow-[0_0_10px_#f87171]"}`}
                      ></div>
                      <span
                        className={`font-bold text-sm uppercase tracking-wider ${server.status === "online" ? "text-emerald-400" : "text-red-400"}`}
                      >
                        {server.status}
                      </span>
                    </div>
                  </div>

                  {server.description && (
                    <p className="text-gray-400 mb-6 italic">
                      {server.description}
                    </p>
                  )}

                  {/* Mods Section */}
                  <div className="border-t border-white/10 pt-6">
                    <h4 className="text-xl font-bold mb-4 flex items-center gap-2 text-purple-400">
                      <Plus size={20} /> Loaded Modifications
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {server.mods?.map((mod) => (
                        <a
                          key={mod.id}
                          href={mod.url}
                          target="_blank"
                          className="group/mod flex items-center justify-between gap-2 px-4 py-3 bg-white/5 hover:bg-gradient-to-r hover:from-purple-500/30 hover:to-pink-500/30 border border-white/10 hover:border-purple-500/50 rounded-lg transition-all"
                        >
                          <span className="text-gray-300 group-hover/mod:text-white truncate text-sm">
                            {mod.name}
                          </span>
                          <ExternalLink
                            size={14}
                            className="text-purple-400 opacity-0 group-hover/mod:opacity-100 transition-opacity flex-shrink-0"
                          />
                        </a>
                      ))}
                      {(!server.mods || server.mods.length === 0) && (
                        <p className="text-gray-600 italic col-span-full">
                          No modifications detected
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Contact Tab */}
        {activeTab === "contact" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-600/20 via-purple-600/20 to-pink-600/20 p-1">
              <div className="bg-gradient-to-br from-[#1a0b2e] to-[#16041a] backdrop-blur-xl rounded-2xl p-10">
                <div className="flex items-center justify-center gap-3 mb-8">
                  <Mail className="text-cyan-400" size={32} />
                  <h2 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    Contact Command
                  </h2>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    contactMutation.mutate({
                      name: formData.get("name"),
                      email: formData.get("email"),
                      request_type: formData.get("request_type"),
                      message: formData.get("message"),
                      captcha_answer: formData.get("captcha"),
                      captcha_correct: captcha.a,
                    });
                    e.target.reset();
                  }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                      Name
                    </label>
                    <input
                      required
                      name="name"
                      className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-4 py-3 text-white outline-none transition-all focus:bg-white/10 placeholder:text-gray-600"
                      placeholder="Enter your name..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-4 py-3 text-white outline-none transition-all focus:bg-white/10 placeholder:text-gray-600"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                      Request Type
                    </label>
                    <select
                      name="request_type"
                      className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-4 py-3 text-white outline-none transition-all focus:bg-white/10"
                    >
                      <option value="game_server" className="bg-[#1a0b2e]">
                        Game Server
                      </option>
                      <option value="website" className="bg-[#1a0b2e]">
                        Website Hosting
                      </option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                      Message
                    </label>
                    <textarea
                      required
                      name="message"
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-4 py-3 text-white outline-none transition-all focus:bg-white/10 placeholder:text-gray-600 resize-none"
                      placeholder="Tell us about your request..."
                    />
                  </div>

                  {/* Captcha */}
                  <div className="p-6 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <p className="text-sm mb-3 text-purple-400 font-bold uppercase tracking-wider">
                      Security Verification: {captcha.q} = ?
                    </p>
                    <input
                      required
                      name="captcha"
                      type="number"
                      className="w-full bg-white/5 border border-white/10 focus:border-purple-500/50 rounded-lg px-4 py-3 text-white outline-none transition-all focus:bg-white/10"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={contactMutation.isLoading}
                    className="w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white px-6 py-4 rounded-lg font-bold text-lg uppercase tracking-wider hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {contactMutation.isLoading ? "Sending..." : "Send Request"}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 backdrop-blur-xl bg-black/40 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400 mb-4 font-semibold">
            © House of Cuddles - Your Cozy Corner of the Internet
          </p>
          <div className="flex justify-center gap-8 text-sm text-gray-600">
            <span className="cursor-pointer hover:text-cyan-400 transition-colors">
              Command HQ
            </span>
            <span className="cursor-pointer hover:text-purple-400 transition-colors">
              Network Link
            </span>
            <span className="cursor-pointer hover:text-pink-400 transition-colors">
              Core Systems
            </span>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&display=swap');
        
        body {
          background: linear-gradient(to bottom right, #0a0118, #1a0b2e, #16041a);
          overflow-x: hidden;
        }

        .font-rajdhani {
          font-family: 'Rajdhani', sans-serif;
        }

        @keyframes gridMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(50px); }
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.5);
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #06b6d4, #8b5cf6);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #22d3ee, #a78bfa);
        }
      `}</style>
    </div>
  );
}
