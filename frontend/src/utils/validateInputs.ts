import { ErrorsInputs } from "../types/errors-inputs";

const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
const cpfRegex = /^([0-9]{3})\.([0-9]{3})\.([0-9]{3})-([0-9]{2})$/;

const validateEmail = (email: string) => {
  return emailRegex.test(email);
};

const validateCpf = (cpf: string) => {
  return cpfRegex.test(cpf);
};

const validatePhone = (phone: string) => {
  return phoneRegex.test(phone);
};

const validateInputs = (
  email: string,
  name: string,
  cpf: string,
  phone: string
): ErrorsInputs => {
  const emailIsValid = validateEmail(email);
  const phoneIsValid = validatePhone(phone);
  const cpfIsFormatted = validateCpf(cpf);

  return {
    name: name.length > 1,
    email: !emailIsValid,
    cpf: !cpfIsFormatted,
    phone: !phoneIsValid,
  };
};

export { validateInputs, validateCpf, validateEmail, validatePhone };
