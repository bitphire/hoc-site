import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { type, data } = await request.json();

    if (type === "website") {
      const { name, url, description } = data;
      await sql`INSERT INTO websites (name, url, description) VALUES (${name}, ${url}, ${description})`;
    } else if (type === "server") {
      const { name, game, description, status } = data;
      await sql`INSERT INTO game_servers (name, game, description, status) VALUES (${name}, ${game}, ${description}, ${status})`;
    } else if (type === "mod") {
      const { server_id, name, url } = data;
      await sql`INSERT INTO mods (server_id, name, url) VALUES (${server_id}, ${name}, ${url})`;
    } else {
      return Response.json({ error: "Invalid type" }, { status: 400 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Admin add error:", error);
    return Response.json({ error: "Failed to add item" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { type, id } = await request.json();

    if (type === "website") {
      await sql`DELETE FROM websites WHERE id = ${id}`;
    } else if (type === "server") {
      await sql`DELETE FROM game_servers WHERE id = ${id}`;
    } else if (type === "mod") {
      await sql`DELETE FROM mods WHERE id = ${id}`;
    } else {
      return Response.json({ error: "Invalid type" }, { status: 400 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Admin delete error:", error);
    return Response.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
