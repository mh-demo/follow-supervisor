import Cors from 'cors';
import helmet from 'helmet';
import middleware from '../../controllers/middleware';

const CORS_ORIGIN = process?.env?.CORS_ORIGIN || 'http://localhost:3000';
const MANAGERS_API_URL =
  process?.env?.MANAGERS_API_URL ||
  'https://o3m5qixdng.execute-api.us-east-1.amazonaws.com/api/managers';
const MANAGERS_API_CACHE_MAX_AGE =
  process?.env?.MANAGERS_API_CACHE_MAX_AGE || 600;

const cors = Cors({
  methods: ['HEAD', 'GET'],
  origin: [CORS_ORIGIN],
});

let managersApiCache = [];

export default async function supervisors(req, res) {
  if (req.method !== 'GET') return;
  await middleware(req, res, cors);
  await middleware(req, res, helmet());

  try {
    if (managersApiCache.length > 0) {
      console.info('GET (/api/supervisors) - served from cache');
      res.status(200).json(managersApiCache);
      return;
    }
    const response = await fetch(`${MANAGERS_API_URL}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status !== 200) {
      throw new Error(
        `There was a problem retrieving the supervisor list (http status: ${response.status})`
      );
    }
    const data = await response.json();

    managersApiCache = data
      .filter((sup) => Number.isNaN(parseInt(sup.jurisdiction, 10)))
      .sort(
        (a, b) =>
          a.jurisdiction.localeCompare(b.jurisdiction) ||
          a.lastName.localeCompare(b.lastName) ||
          a.firstName.localeCompare(b.firstName)
      );
    setTimeout(() => {
      console.info('CACHE expired (/api/supervisors)');
      managersApiCache = [];
    }, MANAGERS_API_CACHE_MAX_AGE * 1000);

    console.info(`GET (${MANAGERS_API_URL})`);
    res.status(200).json(managersApiCache);
  } catch (error) {
    console.error(error);
  }
}
