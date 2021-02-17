import { log } from 'debug';

import app from './app';

app.listen(3333, () => {
  // console.log('🚀 Server started on port 3333!');
  log('🚀 Server started on port 3333!');
});
