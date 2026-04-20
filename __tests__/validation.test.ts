import { signupSchema } from '../src/utils/validation';

const valid = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  password: 'Passw0rd!',
  acceptTos: true,
};

describe('signupSchema', () => {
  it('accepts a well-formed payload', () => {
    expect(signupSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects names shorter than 2 characters', () => {
    const result = signupSchema.safeParse({ ...valid, name: 'J' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === 'name')).toBe(true);
    }
  });

  it('trims whitespace from name before validating', () => {
    const result = signupSchema.safeParse({ ...valid, name: '   Jane   ' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.name).toBe('Jane');
  });

  it('rejects malformed emails', () => {
    const result = signupSchema.safeParse({ ...valid, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('lowercases emails', () => {
    const result = signupSchema.safeParse({ ...valid, email: 'Jane@Example.COM' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.email).toBe('jane@example.com');
  });

  it('requires passwords of at least 8 characters', () => {
    const result = signupSchema.safeParse({ ...valid, password: 'Ab1' });
    expect(result.success).toBe(false);
  });

  it('requires passwords to contain a letter and a digit', () => {
    const noLetter = signupSchema.safeParse({ ...valid, password: '12345678' });
    const noDigit = signupSchema.safeParse({ ...valid, password: 'abcdefgh' });
    expect(noLetter.success).toBe(false);
    expect(noDigit.success).toBe(false);
  });

  it('requires acceptTos to be true', () => {
    const result = signupSchema.safeParse({ ...valid, acceptTos: false });
    expect(result.success).toBe(false);
  });
});
