const removeNonNumeric = (str: string) => str.replace(/[^0-9]/g, "");

const formatCPF = (value: string) => {
  const cpfNumbers = removeNonNumeric(value);
  if (cpfNumbers.length <= 3) {
    return cpfNumbers;
  } else if (cpfNumbers.length <= 6) {
    return `${cpfNumbers.slice(0, 3)}.${cpfNumbers.slice(3, 6)}`;
  } else if (cpfNumbers.length <= 9) {
    return `${cpfNumbers.slice(0, 3)}.${cpfNumbers.slice(
      3,
      6
    )}.${cpfNumbers.slice(6, 9)}`;
  } else {
    return `${cpfNumbers.slice(0, 3)}.${cpfNumbers.slice(
      3,
      6
    )}.${cpfNumbers.slice(6, 9)}-${cpfNumbers.slice(9, 11)}`;
  }
};

const formatPhone = (value: string) => {
  const phoneNumbers = removeNonNumeric(value);
  if (phoneNumbers.length === 0) {
    return "";
  } else if (phoneNumbers.length <= 2) {
    return `(${phoneNumbers}`;
  } else if (phoneNumbers.length <= 6) {
    return `(${phoneNumbers.slice(0, 2)}) ${phoneNumbers.slice(2, 6)}`;
  } else if (phoneNumbers.length <= 10) {
    return `(${phoneNumbers.slice(0, 2)}) ${phoneNumbers.slice(
      2,
      6
    )}-${phoneNumbers.slice(6, 10)}`;
  } else {
    return `(${phoneNumbers.slice(0, 2)}) ${phoneNumbers.slice(
      2,
      7
    )}-${phoneNumbers.slice(7, 11)}`;
  }
};

export { formatCPF, formatPhone };
