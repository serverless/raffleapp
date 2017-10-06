module.exports.getHeaders = () => {
  let headers = {
    'Content-Type': 'application/json'
  };
  const accessToken = localStorage.getItem('access_token');
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  };

  return headers;
}
