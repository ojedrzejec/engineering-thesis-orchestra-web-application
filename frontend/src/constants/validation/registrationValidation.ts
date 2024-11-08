// validation messages
export const messageValidationPasswordsMatch = "Passwords do not match.";
export const messageValidationSmallCapitalLetters = "Input must contain only letters.";

// validation functions
export const validatePasswordsMatch = (password: string, passwordRepeated: string) => {
  return password === passwordRepeated;
}

export const validateSmallCapitalLetters = (input: string) => {
  return /^[a-zA-Z]+$/.test(input);
}
