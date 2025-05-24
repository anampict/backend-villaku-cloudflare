-- membuat tabel villa dan menambahkan kolom id, nama, harga, deskripsi

CREATE TABLE IF NOT EXISTS villa (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nama TEXT NOT NULL,
  harga INTEGER NOT NULL,
  deskripsi TEXT NOT NULL
);
