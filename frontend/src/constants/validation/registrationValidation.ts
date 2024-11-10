// validation messages
export const messageValidationPasswordsMatch = "Passwords do not match.";
export const messageValidationFirstLastNameLength = (value: string) => {
  return `${value} must be at least 2 characters long.`;
}
export const messageValidationSmallCapitalLetters = "Input must contain only letters.";
export const messageValidationPhoneNumber = "Phone number must have prefix as a country code with a plus sign (e.g. +48) and 9 digits.";

// validation functions
export const validatePasswordsMatch = (password: string, passwordRepeated: string) => {
  return password === passwordRepeated;
}

export const validateFirstLastNameLength = (value: string) => {
  return value.length >= 2;
}

export const validateSmallCapitalLetters = (value: string) => {
  return /^[a-zA-Z]+$/.test(value);
}

export const validatePhoneNumber = (value: string) => {
  return /^(\+)[0-9]{11}$/.test(value);  
}
