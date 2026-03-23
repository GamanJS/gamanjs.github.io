# Service

Service di GamanJS adalah tempat untuk **business logic** aplikasi. Service dibuat dengan `composeService` dan tidak bergantung pada HTTP layer — murni logic.

## Membuat Service

```ts
// src/module/services/AppService.ts
import { composeService } from 'gaman/compose';

export default composeService(() => ({
  WelcomeMessage() {
    return '❤️ Welcome to GamanJS';
  },
}));
```

`composeService` menerima factory function yang mengembalikan object berisi method-method logic.

## Contoh: User Service

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

## Service dengan Dependency

Service juga bisa menerima dependency dari service lain:

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

## Menggunakan di Controller

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

- Service **tidak** memiliki akses ke `ctx` — ini disengaja agar logic tidak bergantung pada HTTP
- Satu service bisa dipakai oleh banyak controller
- Service bisa saling bergantung satu sama lain
- Pisahkan concern: Service = business logic, Controller = HTTP handling
