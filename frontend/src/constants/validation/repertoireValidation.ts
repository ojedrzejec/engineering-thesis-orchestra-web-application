// validation messages

export const messageValidationInputLength = (value: string) => {
  return `${value} must be at least 2 characters long.`
}

// validation functions

export const validateInputLength = (value: string) => {
  return value.length >= 2
}
