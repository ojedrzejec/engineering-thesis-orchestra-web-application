// validation messages

// export const messageInputRequired = 'Input is required.'

// export const messageValidationPolishLettersAndWhitespaces =
//   'Input must contain only Polish letters and whitespaces.'

export const messageValidationNewGroupNameLength = (value: string) => {
  return `${value} must be at least 2 characters long.`
}

// validation functions

export const validateNewGroupNameLength = (value: string) => {
  return value.length >= 2
}

// export const validatePolishLettersAndWhitespaces = (value: string) => {
//   return /^[\s\p{L}]+$/u.test(value)
// }
