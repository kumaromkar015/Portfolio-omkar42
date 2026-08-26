import { v2 as cloudinary } from 'cloudinary';
import { getEnv } from './env.js';

/** Returns a configured Cloudinary instance. Lazy-initializes on first call. */
let _configured = false;

function ensureConfigured() {
  if (_configured) return;
  const env = getEnv();
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });
  _configured = true;
}

/** Proxy that auto-configures before use */
export default new Proxy(cloudinary, {
  get(target, prop, receiver) {
    ensureConfigured();
    return Reflect.get(target, prop, receiver);
  },
});
