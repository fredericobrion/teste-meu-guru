import FormatTransformer from './format-transformer';

describe('FormatTransformer', () => {
  describe('unformatCpf', () => {
    it('should remove non-numeric characters from CPF', () => {
      expect(FormatTransformer.unformatCpf('123.456.789-00')).toBe(
        '12345678900',
      );
      expect(FormatTransformer.unformatCpf('12345678900')).toBe('12345678900');
    });
  });

  describe('formatCpf', () => {
    it('should format a valid CPF', () => {
      expect(FormatTransformer.formatCpf('12345678900')).toBe('123.456.789-00');
    });

    it('should throw an error for an invalid CPF', () => {
      expect(() => FormatTransformer.formatCpf('12345678')).toThrow(
        'Invalid CPF',
      );
      expect(() => FormatTransformer.formatCpf('123456789012')).toThrow(
        'Invalid CPF',
      );
    });
  });

  describe('unformatPhone', () => {
    it('should remove non-numeric characters from phone', () => {
      expect(FormatTransformer.unformatPhone('(12) 3456-7890')).toBe(
        '1234567890',
      );
      expect(FormatTransformer.unformatPhone('1234567890')).toBe('1234567890');
    });
  });

  describe('formatPhone', () => {
    it('should format a valid phone number', () => {
      expect(FormatTransformer.formatPhone('1234567890')).toBe(
        '(12) 3456-7890',
      );
      expect(FormatTransformer.formatPhone('11987654321')).toBe(
        '(11) 98765-4321',
      );
    });

    it('should throw an error for an invalid phone number', () => {
      expect(() => FormatTransformer.formatPhone('12345')).toThrow(
        'Invalid Phone',
      );
      expect(() => FormatTransformer.formatPhone('12345678901234')).toThrow(
        'Invalid Phone',
      );
    });
  });
});
