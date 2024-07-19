export default class FormatTransformer {
  static unformatCpf(cpf: string): string {
    return cpf.replace(/\D/g, '');
  }

  static formatCpf(cpf: string): string {
    const match = cpf.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);

    if (!match) {
      throw new Error('Invalid CPF');
    }

    const formatedCpf = `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;

    return formatedCpf;
  }

  static unformatPhone(phone: string): string {
    return phone.replace(/\D/g, '');
  }

  static formatPhone(phone: string): string {
    const match = phone.match(/^(\d{2})(\d{4,5})(\d{4})$/);

    if (!match) {
      throw new Error('Invalid Phone');
    }

    const formatedPhone = `(${match[1]}) ${match[2]}-${match[3]}`;

    return formatedPhone;
  }
}
