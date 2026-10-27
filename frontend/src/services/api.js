/**
 * API Service for PulseAI Platform
 * Communicates with Starlette / Uvicorn ASGI Backend
 */

const BASE_URL = '';

export async function fetchOverview() {
  const res = await fetch(`${BASE_URL}/api/overview`);
  if (!res.ok) throw new Error('Failed to fetch dataset overview');
  return res.json();
}

export async function fetchModels() {
  const res = await fetch(`${BASE_URL}/api/models`);
  if (!res.ok) throw new Error('Failed to fetch model benchmarks');
  return res.json();
}

export async function predictWellness(payload) {
  const res = await fetch(`${BASE_URL}/api/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Prediction inference error');
  return res.json();
}

export async function saveAssessmentToCloud(payload) {
  const res = await fetch(`${BASE_URL}/api/assessments/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to save assessment to cloud');
  return res.json();
}

export async function fetchCloudHistory(userId) {
  const url = userId 
    ? `${BASE_URL}/api/assessments/history?user_id=${encodeURIComponent(userId)}`
    : `${BASE_URL}/api/assessments/history`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
}

export async function registerAccount(email, password) {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function loginAccount(email, password) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}
