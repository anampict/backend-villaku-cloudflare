// konsifgurasi APInya menggunakan cloudflare worker

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle preflight OPTIONS request
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // GET semua villa / mengambil data villa
    if (url.pathname === "/api/villa" && request.method === "GET") {
      //menggunakan try catch untuk menangani error dan memudahkan debugging
      try {
        const { results } = await env.DB.prepare("SELECT * FROM villa").all();
        return new Response(JSON.stringify(results), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      } catch (err) {
        return new Response("Gagal mengambil data villa: " + err.message, {
          status: 500,
          headers: { "Access-Control-Allow-Origin": "*" },
        });
      }
    }

    // POST villa baru dan menambahkan data villa
    // menggunakan try catch untuk menangani error dan memudahkan debugging
    if (url.pathname === "/api/villa" && request.method === "POST") {
      try {
        const { nama, harga, deskripsi } = await request.json();
        await env.DB.prepare(
          "INSERT INTO villa (nama, harga, deskripsi) VALUES (?, ?, ?)"
        )
          .bind(nama, harga, deskripsi)
          .run();
        return new Response("Villa berhasil ditambahkan", {
          status: 201,
          headers: { "Access-Control-Allow-Origin": "*" },
        });
      } catch (err) {
        return new Response("Gagal menambahkan villa: " + err.message, {
          status: 500,
          headers: { "Access-Control-Allow-Origin": "*" },
        });
      }
    }

    // PUT update villa untuk mengupdate data villa
    if (url.pathname.startsWith("/api/villa/") && request.method === "PUT") {
      try {
        const id = url.pathname.split("/").pop();
        const { nama, harga, deskripsi } = await request.json();
        await env.DB.prepare(
          "UPDATE villa SET nama = ?, harga = ?, deskripsi = ? WHERE id = ?"
        )
          .bind(nama, harga, deskripsi, id)
          .run();
        return new Response("Villa berhasil diupdate", {
          status: 200,
          headers: { "Access-Control-Allow-Origin": "*" },
        });
      } catch (err) {
        return new Response("Gagal mengupdate villa: " + err.message, {
          status: 500,
          headers: { "Access-Control-Allow-Origin": "*" },
        });
      }
    }

    // DELETE villa menghapus data villa
    if (url.pathname.startsWith("/api/villa/") && request.method === "DELETE") {
      try {
        const id = url.pathname.split("/").pop();
        await env.DB.prepare("DELETE FROM villa WHERE id = ?").bind(id).run();
        return new Response("Villa berhasil dihapus", {
          status: 200,
          headers: { "Access-Control-Allow-Origin": "*" },
        });
      } catch (err) {
        return new Response("Gagal menghapus villa: " + err.message, {
          status: 500,
          headers: { "Access-Control-Allow-Origin": "*" },
        });
      }
    }
    // Jika tidak ada endpoint yang cocok, kembalikan 404 dengan pesan tidak ditemukan
    return new Response("Endpoint tidak ditemukan", {
      status: 404,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  },
};
