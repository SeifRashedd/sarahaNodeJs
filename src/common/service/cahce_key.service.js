export const userKeyBase = ({ userId, jti }) => {
  return `user::${userId}`
}



export const userRevokeKey = ({ userId, jti }) => {
  return `${userKeyBase({ userId })}::revoke::${jti}`
}



export const userSubjectedOtpKey = ({ userId, subject }) => {
  return `${userKeyBase({ userId })}::${subject}`
}


export const userTrialsOtpKey = ({ userId, subject }) => {
  return `${userSubjectedOtpKey({ userId, subject })}::trials`
}


export const userBlockOtpKey = ({ userId, subject }) => {
  return `${userSubjectedOtpKey({ userId, subject })}::block`
}


export const userWrongOtpTrialsKey = ({ userId, subject }) => {
  return `${userSubjectedOtpKey({ userId, subject })}::wrong_trials`
}


export const userWrongOtpBlockKey = ({ userId, subject }) => {
  return `${userSubjectedOtpKey({ userId, subject })}::wrong_block`
}


// otp was verified -> the user is allowed to do the next step (e.g. reset password)
export const userVerifiedOtpKey = ({ userId, subject }) => {
  return `${userSubjectedOtpKey({ userId, subject })}::verified`
}
