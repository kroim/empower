import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';

// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

//var redirectToHTTPS = require('express-http-to-https').redirectToHTTPS;
import * as express from 'express';
import { join } from 'path';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();

const PORT = process.env.PORT || 80;
const DIST_FOLDER = join(process.cwd(), 'dist');

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./server/main');

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP),
    // In case you want to use an AppShell with SSR and Lazy loading
    // you'd need to uncomment the below. (see: https://github.com/angular/angular-cli/issues/9202)
    // {
    //   provide: NgModuleFactoryLoader,
    //   useClass: ModuleMapNgFactoryLoader,
    //   deps: [
    //     Compiler,
    //     MODULE_MAP
    //   ],
    // },
  ]
}));

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

// Example Express Rest API endpoints
// app.get('/api/**', (req, res) => { });

app.use((req, res, next) => {
  // for domain/index.html
  if (req.url === '/index.html') {
    res.redirect(301, 'https://' + req.hostname);
  }

  // check if it is a secure (https) request
  // if not redirect to the equivalent https url
  if (
    req.headers['x-forwarded-proto'] !== 'https' &&
    req.hostname !== 'localhost'
  ) {
    // special for robots.txt
    if (req.url === '/robots.txt') {
      next();
      return;
    }
    res.redirect(301, 'https://' + req.hostname + req.url);
  }

  // www or not
  if (req.hostname.startsWith('www.')) {
    const host = req.hostname.slice(4, req.hostname.length);
    res.redirect(301, 'https://' + host + req.url);
  }

  next();
});


// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser'), {
  maxAge: '1y'
}));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render('index', { req });
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});
