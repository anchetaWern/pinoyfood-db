# Juan Nutrisyon Contribution Site Refresh — Implementation Spec

## Goal

Refresh `contribute.juanutrisyon.info` into an action-oriented hub showing that people can support Juan Nutrisyon in many ways besides donating.

The contribution site should:

- Make it obvious that **anyone** can help.
- Turn useful testing tasks from the existing RND Contributor Quickstart into general contribution tasks where professional expertise is not required.
- Clearly tag the smaller set of tasks that are specifically useful for RNDs or other qualified experts.
- Encourage sharing, testing, food/recipe contributions, corrections, and feedback.
- Keep monetary donations lightweight and optional.
- Avoid duplicating the deeper collaboration and research content already available at:
  - `https://juanutrisyon.info/collaborate`
  - `https://juanutrisyon.info/research`

## Product principles

1. **Helping should feel easy.** A useful contribution can take 30 seconds or 30+ minutes.
2. **Do not imply that only professionals can contribute.**
3. **Professional expertise should be tagged, not mixed into ordinary usability testing.**
4. **Show concrete actions, not vague calls to “get involved.”**
5. **Do not duplicate the Collaborate or Research pages.** Link to them when the user's intent is deeper than community contribution.
6. **Donations are one support path, not the main purpose of the site.**
7. **Do not require an account for ordinary contribution actions unless the target app feature already requires one.**

---

# 1. Recommended information architecture

Keep the contribution site primarily as a single action hub.

Suggested page order:

1. Hero
2. Quick ways to help
3. Choose something that fits your time
4. For nutrition professionals and other relevant experts
5. What useful feedback looks like
6. Deeper collaboration / research handoff
7. Donation option
8. Feedback/contact destinations

Avoid creating separate long pages unless an existing contribution workflow already needs one.

---

# 2. Hero

## Suggested copy

### Heading

**Help Juan Nutrisyon grow**

### Body

You do not need to donate to support Juan Nutrisyon. Sharing the project, testing the tools, reporting missing or questionable information, contributing Filipino food or recipe knowledge, and giving professional feedback can all help improve it.

### Primary CTA

**Find a way to help**

Scroll to `#ways-to-help`.

### Secondary CTA

**Support with a donation**

Open the reusable donation modal.

---

# 3. Quick ways to help

Show 5–6 cards near the top of the page.

## Card 1 — Share Juan Nutrisyon

**Description:** Help more people discover useful Filipino food and nutrition tools.

Actions:

- Share the Juan Nutrisyon homepage.
- Share a useful food page with someone.
- Nutrition professionals may also share relevant public tools or food pages with clients when appropriate.

CTA: **Share Juan Nutrisyon**

Use the Web Share API when available; otherwise copy the URL to the clipboard.

---

## Card 2 — Report something missing or questionable

**Description:** Missing foods, strange serving sizes, unclear wording, incorrect data, and awkward household measures are useful to know about.

Suggested actions:

- Request a missing food.
- Flag questionable food information.
- Report a confusing warning or explanation.
- Report a bug or usability issue.

Primary destination: existing Featurebase feedback/request workflow.

CTA: **Send feedback**

---

## Card 3 — Test the tools

**Description:** Try a real task and tell us where Juan Nutrisyon slows you down or fails.

Examples:

- Search for three foods you commonly eat or use.
- Log one meal in Food Diary.
- Try one meal in Nutrition Analyzer.
- Create a simple recipe in Recipe Creator.
- Compare a packaged-food entry with the nutrition label.

CTA: **Choose a quick test**

Scroll to the time-based contribution section.

---

## Card 4 — Help improve Filipino food and recipe coverage

**Description:** Real-world knowledge about Filipino foods, packaged products, recipes, portions, and cooking practices can improve the database.

Examples:

- Suggest a missing Filipino food or packaged product.
- Submit or review a practical Filipino recipe.
- Flag unrealistic household measures.
- Provide a product-label correction.
- Help document cooking yield or serving conventions if this is an area you know well.

CTA: **Contribute food or recipe information**

Preserve and surface existing contribution forms/routes if they already exist. Do not replace working workflows unnecessarily.

---

## Card 5 — Offer professional or expert review

