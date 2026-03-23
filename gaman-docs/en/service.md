# Service

Services in GamanJS hold your **business logic**. Created with `composeService`, services are independent from the HTTP layer — pure logic.

## Creating a Service

```ts
// src/module/services/AppService.ts
import { composeService } from 'gaman/compose';

export default composeService(() => ({
  WelcomeMessage() {
    return '❤️ Welcome to GamanJS';
  },
}));
```

`composeService` takes a factory function that returns an object containing logic methods.

## Example: User Service

```ts
// src/module/services/UserService.ts
import { composeService } from 'gaman/compose';

interface User {
  id: number;
  name: string;
  email: string;
}

const users: User[] = [
  { id: 1, name: 'Angga', email: 'angga@example.com' },
  { id: 2, name: 'Budi', email: 'budi@example.com' },
];

export default composeService(() => ({
  findAll(): User[] {
    return users;
  },

  findById(id: number): User | undefined {
    return users.find((u) => u.id === id);
  },

  create(data: Omit<User, 'id'>): User {
    const newUser = { ...data, id: users.length + 1 };
    users.push(newUser);
    return newUser;
  },

  delete(id: number): boolean {
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return false;
    users.splice(idx, 1);
    return true;
  },
}));
```

## Service with Dependencies

Services can also receive dependencies from other services:

```ts
// src/module/services/EmailService.ts
import { composeService } from 'gaman/compose';

export default composeService(() => ({
  sendWelcome(email: string) {
    console.log(`Sending welcome email to ${email}`);
  },

  sendResetPassword(email: string, token: string) {
    console.log(`Sending reset password email to ${email}`);
  },
}));
```

```ts
// src/module/services/AuthService.ts
import { composeService } from 'gaman/compose';
import type { RT } from 'gaman/types';
import EmailService from './EmailService';

export default composeService(
  (emailService: RT<typeof EmailService> = EmailService()) => ({
    register(name: string, email: string) {
      // ... register logic
      emailService.sendWelcome(email);
      return { name, email };
    },

    resetPassword(email: string) {
      const token = crypto.randomUUID();
      emailService.sendResetPassword(email, token);
    },
  }),
);
```

## Using in a Controller

```ts
import { composeController } from 'gaman/compose';
import UserService from '../services/UserService';
import type { RT } from 'gaman/types';

export default composeController(
  (userService: RT<typeof UserService> = UserService()) => ({
    GetAll(ctx) {
      return Res.send(userService.findAll());
    },
  }),
);
```

## Tips

- Services do **not** have access to `ctx` — this is intentional so logic stays independent from HTTP
- One service can be used by multiple controllers
- Services can depend on each other
- Separation of concerns: Service = business logic, Controller = HTTP handling
