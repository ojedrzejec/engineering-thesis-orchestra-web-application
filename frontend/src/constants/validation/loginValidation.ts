// validation messages

export const messageValidationInput = "Invalid input.";
export const messageInputRequired = "Input is required.";
export const messageValidationPasswordLength = "Password must be at least 8 characters long.";
export const messageValidationSpecialCharacter = "Password must be at least 1 special character.";
export const messageValidationDigitNumber = "Password must be at least 1 digit number.";
export const messageValidationCapitalLetter = "Input must contain at least 1 capital letter.";
export const messageValidationSmallLetter = "Input must contain at least 1 small letter.";
export const messageValidationEmail = "Please enter a valid email address.";
export const messageValidationNoWhitespaces = "Input must not contain whitespaces.";

// validation functions

// export const requireInput = (input: string) => {
//   return input.length > 0;
// }

export const validatePasswordLength = (input: string) => {
  return input.length >= 8;
}

export const validateSpecialCharacter = (input: string) => {
  return /[!@#$%^&*(),.?":{}|<>]/.test(input);
}

export const validateDigitNumber = (input: string) => {
  return /[0-9]/.test(input);
}

export const validateCapitalLetter = (input: string) => {
  return /[A-Z]/.test(input);
}

export const validateSmallLetter = (input: string) => {
  return /[a-z]/.test(input);
}

export const validateNoWhitespaces = (input: string) => {
  return !/\s/.test(input);
}

export const validateEmail = (input: string) => {
  return input && /.+@.+\..+/.test(input);
}
