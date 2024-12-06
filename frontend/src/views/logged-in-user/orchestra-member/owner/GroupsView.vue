<template>
  <div class="groups-view">
    <div class="groups-view__title">
      <h1>Groups</h1>
    </div>

    <div v-if="loadingGroups">
      <ProgressSpinner />
    </div>
    <div v-else-if="!groups">
      <Message severity="error">Failed to load orchestra groups.</Message>
    </div>
    <div v-else class="groups-view__content">
      <pre>
        {{ route.params }}
        {{ { groups } }}
      </pre>

      <pre>
      <div>
        See all Orchestra Groups:
        -> delete group
        -> see all assigned members
      </div>
      <div>
        Create Orchestra Group (form):
        - name
        = button (Create new group)
      </div>
      <div>
        Add Orchesstra Member to the Group (form):
        - orchestra member email (select)
        - orchestra group (select)
        = button (Assign Member to the Group)
      </div>
    </pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useGroups } from '@/composables/useGroups'

const { groups, loadingGroups, fetchGroups } = useGroups()

const route = useRoute()

watch(
  () => route.params.orchestraId,
  async orchestraId => {
    await fetchGroups(orchestraId.toString())
  },
  { immediate: true },
)
</script>

<style setup lang="scss">
.groups-view {
  &__title {
    margin-bottom: 50px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    // align-items: center;
    gap: 50px;
    width: 100%;
  }
}
</style>