**Description:** RNDs, food scientists, recipe developers, educators, and other relevant experts can help review areas where subject-matter judgment matters.

CTA: **See expert contribution ideas**

Scroll to `#expert-contributions`.

---

## Card 6 — Donate

**Description:** Financial support helps sustain an independent project, but it is only one way to contribute.

CTA: **Donate via GCash or Maya**

Open the reusable donation modal.

---

# 4. Choose something that fits your time

This section adapts the existing RND Contributor Quickstart but removes unnecessary professional gating.

Every task should have:

- title
- 1–2 sentence instruction
- estimated time
- category
- audience tag
- CTA
- destination

Recommended audience tags:

- `Anyone`
- `Nutrition professional`
- `Relevant expertise`

Do **not** hide tasks behind these tags. They are guidance only.

## 2–5 minutes

### Share one useful page
- Audience: Anyone
- Share Juan Nutrisyon or a specific food page with someone who may find it useful.

### Flag one confusing, missing, or questionable thing
- Audience: Anyone
- Open any familiar food page and report one problem involving the food name, serving size, household measure, nutrient information, category, warning, wording, or another visible detail.

### Search for three foods you commonly use
- Audience: Anyone
- Report each result as:
  - Found
  - Found but awkward/questionable
  - Not found

### Check one household measure
- Audience: Anyone
- Tell us whether a shown portion or household measure feels realistic based on how you normally encounter or use the food.
- Nutrition professionals may additionally comment on whether the measure is practical in counseling.

### Review one phrase or warning
- Audience: Anyone
- Tell us whether the wording is understandable or confusing.
- Nutrition professionals may additionally comment on whether it is overly alarming, falsely reassuring, or inappropriate for client-facing use.

---

## 5–10 minutes

### Log one meal in Food Diary
- Audience: Anyone
- Report one thing that confused you, slowed you down, or made the task difficult.

### Try one meal in Nutrition Analyzer
- Audience: Anyone
- Focus on whether the result is understandable and useful rather than recomputing every nutrient.

### Compare one packaged-food entry with its label
- Audience: Anyone
- Compare serving size and a few major nutrients such as calories, sodium, sugar, fat, or protein.
- Allow the user to attach or link a product-label photo through the existing feedback workflow if supported.

### Review the proposed food taxonomy
- Audience: Anyone / Relevant expertise
- Link to the current taxonomy review document.
- Ask whether categories are understandable and whether familiar foods appear to belong in sensible places.

---

## 10–20 minutes

### Review one Juan Nutrisyon recipe for real-world usefulness
- Audience: Anyone
- Review ingredients, declared servings, household portion, oil, sauces, and seasonings.
- Ask whether the recipe resembles something they would actually cook, eat, or recognize.

### Sanity-check recipe nutrition
- Audience: Nutrition professional / Relevant expertise
- Review calories, macros, sodium, serving size, and other nutrients at a glance.
- Do not ask users to recompute the recipe from scratch.
- Ask them to flag anything that appears implausible.

---

## 20–30 minutes

### Try Recipe Creator end to end
- Audience: Anyone
- Create a simple recipe.
- Set servings.
- Review the calculated result.
- Report missing foods, awkward inputs, confusing terminology, or surprising calculations.

### Try Meal Planner as if doing real work
- Audience: Nutrition professional
- Keep the existing RND access requirement.
- Ask the contributor to focus on:
  - food availability
  - Filipino dish representation
  - serving/household measures
  - exchange information where relevant
  - number of clicks
  - editing workflow
  - print/export output
- Prompt: **What is the first thing that would prevent you from using this during actual meal planning?**

---

## 30+ minutes

### Standardize one Filipino recipe
- Audience: Anyone with relevant cooking knowledge
- Provide:
  - practical ingredient list
  - amounts
  - number of servings
  - reasonable household serving measure
  - optional notes on oil, sauces, discarded liquid, bones/inedible portions, or cooking changes

Professional review of nutrient methodology is separate from contributing a realistic recipe.

### Review cooking and yield handling
- Audience: Nutrition professional / Relevant expertise
- Review how the system should handle:
  - water gain/loss
  - cooking loss
  - discarded liquid
  - bones or other inedible portions
  - oil retained in the final dish

