# GamanJS

> _A Lean Framework for Heavy-Duty Enterprise Performance._

GamanJS is a lightweight, fast HTTP framework built on top of [Bun](https://bun.sh) runtime. Designed for building structured REST APIs with a clean **Controller-Service-Middleware** architecture that's easy to maintain.

## ✨ Key Features

- ⚡ **Blazing Fast** — Built on Bun's native `Bun.serve()` for maximum performance
- 🏗️ **Structured Architecture** — Built-in Controller / Service / Middleware pattern
- 📦 **Standardized Response** — Consistent API response format via global `Res`
- 🔀 **Declarative Router** — Clean route definition with `composeRouter`
- 🧩 **Simple Dependency Injection** — DI via default parameters in controllers
- 🛡️ **Exception Handling** — Global & per-route exception handlers
- 🎯 **Middleware Priority** — Control middleware execution order

## 📚 Table of Contents

| Page | Description |
|------|-------------|
| [Getting Started](./getting-started.md) | Installation & creating a new project |
| [Bootstrap](./bootstrap.md) | `defineBootstrap` & server configuration |
| [Router](./router.md) | Route definition, grouping, & methods |
| [Controller](./controller.md) | Creating controllers with `composeController` |
| [Service](./service.md) | Business logic with `composeService` |
| [Middleware](./middleware.md) | Middleware & priority system |
| [Response](./response.md) | Standardized API response with `Res` |
| [Context](./context.md) | Request context (`ctx`) in detail |
| [Exception Handler](./exception.md) | Global & per-route error handling |

## 🚀 Quick Start

```bash
bun create gaman@latest
```

```
src/
├── index.ts              # Application bootstrap
├── router.ts             # All route definitions
└── module/
    ├── controllers/
    │   └── AppController.ts
    ├── services/
    │   └── AppService.ts
    └── middlewares/
        └── AppMiddleware.ts
```

### `src/index.ts`

```ts
import { defineBootstrap } from 'gaman';
import router from './router';

defineBootstrap(async (app) => {
  app.mount(router);
  app.mountServer({ http: 3431 });
});
```

### `src/router.ts`

```ts
import { composeRouter } from 'gaman/compose';
import AppController from './module/controllers/AppController';

export default composeRouter((r) => {
  r.get('/', [AppController, 'HelloWorld']);
});
```

### `src/module/controllers/AppController.ts`

```ts
import { composeController } from 'gaman/compose';
import AppService from '../services/AppService';
import type { RT } from 'gaman/types';

export default composeController(
  (appService: RT<typeof AppService> = AppService()) => ({
    HelloWorld(ctx) {
      return Res.message(appService.WelcomeMessage());
    },
  }),
);
```

### `src/module/services/AppService.ts`

```ts
import { composeService } from 'gaman/compose';

export default composeService(() => ({
  WelcomeMessage() {
    return '❤️ Welcome to GamanJS';
  },
}));
```

### `src/module/middlewares/AppMiddleware.ts`

```ts
import { composeMiddleware } from 'gaman/compose';

export default composeMiddleware(async (ctx, next) => {
  return next();
});
```

Run the server:

```bash
bun run dev
```

Server will start at `http://localhost:3431`. Access the `/` endpoint and you'll get a standardized response:

```json
{
  "success": true,
  "message": "❤️ Welcome to GamanJS",
  "metadata": {
    "requestId": "abc123...",
    "timestamp": "2026-03-23T07:00:00.000Z"
  }
}
```

## 📄 License

MIT © [Angga7Togk](https://github.com/angga7togk)
