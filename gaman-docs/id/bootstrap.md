# Bootstrap

`defineBootstrap` adalah entry point utama GamanJS. Fungsi ini membuat instance `Gaman` dan memberikan akses ke method `mount()` dan `mountServer()`.

## Penggunaan Dasar

```ts
import { defineBootstrap } from 'gaman';
import router from './router';

defineBootstrap(async (app) => {
  // Mount router, middleware, atau exception handler
  app.mount(router);

  // Jalankan HTTP server
  app.mountServer({ http: 3431 });
});
```

## `app.mount()`

Method `mount()` digunakan untuk mendaftarkan:

| Tipe | Deskripsi |
|------|-----------|
| **Routes** | Hasil dari `composeRouter()` — mendaftarkan semua route yang sudah didefinisikan |
| **Middleware** | Hasil dari `composeMiddleware()()` — middleware global yang berjalan di semua route |
| **ExceptionHandler** | Hasil dari `composeException()` — global error handler |

### Contoh: Mount Semua

```ts
import { defineBootstrap } from 'gaman';
import router from './router';
import AuthMiddleware from './module/middlewares/AuthMiddleware';
import GlobalExceptionHandler from './module/exceptions/GlobalException';

defineBootstrap(async (app) => {
  // Mount global middleware (dipanggil sebagai fungsi untuk set config)
  app.mount(AuthMiddleware());

  // Mount global exception handler
  app.mount(GlobalExceptionHandler);

  // Mount routes
  app.mount(router);

  app.mountServer({ http: 3431 });
});
```

> **Catatan:** Urutan `mount()` untuk middleware memengaruhi urutan eksekusi berdasarkan priority. Lihat [Middleware](./middleware.md) untuk detail priority system.

## `app.mountServer()`

Memulai HTTP server dengan konfigurasi yang diberikan.

### Shorthand (Port Saja)

```ts
app.mountServer({ http: 3431 });
```

### Full Configuration

```ts
app.mountServer({
  http: {
    port: 3431,
    host: 'localhost',          // default: 'localhost'
    maxRequestBodySize: 1024 * 1024 * 50, // 50MB
    reusePort: false,           // default: false
    development: true,          // default: false
  },
});
```

### Opsi `HttpServerConfig`

| Property | Type | Default | Deskripsi |
|----------|------|---------|-----------|
| `port` | `number` | `3431` | Port HTTP server |
| `host` | `string` | `'localhost'` | Hostname server. Gunakan `'0.0.0.0'` untuk menerima dari semua interface |
| `maxRequestBodySize` | `number` | — | Maksimum ukuran request body dalam bytes |
| `reusePort` | `boolean` | `false` | Aktifkan `SO_REUSEPORT` socket option |
| `development` | `boolean` | `false` | Mode development — menampilkan error stack detail |
