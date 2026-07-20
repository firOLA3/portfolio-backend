const dns = require('dns');
dns.resolveSrv('_mongodb._tcp.cluster0.orjid83.mongodb.net', (err, addresses) => {
  if (err) {
    console.error('SRV Error:', err);
    return;
  }
  console.log('SRV Records:', addresses);
});
