// Server-side event forwarder for TikTok's Events API (Conversions API).
//
// This exists alongside the browser-side TikTok Pixel already in
// index.html — it does not replace it. The two are meant to report the
// same events with the same event_id so TikTok's dedup logic treats them
// as one conversion, not two. See the README for why this was added:
// browser-only tracking was overcounting relative to actual WhatsApp
// group membership, and server-side reporting is one part of tightening
// that gap (not a full fix — see the README for what it does and does
// not solve).
//
// SECURITY: TIKTOK_ACCESS_TOKEN must be set as a Vercel Environment
// Variable, never hardcoded here and never committed to this repo. This
// repo is public — a token committed to it would be scraped within
// minutes. If you are reading this file and the token is not in
// process.env, the endpoint fails closed (returns 500) rather than
// silently doing nothing, so a misconfiguration is visible in Vercel's
// function logs instead of hiding as a quiet tracking gap.

const TIKTOK_PIXEL_CODE = 'DA2VFEBC77UAAA42UMQ0'; // same pixel already live in index.html — intentionally not an env var, it is not a secret
const TIKTOK_EVENTS_API_URL = 'https://business-api.tiktok.com/open_api/v1.3/event/track/';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
  if (!accessToken) {
    console.error('TIKTOK_ACCESS_TOKEN is not set in Vercel Environment Variables.');
    res.status(500).json({ error: 'Server tracking is not configured yet.' });
    return;
  }

  const { event, event_id, url } = req.body || {};

  if (!event || !event_id) {
    res.status(400).json({ error: 'Missing required fields: event, event_id' });
    return;
  }

  // Best-effort client context for TikTok's match-quality scoring.
  // Neither field is required for the event to be accepted, so a
  // missing header (e.g. behind certain proxies) degrades match
  // quality rather than breaking the request.
  const forwardedFor = req.headers['x-forwarded-for'];
  const clientIp = forwardedFor
    ? forwardedFor.split(',')[0].trim()
    : req.socket && req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'] || '';

  const payload = {
    event_source: 'web',
    event_source_id: TIKTOK_PIXEL_CODE,
    data: [
      {
        event,
        event_time: Math.floor(Date.now() / 1000),
        event_id, // must match the event_id sent to the browser pixel for TikTok to deduplicate the two
        user: {
          ip: clientIp || undefined,
          user_agent: userAgent || undefined,
        },
        page: {
          url: url || undefined,
        },
      },
    ],
  };

  try {
    const ttResponse = await fetch(TIKTOK_EVENTS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': accessToken,
      },
      body: JSON.stringify(payload),
    });

    const ttResult = await ttResponse.json();

    if (!ttResponse.ok || ttResult.code !== 0) {
      // Logged server-side for diagnosis; deliberately not surfaced to
      // the visitor's browser console — a tracking failure should never
      // look like a site error to a real visitor.
      console.error('TikTok Events API rejected the event:', ttResult);
      res.status(502).json({ error: 'TikTok API rejected the event' });
      return;
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Server-side tracking request failed:', err);
    res.status(500).json({ error: 'Internal error forwarding event' });
  }
}
