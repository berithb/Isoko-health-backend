import { createApp } from './app';
import { env } from './config';

const app = createApp();

app.listen(env.port, () => {
  console.log(`IsokoHealth API running on port ${env.port}`);
});

