<template>
  <main class="contribution-page">
    <section class="hero" aria-labelledby="hero-title">
      <div class="page-shell hero__inner">
        <div class="hero__copy">

          <h1 id="hero-title">Help Juan Nutrisyon grow</h1>
          <p class="hero__lead">
            Sharing the project, testing the tools,
            reporting missing or questionable information, contributing Filipino food or recipe knowledge,
            and giving professional feedback can all help improve it.
          </p>
          <div class="hero__actions">
            <v-btn color="primary" size="x-large" href="#ways-to-help" append-icon="mdi-arrow-down">
              Find a way to help
            </v-btn>
            <v-btn color="primary" size="x-large" variant="outlined" @click="openDonationModal('contribute_page')">
              Support with a donation
            </v-btn>
          </div>
          <p class="hero__note">A useful contribution can take 30 seconds or 30+ minutes.</p>
        </div>
      </div>
    </section>

    <section class="community-callout" aria-labelledby="community-title">
      <div class="page-shell">
        <div class="community-callout__card">
          <div class="community-callout__icon" aria-hidden="true">
            <v-icon icon="mdi-account-group" size="38" />
          </div>
          <div class="community-callout__copy">
            <p class="eyebrow">Our Facebook community</p>
            <h2 id="community-title">Interact with fellow users</h2>
            <p>
              A place for Juan Nutrisyon users to ask questions, suggest foods/features, share feedback, and see what’s being worked on.
            </p>
          </div>
          <v-btn
            color="primary"
            size="large"
            :href="links.facebookGroup"
            target="_blank"
            rel="noopener noreferrer"
            append-icon="mdi-open-in-new"
            @click="trackExternal('facebook_group')"
          >
            Join the Facebook group
          </v-btn>
        </div>
      </div>
    </section>

    <section id="ways-to-help" class="section page-shell" aria-labelledby="ways-title">
      <div class="section-heading">
        <p class="eyebrow">Start here</p>
        <h2 id="ways-title">Quick ways to help</h2>
        <p>Choose an action that feels useful and manageable today.</p>
      </div>

      <div class="quick-grid">
        <article v-for="card in quickWays" :key="card.id" class="quick-card">
          <div class="quick-card__icon" aria-hidden="true"><v-icon :icon="card.icon" size="30" /></div>
          <h3>{{ card.title }}</h3>
          <p>{{ card.description }}</p>
          <ul v-if="card.examples?.length">
            <li v-for="example in card.examples" :key="example">{{ example }}</li>
          </ul>
          <div class="quick-card__action">
            <template v-for="action in card.actions ?? [card]" :key="`${card.id}-${action.actionLabel}`">
              <v-btn
                v-if="action.action === 'scroll'"
                color="primary"
                variant="text"
                :href="action.href"
                append-icon="mdi-arrow-down"
                @click="trackQuickAction(card, action)"
              >
                {{ action.actionLabel }}
              </v-btn>
              <v-btn
                v-else-if="action.action === 'navigate'"
                color="primary"
                variant="text"
                :to="action.href"
                append-icon="mdi-arrow-right"
                @click="trackQuickAction(card, action)"
              >
                {{ action.actionLabel }}
              </v-btn>
              <v-btn
                v-else-if="action.action === 'donate'"
                color="primary"
                variant="text"
                append-icon="mdi-heart-outline"
                @click="openDonationFromCard(card, action)"
              >
                {{ action.actionLabel }}
              </v-btn>
              <v-btn
                v-else-if="action.action === 'share'"
                color="primary"
                variant="text"
                append-icon="mdi-share-variant"
                @click="shareProject(card, action)"
              >
                {{ action.actionLabel }}
              </v-btn>
              <v-btn
                v-else
                color="primary"
                variant="text"
                :href="action.href"
                target="_blank"
                rel="noopener noreferrer"
                append-icon="mdi-open-in-new"
                @click="trackQuickAction(card, action)"
              >
                {{ action.actionLabel }}
              </v-btn>
            </template>
          </div>
        </article>
      </div>
    </section>

    <section class="social-section" aria-labelledby="social-title">
      <div class="page-shell social-section__inner">
        <div>
          <p class="eyebrow">Stay connected</p>
          <h2 id="social-title">Follow us on our socials</h2>
          <p>Following and sharing our work helps more people learn about the nutrients of Filipino food.</p>
        </div>
        <nav class="social-links" aria-label="Juan Nutrisyon social media">
          <a
            v-for="social in socials"
            :key="social.name"
            :href="social.href"
            target="_blank"
            rel="noopener noreferrer"
            @click="trackExternal(social.destination)"
          >
            <v-icon :icon="social.icon" />
            <span>{{ social.name }}</span>
            <v-icon icon="mdi-open-in-new" size="small" aria-hidden="true" />
          </a>
        </nav>
      </div>
    </section>

    <section class="section page-shell" aria-labelledby="time-title">
      <div class="section-heading">
        <p class="eyebrow">At your own pace</p>
        <h2 id="time-title">Choose something that fits your time</h2>
        <p>The tags are guidance, not gates. Unless a task says otherwise, no account is required.</p>
      </div>

      <div class="time-groups">
        <section v-for="bucket in taskGroups" :key="bucket.id" class="time-group" :aria-labelledby="`time-${bucket.id}`">
          <div class="time-group__heading">
            <span class="time-badge"><v-icon icon="mdi-clock-outline" size="small" /> {{ bucket.label }}</span>
            <h3 :id="`time-${bucket.id}`">{{ bucket.description }}</h3>
          </div>
          <div class="task-grid">
            <ContributionTaskCard v-for="task in bucket.tasks" :key="task.id" :task="task" />
          </div>
        </section>
      </div>
    </section>

    <section id="expert-contributions" class="expert-section" aria-labelledby="expert-title">
      <div class="page-shell expert-section__inner">
        <div class="expert-section__copy">
          <p class="eyebrow">Where expertise matters</p>
          <h2 id="expert-title">For nutrition professionals and relevant experts</h2>
          <p>
            RNDs, food scientists, recipe developers, educators, and other relevant experts can help review
            areas where subject-matter judgment matters. These contributions complement the everyday usability
            feedback anyone can provide.
          </p>
        </div>
        <div class="expert-list">
          <span>FEL classification</span>
          <span>Calculation plausibility</span>
          <span>Client-facing wording</span>
          <span>Cooking and yield methods</span>
          <span>Meal-planning workflow</span>
          <span>Public-facing context</span>
        </div>
      </div>
    </section>

    <section class="section page-shell" aria-labelledby="feedback-title">
      <div class="section-heading section-heading--centered">
        <p class="eyebrow">Specific beats perfect</p>
        <h2 id="feedback-title">What useful feedback looks like</h2>
        <p>You do not need to prepare a formal report. A clear observation is enough.</p>
      </div>
      <div class="quote-grid">
        <blockquote v-for="quote in feedbackExamples" :key="quote">“{{ quote }}”</blockquote>
      </div>
    </section>

    <section class="feedback-section" aria-labelledby="send-feedback-title">
      <div class="page-shell feedback-section__inner">
        <div>
          <p class="eyebrow">Use what is easiest</p>
          <h2 id="send-feedback-title">Send feedback your way</h2>
          <p>The Facebook group is the main place to share feedback, ask questions, join testing requests, and discuss what should improve next.</p>
        </div>
        <div class="feedback-actions">
          <v-btn :href="links.facebookGroup" target="_blank" rel="noopener noreferrer" color="primary" size="large" @click="trackExternal('facebook_group')">Join the Facebook group</v-btn>
          <v-btn :href="links.featurebase" target="_blank" rel="noopener noreferrer" variant="outlined" color="primary" size="large" @click="trackExternal('featurebase')">Featurebase</v-btn>
          <v-btn :href="links.email" variant="outlined" color="primary" size="large" @click="trackExternal('email')">Email</v-btn>
          <v-btn :href="links.instagram" target="_blank" rel="noopener noreferrer" variant="outlined" color="primary" size="large" @click="trackExternal('instagram')">Instagram</v-btn>
          <v-btn :href="links.messenger" target="_blank" rel="noopener noreferrer" variant="outlined" color="primary" size="large" @click="trackExternal('messenger')">Facebook</v-btn>
        </div>
      </div>
    </section>

    <section class="section page-shell" aria-labelledby="deeper-title">
      <div class="section-heading section-heading--centered">
        <p class="eyebrow">Partnerships and studies</p>
        <h2 id="deeper-title">Looking for something deeper?</h2>
      </div>
      <div class="handoff-grid">
        <article>
          <v-icon icon="mdi-handshake-outline" size="36" color="primary" />
          <h3>Collaboration</h3>
          <p>For organizations, educators, nutrition professionals, data providers, and others interested in a substantial project or partnership.</p>
          <v-btn :href="links.collaborate" target="_blank" rel="noopener noreferrer" color="primary" variant="text" append-icon="mdi-open-in-new" @click="trackExternal('collaborate')">Explore collaboration</v-btn>
        </article>
        <article>
          <v-icon icon="mdi-flask-outline" size="36" color="primary" />
          <h3>Research</h3>
          <p>For academic studies or investigator-led research using or adapting Juan Nutrisyon’s existing infrastructure.</p>
          <v-btn :href="links.research" target="_blank" rel="noopener noreferrer" color="primary" variant="text" append-icon="mdi-open-in-new" @click="trackExternal('research')">Explore research collaboration</v-btn>
        </article>
      </div>
    </section>

    <section class="donation-section" aria-labelledby="donation-title">
      <div class="page-shell donation-section__inner">
        <div>
          <p class="eyebrow">One more way to help</p>
          <h2 id="donation-title">Support the independent project</h2>
          <p>Your donation helps in the continued development and maintenance of this project.</p>
        </div>
        <v-btn color="primary" size="large" prepend-icon="mdi-heart-outline" @click="openDonationModal('contribute_page')">
          Donate via GCash or Maya
        </v-btn>
      </div>
    </section>

    <footer class="site-footer">
      <div class="page-shell site-footer__inner">
        <img :src="logo" alt="Juan Nutrisyon" />
        <p>An independent Filipino food-literacy and nutrition-information project.</p>
        <button type="button" @click="openDonationModal('footer')">Support Juan Nutrisyon</button>
      </div>
    </footer>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { createToast } from 'mosha-vue-toastify'