### Review frying-oil retention
- Audience: Nutrition professional / Relevant expertise
- Test examples such as:
  - deep-fried
  - pan-fried
  - sautéed
  - drained fried foods
  - dishes where oil remains in a sauce

### Build or review an FEL mapping
- Audience: Nutrition professional
- Choose a common Filipino dish and review its Food Exchange List contribution per serving.
- Multi-exchange ingredients are especially useful.

### Review what should or should not be public-facing
- Audience: Nutrition professional
- Ask whether any calculation, interpretation, warning, or label could be misunderstood as individualized nutrition advice or requires stronger context.

---

# 5. Task configuration

Do not hard-code all task cards directly into page templates.

Store contribution tasks in one maintainable config/data file, e.g.:

`src/data/contributionTasks.ts`

Suggested shape:

```ts
type ContributionTask = {
  id: string
  title: string
  summary: string
  timeBucket: '2-5' | '5-10' | '10-20' | '20-30' | '30+'
  category:
    | 'share'
    | 'data'
    | 'testing'
    | 'recipes'
    | 'professional-review'
    | 'donation'
  audience: Array<'anyone' | 'nutrition-professional' | 'relevant-expertise'>
  actionLabel: string
  href?: string
  action?: 'navigate' | 'external' | 'share' | 'donate-modal'
  requiresAuth?: boolean
  note?: string
}
```

Benefits:

- Contribution ideas can be added or removed without rewriting page structure.
- Tasks can later be filtered by time, category, or audience.
- Analytics can use the stable `id`.

A full interactive filtering UI is **not required for this phase**. Tags and sections are enough.

---

# 6. What useful feedback looks like

Include a compact example section to reduce contributor anxiety.

Suggested examples:

> “I searched for three foods I commonly use. Two were missing.”

> “This household measure feels too small compared with how I normally use this food.”

> “I could find the food, but the name made it hard to recognize.”

> “The sodium warning is understandable, but it feels overly alarming.”

> “This recipe seems to count more cooking oil than I would expect in the finished dish.”

> “I stopped using Recipe Creator because I could not find one of the ingredients I needed.”

For professional contributors, additional examples can mention FEL classification, meal-planning workflow, and client-facing interpretation.

---

# 7. Feedback destinations

Keep Featurebase as the recommended structured feedback destination unless the current implementation already has a better equivalent.

Show:

1. **Featurebase** — recommended for bugs, missing foods, corrections, and feature requests
2. **Email**
3. **Instagram**
4. **Facebook**

Do not require contributors to use a single channel if another is easier for them.

If existing contribution forms already capture structured food/recipe submissions, continue using them and link to them directly from the relevant task cards.

---

# 8. Collaborate and Research handoff

Do not repeat the content of the main-site Collaborate or Research pages.

Near the bottom of the contribution page add a small section:

## Looking for something deeper?

### Collaboration
For organizations, researchers, educators, nutrition professionals, data providers, or others interested in a more substantial project or partnership:

CTA: **Explore collaboration**

Destination:
`https://juanutrisyon.info/collaborate`

### Research
For academic studies or investigator-led research using or adapting Juan Nutrisyon's infrastructure:

CTA: **Explore research collaboration**

Destination:
`https://juanutrisyon.info/research`

Keep each description to 1–2 sentences.

---

# 9. Donation modal

Create one reusable donation modal/component that can be invoked from both:

- `contribute.juanutrisyon.info`
- the main Juan Nutrisyon site/app where technically practical

Do not auto-open it.

## Modal copy

### Title

**Support Juan Nutrisyon**

### Body

> Thank you so much for supporting Juan Nutrisyon. Your support means a lot to an independent project like this.
>
> Scan the QR code below to donate via GCash or Maya. Any amount is appreciated. 🙏

Show the GCash and Maya QR codes.

Below the QR codes:

**I sent a donation**

Clicking this reveals or advances to the donor notification form without leaving the modal.

---

# 10. Donation notification form

## Fields

### Payment method
Required.

Options:

- GCash
- Maya

### Amount
Optional.

- Numeric
- Positive values only
- Do not require currency input; assume PHP.

### Name
Optional.

Helper text:

`You can leave this blank if you prefer.`

This value is private unless the donor explicitly chooses named public acknowledgment.

