import * as bcrypt from 'bcrypt';

export function passwordEncryption(password: string) {
  return bcrypt.hash(password, 12);
}
