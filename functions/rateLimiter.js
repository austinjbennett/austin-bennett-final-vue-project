const admin = require('firebase-admin');
const functions = require('firebase-functions');

const RATE_LIMITS = {
  auth: { max: 10, window: 60000 }, // 10 auth attempts per minute
  firestore: { max: 1000, window: 60000 }, // 1000 operations per minute
};

async function checkRateLimit(userId, operation) {
  const limit = RATE_LIMITS[operation];
  if (!limit) return true;

  const now = Date.now();
  const windowStart = now - limit.window;

  const ref = admin.firestore()
    .collection('rate_limits')
    .doc(userId)
    .collection(operation)
    .where('timestamp', '>', windowStart);

  const snapshot = await ref.get();

  if (snapshot.size >= limit.max) {
    throw new functions.https.HttpsError(
      'resource-exhausted',
      `Rate limit exceeded for ${operation}`,
    );
  }

  // Log this request
  await admin.firestore()
    .collection('rate_limits')
    .doc(userId)
    .collection(operation)
    .add({ timestamp: now });

  return true;
}

module.exports = { checkRateLimit };
