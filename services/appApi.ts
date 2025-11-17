import type { User } from '../types';

interface StoredUser extends User {
  passwordHash: string;
}

interface SessionRecord {
  token: string;
  userId: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface SignupPayload extends LoginPayload {
  name: string;
}

interface ProfileUpdatePayload {
  name: string;
  email: string;
}

interface PasswordUpdatePayload {
  currentPassword: string;
  newPassword: string;
}

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const STORAGE_KEYS = {
  USERS: 'aimastering:users',
  SESSION: 'aimastering:session',
};

const memoryStorage = (() => {
  const store: Record<string, string> = {};
  return {
    getItem: (key: string) => (key in store ? store[key] : null),
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();

const storage: StorageLike =
  typeof window !== 'undefined' && window.localStorage ? window.localStorage : memoryStorage;

type CryptoLike = { randomUUID?: () => string };

const cryptoLike: CryptoLike | undefined =
  typeof globalThis !== 'undefined' ? (globalThis as any).crypto : undefined;

const DEFAULT_USERS: Array<{ user: User; password: string }> = [
  {
    user: {
      id: 'user-123',
      name: 'Nova Spark',
      email: 'nova@example.com',
      isAdmin: true,
      plan: 'Pro',
      joinedAt: '2024-01-05',
    },
    password: 'demo1234',
  },
  {
    user: {
      id: 'user-002',
      name: 'Jane Smith',
      email: 'jane.s@example.com',
      isAdmin: false,
      plan: 'Free',
      joinedAt: '2024-02-14',
    },
    password: 'password123',
  },
  {
    user: {
      id: 'user-003',
      name: 'Alex Rivera',
      email: 'alex.r@example.com',
      isAdmin: false,
      plan: 'Pro',
      joinedAt: '2024-03-22',
    },
    password: 'supersecure',
  },
];

const wait = (min = 250, max = 650) =>
  new Promise((resolve) => setTimeout(resolve, Math.random() * (max - min) + min));

const hashPassword = (password: string) => btoa(`aimastering::${password}::pepper`);

const getUsers = (): StoredUser[] => {
  const raw = storage.getItem(STORAGE_KEYS.USERS);
  if (!raw) {
    seedUsers();
    return getUsers();
  }
  try {
    const parsed = JSON.parse(raw) as StoredUser[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to parse users from storage:', error);
    return [];
  }
};

const seedUsers = () => {
  const seeded: StoredUser[] = DEFAULT_USERS.map(({ user, password }) => ({
    ...user,
    passwordHash: hashPassword(password),
  }));
  storage.setItem(STORAGE_KEYS.USERS, JSON.stringify(seeded));
};

const persistUsers = (users: StoredUser[]) => {
  storage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

const toPublicUser = (user: StoredUser): User => {
  const { passwordHash, ...publicUser } = user;
  return publicUser;
};

const findUserByEmail = (email: string, users = getUsers()) =>
  users.find((u) => u.email.toLowerCase() === email.toLowerCase());

const ensureSessionRecord = (): SessionRecord | null => {
  const raw = storage.getItem(STORAGE_KEYS.SESSION);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as SessionRecord;
  } catch (error) {
    console.error('Failed to parse session record:', error);
    storage.removeItem(STORAGE_KEYS.SESSION);
    return null;
  }
};

const setSession = (record: SessionRecord | null) => {
  if (!record) {
    storage.removeItem(STORAGE_KEYS.SESSION);
    return;
  }
  storage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(record));
};

const randomUUID = () =>
  cryptoLike?.randomUUID?.() ?? `id-${Math.random().toString(36).slice(2)}-${Date.now()}`;

const generateToken = () => `token-${randomUUID()}`;

const generateUserId = () => randomUUID();

const comparePassword = (hash: string, password: string) => hash === hashPassword(password);

class AppApi {
  async getSession(): Promise<AuthResponse | null> {
    await wait();
    const record = ensureSessionRecord();
    if (!record) {
      return null;
    }
    const user = getUsers().find((u) => u.id === record.userId);
    if (!user) {
      setSession(null);
      return null;
    }
    return { token: record.token, user: toPublicUser(user) };
  }

  async signup(payload: SignupPayload): Promise<AuthResponse> {
    await wait();
    const users = getUsers();
    if (findUserByEmail(payload.email, users)) {
      throw new Error('An account with this email already exists.');
    }
    if (!payload.name.trim()) {
      throw new Error('Name is required.');
    }
    if (!payload.email.trim()) {
      throw new Error('Email is required.');
    }
    if (payload.password.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
    }

    const newUser: StoredUser = {
      id: generateUserId(),
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      isAdmin: false,
      plan: 'Free',
      joinedAt: new Date().toISOString().split('T')[0],
      passwordHash: hashPassword(payload.password),
    };

    users.push(newUser);
    persistUsers(users);

    const token = generateToken();
    setSession({ token, userId: newUser.id });

    return { token, user: toPublicUser(newUser) };
  }

  async login(payload: LoginPayload): Promise<AuthResponse> {
    await wait();
    const user = findUserByEmail(payload.email);
    if (!user || !comparePassword(user.passwordHash, payload.password)) {
      throw new Error('Invalid email or password.');
    }
    const token = generateToken();
    setSession({ token, userId: user.id });
    return { token, user: toPublicUser(user) };
  }

  async logout(): Promise<void> {
    await wait();
    setSession(null);
  }

  async updateProfile(userId: string, updates: ProfileUpdatePayload): Promise<User> {
    await wait();
    if (!updates.name.trim()) {
      throw new Error('Name cannot be empty.');
    }
    if (!updates.email.trim()) {
      throw new Error('Email is required.');
    }
    const users = getUsers();
    if (
      users.some(
        (u) => u.id !== userId && u.email.toLowerCase() === updates.email.trim().toLowerCase(),
      )
    ) {
      throw new Error('Another account already uses this email.');
    }
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) {
      throw new Error('User not found.');
    }
    users[index] = {
      ...users[index],
      name: updates.name.trim(),
      email: updates.email.trim().toLowerCase(),
    };
    persistUsers(users);
    return toPublicUser(users[index]);
  }

  async updatePassword(userId: string, payload: PasswordUpdatePayload): Promise<void> {
    await wait();
    if (!payload.currentPassword) {
      throw new Error('Please enter your current password.');
    }
    if (payload.newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters long.');
    }
    const users = getUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) {
      throw new Error('User not found.');
    }
    const user = users[index];
    if (!comparePassword(user.passwordHash, payload.currentPassword)) {
      throw new Error('Current password is incorrect.');
    }
    users[index] = {
      ...user,
      passwordHash: hashPassword(payload.newPassword),
    };
    persistUsers(users);
  }

  async listUsers(): Promise<User[]> {
    await wait();
    return [...getUsers()]
      .sort((a, b) => b.joinedAt.localeCompare(a.joinedAt))
      .map(toPublicUser);
  }
}

export const appApi = new AppApi();

export type { AuthResponse, LoginPayload, SignupPayload, ProfileUpdatePayload };
