
let callbackUrl = 'http://localhost:3000/callback'
if (process.env.NODE_ENV === 'production') {
  // in netlify context. See http://bit.ly/2y86cil
  callbackUrl = 'https://raffle.serverless.com/callback'
}

export const AUTH_CONFIG = {
  domain: 'serverlessinc.auth0.com',
  clientId: '37p4vtkwmDGQwwG1FYhwOGiu3OjZoHo5',
  callbackUrl: callbackUrl
}
