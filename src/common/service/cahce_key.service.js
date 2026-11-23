export const userKeyBase = ({ userId, jti }) => {
  return `user::${userId}`
}



export const userRevokeKey = ({ userId, jti }) => {
  return `${userKeyBase({ userId })}::revoke::${jti}`
}



export const userOtpKey = ({ userId }) => {
  return `${userKeyBase({ userId })}::otp`
}