import logo from '@/assets/juan-nutrisyon.png'
import ContributionTaskCard from '@/components/contribution/ContributionTaskCard.vue'
import { useDonationModal } from '@/composables/useDonationModal'
import { contributionLinks as links, contributionTasks, timeBuckets } from '@/data/contributionTasks'
import { captureEvent } from '@/services/analytics'
import { shareContent } from '@/services/share'

const { openDonationModal } = useDonationModal()

const quickWays = [
  {
    id: 'share-project', title: 'Share Juan Nutrisyon',
    description: 'Help more people discover useful Filipino food and nutrition tools.',
    examples: ['Share the homepage', 'Send someone a useful food page'],
    icon: 'mdi-share-variant-outline', category: 'share', actionLabel: 'Share Juan Nutrisyon', action: 'share', href: links.homepage,
  },
  {
    id: 'report-feedback', title: 'Report something missing or questionable',
    description: 'Missing foods, strange serving sizes, unclear wording, incorrect data, and awkward measures are useful to know about.',
    icon: 'mdi-message-alert-outline', category: 'data', actionLabel: 'Send feedback', action: 'external', href: links.featurebase,
  },
  {
    id: 'test-tools', title: 'Test the tools',
    description: 'Try a real task and tell us where Juan Nutrisyon slows you down or fails.',
    examples: ['Search for familiar foods', 'Log or analyze one meal', 'Create a simple recipe', 'Try the seasoning budgeter'],
    icon: 'mdi-test-tube', category: 'testing', actionLabel: 'Choose a quick test', action: 'scroll', href: '#time-title',
  },
  {
    id: 'food-recipe-coverage', title: 'Improve food and recipe coverage',
    description: 'Real-world knowledge about Filipino foods, products, recipes, portions, and cooking practices can improve the database.',
    icon: 'mdi-food-apple-outline', category: 'recipes',
    actions: [
      { actionLabel: 'Contribute label photos', action: 'navigate', href: '/contribute/product-labels' },
      { actionLabel: 'Create Recipe', action: 'external', href: links.recipeCreator, destination: 'recipe_creator' },
    ],
  },
  {
    id: 'expert-review', title: 'Offer professional or expert review',
    description: 'Help review areas where nutrition, food science, cooking, education, or professional-workflow judgment matters.',
    icon: 'mdi-account-star-outline', category: 'professional-review', actionLabel: 'See expert contribution ideas', action: 'scroll', href: '#expert-contributions',
  },
  {
    id: 'donate', title: 'Donate',
    description: 'Financial support helps sustain this independent project.',
    icon: 'mdi-heart-outline', category: 'donation', actionLabel: 'Donate via GCash or Maya', action: 'donate',
  },
]

