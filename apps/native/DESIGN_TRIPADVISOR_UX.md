# Mukja Native App — TripAdvisor Matching UX Brief

Platforms: iOS & Android  
Auth: Sign-in required before any game (email/password + Apple/Google)  
Monetization: Free (1 ad-free match/mo), rewarded ad gate after quota, Paid Monthly (unlimited, ad-free), Paid Yearly (2 months free)

## 1) Onboarding & Auth
- 3-slide intro: value (find places together), privacy/location, freemium limits.
- Entry: “Continue with Apple”, “Continue with Google”, “Continue with email”.
- Email flow: minimal fields (email, password, name optional). Show password rules inline. 
- Post-auth: prompt for location permission (why: nearby picks) and notification opt-in (match ready, invites).
- Edge: failed social login → friendly retry + alternative option. 
- Copy: “You’ll need an account to start a match. It’s quick.”

## 2) Home / Dashboard
- Primary CTA: “Start a match” (solo or group).
- Secondary: “Join with invite code/link”.
- Modules: Recent matches (status chips: In-progress, Waiting for votes, Completed), Free game counter (“1 ad-free match/month. Ads apply after.”), Premium banner (Monthly, Yearly 2mo free), Tips (“Set diet filters to improve matches”).
- Quick filters reminder showing last-used criteria.

## 3) Create Match (Lobby)
- Mode choice: Solo / Group. Group: show invite link/QR, participant list.
- Vote rules: Majority, Unanimous, First-to-X. Explain with one-liners.
- Per-user criteria: Budget ($/$$/$$$), Cuisine chips, Distance slider, Dietary (veg/vegan/halal), Open now toggle, Rating floor, “Must have photos” toggle (if API supports).
- Location picker: current location, drop pin, search address. Show privacy note.
- Free tier messaging: “1 ad-free match/month. After that, results are ad-supported.”
- Ready state: show all participants’ readiness; start button enabled when host starts.

## 4) Matching Experience
- UI: Card stack with photo (fallback gradient + initials), name, cuisine tags, price, rating, distance, open/closed, address snippet.
- Actions: Like / Pass (or 1–5 rating). Quick-info sheet for hours, map/call buttons.
- Group awareness: tiny avatars with their latest vote; status chip (“2/3 majority reached”) as rules progress.
- Progress: “Card 4 of 15”, vote-rule progress bar.
- Empty/error states: “No results in range. Expand distance or relax filters.”
- Performance: skeleton placeholders while fetching; optimistic swipe then confirm results.

## 5) Results
- Show winner card + runner-ups. Map with pins for top 3.
- CTAs: “Navigate”, “Share”, “Save to favorites” (signed-in users only), “Start new match with same criteria”.
- Free tier after quota: gate results with rewarded ad screen (“Watch one ad (~30s) to view results”). After ad, show results immediately.
- Social: allow share link to group chat with winner info.

## 6) Payments & Monetization
- Plans: Monthly (ad-free, unlimited), Yearly (2 mo free). Show price/month equivalent.
- Paywall placements: home banner, lobby reminder, results gate after quota, settings.
- State handling: show current plan, renewal date, remaining ad-free match this month. On downgrade, inform when change takes effect.
- Copy: “Free includes 1 ad-free match/month. After that, watch an ad or go Premium for unlimited ad-free matches.”

## 7) Settings & Profile
- Profile basics, subscription status, payment history/restore purchases.
- Saved favorites, default dietary filters, notification toggles (match ready, invites, nearby picks).
- Support/FAQ for ads, privacy, data deletion.

## 8) TripAdvisor Integration (UX)
- Display fields: name, image (or fallback), rating, price, cuisine tags, distance, open/closed, address.
- Handle missing photos gracefully; use skeletons and label “Photo not available”.
- Error handling: gentle retry with message if rate-limited or offline.

## 9) Ad Experience
- Only at results gate; never mid-swipe.
- Clear duration and skip expectations. Post-ad confirmation toast “Thanks! Unlocking results…”.

## 10) Success Metrics (UX)
- Time to first completed match; % matches completed.
- Ad completion rate post-quota; conversion to Monthly/Yearly.
- Drop-off points: onboarding, lobby, first swipe, results gate.

## User Flows (high level)
### Onboarding/Auth
- Launch → intro slides → choose sign-in (Apple/Google/email) → permissions prompts (location, notifications) → land on Home.

### Create & Play (Solo/Group)
- Home → Start match → choose Solo/Group → set vote rule → set criteria (per user) → host starts → swipe cards (like/pass) → rule satisfied → results gate (ad if needed) → winner/map → navigate/share/save.

### Monetization Moments
- Home banner → lobby reminder after free quota → results gate (rewarded ad or upgrade) → Settings subscriptions page.

## Copy Drafts (key screens)
### Onboarding Slides
- Slide 1: “Find places together. Swipe through great restaurants and agree as a group.” 
- Slide 2: “Built for your preferences. Set budget, cuisine, distance, and dietary filters.” 
- Slide 3: “Fair matches. Choose vote rules like majority or unanimous to decide quickly.”

### Permissions
- Location: “We use your location to find nearby options. You can set a custom spot anytime.”
- Notifications: “Get notified when a match is ready or friends invite you.”

### Home
- Hero: “Start a match” (CTA) — “Solo or with friends. One ad-free match/month on Free.”
- Free quota: “1 ad-free match left this month. After that, watch an ad or go Premium.”
- Premium banner: “Unlimited ad-free matches. Monthly or Yearly (2 months free).”

### Lobby (Create Match)
- Vote rule helper: “Majority: fastest decisions. Unanimous: everyone must like it.”
- Free tier note: “Results after your free match may show an ad before revealing winners.”
- Invite: “Share link or QR to add friends. Everyone sets their own filters.”

### Matching Cards
- Empty state: “No results in range. Expand distance or relax filters.”
- Error state: “We hit a snag. Pull to retry or adjust filters.”

### Results & Ad Gate
- Gate: “Watch one quick ad to see your match results.” Button: “Watch ad to unlock.”
- Post-ad toast: “Thanks! Unlocking your results…”
- Results header: “Your match is ready.” Secondary: “Runner-ups to revisit later.”

### Paywall (Upgrade)
- Header: “Go Premium. Unlimited ad-free matches.”
- Bullets: “No ads,” “Unlimited matches,” “Yearly saves 2 months.”
- CTA: “Start Monthly” / “Start Yearly (best value)”

### Settings
- Subscription state: “You’re on Free. 1 ad-free match/month.”
- Restore/Manage: “Manage subscription” / “Restore purchases.”

## Core Match Journey (mermaid)
```mermaid
flowchart TD
  launch[Launch app] --> auth[Sign-in required]
  auth --> home[Home]
  home --> startMatch[Start match (solo/group)]
  startMatch --> lobby[Set criteria & vote rule]
  lobby --> invite[Invite friends (group)]
  lobby --> matching[Swipe cards (like/pass)]
  matching --> progress[Vote rule progress]
  progress -->|rule met| resultsGate[Results gate]
  resultsGate -->|free quota left| results[Show results]
  resultsGate -->|quota used| adGate[Rewarded ad]
  adGate --> results
  results --> actions[Map / navigate / share / save]
  actions --> home
```

## Component / State Handoff (for eng)
- Global state: auth, subscription plan, free-match counter, rewarded-ad eligibility, location permission.
- Per-match state: participants, vote rule, criteria per user, card deck, progress to decision, network/offline state.
- Screens: Onboarding, Auth, Home, Create/Lobby, Matching, Results/Paywall, Settings.

