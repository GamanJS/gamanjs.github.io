# Bootstrap

`defineBootstrap` is the main entry point of GamanJS. This function creates a `Gaman` instance and provides access to the `mount()` and `mountServer()` methods.

## Basic Usage

```ts
import { defineBootstrap } from 'gaman';
import router from './router';

defineBootstrap(async (app) => {
  // Mount router, middleware, or exception handler
  app.mount(router);

  // Start HTTP server
  app.mountServer({ http: 3431 });
});
```

## `app.mount()`

The `mount()` method is used to register:

| Type | Description |
|------|-------------|
| **Routes** | Result of `composeRouter()` — registers all defined routes |
| **Middleware** | Result of `composeMiddleware()()` — global middleware that runs on all routes |
| **ExceptionHandler** | Result of `composeException()` — global error handler |

### Example: Mount Everything

```ts
import { defineBootstrap } from 'gaman';
import router from './router';
import AuthMiddleware from './module/middlewares/AuthMiddleware';
import GlobalExceptionHandler from './module/exceptions/GlobalException';

defineBootstrap(async (app) => {
  // Mount global middleware (called as function to set config)
  app.mount(AuthMiddleware());

  // Mount global exception handler
  app.mount(GlobalExceptionHandler);

  // Mount routes
  app.mount(router);

  app.mountServer({ http: 3431 });
});
```

> **Note:** The order of `mount()` for middleware affects execution order based on priority. See [Middleware](./middleware.md) for priority system details.

## `app.mountServer()`

Starts the HTTP server with the given configuration.

### Shorthand (Port Only)

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

### `HttpServerConfig` Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `port` | `number` | `3431` | HTTP server port |
| `host` | `string` | `'localhost'` | Server hostname. Use `'0.0.0.0'` to accept from all interfaces |
| `maxRequestBodySize` | `number` | — | Maximum request body size in bytes |
| `reusePort` | `boolean` | `false` | Enable `SO_REUSEPORT` socket option |
| `development` | `boolean` | `false` | Development mode — shows detailed error stacks |
