import { buildLocalCliReview, parseCliArgs, renderCliReview } from './local-adapter.js';

try {
  const input = parseCliArgs(process.argv.slice(2));
  const review = buildLocalCliReview(input);
  console.log(renderCliReview(review));
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`RX Guard CLI error: ${message}`);
  console.error('Usage: npm run review:local -- --name "Sheila Bankston" --dob "1960-06-13" --medication "Xanax 1 mg tablet" --directions "1 tablet PO BID PRN for anxiety" --history "no recent narcotic or controlled-substance use" --note "PDMP review not yet documented"');
  process.exit(1);
}
