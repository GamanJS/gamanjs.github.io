# Router

GamanJS uses `composeRouter` to declaratively define all application routes. The router supports all HTTP methods, route grouping, per-route middleware, and per-route exception handlers.

## Basic Usage

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

All standard HTTP methods are available:

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

## Handler Types

A handler can be a **function** directly or a **Controller tuple**:

### Function Handler

```ts
r.get('/ping', (ctx) => {
  return Res.message('pong');
});
```

### Controller Handler (Recommended)

```ts
import UserController from './module/controllers/UserController';

r.get('/users', [UserController, 'GetAll']);
r.get('/users/:id', [UserController, 'GetById']);
r.post('/users', [UserController, 'Create']);
```

Format: `[ControllerFactory, 'MethodName']`

## Route Parameters

Use `:name` for dynamic parameters:

```ts
r.get('/users/:id', [UserController, 'GetById']);
r.get('/posts/:postId/comments/:commentId', [PostController, 'GetComment']);
```

Access in handler via `ctx.param('id')` or `ctx.params`.

## Route Grouping

Group routes with a shared prefix:

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

Resulting routes:
- `GET /api/v1/users`
- `POST /api/v1/users`
- `GET /api/v1/admin/dashboard`

## Route Middleware

Add per-route middleware using `.middleware()` chaining:

```ts
import AuthMiddleware from './module/middlewares/AuthMiddleware';

export default composeRouter((r) => {
  // Route without middleware
  r.get('/public', [AppController, 'Public']);

  // Route with middleware
  r.get('/protected', [AppController, 'Protected'])
    .middleware(AuthMiddleware());

  // Multiple middleware
  r.post('/admin/action', [AdminController, 'DoAction'])
    .middleware(AuthMiddleware())
    .middleware(RateLimitMiddleware());
});
```

### Group Middleware

Automatically applied to all routes in the group:

```ts
r.group('/admin', (admin) => {
  admin.get('/dashboard', [AdminController, 'Dashboard']);
  admin.get('/users', [AdminController, 'Users']);
}).middleware(AuthMiddleware());
```

## Route Exception Handler

Override error handling for specific routes:

```ts
import { composeException } from 'gaman/compose';

const CustomErrorHandler = composeException((error, ctx) => {
  return Res.send({ detail: error.message }, 500);
});

r.get('/risky', [AppController, 'Risky'])
  .exception(CustomErrorHandler);
```

## Route Naming

Give routes a name for reference:

```ts
r.get('/users/:id', [UserController, 'GetById'])
  .name('users.show');
```

## Full Chaining

All route methods return a `RouteDefinition` supporting chaining:

```ts
r.post('/users', [UserController, 'Create'])
  .middleware(AuthMiddleware())
  .middleware(ValidateMiddleware())
  .exception(CustomErrorHandler)
  .name('users.create');
```