const socials = [
  { name: 'Facebook', href: links.facebook, destination: 'facebook', icon: 'mdi-facebook' },
  { name: 'Instagram', href: links.instagram, destination: 'instagram', icon: 'mdi-instagram' },
  { name: 'TikTok', href: links.tiktok, destination: 'tiktok', icon: 'mdi-music-note' },
  { name: 'YouTube', href: links.youtube, destination: 'youtube', icon: 'mdi-youtube' },
]

const feedbackExamples = [
  'I searched for three foods I commonly use. Two were missing.',
  'This household measure feels too small compared with how I normally use this food.',
  'I could find the food, but the name made it hard to recognize.',
  'The sodium warning is understandable, but it feels overly alarming.',
  'This recipe seems to count more cooking oil than I would expect in the finished dish.',
  'I stopped using Recipe Creator because I could not find one of the ingredients I needed.',
]

const taskGroups = computed(() => timeBuckets.map((bucket) => ({
  ...bucket,
  tasks: contributionTasks.filter((task) => task.timeBucket === bucket.id),
})))

function trackQuickAction(card, action = card) {
  captureEvent('contribution_action_clicked', {
    task_id: card.id, category: card.category, audience: ['anyone'], destination: action.href,
  })
  if (action.action === 'external') {
    captureEvent('contribution_external_link_clicked', { destination: action.destination ?? (card.id === 'report-feedback' ? 'featurebase' : action.href) })
  }
}

