import { ZodValidationPipe } from './zod-validation.pipe';
import { createUserSchema, updateUserSchema } from '../user/validation.schema';
import { loginSchema } from '../auth/validation.schema';
import { BadRequestException } from '@nestjs/common';

describe('ZodValidationPipe', () => {
  let pipe: ZodValidationPipe;

  beforeEach(() => {
    pipe = new ZodValidationPipe(createUserSchema);
  });

  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      pipe = new ZodValidationPipe(loginSchema);
      const result = pipe.transform(
        { email: 'test@example.com', password: 'password123' },
        { type: 'body' },
      );
      expect(result).toEqual({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should throw BadRequestException for invalid email', () => {
      expect(() =>
        pipe.transform(
          { email: 'invalid-email', password: 'password123' },
          { type: 'body' },
        ),
      ).toThrow(
        new BadRequestException([
          {
            message: 'Invalid email address',
            path: ['email'],
            type: 'invalid_type',
            value: 'invalid-email',
          },
        ]),
      );
    });

    it('should throw BadRequestException for short password', () => {
      expect(() =>
        pipe.transform(
          { email: 'test@example.com', password: 'short' },
          { type: 'body' },
        ),
      ).toThrow(
        new BadRequestException([
          {
            message: 'Password must be at least 6 characters long',
            path: ['password'],
            type: 'too_small',
            value: 'short',
            minimum: 6,
          },
        ]),
      );
    });
  });

  describe('createUserSchema', () => {
    beforeEach(() => {
      pipe = new ZodValidationPipe(createUserSchema);
    });

    it('should validate correct user data', () => {
      const result = pipe.transform(
        {
          email: 'test@example.com',
          password: 'password123',
          name: 'John Doe',
          phone: '(12) 34567-8901',
          cpf: '123.456.789-01',
        },
        { type: 'body' },
      );
      expect(result).toEqual({
        email: 'test@example.com',
        password: 'password123',
        name: 'John Doe',
        phone: '(12) 34567-8901',
        cpf: '123.456.789-01',
      });
    });

    it('should throw BadRequestException for invalid phone format', () => {
      expect(() =>
        pipe.transform(
          {
            email: 'test@example.com',
            password: 'password123',
            name: 'John Doe',
            phone: '1234567890',
            cpf: '123.456.789-01',
          },
          { type: 'body' },
        ),
      ).toThrow(
        new BadRequestException([
          {
            message: 'Invalid phone format',
            path: ['phone'],
            type: 'invalid_string',
            value: '1234567890',
          },
        ]),
      );
    });

    it('should throw BadRequestException for invalid CPF format', () => {
      expect(() =>
        pipe.transform(
          {
            email: 'test@example.com',
            password: 'password123',
            name: 'John Doe',
            phone: '(12) 34567-8901',
            cpf: '12345678901',
          },
          { type: 'body' },
        ),
      ).toThrow(
        new BadRequestException([
          {
            message: 'Invalid cpf format',
            path: ['cpf'],
            type: 'invalid_string',
            value: '12345678901',
          },
        ]),
      );
    });
  });

  describe('updateUserSchema', () => {
    beforeEach(() => {
      pipe = new ZodValidationPipe(updateUserSchema);
    });

    it('should validate correct update user data', () => {
      const result = pipe.transform(
        {
          email: 'test@example.com',
          password: 'password123',
          name: 'John Doe',
          phone: '(12) 34567-8901',
          cpf: '123.456.789-01',
          admin: true,
        },
        { type: 'body' },
      );
      expect(result).toEqual({
        email: 'test@example.com',
        password: 'password123',
        name: 'John Doe',
        phone: '(12) 34567-8901',
        cpf: '123.456.789-01',
        admin: true,
      });
    });

    it('should throw BadRequestException for optional invalid password', () => {
      expect(() =>
        pipe.transform(
          {
            email: 'test@example.com',
            name: 'John Doe',
            phone: '(12) 34567-8901',
            cpf: '123.456.789-01',
          },
          { type: 'body' },
        ),
      ).not.toThrow();
    });

    it('should throw BadRequestException for invalid name length', () => {
      expect(() =>
        pipe.transform(
          {
            email: 'test@example.com',
            password: 'password123',
            name: 'J',
            phone: '(12) 34567-8901',
            cpf: '123.456.789-01',
          },
          { type: 'body' },
        ),
      ).toThrow(
        new BadRequestException([
          {
            message: 'Name must be at least 2 characters long',
            path: ['name'],
            type: 'too_small',
            value: 'J',
            minimum: 2,
          },
        ]),
      );
    });
  });
});
