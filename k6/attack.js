import http from 'k6/http';
import { check, sleep } from 'k6';

// 1. CONFIGURATION (The Army)
export const options = {
  vus: 50,         // 50 "Virtual Users" hitting the site at once
  duration: '10s', // The attack lasts for 10 seconds
};

export default function () {
  // 2. TARGET (Read Shield Status from Command Line)
  // If we run "k6 run -e SHIELD=true", this variable becomes "true"
  const shield = __ENV.SHIELD || 'false';
  
  // The URL of your Next.js API
  const url = `http://localhost:3000/api/simulate?shield=${shield}`;

  // 3. FIRE THE REQUEST
  const res = http.get(url);

  // 4. CHECK THE RESULT (Did it work or crash?)
  check(res, {
    'is status 200 (Success)': (r) => r.status === 200,
    'is status 500 (Crash)': (r) => r.status === 500,
  });

  // Short pause (0.1s) to simulate real human clicking speed
  sleep(0.1); 
}