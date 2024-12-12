<template>
  <div class="concert-details-view">
    <div class="concert-details-view__datatable-availability">
      <ProgressSpinner v-if="loadingAllMembersAvailability" />
      <DataTable
        v-else
        tableStyle="max-width:15rem"
        :value="allMembersAvailability"
        :loading="loadingAllMembersAvailability"
        removableSort
      >
        <Column field="first_name" header="First Name" sortable></Column>
        <Column field="last_name" header="Last Name" sortable></Column>
        <Column field="email" header="Email" sortable></Column>
        <Column field="is_available" header="Availability" sortable>
          <template #body="{ data }">
            <Tag
              :value="
                data.is_available === null
                  ? 'No response'
                  : data.is_available
                    ? 'Available'
                    : 'Not available'
              "
              :severity="tagSeverity(data.is_available)"
            ></Tag>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import ProgressSpinner from 'primevue/progressspinner'
import { useAvailability } from '@/composables/useAvailability'

const props = defineProps<{
  concertId: string | null
}>()

const {
  allMembersAvailability,
  loadingAllMembersAvailability,
  fetchAllMembersAvailability,
} = useAvailability()

watch(
  () => props.concertId,
  async concertId => {
    if (concertId !== null) {
      await fetchAllMembersAvailability(concertId.toString())
    }
  },
  { immediate: true },
)

const tagSeverity = (is_available: boolean) => {
  if (is_available === null) {
    return 'warn'
  } else if (!is_available) {
    return 'danger'
  } else {
    return 'success'
  }
}
</script>

<style setup lang="scss">
.concert-availability-view {
  &__datatable-availability {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
}
</style>
