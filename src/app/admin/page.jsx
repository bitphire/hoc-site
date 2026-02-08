import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Trash2,
  ChevronRight,
  Terminal,
  Globe,
  Gamepad2,
  Database,
  ArrowLeft,
  Power,
} from "lucide-react";
import { motion } from "motion/react";
import useUser from "@/utils/useUser";

const fetchDashboardData = async () => {
  const response = await fetch("/api/dashboard/data");
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
};

const manageData = async ({ action, type, data, id }) => {
  const method = action === "add" ? "POST" : "DELETE";
  const response = await fetch("/api/admin/manage", {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, data, id }),
  });
  if (!response.ok) throw new Error("Operation failed");
  return response.json();
};

export default function AdminPage() {
  const queryClient = useQueryClient();
  const { data: user, loading: userLoading } = useUser();
  const { data, isLoading } = useQuery({
    queryKey: ["dashboardData"],
    queryFn: fetchDashboardData,
  });

  const mutation = useMutation({
    mutationFn: manageData,
    onSuccess: () => {
      queryClient.invalidateQueries(["dashboardData"]);
      alert("System Updated!");
    },
  });

  const [formType, setFormType] = useState(null);

  // Redirect to signin if not authenticated
  if (!userLoading && !user) {
    if (typeof window !== "undefined") {
      window.location.href = "/account/signin?callbackUrl=/admin";
    }
    return null;
  }

  if (isLoading || userLoading)
    return (
      <div className="bg-black text-purple-400 min-h-screen p-8 font-vt323">
        INITIALIZING ADMIN CORE...
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-[#c084fc] font-vt323 p-8">
      {/* CRT Overlay Effect */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(124,58,237,0.06),rgba(192,132,252,0.02),rgba(147,51,234,0.06))] bg-[length:100%_2px,3px_100%]"></div>

      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b-4 border-purple-500 pb-4 gap-4">
          <div className="flex items-center gap-4">
            <Terminal
              size={40}
              className="text-purple-400 drop-shadow-[0_0_8px_#c084fc]"
            />
            <h1 className="text-4xl font-bold uppercase drop-shadow-[0_0_10px_#a78bfa]">
              House_of_Cuddles_Admin
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-xl text-purple-600">USER: {user?.email}</span>
            <a
              href="/account/logout"
              className="flex items-center gap-2 text-xl hover:text-white transition-colors text-purple-400"
            >
              <Power size={20} /> LOGOUT
            </a>
            <a
              href="/"
              className="flex items-center gap-2 text-xl hover:text-white transition-colors text-purple-400"
            >
              <ArrowLeft /> EXIT_CORE
            </a>
          </div>
        </div>

        {/* Action Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => setFormType("website")}
            className="border-4 border-purple-700 p-6 text-2xl uppercase hover:bg-purple-700 hover:text-black transition-all shadow-[0_0_10px_rgba(192,132,252,0.2)]"
          >
            + ADD_WEBSITE
          </button>
          <button
            onClick={() => setFormType("server")}
            className="border-4 border-purple-700 p-6 text-2xl uppercase hover:bg-purple-700 hover:text-black transition-all shadow-[0_0_10px_rgba(192,132,252,0.2)]"
          >
            + ADD_SERVER
          </button>
          <button
            onClick={() => setFormType("mod")}
            className="border-4 border-purple-700 p-6 text-2xl uppercase hover:bg-purple-700 hover:text-black transition-all shadow-[0_0_10px_rgba(192,132,252,0.2)]"
          >
            + ADD_MOD
          </button>
        </div>

        {/* Dynamic Forms */}
        {formType && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="border-4 border-purple-500 p-8 bg-purple-900/10 shadow-[0_0_20px_rgba(192,132,252,0.3)]"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl uppercase font-bold text-white drop-shadow-[0_0_10px_#a78bfa]">
                NEW_{formType.toUpperCase()}_ENTRY
              </h2>
              <button
                onClick={() => setFormType(null)}
                className="text-purple-800 hover:text-white transition-colors"
              >
                CANCEL
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const payload = Object.fromEntries(formData.entries());
                mutation.mutate({
                  action: "add",
                  type: formType,
                  data: payload,
                });
                e.target.reset();
              }}
              className="space-y-4"
            >
              {formType === "website" && (
                <>
                  <input
                    required
                    name="name"
                    placeholder="SITE_NAME"
                    className="w-full bg-black border-2 border-purple-800 p-3 text-2xl outline-none focus:border-purple-500 focus:shadow-[0_0_10px_#c084fc] text-purple-400 placeholder:text-purple-900"
                  />
                  <input
                    required
                    name="url"
                    placeholder="HTTPS://URL..."
                    className="w-full bg-black border-2 border-purple-800 p-3 text-2xl outline-none focus:border-purple-500 focus:shadow-[0_0_10px_#c084fc] text-purple-400 placeholder:text-purple-900"
                  />
                  <textarea
                    name="description"
                    placeholder="SITE_DESC"
                    className="w-full bg-black border-2 border-purple-800 p-3 text-2xl outline-none focus:border-purple-500 focus:shadow-[0_0_10px_#c084fc] text-purple-400 placeholder:text-purple-900"
                  />
                </>
              )}

              {formType === "server" && (
                <>
                  <input
                    required
                    name="name"
                    placeholder="SERVER_NAME"
                    className="w-full bg-black border-2 border-purple-800 p-3 text-2xl outline-none focus:border-purple-500 focus:shadow-[0_0_10px_#c084fc] text-purple-400 placeholder:text-purple-900"
                  />
                  <input
                    required
                    name="game"
                    placeholder="GAME_TITLE"
                    className="w-full bg-black border-2 border-purple-800 p-3 text-2xl outline-none focus:border-purple-500 focus:shadow-[0_0_10px_#c084fc] text-purple-400 placeholder:text-purple-900"
                  />
                  <select
                    name="status"
                    className="w-full bg-black border-2 border-purple-800 p-3 text-2xl outline-none focus:border-purple-500 focus:shadow-[0_0_10px_#c084fc] text-purple-400"
                  >
                    <option value="online">ONLINE</option>
                    <option value="offline">OFFLINE</option>
                  </select>
                  <textarea
                    name="description"
                    placeholder="SERVER_DESC"
                    className="w-full bg-black border-2 border-purple-800 p-3 text-2xl outline-none focus:border-purple-500 focus:shadow-[0_0_10px_#c084fc] text-purple-400 placeholder:text-purple-900"
                  />
                </>
              )}

              {formType === "mod" && (
                <>
                  <select
                    required
                    name="server_id"
                    className="w-full bg-black border-2 border-purple-800 p-3 text-2xl outline-none focus:border-purple-500 focus:shadow-[0_0_10px_#c084fc] text-purple-400"
                  >
                    <option value="">SELECT_SERVER</option>
                    {data?.servers?.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <input
                    required
                    name="name"
                    placeholder="MOD_NAME"
                    className="w-full bg-black border-2 border-purple-800 p-3 text-2xl outline-none focus:border-purple-500 focus:shadow-[0_0_10px_#c084fc] text-purple-400 placeholder:text-purple-900"
                  />
                  <input
                    required
                    name="url"
                    placeholder="DOWNLOAD_URL"
                    className="w-full bg-black border-2 border-purple-800 p-3 text-2xl outline-none focus:border-purple-500 focus:shadow-[0_0_10px_#c084fc] text-purple-400 placeholder:text-purple-900"
                  />
                </>
              )}

              <button
                type="submit"
                className="w-full bg-purple-500 text-white p-4 text-2xl font-bold uppercase hover:bg-purple-400 transition-colors shadow-[0_0_10px_#c084fc]"
              >
                SAVE_TO_DATABASE
              </button>
            </form>
          </motion.div>
        )}

        {/* Existing Data Management */}
        <div className="space-y-8">
          <section>
            <h3 className="text-2xl uppercase border-b-2 border-purple-900 pb-2 mb-4 flex items-center gap-2 text-purple-300">
              <Globe size={20} /> Managed_Websites.dir
            </h3>
            <div className="space-y-2">
              {data?.websites?.map((site) => (
                <div
                  key={site.id}
                  className="flex items-center justify-between border-2 border-purple-900 p-3 hover:border-purple-500 group text-purple-400"
                >
                  <span className="text-xl">
                    {site.name} ({site.url})
                  </span>
                  <button
                    onClick={() =>
                      mutation.mutate({
                        action: "delete",
                        type: "website",
                        id: site.id,
                      })
                    }
                    className="text-red-800 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-2xl uppercase border-b-2 border-purple-900 pb-2 mb-4 flex items-center gap-2 text-purple-300">
              <Gamepad2 size={20} /> Managed_Servers.dir
            </h3>
            <div className="space-y-4">
              {data?.servers?.map((server) => (
                <div key={server.id} className="border-2 border-purple-900 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-purple-300">
                      {server.name} - {server.game}
                    </span>
                    <button
                      onClick={() =>
                        mutation.mutate({
                          action: "delete",
                          type: "server",
                          id: server.id,
                        })
                      }
                      className="text-red-800 hover:text-red-500"
                    >
                      <Trash2 size={24} />
                    </button>
                  </div>
                  {/* Mods list */}
                  <div className="pl-6 space-y-1">
                    {server.mods?.map((mod) => (
                      <div
                        key={mod.id}
                        className="flex items-center justify-between text-lg text-purple-700"
                      >
                        <span>• {mod.name}</span>
                        <button
                          onClick={() =>
                            mutation.mutate({
                              action: "delete",
                              type: "mod",
                              id: mod.id,
                            })
                          }
                          className="hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
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
