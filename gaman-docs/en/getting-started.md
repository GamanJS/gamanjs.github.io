# Getting Started

## Requirements

- [Bun](https://bun.sh) `v1.0+`

## Create a New Project

```bash
bun create gaman@latest
```

This will generate a new project with the following structure:

```
my-app/
├── src/
│   ├── index.ts                      # Entry point & bootstrap
│   ├── router.ts                     # Route definitions
│   └── module/
│       ├── controllers/
│       │   └── AppController.ts      # Example controller
│       ├── services/
│       │   └── AppService.ts         # Example service
│       └── middlewares/
│           └── AppMiddleware.ts      # Example middleware
├── package.json
└── tsconfig.json
```

## Manual Installation

If you want to add GamanJS to an existing project:

```bash
bun add gaman @gaman/michi
```

## Running the Server

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

## What's Next

- [Bootstrap](./bootstrap.md) — Configuration and starting the server
- [Router](./router.md) — Defining routes
- [Controller](./controller.md) — Separating handler logic
