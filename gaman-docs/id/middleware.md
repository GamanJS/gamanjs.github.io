# Middleware

Middleware di GamanJS berjalan **sebelum** handler route dan bisa melakukan pengecekan, modifikasi context, atau menghentikan request sebelum sampai ke controller.

## Membuat Middleware

```ts
// src/module/middlewares/AppMiddleware.ts
import { composeMiddleware } from 'gaman/compose';

export default composeMiddleware(async (ctx, next) => {
  // Logic sebelum handler
  console.log(`[${ctx.request.method}] ${ctx.path}`);

  // Lanjutkan ke handler / middleware berikutnya
  return next();
});
```

`composeMiddleware` mengembalikan **factory function** — harus dipanggil `()` saat didaftarkan.

### Menghentikan Request

Jika middleware ingin menghentikan request (misal: auth gagal), **jangan panggil `next()`**, langsung return `Res`:

```ts
import { composeMiddleware } from 'gaman/compose';

export default composeMiddleware(async (ctx, next) => {
  const token = ctx.header('Authorization');

  if (!token) {
    return Res.message('Unauthorized').unauthorized();
  }

  // Token valid, lanjutkan
  return next();
});
```

## Middleware Global

Daftarkan di `defineBootstrap` via `app.mount()`:

```ts
import { defineBootstrap } from 'gaman';
import router from './router';
import LogMiddleware from './module/middlewares/LogMiddleware';

defineBootstrap(async (app) => {
  // Middleware global — berjalan di SEMUA route
  app.mount(LogMiddleware());

  app.mount(router);
  app.mountServer({ http: 3431 });
});
```

## Middleware Per-Route

Daftarkan langsung di route definition:

```ts
import { composeRouter } from 'gaman/compose';
import AuthMiddleware from './module/middlewares/AuthMiddleware';
import UserController from './module/controllers/UserController';

export default composeRouter((r) => {
  r.get('/profile', [UserController, 'Profile'])
    .middleware(AuthMiddleware());
});
```

## Middleware pada Group

Berlaku ke semua route dalam group:

```ts
r.group('/admin', (admin) => {
  admin.get('/dashboard', [AdminController, 'Dashboard']);
  admin.get('/settings', [AdminController, 'Settings']);
}).middleware(AuthMiddleware());
```

## Priority System

Middleware memiliki **priority** yang mengatur urutan eksekusi. Priority lebih rendah (angka lebih kecil) dijalankan lebih dulu.

```ts
import { Priority } from 'gaman/utils';
```

| Priority | Nilai | Keterangan |
|----------|-------|------------|
| `MONITOR` | `0` | Paling awal, untuk logging/monitoring |
| `VERY_HIGH` | `1` | Sangat tinggi |
| `HIGH` | `2` | Tinggi |
| `NORMAL` | `3` | Default |
| `LOW` | `4` | Rendah |
| `VERY_LOW` | `5` | Paling akhir |

### Default Config

```ts
export default composeMiddleware(
  async (ctx, next) => {
    return next();
  },
  { priority: Priority.NORMAL }, // default config
);
```

### Override Saat Digunakan

```ts
app.mount(LogMiddleware({ priority: Priority.MONITOR }));
app.mount(AuthMiddleware({ priority: Priority.HIGH }));
```

### Custom Config

Middleware bisa menerima konfigurasi custom:

```ts
import { composeMiddleware } from 'gaman/compose';

type CorsConfig = {
  origin: string;
  methods: string[];
};

export default composeMiddleware<CorsConfig>(
  async (ctx, next) => {
    ctx.headers.set('Access-Control-Allow-Origin', '*');
    return next();
  },
  {
    origin: '*',
    methods: ['GET', 'POST'],
    priority: Priority.VERY_HIGH,
  },
);
```

Penggunaan:

```ts
app.mount(CorsMiddleware({ origin: 'https://example.com' }));
```

## Menyimpan Data di Context

Middleware bisa menyimpan data yang bisa diakses oleh handler:

```ts
export default composeMiddleware(async (ctx, next) => {
  const user = await verifyToken(ctx.header('Authorization'));
  ctx.set('user', user);   // Simpan ke context
  return next();
});
```

Akses di controller:

```ts
GetProfile(ctx) {
  const user = ctx.get('user');  // Ambil dari context
  return Res.send(user);
}
```

## Pipeline Eksekusi

Urutan middleware pipeline:

```
Request → Global Middlewares (sorted by priority) → Route Middlewares → Handler → Response
```
