export interface loginCredentials{
    email: string,
    password: string
}
export interface resetPasswordPayload{
    token: string,
    newPassword: string,
}
export interface resetPasswordResponse{
    message: string
}