
let callbackUrl = 'http://localhost:3000/callback'
if(process.env && process.env.REPOSITORY_URL) {
  // in netlify context. See http://bit.ly/2y86cil
  callbackUrl = 'https://serverless-raffle.netlify.com/callback'
}

export const AUTH_CONFIG = {
  domain: 'serverlessinc.auth0.com',
  clientId: '37p4vtkwmDGQwwG1FYhwOGiu3OjZoHo5',
  callbackUrl: callbackUrl
}
