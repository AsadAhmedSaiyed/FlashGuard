import http from 'k6/http';
import { check, sleep } from 'k6';
//  k6 run -e SHIELD=false k6/attack.js

export const options = {
  // ✅ Marketing Config: Fast, clean numbers
  stages: [
    { duration: '5s',  target: 50 },  // Warm up gently
    { duration: '10s', target: 100 }, // Peak at 100 (Laptop safe zone)
    { duration: '10s', target: 100 }, // Hold steady
    { duration: '5s',  target: 0 },   // Cooldown
  ],
  thresholds: {
    // ✅ Strict threshold: Prove it stays under 500ms!
    http_req_duration: ['p(95)<500'], 
  },
};

export default function () {
  const shield = __ENV.SHIELD || 'true'; 
  const url = `http://localhost:3000/api/simulate?shield=${shield}`;
  
  const res = http.get(url);
  
  check(res, {
    'is status 200': (r) => r.status === 200,
  });

  sleep(0.1); 
}