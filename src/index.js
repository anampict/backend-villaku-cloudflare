import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

// Middleware CORS agar bisa diakses dari Vue.js frontend
app.use(
  "/api/*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  })
);

// Endpoint test
app.get("/api", (c) => c.text("API Villa aktif"));

// Ambil semua data villa
app.get("/api/villa", async (c) => {
  try {
    const { results } = await c.env.DB.prepare("SELECT * FROM villa").all();
    return c.json(results);
  } catch (err) {
    return c.text("Gagal mengambil data villa: " + err.message, 500);
  }
});

// Tambah villa baru
app.post("/api/villa", async (c) => {
  try {
    const { nama, harga, deskripsi } = await c.req.json();
    const stmt = c.env.DB.prepare(
      "INSERT INTO villa (nama, harga, deskripsi) VALUES (?, ?, ?)"
    );
    const result = await stmt.bind(nama, harga, deskripsi).run();
    return c.json({ message: "Villa berhasil ditambahkan", result }, 201);
  } catch (err) {
    return c.text("Gagal menambahkan villa: " + err.message, 500);
  }
});

// Update villa
app.put("/api/villa/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const { nama, harga, deskripsi } = await c.req.json();
    const stmt = c.env.DB.prepare(
      "UPDATE villa SET nama = ?, harga = ?, deskripsi = ? WHERE id = ?"
    );
    const result = await stmt.bind(nama, harga, deskripsi, id).run();
    return c.json({ message: "Villa berhasil diupdate", result });
  } catch (err) {
    return c.text("Gagal mengupdate villa: " + err.message, 500);
  }
});

// Hapus villa
app.delete("/api/villa/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const stmt = c.env.DB.prepare("DELETE FROM villa WHERE id = ?");
    const result = await stmt.bind(id).run();
    return c.json({ message: "Villa berhasil dihapus", result });
  } catch (err) {
    return c.text("Gagal menghapus villa: " + err.message, 500);
  }
});

// Jika ingin handle static file (jika deploy frontend bareng)
app.get("*", (c) => c.env.ASSETS?.fetch(c.req.raw) ?? c.text("Not found", 404));

export default app;
