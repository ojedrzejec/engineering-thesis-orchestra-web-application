// validation messages

export const messageInputRequired = (value: string) => {
  return `${value} is required.`
}

export const messageValidationInputLength = (value: string) => {
  return `${value} must be at least 2 characters long.`
}

export const messageValidationLink = 'Please enter a valid link.'

// validation functions

export const validateLength = (value: string) => {
  return value.length >= 2
}

export const validateLink = (value: string) => {
  return value && /https:\/\/.*/.test(value)
}
