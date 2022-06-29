import Cors from 'cors';
import helmet from 'helmet';
import middleware from '../../controllers/middleware';
import ValidInput from '../../controllers/input';

const CORS_ORIGIN = process?.env?.CORS_ORIGIN || 'http://localhost:3000';
const ENV = process?.env?.ENV || 'dev';

const cors = Cors({
  methods: ['HEAD', 'POST'],
  origin: [CORS_ORIGIN],
});

function simulateLatency(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

const helperText = {
  genericError:
    'There was a problem handling the request.  Please try again later.',
  firstName: 'Invalid name - use only letters',
  lastName: 'Invalid name - use only letters',
  email: 'Invalid email address',
  phoneNumber: 'Invalid phone number',
};

export default async function submit(req, res) {
  if (req.method !== 'POST') return;

  await middleware(req, res, cors);
  await middleware(req, res, helmet());

  // In dev environment, simulate latency so we can test spinners
  if (ENV === 'dev') await simulateLatency(600);

  for (const [key, value] of Object.entries(req.body)) {
    try {
      if (!ValidInput.compare(key, value)) {
        console.warn(`POST (/api/submit) - Invalid ${key} '${value}'`);
        const resBody = {};
        if (['firstName', 'lastName', 'email', 'phoneNumber'].includes(key)) {
          resBody[key] = helperText[key];
        } else {
          resBody.genericError = helperText.genericError;
        }
        res.status(400).json({
          helperText: { ...resBody },
        });
        return;
      }
    } catch (error) {
      res.status(500).json({
        helperText: { genericError: helperText.genericError },
      });
    }
  }
  console.info(`POST (/api/submit) - ${JSON.stringify(req.body)}`);
  res.status(200).json({ message: 'You are now subscribed!' });
}
