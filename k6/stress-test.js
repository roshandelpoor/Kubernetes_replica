import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },   // ramp up to 50 VUs
    { duration: '1m', target: 50 },    // stay at 50 VUs
    { duration: '30s', target: 0 },    // ramp down
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],     // <1% errors
    http_req_duration: ['p(95)<500'],   // 95% under 500ms
  },
};

const TARGET = __ENV.TARGET_URL || 'http://127.0.0.0:80/';

export default function () {
  const res = http.get(TARGET);
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(1);
}


