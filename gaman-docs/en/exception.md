# Exception Handler

GamanJS provides `composeException` for handling errors that occur during request processing. Exception handlers can be registered **globally** (all routes) or **per-route**.

## Creating an Exception Handler

```ts
// src/module/exceptions/GlobalException.ts
import { composeException } from 'gaman/compose';

export default composeException((error, ctx) => {
  console.error(`[Error] ${ctx.path}:`, error.message);

  return Res.send({
    error: error.message,
    path: ctx.path,
  }).internalServerError();
});
```

`composeException` takes a callback `(error, ctx) => Responder` and returns an `ExceptionHandler`.

## Global Exception Handler

Register in `defineBootstrap` via `app.mount()`:

```ts
import { defineBootstrap } from 'gaman';
import router from './router';
import GlobalException from './module/exceptions/GlobalException';

defineBootstrap(async (app) => {
  // Register global exception handler
  app.mount(GlobalException);

  app.mount(router);
  app.mountServer({ http: 3431 });
});
```

The global exception handler catches **all errors** not handled by per-route exception handlers.

## Per-Route Exception Handler

Override error handling for specific routes:

```ts
import { composeRouter } from 'gaman/compose';
import { composeException } from 'gaman/compose';
import PaymentController from './module/controllers/PaymentController';

const PaymentErrorHandler = composeException((error, ctx) => {
  // Log to external service
  console.error('[Payment Error]', error);

  return Res.send({
    error: 'Payment processing failed',
    reference: ctx.request.id,
  }).internalServerError();
});

export default composeRouter((r) => {
  r.post('/payment/process', [PaymentController, 'Process'])
    .exception(PaymentErrorHandler);
});
```

## Inline Exception Handler

Can also be used inline without `composeException`:

```ts
r.post('/payment', [PaymentController, 'Process'])
  .exception((error, ctx) => {
    return Res.message('Payment failed').internalServerError();
  });
```

GamanJS will automatically wrap it with `composeException` internally.

## Group Exception Handler

Applied to all routes in the group:

```ts
r.group('/payment', (payment) => {
  payment.post('/process', [PaymentController, 'Process']);
  payment.post('/refund', [PaymentController, 'Refund']);
}).exception(PaymentErrorHandler);
```

## Exception Handler Priority

```
Error occurs in handler
    ↓
Is there a per-route exception handler?
    → Yes: Use per-route handler
    → No: Is there a global exception handler?
        → Yes: Use global handler
        → No: Return default 500 response
```

## Error in Exception Handler

If the exception handler itself throws an error ("fatal error"), GamanJS returns:

```
HTTP 500: "Fatal Server Error"
```

## Example: Structured Error Handling

```ts
// src/module/exceptions/GlobalException.ts
import { composeException } from 'gaman/compose';

class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public errors?: Record<string, string[]>,
  ) {
    super(message);
  }
}

export default composeException((error, ctx) => {
  if (error instanceof AppError) {
    if (error.errors) {
      return Res.error(error.errors, {
        status: error.statusCode,
        message: error.message,
      });
    }
    return Res.message(error.message, error.statusCode);
  }

  // Unknown error
  console.error('[Unhandled]', error);
  return Res.message('Internal Server Error').internalServerError();
});
```

Usage in controller:

```ts
async Create(ctx) {
  const body = await ctx.json();

  if (!body.email) {
    throw new AppError('Validation failed', 422, {
      email: ['Email is required'],
    });
  }

  // ... logic
}
```
