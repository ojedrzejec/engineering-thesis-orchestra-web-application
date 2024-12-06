<template>
  <div class="instruments-view">
    <div class="instruments-view__title">
      <h1>Instruments</h1>
    </div>

    <div class="instruments-view__content">
      <ProgressSpinner v-if="loadingInstrumentsInOrchestra" />

      <div class="instruments-view__datatable">
        <DataTable
          v-model:filters="filters"
          filterDisplay="row"
          :globalFilterFields="[
            'instrumentName',
            'orchestraMemberFirstName',
            'orchestraMemberLastName',
            'orchestraMemberEmail',
          ]"
          :value="instrumentsInOrchestra"
          :loading="loadingInstrumentsInOrchestra"
          removableSort
          tableStyle="min-width: 50rem"
        >
          <template #header>
            <div class="flex justify-end">
              <IconField>
                <InputIcon>
                  <i class="pi pi-search"></i>
                </InputIcon>
                <InputText
                  v-model="filters['global'].value"
                  placeholder="Keyword Search"
                />
              </IconField>
            </div>
          </template>
          <template #empty> No instruments found. </template>
          <template #loading> Loading instruments data. Please wait. </template>
          <Column
            field="instrumentName"
            header="Instrument"
            sortable
            style="width: 25%; font-weight: bold"
          >
            <template #body="{ data }">
              {{ data.instrumentName }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
              <InputText
                v-model="filterModel.value"
                type="text"
                @input="filterCallback()"
                placeholder="Search by instrument name"
              />
            </template>
          </Column>
          <Column
            field="orchestraMemberFirstName"
            header="First Name"
            sortable
            style="width: 25%"
          ></Column>
          <Column
            field="orchestraMemberLastName"
            header="Last Name"
            sortable
            style="width: 25%"
          ></Column>
          <Column
            field="orchestraMemberEmail"
            header="Email"
            style="width: 25%"
          ></Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useInstruments } from '@/composables/useInstruments'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProgressSpinner from 'primevue/progressspinner'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { FilterMatchMode } from '@primevue/core/api'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'

const route = useRoute()

const {
  instrumentsInOrchestra,
  loadingInstrumentsInOrchestra,
  fetchInstrumentsInOrchestra,
} = useInstruments()

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  instrumentName: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

watch(
  () => route.params.orchestraId,
  async orchestraId => {
    await fetchInstrumentsInOrchestra(orchestraId.toString())
  },
  { immediate: true },
)
</script>

<style setup lang="scss">
.instruments-view {
  &__title {
    margin-bottom: 50px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    // align-items: center;
  }
}
</style>
