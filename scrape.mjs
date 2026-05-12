import http from 'https';
http.get('https://www.toyota-dreamcarart.com/district/', (resp) => {
  let data = '';
  resp.on('data', (chunk) => {
    data += chunk;
  });
  resp.on('end', () => {
    console.log(data);
  });
});
