# Context (`ctx`)

Setiap handler dan middleware di GamanJS menerima object `ctx` (Context) yang berisi semua informasi request dan utility untuk mengakses data.

## Properti Utama

### `ctx.path`

Pathname dari URL (tanpa query string):

```ts
// Request: GET /users/123?active=true
ctx.path; // '/users/123'
```

### `ctx.url`

Instance `URL` lengkap:

```ts
ctx.url.origin;   // 'http://localhost:3431'
ctx.url.pathname; // '/users/123'
ctx.url.search;   // '?active=true'
```

### `ctx.request`

Informasi raw request:

```ts
ctx.request.id;       // Request ID unik (auto-generated)
ctx.request.method;   // 'GET', 'POST', dll
ctx.request.url;      // URL lengkap sebagai string
ctx.request.pathname; // Pathname
ctx.request.body();   // Promise<Buffer> — raw body
```

---

## Route Parameters

### `ctx.param(name)`

Ambil satu route parameter:

```ts
// Route: /users/:id
r.get('/users/:id', (ctx) => {
  const id = ctx.param('id'); // '123'
  return Res.send({ id });
});
```

### `ctx.params`

Semua route parameters sebagai object:

```ts
// Route: /posts/:postId/comments/:commentId
ctx.params; // { postId: '1', commentId: '42' }
```

---

## Query Parameters

### `ctx.query`

Akses query parameter langsung:

```ts
// Request: GET /search?q=gaman&page=2
ctx.query.q;    // 'gaman'
ctx.query.page; // '2'
```

Jika parameter memiliki banyak nilai:

```ts
// Request: GET /filter?tag=js&tag=ts
ctx.query.tag; // ['js', 'ts']
```

---

## Request Body

### `ctx.json<T>()`

Parse body sebagai JSON:

```ts
async Create(ctx) {
  const body = await ctx.json<{ name: string; email: string }>();
  // body.name, body.email
  return Res.send(body, 201);
}
```

### `ctx.text()`

Baca body sebagai plain text:

```ts
async Webhook(ctx) {
  const raw = await ctx.text();
  return Res.message('OK');
}
```

### `ctx.formData()`

Parse body sebagai FormData (multipart atau URL-encoded):

```ts
async Upload(ctx) {
  const form = await ctx.formData();
  const name = form.get('name');
  // ...
}
```

---

## Form Shortcuts

### `ctx.input(name)`

Ambil satu string value dari form data:

```ts
const email = await ctx.input('email'); // string | null
```

### `ctx.inputs(name)`

Ambil banyak string values dari form data:

```ts
const tags = await ctx.inputs('tags'); // string[]
```

### `ctx.file(name)`

Ambil satu file dari form data:

```ts
const avatar = await ctx.file('avatar'); // GFile | null

if (avatar) {
  avatar.name;     // nama file asli
  avatar.type;     // MIME type
  avatar.size;     // ukuran dalam bytes
  // ...
}
```

### `ctx.files(name)`

Ambil banyak file dari form data:

```ts
const images = await ctx.files('images'); // GFile[]
```

---

## Headers

### `ctx.header(key)`

Ambil value header tertentu (case-insensitive):

```ts
const token = ctx.header('Authorization'); // string | null
const contentType = ctx.header('Content-Type');
```

### `ctx.headers`

Instance `GamanHeader` untuk akses dan manipulasi header:

```ts
// Baca
ctx.headers.get('Content-Type');

// Set response header
ctx.headers.set('X-Custom-Header', 'value');
```

---

## Cookies

### `ctx.cookies`

Instance `CookieMap` dari Bun untuk akses cookies:

```ts
const session = ctx.cookies.get('session_id');
```

---

## Data Store

Middleware dan handler bisa berbagi data via context store:

### `ctx.set(key, value)`

```ts
ctx.set('user', { id: 1, name: 'Angga' });
```

### `ctx.get<T>(key)`

```ts
const user = ctx.get<{ id: number; name: string }>('user');
```

### `ctx.has(key)`

```ts
if (ctx.has('user')) {
  // user sudah di-set oleh middleware
}
```

### `ctx.delete(key)`

```ts
ctx.delete('tempData');
```

---

## Contoh Lengkap

```ts
export default composeController(() => ({
  async CreatePost(ctx) {
    // Route params
    const userId = ctx.param('userId');

    // Query
    const draft = ctx.query.draft === 'true';

    // Body
    const body = await ctx.json<{
      title: string;
      content: string;
    }>();

    // Headers
    const token = ctx.header('Authorization');

    // Data dari middleware
    const currentUser = ctx.get('user');

    return Res.send({
      userId,
      draft,
      title: body.title,
      author: currentUser.name,
    }, 201);
  },
}));
```
