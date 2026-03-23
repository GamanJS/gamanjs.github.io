# Response (`Res`)

GamanJS provides a global `Res` (alias for the `Responder` class) to create **consistent and standardized** responses. The goal is for all API responses from your application to have the same format — no more inconsistent response formats across endpoints.

## Standard Response Format

All responses created via `Res.send()` / `Res.message()` / `Res.error()` produce a consistent JSON format:

```json
{
  "success": true,
  "message": "Success",
  "data": { ... },
  "metadata": {
    "requestId": "abc123...",
    "timestamp": "2026-03-23T07:00:00.000Z"
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `success` | `boolean` | `true` if status 2xx, `false` otherwise |
| `message` | `string` | Response message (auto-set based on status code, or custom) |
| `data` | `any` | Response data (optional) |
| `errors` | `Record<string, string[]>` | Validation errors (optional) |
| `metadata` | `object` | Request ID & timestamp, plus custom metadata |

---

## Static Factory Methods

### `Res.send(data, options?)` ⭐ **Primary**

The primary method for sending responses with data. **This is the most commonly used.**

```ts
// Send data with status 200 (default)
return Res.send({ name: 'Angga', age: 25 });

// Send data with custom status
return Res.send(users, 201);

// Send data with full options
return Res.send(users, {
  status: 200,
  message: 'Users retrieved successfully',
});
```

Output:

```json
{
  "success": true,
  "message": "Success",
  "data": { "name": "Angga", "age": 25 },
  "metadata": {
    "requestId": "...",
    "timestamp": "..."
  }
}
```

### `Res.message(msg, options?)`

Send a response with only a message (no data):

```ts
return Res.message('Welcome to GamanJS');
return Res.message('User created successfully', 201);
```

Output:

```json
{
  "success": true,
  "message": "Welcome to GamanJS",
  "metadata": { ... }
}
```

### `Res.error(errors, options?)`

Send an error response with validation error details:

```ts
return Res.error({
  email: ['Email is required', 'Invalid email format'],
  password: ['Password must be at least 8 characters'],
}, 422);
```

Output:

```json
{
  "success": false,
  "message": "Unprocessable Entity",
  "errors": {
    "email": ["Email is required", "Invalid email format"],
    "password": ["Password must be at least 8 characters"]
  },
  "metadata": { ... }
}
```

### `Res.ok(data)`

Shortcut for `Res.send(data)` with status `200`:

```ts
return Res.ok(users);
```

### `Res.notFound(data?)`

Shortcut for `404` response:

```ts
return Res.notFound();
```

---

## Raw Response Methods

Methods for sending responses **without** the standard format (raw body):

### `Res.json(data, options?)`

Send raw JSON (without `success`, `message` wrapper, etc):

```ts
return Res.json({ custom: 'format' });
```

### `Res.text(message, options?)`

Send plain text:

```ts
return Res.text('Hello World');
```

### `Res.html(body, options?)`

Send HTML:

```ts
return Res.html('<h1>Hello World</h1>');
```

### `Res.stream(readableStream, options?)`

Send stream response:

```ts
const file = Bun.file('./large-video.mp4');
return Res.stream(file.stream());
```

### `Res.render(viewName, viewData?, options?)`

Send HTML response from a view template:

```ts
return Res.render('home', { title: 'Welcome' });
```

### `Res.redirect(location, status?)`

Redirect response:

```ts
return Res.redirect('/dashboard');      // 302
return Res.redirect('/new-url', 301);   // 301
```

---

## Fluent API (Method Chaining)

All `Responder` instances support chaining:

```ts
return Res.send(data)
  .status(201)
  .message('User created')
  .meta({ page: 1, total: 100 })
  .header('X-Custom', 'value');
```

### Chaining Methods

| Method | Description |
|--------|-------------|
| `.message(msg)` | Set custom message |
| `.status(code)` | Set HTTP status code |
| `.statusText(text)` | Set status text |
| `.meta(data)` | Add custom metadata |
| `.header(key, value)` | Add response header |
| `.error(errors, msg?)` | Set validation errors |

---

## Status Shortcuts

Shortcut methods for setting status codes:

```ts
return Res.send(data).ok();                 // 200
return Res.send(data).created();            // 201
return Res.send(data).accepted();           // 202
return Res.send(data).noContent();          // 204
return Res.send(data).badRequest();         // 400
return Res.send(data).unauthorized();       // 401
return Res.send(data).forbidden();          // 403
return Res.send(data).notFound();           // 404
return Res.send(data).methodNotAllowed();   // 405
return Res.send(data).tooManyRequests();    // 429
return Res.send(data).internalServerError();// 500
```

### Redirect Shortcuts

```ts
return Res.send(null).movedPermanently('/new-url');  // 301
return Res.send(null).movedTemporarily('/temp-url');  // 302
```

---

## Full Example

```ts
import { composeController } from 'gaman/compose';
import UserService from '../services/UserService';
import type { RT } from 'gaman/types';

export default composeController(
  (userService: RT<typeof UserService> = UserService()) => ({
    // GET /users
    GetAll(ctx) {
      const users = userService.findAll();
      return Res.send(users).meta({ total: users.length });
    },

    // GET /users/:id
    GetById(ctx) {
      const user = userService.findById(ctx.param('id'));
      if (!user) return Res.message('User not found').notFound();
      return Res.send(user);
    },

    // POST /users
    async Create(ctx) {
      const body = await ctx.json();

      if (!body.email) {
        return Res.error({ email: ['Email is required'] }, 422);
      }

      const user = userService.create(body);
      return Res.send(user, { status: 201, message: 'User created' });
    },

    // DELETE /users/:id
    Delete(ctx) {
      userService.delete(ctx.param('id'));
      return Res.send(null).noContent(); // 204 No Content
    },
  }),
);
```

## Why Use `Res.send()`?

> **Problem:** Most developers create API responses with different formats across endpoints. Some use `{ data: ... }`, `{ result: ... }`, `{ status: 'ok' }`, etc.
>
> **Solution:** GamanJS enforces consistent response formatting through `Res`. All responses automatically have `success`, `message`, `data`, `errors`, and `metadata`.
