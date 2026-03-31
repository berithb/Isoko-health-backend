import os from 'os';
import { createApp } from './app';
import { env } from './config';

const app = createApp();

const getLanAddresses = () =>
  Object.values(os.networkInterfaces())
    .flat()
    .filter((details): details is NonNullable<typeof details> =>
      Boolean(details && details.family === 'IPv4' && !details.internal),
    )
    .map((details) => details.address);

app.listen(env.port, env.host, () => {
  console.log(`IsokoHealth API running on http://${env.host}:${env.port}`);
  console.log(`Swagger docs running at http://localhost:${env.port}/api-docs`);

  for (const address of getLanAddresses()) {
    console.log(`LAN API URL: http://${address}:${env.port}/api/v1/data`);
    console.log(`LAN Swagger URL: http://${address}:${env.port}/api-docs`);
  }
});

