<template>
  <div class="members-view">
    <div class="members-view__title">
      <h1>
        {{
          selectedOrchestraDetails?.name
            ? selectedOrchestraDetails?.name
            : 'Orchestra'
        }}
        Members
      </h1>
    </div>

    <div class="members-view__content">
      <div class="members-view__form">
        <div class="members-view__form-input card flex justify-center">
          <Select
            v-model="selectedEmail"
            showClear
            filter
            :loading="loadingAllAppUsersNotInOrchestra"
            :options="allAppUsersNotInOrchestra"
            optionLabel="email"
            placeholder="Select an email"
            :disabled="loadingAllAppUsersNotInOrchestra"
            class="w-full md:w-56"
          ></Select>
        </div>
        <div>
          <Button
            class="members-view__form-button"
            @click.prevent="handleAddMember"
            :disabled="loadingOrchestraMembersUpdate || !selectedEmail"
            :label="loadingOrchestraMembersUpdate ? 'Adding...' : 'Add Member'"
          ></Button>
        </div>
      </div>

      <ProgressSpinner v-if="loadingAllOrchestraMembers" />

      <div v-else class="members-view__datatable">
        <DataTable
          :value="allOrchestraMembers"
          :loading="loadingAllOrchestraMembers"
          removableSort
          tableStyle="min-width: 50rem"
          v-model:filters="filters"
          filterDisplay="row"
          :globalFilterFields="[
            'email',
            'firstName',
            'lastName',
            'instruments',
            'accessType',
          ]"
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
          <template #empty> No members found. </template>
          <template #loading> Loading members data. Please wait. </template>
          <Column header="Avatar">
            <template #body="{ data }">
              <Avatar
                :image="data.profilePicture"
                class="flex items-center justify-center mr-2"
                size="large"
              />
            </template>
          </Column>
          <Column
            field="email"
            header="Email"
            sortable
            style="width: 25%"
          ></Column>
          <Column
            field="firstName"
            header="First Name"
            sortable
            style="width: 25%"
          ></Column>
          <Column
            field="lastName"
            header="Last Name"
            sortable
            style="width: 25%"
          ></Column>
          <Column
            field="instruments"
            header="Instruments"
            sortable
            style="width: 25%"
          ></Column>
          <Column
            field="accessType"
            header="Access Type"
            sortable
            style="width: 25%"
          >
            <template #body="{ data }">
              <Tag
                v-if="data.accessType"
                :value="data.accessType"
                :severity="tagSeverity(data.accessType)"
              ></Tag>
            </template>
          </Column>
          <Column class="w-24 !text-end">
            <template #body="{ data }">
              <Button
                icon="pi pi-user"
                @click="openDrawer(data)"
                rounded
              ></Button>
            </template>
          </Column>
        </DataTable>

        <Drawer
          v-model:visible="drawerVisible"
          position="right"
          header="Orchestra Member Details"
          :pt="{ root: 'members-view__drawer' }"
        >
          <div class="members-view__drawer-content">
            <div
              class="members-view__drawer-single-info members-view__drawer-avatar"
            >
              <Avatar
                :image="selectedUser.profilePicture || undefined"
                size="xlarge"
              />
            </div>
            <div class="members-view__drawer-single-info">
              <h4>Access Type:</h4>
              <p>
                <Tag
                  v-if="selectedUser.accessType"
                  :value="selectedUser.accessType"
                  :severity="tagSeverity(selectedUser.accessType)"
                ></Tag>
              </p>
              <div
                class="members-view__drawer-single-info-not-provided"
                v-if="!selectedUser.accessType"
              >
                Not provided
              </div>
            </div>
            <div class="members-view__drawer-single-info">
              <h4>First Name:</h4>
              <p v-if="selectedUser.firstName">
                {{ selectedUser.firstName }}
              </p>
              <div
                class="members-view__drawer-single-info-not-provided"
                v-if="!selectedUser.firstName"
              >
                Not provided
              </div>
            </div>
            <div class="members-view__drawer-single-info">
              <h4>Last Name:</h4>
              <p v-if="selectedUser.lastName">
                {{ selectedUser.lastName }}
              </p>
              <div
                class="members-view__drawer-single-info-not-provided"
                v-if="!selectedUser.lastName"
              >
                Not provided
              </div>
            </div>
            <div class="members-view__drawer-single-info">
              <h4>Instruments:</h4>
              <p v-if="selectedUser.instruments">
                {{ selectedUser.instruments }}
              </p>
              <div
                class="members-view__drawer-single-info-not-provided"
                v-if="!selectedUser.instruments"
              >
                Not provided
              </div>
            </div>
            <div class="members-view__drawer-single-info">
              <h4>Email:</h4>
              <p v-if="selectedUser.email">{{ selectedUser.email }}</p>
              <div
                class="members-view__drawer-single-info-not-provided"
                v-if="!selectedUser.email"
              >
                Not provided
              </div>
            </div>
            <div class="members-view__drawer-single-info">
              <h4>Phone:</h4>
              <p v-if="selectedUser.phone">{{ selectedUser.phone }}</p>
              <div
                class="members-view__drawer-single-info-not-provided"
                v-if="!selectedUser.phone"
              >
                Not provided
              </div>
            </div>
            <div class="members-view__drawer-single-info">
              <h4>Date of Birth:</h4>
              <p v-if="selectedUser.dateOfBirth">
                {{ selectedUser.dateOfBirth }}
              </p>
              <div
                class="members-view__drawer-single-info-not-provided"
                v-if="!selectedUser.dateOfBirth"
              >
                Not provided
              </div>
            </div>
            <div class="members-view__drawer-single-info">
              <h4>Is a Student:</h4>
              <p v-if="selectedUser.isStudent">
                {{ selectedUser.isStudent }}
              </p>
              <div
                class="members-view__drawer-single-info-not-provided"
                v-if="!selectedUser.isStudent"
              >
                Not provided
              </div>
            </div>
            <div
              v-if="selectedUser.isStudent"
              class="members-view__drawer-single-info"
            >
              <h4>University:</h4>
              <p v-if="selectedUser.university">
                {{ selectedUser.university }}
              </p>
              <div
                class="members-view__drawer-single-info-not-provided"
                v-if="!selectedUser.university"
              >
                Not provided
              </div>
            </div>
            <div class="members-view__drawer-single-info">
              <h4>Description:</h4>
              <p v-if="selectedUser.description">
                {{ selectedUser.description }}
              </p>
              <div
                class="members-view__drawer-single-info-not-provided"
                v-if="!selectedUser.description"
              >
                Not provided
              </div>
            </div>
          </div>
        </Drawer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAvailableOrchestrasStore } from '@/stores/useAvailableOrchestras'
