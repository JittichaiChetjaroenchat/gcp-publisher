import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  // vus: 1,
  // duration: '30s',
  iterations: 1,
}

export default function() {
  const url = 'http://localhost:3000/publish';
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  for (let i = 1; i <= 50; i++) {
    const payload = JSON.stringify({
      id: i,
      name: 'Unknown'
    });

    const res = http.post(url, payload, params);
    // check(res, { 'status was 200': (r) => r.status == 200 });
    // sleep(1);
  }
}