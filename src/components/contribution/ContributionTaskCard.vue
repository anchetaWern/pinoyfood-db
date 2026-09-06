<template>
  <article class="task-card">
    <div class="task-card__tags" aria-label="Who this task is for">
      <span
        v-for="audience in task.audience"
        :key="audience"
        class="audience-tag"
        :class="`audience-tag--${audience}`"
      >
        {{ audienceLabels[audience] }}
      </span>
      <span v-if="task.requiresAuth" class="audience-tag audience-tag--auth">
        Account required
      </span>
    </div>

    <h3>{{ task.title }}</h3>
    <p>{{ task.summary }}</p>
    <p v-if="task.note" class="task-card__note">{{ task.note }}</p>

    <div class="task-card__action">
      <v-btn
        v-if="task.action === 'share'"
        color="primary"
        variant="tonal"
        prepend-icon="mdi-share-variant"
        @click="handleAction"
      >
        {{ task.actionLabel }}
      </v-btn>
      <v-btn
        v-else-if="task.action === 'navigate'"
        color="primary"
        variant="tonal"
        :to="task.href"
        @click="trackAction"
      >
        {{ task.actionLabel }}
      </v-btn>
      <v-btn
        v-else
        color="primary"
        variant="tonal"
        :href="task.href"
        target="_blank"
        rel="noopener noreferrer"
        append-icon="mdi-open-in-new"
        @click="trackAction"
      >
        {{ task.actionLabel }}
      </v-btn>
    </div>
  </article>
</template>

<script setup>
import { createToast } from 'mosha-vue-toastify'
import { audienceLabels } from '@/data/contributionTasks'
import { captureEvent } from '@/services/analytics'
import { shareContent } from '@/services/share'

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
})

function destinationName() {
  if (props.task.action === 'share') return 'web_share'
  if (props.task.action === 'navigate') return 'contribution_site'
  try {
    return new URL(props.task.href).hostname
  } catch {
    return props.task.href
  }
}

function trackAction() {
  const destination = destinationName()
  captureEvent('contribution_action_clicked', {
    task_id: props.task.id,
    category: props.task.category,
    time_bucket: props.task.timeBucket,
    audience: props.task.audience,
    destination,
  })

  if (props.task.action === 'external') {
    captureEvent('contribution_external_link_clicked', { destination })
  }
}

async function handleAction() {
  trackAction()
  try {
    const result = await shareContent({
      url: props.task.href,
      title: 'Juan Nutrisyon',
      text: 'Discover practical nutrition information for Filipino foods on Juan Nutrisyon.',
    })
    if (result === 'copied') {
      createToast({ title: 'Link copied' }, { type: 'success', position: 'bottom-right' })
    }
  } catch {
    createToast(
      { title: 'Could not share', description: 'Please copy the page address from your browser.' },
      { type: 'danger', position: 'bottom-right' },
    )
  }
}
</script>

<style scoped>
.task-card {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding: 24px;
  border: 1px solid #dce5df;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 10px 30px rgba(21, 55, 39, 0.06);
}

.task-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.audience-tag {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 4px 10px;
  border: 1px solid #b9d5c5;
  border-radius: 999px;
  background: #edf8f1;
  color: #174b31;
  font-size: 0.78rem;
  font-weight: 700;
  line-height: 1.2;
}

.audience-tag--nutrition-professional,
.audience-tag--relevant-expertise {
  border-color: #d5c895;
  background: #fff9df;
  color: #644f06;
}

.audience-tag--auth {
  border-color: #c8cbd8;
  background: #f3f4f8;
  color: #414657;
}

h3 {
  margin: 0 0 10px;
  color: #173c2b;
  font-size: 1.18rem;
  font-weight: 750;
  line-height: 1.3;
}

p {
  margin: 0;
  color: #4b6257;
  line-height: 1.65;
}

.task-card__note {
  margin-top: 12px;
  padding: 12px 14px;
  border-left: 3px solid #e1a72e;
  background: #fffbec;
  color: #584b28;
  font-size: 0.9rem;
}

.task-card__action {
  margin-top: auto;
  padding-top: 22px;
}

@media (max-width: 600px) {
  .task-card {
    padding: 20px;
  }
}
</style>
