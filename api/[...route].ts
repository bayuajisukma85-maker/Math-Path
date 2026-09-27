import { app } from '../server';

export default function handler(req: any, res: any) {
  if (req.query && req.query.route) {
    const routePath = Array.isArray(req.query.route)
      ? req.query.route.join('/')
      : req.query.route;
    const search = req.url && req.url.includes('?') ? '?' + req.url.split('?').slice(1).join('?') : '';
    req.url = `/api/${routePath}${search}`;
  } else if (req.url && !req.url.startsWith('/api')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }

  return app(req, res);
}