### Contact
Optional.

Label:

**Email or social media handle**

Helper text:

`So we can thank you or contact you if needed. This will not be displayed publicly.`

Do not ask for a phone number separately.

### How should we acknowledge you?
Required.

Single-choice options:

1. **Use my name or nickname**
2. **Acknowledge me anonymously**
3. **Please don't acknowledge me publicly**

If option 1 is selected, show:

**Name to display**

- Required only for named acknowledgment.
- Pre-fill from `Name` if available.
- User may change it to a nickname.

Helper text below the acknowledgment choices:

`Your choice only affects public acknowledgment. Any contact information you provide will remain private.`

### Message
Optional.

Label:

**Message**

Helper text:

`Anything you'd like to share with us.`

Do not add a separate free-text “What made you support Juan Nutrisyon?” field in this phase.

### Submit button

**Let us know**

or

**Send donation note**

Prefer **Let us know** if it fits the existing UI tone.

---

# 11. Donation form data handling

Use the contribution site's existing backend/storage pattern where possible. Do not introduce a separate database solely for this feature if an existing persistence mechanism can be reused.

Suggested stored fields:

```ts
type DonationNotification = {
  id: string
  paymentMethod: 'gcash' | 'maya'
  amount?: number
  name?: string
  contact?: string
  acknowledgement: 'named' | 'anonymous' | 'private'
  displayName?: string
  message?: string
  status: 'unverified' | 'confirmed'
  createdAt: string
}
```

Rules:

- Default `status` to `unverified`; the form is a notification, not automatic payment verification.
- Never publicly expose `name`, `contact`, amount, or message unless a future supporter display feature explicitly uses the donor's acknowledgment preference.
- `displayName` may only be considered publicly displayable when `acknowledgement === 'named'`.
- For `anonymous`, a future public supporter list may show only `Anonymous supporter`.
- For `private`, do not create any public acknowledgment.
- Do not build the public supporter list in this phase.
- If the project already has an owner-notification mechanism, notify the owner after a successful submission.

## Anti-spam

Use the site's existing spam protection if available.

At minimum:

- server-side validation
- rate limiting
- honeypot or existing Turnstile integration where practical

---

# 12. Donation prompt across sites

Use a lightweight global support entry point rather than banners or automatic popups.

Recommended implementations:

- Footer link: **Support Juan Nutrisyon**
- Optional compact header/menu item if it does not compete with primary navigation
- Contribution-site Donate card

All should open the same donation experience or equivalent component.

Do **not**:

- auto-open the donation modal
- interrupt users while viewing nutrition information
- show repeated donation banners on every page

---

# 13. Food-page Share button

Add a share action to every public food page in the main app/site.

## Placement

Place near the food title or the existing page-action controls.

Label:

**Share**

## Behavior

1. Use `navigator.share()` when supported.
2. Share the canonical food-page URL.
3. Suggested share title:
   - `{Food name} | Juan Nutrisyon`
4. Suggested text:
   - `See nutrition information for {Food name} on Juan Nutrisyon.`
5. If Web Share API is unavailable:
   - copy canonical URL to clipboard
   - show success toast: **Link copied**

Do not require login.

This is both a product utility and a low-friction way for users to support the project.

---

# 14. Analytics

Instrument the refreshed contribution flow in PostHog.

Suggested events:

### `contribution_action_clicked`

Properties:

```ts
{
  task_id,
  category,
  time_bucket,
  audience,
  destination
}
```

### `contribution_external_link_clicked`

Properties:

```ts
{
  destination: 'featurebase' | 'email' | 'instagram' | 'facebook' | 'collaborate' | 'research'
}
```

### `share_initiated`

Properties:

```ts
{
  content_type: 'food' | 'project',
  food_id?: string,
  method: 'web_share' | 'copy_link'
}
```

### `share_completed`

Capture only when the browser/API provides a reliable success signal.

### `donation_modal_opened`

Properties:

```ts
{
  source: 'contribute_page' | 'footer' | 'header' | 'other'
}
```

### `donation_notification_started`

### `donation_notification_submitted`

Allowed properties:

```ts
{
  payment_method,
  acknowledgement
}
```

