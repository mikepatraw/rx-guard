import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { reviewEncounter } from './review.js';
import { normalizeReviewRequest } from '../fhir/normalize.js';
import type { ReviewRequest } from '../types/review.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '../..');
const requestedPath = process.argv[2] || 'data/synthetic/case-01-opioid-benzo-overlap.json';
const absolutePath = path.resolve(root, requestedPath);

const raw = fs.readFileSync(absolutePath, 'utf8');
const input = JSON.parse(raw) as ReviewRequest;
const result = reviewEncounter(normalizeReviewRequest(input));

console.log(JSON.stringify(result, null, 2));
