// validation messages
export const messageValidationPasswordsMatch = "Passwords do not match.";
export const messageValidationFirstLastNameLength = (input: string) => {
  return `${input} must be at least 2 characters long.`;
}
export const messageValidationSmallCapitalLetters = "Input must contain only letters.";

// validation functions
export const validatePasswordsMatch = (password: string, passwordRepeated: string) => {
  return password === passwordRepeated;
}

export const validateFirstLastNameLength = (input: string) => {
  return input.length >= 2;
}

export const validateSmallCapitalLetters = (input: string) => {
  return /^[a-zA-Z]+$/.test(input);
}
