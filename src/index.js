import { Hono } from "hono";
import { serveStatic } from "hono/cloudflare-workers";
import { cors } from "hono/cors";

const app = new Hono();

// CORS untuk keamanan untuk mengakses api dari domain lain
app.use(
  "/api/*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  })
);

// tes endpoint api
app.get("/api", (c) => c.text("API Villa aktif"));

//perintah untuk mengambil semua data villa
app.get("/api/villa", async (c) => {
  const { results } = await c.env.DB.prepare("SELECT * FROM villa").all();
  return c.json(results);
});

//perintah untuk menambahkan data villa berdasarkan id
app.post("/api/villa", async (c) => {
  const { nama, harga, deskripsi } = await c.req.json();
  const result = await c.env.DB.prepare(
    "INSERT INTO villa (nama, harga, deskripsi) VALUES (?, ?, ?)"
  )
    .bind(nama, harga, deskripsi)
    .run();
  return c.json({ message: "Villa berhasil ditambahkan", result }, 201);
});

//perintah untuk mengupdate data villa berdasarkan id
app.put("/api/villa/:id", async (c) => {
  const id = c.req.param("id");
  const { nama, harga, deskripsi } = await c.req.json();
  const result = await c.env.DB.prepare(
    "UPDATE villa SET nama = ?, harga = ?, deskripsi = ? WHERE id = ?"
  )
    .bind(nama, harga, deskripsi, id)
    .run();
  return c.json({ message: "Villa berhasil diupdate", result });
});

//perintah untuk menghapus data villa berdasarkan id
app.delete("/api/villa/:id", async (c) => {
  const id = c.req.param("id");
  const result = await c.env.DB.prepare("DELETE FROM villa WHERE id = ?")
    .bind(id)
    .run();
  return c.json({ message: "Villa berhasil dihapus", result });
});

// Static files handler
app.use("/assets/*", serveStatic({ root: "./" }));

// SPA Fallback ke index.html
app.use("*", serveStatic({ path: "./index.html" }));

export default app;