**Never send donation amount, donor name, contact information, display name, or message content to PostHog.**

---

# 15. UX and accessibility

- Mobile-first layout.
- Cards must be keyboard accessible.
- External links should be clearly handled.
- QR images require useful alt text, e.g. `GCash QR code for supporting Juan Nutrisyon`.
- Do not rely on color alone for audience/time tags.
- Donation modal must trap focus and close with Escape.
- Form errors should appear inline and be accessible to screen readers.
- Preserve contributor-entered text exactly when storing messages.
- Avoid language that implies contributors are performing clinical validation unless that is actually the task.

---

# 16. Explicit distinction between ordinary and professional contributions

The site should make this distinction clear:

## Ordinary users can help evaluate

- whether foods can be found
- whether names and serving descriptions make sense
- whether household measures seem realistic in everyday use
- whether instructions and warnings are understandable
- whether packaged-food data matches a label they possess
- whether Food Diary / Nutrition Analyzer / Recipe Creator are usable
- whether Filipino recipes seem recognizable and practical
- whether something is broken, confusing, or missing
- whether a food page is useful enough to share

## Nutrition professionals / relevant experts can additionally evaluate

- FEL conversion and classification
- clinical/client-facing usefulness of portions and wording
- whether interpretations risk being misleading or overreaching
- nutrient-calculation plausibility
- Meal Planner professional workflow
- cooking/yield methodology
- frying-oil retention assumptions
- standardized exchange mapping
- what should or should not be presented to the general public without stronger context

Do not describe ordinary-user feedback as scientific or clinical validation.

---

# 17. Non-goals for this phase

Do not build:

- a contributor account system
- points, badges, leaderboards, or gamification
- a public donor leaderboard
- a public supporter directory
- payment-gateway integration
- automated GCash/Maya payment verification
- a duplicate research pitch
- a duplicate collaboration intake system
- complex contribution filtering/search
- professional credential verification for ordinary feedback tasks

These can be revisited later if actual usage justifies them.

---

# 18. Acceptance criteria

The update is complete when:

- [ ] The contribution homepage clearly says that donating is not required to help.
- [ ] The first screen presents concrete contribution actions.
- [ ] General users can discover testing/data-quality tasks previously framed as RND-only.
- [ ] Tasks requiring professional judgment are clearly tagged.
- [ ] Contribution tasks are stored in a maintainable config/data structure.
- [ ] Users can browse contribution ideas by approximate time commitment.
- [ ] Existing food/recipe submission workflows are preserved and surfaced where appropriate.
- [ ] Featurebase remains easy to find for feedback.
- [ ] Collaborate and Research are linked without duplicating their content.
- [ ] Donation is presented as one support option.
- [ ] The donation modal displays GCash/Maya QR codes.
- [ ] “I sent a donation” opens an in-site notification form.
- [ ] Donors can choose named, anonymous, or no public acknowledgment.
- [ ] Contact information is optional and explicitly private.
- [ ] Donation notification records are not treated as verified payments.
- [ ] No donor PII is sent to PostHog.
- [ ] A lightweight Support entry point can be reused across the main and contribution sites.
- [ ] Public food pages have a Share action with copy-link fallback.
- [ ] Core contribution actions are instrumented in PostHog.
- [ ] The full flow works on mobile and is keyboard accessible.

---

# 19. Suggested implementation order

## Phase 1 — Contribution-site content/IA
1. Add hero and quick-action cards.
2. Convert RND quickstart tasks into the time-based task config.
3. Add audience/expertise tags.
4. Add feedback examples.
5. Add compact Collaborate/Research handoff.
6. Wire existing forms and Featurebase links.

## Phase 2 — Donation flow
1. Build reusable donation modal.
2. Add GCash/Maya QR display.
3. Build “I sent a donation” form.
4. Persist donor notification safely.
5. Add success/error states.
6. Add lightweight Support links on relevant sites.

## Phase 3 — Sharing
1. Add site-level share action to the contribution site.
2. Add Share button to public food pages.
3. Implement Web Share API + clipboard fallback.

## Phase 4 — Analytics and polish
1. Add PostHog events.
2. Verify no PII is included in analytics.
3. Mobile/accessibility pass.
4. Test external destinations and conditional donation fields.