import { useMembers } from '@/composables/useMembers'
import type { TMember } from '@/types/TMember'
import { initMember } from '@/constants/initMember'
import Select from 'primevue/select'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { FilterMatchMode } from '@primevue/core/api'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import Drawer from 'primevue/drawer'
import Avatar from 'primevue/avatar'
import Tag from 'primevue/tag'
import ProgressSpinner from 'primevue/progressspinner'

const availableOrchestrasStore = useAvailableOrchestrasStore()
const { selectedOrchestraId, selectedOrchestraDetails } = storeToRefs(
  availableOrchestrasStore,
)

const {
  allAppUsersNotInOrchestra,
  allOrchestraMembers,
  loadingAllAppUsersNotInOrchestra,
  loadingAllOrchestraMembers,
  loadingOrchestraMembersUpdate,
  fetchAllAppUsersNotInOrchestra,
  fetchAllOrchestraMembers,
  updateAllOrchestraMembers,
} = useMembers()

const route = useRoute()
const selectedEmail = ref<string | null>(null)

const selectedUser = ref<TMember>(initMember)
const drawerVisible = ref(false)

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  instrumentName: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

watch(
  () => route.params.orchestraId,
  async orchestraId => {
    await fetchAllAppUsersNotInOrchestra(orchestraId.toString())
    await fetchAllOrchestraMembers(orchestraId.toString())

    // // convert instruments string array to string of instruments
    // allOrchestraMembers.value.forEach(orchestraMember => {
    //   if (Array.isArray(orchestraMember.instruments)) {
    //     orchestraMember.instruments = orchestraMember.instruments
    //       .map((instrument: string) => instrument)
    //       .join(', ')
    //   }
    // })
  },
  { immediate: true },
)

const openDrawer = (user: TMember) => {
  selectedUser.value = user
  drawerVisible.value = true
}

const tagSeverity = (accessType: string) => {
  if (accessType === 'owner') {
    return 'danger'
  } else if (accessType === 'manager') {
    return 'warn'
  } else {
    return 'info'
  }
}

const handleAddMember = async () => {
  if (!selectedOrchestraId.value) return

  console.log('Button clicked! Inside handleAddMember function.')

  const foundOrchestraMember = allAppUsersNotInOrchestra.value.find(
    user => user === selectedEmail.value,
  )

  if (!foundOrchestraMember) {
    console.error('No member found with the selected email.')
    return
  }

  console.log(
    'foundOrchestraMember:',
    JSON.stringify(foundOrchestraMember, null, 2),
  )

  try {
    await updateAllOrchestraMembers(
      selectedOrchestraId.value,
      foundOrchestraMember,
    )
    await fetchAllAppUsersNotInOrchestra(selectedOrchestraId.value)
    await fetchAllOrchestraMembers(selectedOrchestraId.value)
  } finally {
    selectedEmail.value = null
  }
}
</script>

<style setup lang="scss">
.members-view {
  margin-bottom: 50px;

  &__title {
    margin-bottom: 50px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 50px;
    // align-items: center;
    width: 100%;
  }

  &__form {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 30px;
  }

  &__form-input {
    display: flex;
    flex-direction: column;
    // align-items: center;
    gap: 5px;
    min-width: 300px;
  }

  &__form-button {
    width: 100%;
    min-width: 150px;
  }

  &__datatable {
    // width: 100%;
    margin-top: 15px;
  }

  &__drawer {
    width: 100% !important;
    max-width: 30rem;
  }

  &__drawer-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
    // width: 30rem;
    // height: 100%;
  }

  &__drawer-single-info {
    // display: flex;
    // flex-direction: row;
    // align-items: center;
    // gap: 20px;

    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    align-items: center;
  }

  &__drawer-avatar {
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px auto;
    // border: 1px solid #e0e0e0;
  }

  &__drawer-single-info-not-provided {
    color: #b8b8b8;
  }
}
</style>