function openDonationFromCard(card, action = card) {
  trackQuickAction(card, action)
  openDonationModal('contribute_page')
}

async function shareProject(card, action = card) {
  trackQuickAction(card, action)
  try {
    const result = await shareContent({
      url: links.homepage,
      title: 'Juan Nutrisyon',
      text: 'Discover practical nutrition information for Filipino foods on Juan Nutrisyon.',
    })
    if (result === 'copied') createToast({ title: 'Link copied' }, { type: 'success', position: 'bottom-right' })
  } catch {
    createToast(
      { title: 'Could not share', description: 'Please copy the page address from your browser.' },
      { type: 'danger', position: 'bottom-right' },
    )
  }
}

function trackExternal(destination) {
  captureEvent('contribution_external_link_clicked', { destination })
}
</script>

<style scoped>
.contribution-page { color: #263b31; background: #fbfdfb; }
.page-shell { width: min(1160px, calc(100% - 40px)); margin-inline: auto; }
.hero { overflow: hidden; background: radial-gradient(circle at 85% 20%, rgba(255, 210, 91, 0.34), transparent 29%), linear-gradient(145deg, #eff9f2 0%, #fffaf0 100%); }
.hero__inner { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(280px, 0.6fr); align-items: center; min-height: 620px; padding-block: 128px 110px; }
.eyebrow { margin: 0 0 10px; color: #26724a; font-size: 0.82rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; }
h1, h2, h3 { color: #173c2b; }
h1 { max-width: 720px; margin: 0; font-size: clamp(3rem, 7vw, 5.9rem); font-weight: 850; letter-spacing: -0.055em; line-height: 0.98; }
.hero__lead { max-width: 760px; margin: 28px 0 0; color: #3d564a; font-size: clamp(1.08rem, 2vw, 1.28rem); line-height: 1.7; }
.hero__actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 32px; }
.hero__note { margin: 18px 0 0; color: #5e7067; font-size: 0.93rem; }
.hero__visual { position: relative; min-height: 320px; }
.hero__mark { position: absolute; top: 70px; left: 50%; display: grid; width: 150px; height: 150px; border-radius: 44px; background: #1e784b; color: #fff; box-shadow: 0 30px 70px rgba(23, 93, 57, 0.22); place-items: center; transform: translateX(-50%) rotate(-7deg); }
.hero__bubble { position: absolute; padding: 10px 18px; border: 1px solid rgba(23, 60, 43, 0.1); border-radius: 999px; background: #fff; box-shadow: 0 12px 32px rgba(25, 65, 45, 0.1); color: #235b3c; font-weight: 750; }
.hero__bubble--one { top: 24px; left: 4%; }
.hero__bubble--two { top: 130px; right: 0; }
.hero__bubble--three { bottom: 18px; left: 12%; }
.community-callout { position: relative; z-index: 2; margin-top: -52px; }
.community-callout__card { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 22px; padding: 28px; border: 1px solid #d6e3da; border-radius: 8px; background: #fff; box-shadow: 0 18px 55px rgba(30, 75, 50, 0.12); }
.community-callout__icon { display: grid; width: 64px; height: 64px; border-radius: 18px; background: #eaf7ef; color: #1e784b; place-items: center; }
.community-callout h2, .community-callout p { margin: 0; }
.community-callout h2 { font-size: 1.65rem; font-weight: 800; }
.community-callout__copy > p:last-child { margin-top: 6px; color: #4d6258; }
.section { padding-block: 104px; }
.section-heading { max-width: 700px; margin-bottom: 42px; }
.section-heading--centered { margin-inline: auto; text-align: center; }
.section-heading h2, .social-section h2, .expert-section h2, .feedback-section h2, .donation-section h2 { margin: 0; font-size: clamp(2rem, 4.5vw, 3.35rem); font-weight: 840; letter-spacing: -0.035em; line-height: 1.08; }
.section-heading > p:last-child, .social-section p, .expert-section p, .feedback-section p, .donation-section p { margin: 14px 0 0; color: #53675d; font-size: 1.05rem; line-height: 1.65; }
.quick-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
.quick-card { display: flex; flex-direction: column; min-height: 360px; padding: 28px; border: 1px solid #dce5df; border-radius: 8px; background: #fff; box-shadow: 0 12px 36px rgba(21, 55, 39, 0.06); }
.quick-card__icon { display: grid; width: 56px; height: 56px; margin-bottom: 22px; border-radius: 16px; background: #eaf7ef; color: #1e784b; place-items: center; }
.quick-card h3 { margin: 0; font-size: 1.35rem; font-weight: 780; line-height: 1.25; }
.quick-card p, .quick-card li { color: #54685e; line-height: 1.6; }
.quick-card p { margin: 12px 0 0; }
.quick-card ul { margin: 12px 0 0; padding-left: 20px; }
.quick-card__action { display: flex; flex-wrap: wrap; gap: 6px; margin-top: auto; padding-top: 18px; }
.social-section { padding-block: 72px; background: #183f2d; }
.social-section__inner { display: grid; grid-template-columns: 0.8fr 1.2fr; align-items: center; gap: 56px; }
.social-section h2, .social-section p { color: #fff; }
.social-section .eyebrow { color: #aee4c3; }
.social-section p { opacity: 0.8; }
.social-links { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.social-links a { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 10px; padding: 17px 18px; border: 1px solid rgba(255, 255, 255, 0.18); border-radius: 8px; background: rgba(255, 255, 255, 0.08); color: #fff; font-weight: 700; text-decoration: none; }
.social-links a:hover, .social-links a:focus-visible { background: rgba(255, 255, 255, 0.16); }
.time-groups { display: grid; gap: 76px; }
.time-group__heading { display: flex; align-items: center; gap: 18px; margin-bottom: 22px; }
.time-group__heading h3 { margin: 0; font-size: 1.12rem; font-weight: 650; }
.time-badge { display: inline-flex; flex: 0 0 auto; align-items: center; gap: 7px; padding: 9px 13px; border-radius: 999px; background: #173c2b; color: #fff; font-weight: 750; }
.task-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
.expert-section { padding-block: 90px; background: #fff6d9; }
.expert-section__inner { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 70px; align-items: center; }
.expert-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.expert-list span { padding: 15px; border: 1px solid #dfcc8a; border-radius: 8px; background: rgba(255, 255, 255, 0.54); color: #5c4a0e; font-weight: 700; }
.quote-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
blockquote { margin: 0; padding: 24px; border-radius: 8px; background: #eef7f1; color: #294c3a; font-size: 1.02rem; font-weight: 600; line-height: 1.6; }
.feedback-section { padding-block: 80px; background: #edf3ef; }
.feedback-section__inner, .donation-section__inner { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 48px; }
.feedback-actions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 10px; max-width: 460px; }
.handoff-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; max-width: 920px; margin-inline: auto; }
.handoff-grid article { padding: 30px; border: 1px solid #dce5df; border-radius: 8px; background: #fff; }
.handoff-grid h3 { margin: 18px 0 8px; font-size: 1.45rem; font-weight: 780; }
.handoff-grid p { margin: 0 0 14px; color: #53675d; line-height: 1.65; }
.donation-section { padding-block: 76px; background: linear-gradient(135deg, #fdf1cb, #f6dfaa); }
.site-footer { padding-block: 36px; background: #102e21; color: #eaf4ed; }
.site-footer__inner { display: flex; align-items: center; gap: 24px; }
.site-footer img { width: 140px; filter: brightness(0) invert(1); }
.site-footer p { flex: 1; margin: 0; opacity: 0.76; }
.site-footer button { border: 0; background: none; color: #fff; cursor: pointer; font: inherit; font-weight: 700; text-decoration: underline; text-underline-offset: 4px; }

@media (max-width: 900px) {
  .hero__inner { grid-template-columns: 1fr; min-height: auto; padding-block: 112px 100px; }
  .hero__visual { display: none; }
  .community-callout__card { grid-template-columns: auto 1fr; }
  .community-callout__card .v-btn { grid-column: 1 / -1; }
  .quick-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .social-section__inner, .expert-section__inner { grid-template-columns: 1fr; gap: 36px; }
  .quote-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .feedback-section__inner, .donation-section__inner { grid-template-columns: 1fr; gap: 28px; }
  .feedback-actions { justify-content: flex-start; max-width: none; }
}

@media (max-width: 600px) {
  .page-shell { width: min(100% - 28px, 1160px); }
  .hero__inner { padding-block: 88px 94px; }
  h1 { font-size: 3.15rem; }
  .hero__actions { align-items: stretch; flex-direction: column; }
  .hero__actions .v-btn { width: 100%; }
  .community-callout__card { grid-template-columns: 1fr; gap: 14px; padding: 22px; }
  .community-callout__card .v-btn { grid-column: auto; width: 100%; }
  .section { padding-block: 76px; }
  .quick-grid, .task-grid, .social-links, .expert-list, .quote-grid, .handoff-grid { grid-template-columns: 1fr; }
  .quick-card { min-height: 0; padding: 22px; }
  .social-section { padding-block: 60px; }
  .time-group__heading { align-items: flex-start; flex-direction: column; gap: 10px; }
  .feedback-actions { align-items: stretch; flex-direction: column; }
  .site-footer__inner { align-items: flex-start; flex-direction: column; }
}
</style>
