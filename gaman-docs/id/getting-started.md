# Memulai

## Persyaratan

- [Bun](https://bun.sh) `v1.0+`

## Membuat Project Baru

```bash
bun create gaman@latest
```

Perintah ini akan men-generate project baru dengan struktur berikut:

```
my-app/
├── src/
│   ├── index.ts                      # Entry point & bootstrap
│   ├── router.ts                     # Definisi route
│   └── module/
│       ├── controllers/
│       │   └── AppController.ts      # Controller contoh
│       ├── services/
│       │   └── AppService.ts         # Service contoh
│       └── middlewares/
│           └── AppMiddleware.ts      # Middleware contoh
├── package.json
└── tsconfig.json
```

## Instalasi Manual

Jika kamu ingin menambahkan GamanJS ke project yang sudah ada:

```bash
bun add gaman @gaman/michi
```

## Menjalankan Server

```bash
bun run src/index.ts
```

Output:

```
GamanJS Framework v2
The Universal Transport Layer for Your Logic.
 ──────────────────────────────────────
HTTP  : Listening at http://localhost:3431
 ──────────────────────────────────────
Orchestration complete. Ready for requests.
```

## Selanjutnya

- [Bootstrap](./bootstrap.md) — Konfigurasi dan menjalankan server
- [Router](./router.md) — Mendefinisikan route
- [Controller](./controller.md) — Memisahkan handler logic
