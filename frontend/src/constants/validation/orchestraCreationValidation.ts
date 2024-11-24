// validation messages
export const messageValidationInput = (value: string) => {
    return `Invalid ${value}.`
}
export const messageInputRequired = (value: string) => {
    return `${value} is required.`
}
export const messageValidationInputLength = (value: string) => {
    return `${value} must be at least 2 characters long.`
}
export const messageValidationWhitespaces = (value: string) => {
    return `${value} cannot contain whitespaces.`
}
export const messageValidationEmail = "Please enter a valid email address."
export const messageValidationLink = "Please enter a valid link."

// validation functions
export const validateNameLength = (value: string) => {
    return value.length >= 2
}

export const validateWhitespaces = (value: string) => {
    return value && !/\s/.test(value)
}

export const validateEmail = (value: string) => {
    return value && /.+@.+\..+/.test(value)
}

export const validateFacebookLink = (value: string) => {
    return value && /https:\/\/www.facebook.com\/.*/.test(value)
}

export const validateInstagramLink = (value: string) => {
    return value && /https:\/\/www.instagram.com\/.*/.test(value)
}

export const validateYouTubeLink = (value: string) => {
    return value && /https:\/\/www.youtube.com\/.*/.test(value)
}
