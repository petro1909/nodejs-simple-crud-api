import { User } from '../types/user';

export function validateUser(item: unknown): item is User {
  const user = item as User;
  if (user.age === undefined || typeof user.age !== 'number') return false;
  if (user.username === undefined || typeof user.username !== 'string') return false;
  if (user.hobbies === undefined || !Array.isArray(user.hobbies)) return false;
  if (user.hobbies.length !== 0 && user.hobbies.filter((item) => typeof item !== 'string').length !== 0) return false;
  return true;
}
