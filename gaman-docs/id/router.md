# Router

GamanJS menggunakan `composeRouter` untuk mendefinisikan semua route aplikasi secara deklaratif. Router mendukung semua HTTP method, route grouping, middleware per-route, dan exception handler per-route.

## Penggunaan Dasar

```ts
// src/router.ts
import { composeRouter } from 'gaman/compose';
import AppController from './module/controllers/AppController';

export default composeRouter((r) => {
  r.get('/', [AppController, 'HelloWorld']);
  r.post('/users', [AppController, 'CreateUser']);
});
```

## HTTP Methods

Semua HTTP method standar tersedia:

```ts
export default composeRouter((r) => {
  r.get('/resource', handler);
  r.post('/resource', handler);
  r.put('/resource/:id', handler);
  r.patch('/resource/:id', handler);
  r.delete('/resource/:id', handler);
  r.head('/resource', handler);
  r.options('/resource', handler);
  r.all('/resource', handler);    // GET, POST, PUT, DELETE, PATCH
});
```

### Custom Methods

```ts
r.match(['GET', 'POST'], '/custom', handler);
```

## Tipe Handler

Handler bisa berupa **function** langsung atau **tuple Controller**:

### Function Handler

```ts
r.get('/ping', (ctx) => {
  return Res.message('pong');
});
```

### Controller Handler (Rekomendasi)

```ts
import UserController from './module/controllers/UserController';

r.get('/users', [UserController, 'GetAll']);
r.get('/users/:id', [UserController, 'GetById']);
r.post('/users', [UserController, 'Create']);
```

Format: `[ControllerFactory, 'NamaMethod']`

## Route Parameters

Gunakan `:nama` untuk parameter dinamis:

```ts
r.get('/users/:id', [UserController, 'GetById']);
r.get('/posts/:postId/comments/:commentId', [PostController, 'GetComment']);
```

Akses di handler via `ctx.param('id')` atau `ctx.params`.

## Route Grouping

Grupkan route dengan prefix yang sama:

```ts
export default composeRouter((r) => {
  r.group('/api/v1', (api) => {
    api.get('/users', [UserController, 'GetAll']);
    api.post('/users', [UserController, 'Create']);

    api.group('/admin', (admin) => {
      admin.get('/dashboard', [AdminController, 'Dashboard']);
    });
  });
});
```

Route yang dihasilkan:
- `GET /api/v1/users`
- `POST /api/v1/users`
- `GET /api/v1/admin/dashboard`

## Route Middleware

Tambahkan middleware per-route menggunakan chaining `.middleware()`:

```ts
import AuthMiddleware from './module/middlewares/AuthMiddleware';

export default composeRouter((r) => {
  // Route tanpa middleware
  r.get('/public', [AppController, 'Public']);

  // Route dengan middleware
  r.get('/protected', [AppController, 'Protected'])
    .middleware(AuthMiddleware());

  // Multiple middleware
  r.post('/admin/action', [AdminController, 'DoAction'])
    .middleware(AuthMiddleware())
    .middleware(RateLimitMiddleware());
});
```

### Group Middleware

Otomatis berlaku ke semua route dalam group:

```ts
r.group('/admin', (admin) => {
  admin.get('/dashboard', [AdminController, 'Dashboard']);
  admin.get('/users', [AdminController, 'Users']);
}).middleware(AuthMiddleware());
```

## Route Exception Handler

Override error handling per-route:

```ts
import { composeException } from 'gaman/compose';

const CustomErrorHandler = composeException((error, ctx) => {
  return Res.send({ detail: error.message }, 500);
});

r.get('/risky', [AppController, 'Risky'])
  .exception(CustomErrorHandler);
```

## Route Naming

Beri nama route untuk referensi:

```ts
r.get('/users/:id', [UserController, 'GetById'])
  .name('users.show');
```

## Chaining Lengkap

Semua method route mengembalikan `RouteDefinition` yang mendukung chaining:

```ts
r.post('/users', [UserController, 'Create'])
  .middleware(AuthMiddleware())
  .middleware(ValidateMiddleware())
  .exception(CustomErrorHandler)
  .name('users.create');
```
