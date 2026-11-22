export const userKeyBase = ({ userId, jti }) => {
  return `user::${userId}`
}



export const userRevokeKey = ({ userId, jti }) => {
  return `${userKeyBase({ userId })}::revoke::${jti}`
}