$ErrorActionPreference = "Stop"

npm run review:local -- `
  --name "Sheila Bankston" `
  --dob "1960-06-13" `
  --medication "Xanax 1 mg tablet" `
  --directions "1 tablet PO BID PRN for anxiety" `
  --history "no recent narcotic or controlled-substance use" `
  --note "PDMP review not yet documented"
