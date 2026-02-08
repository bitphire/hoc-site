import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const websites = await sql`SELECT * FROM websites ORDER BY created_at DESC`;
    const servers =
      await sql`SELECT * FROM game_servers ORDER BY created_at DESC`;
    const mods = await sql`SELECT * FROM mods`;

    // Group mods by server_id
    const serversWithMods = servers.map((server) => ({
      ...server,
      mods: mods.filter((mod) => mod.server_id === server.id),
    }));

    return Response.json({ websites, servers: serversWithMods });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return Response.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
