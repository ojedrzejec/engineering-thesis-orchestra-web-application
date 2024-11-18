// validation messages
export const messageValidationPasswordsMatch = "Passwords do not match.";
export const messageValidationFirstLastNameLength = (value: string) => {
  return `${value} must be at least 2 characters long.`;
}
export const messageValidationLettersAndWhitespaces = "Input must contain only letters and whitespaces.";
export const messageValidationPhoneNumber = "Phone number must have prefix as a country code with a plus sign (e.g. +48) and 9 digits.";

// validation functions
export const validatePasswordsMatch = (password: string, passwordRepeated: string) => {
  return password === passwordRepeated;
}

export const validateFirstLastNameLength = (value: string) => {
  return value.length >= 2;
}

export const validateLettersAndWhitespaces = (value: string) => {
  return /^[a-zA-Z\s]+$/.test(value);
}

export const validatePolishLettersAndWhitespaces = (value: string) => {
  return /^[\s\p{L}]+$/u.test(value);
}

export const validatePhoneNumber = (value: string) => {
  return /^(\+)[0-9]{11}$/.test(value);  
}
