<template>
  <div class="groups-view">
    <Toast />
    <div class="groups-view__title">
      <h1>Groups</h1>
    </div>

    <div class="groups-view__content">
      <div v-if="loadingGroups">
        <ProgressSpinner />
      </div>
      <div v-else-if="!groups">
        <Message severity="error">Failed to load orchestra groups.</Message>
      </div>
      <div v-else-if="groups.length === 0">
        <Message severity="error"
          >Failed to load orchestra groups <strong>or</strong> no orchestra
          groups found.
        </Message>
      </div>

      <div v-else>
        <div class="card">
          <Accordion :value="['0']" multiple>
            <AccordionPanel v-for="gr in groups" :key="gr.id" :value="gr.value">
              <AccordionHeader>
                <Tag :value="gr.name" rounded></Tag>
                <!-- Badge presents number of members in the group -->
                <Badge :value="gr.members.length" severity="secondary"></Badge>
              </AccordionHeader>
              <AccordionContent>
                <!-- <p class="m-0">Group id: {{ gr.id }}</p> -->
                <DataTable :value="gr.members" tableStyle="min-width: 50rem">
                  <Column field="email" header="Email"></Column>
                  <Column field="first_name" header="First Name"></Column>
                  <Column field="last_name" header="Last Name"></Column>
                  <Column field="instruments" header="Instruments"></Column>
                </DataTable>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>
        </div>
      </div>

      <div class="groups-view__form">
        <div class="groups-view__form-input">
          <FloatLabel variant="on">
            <InputText
              class="groups-view__form-input-field"
              id="groupName"
              v-model="newGroupName"
              @input="validateNewGroupNameInput"
              :invalid="!isNewGroupNameValid && showNewGroupNameErrors"
            ></InputText>
            <label for="groupName">New Group Name</label>
          </FloatLabel>
          <div class="groups-view__form-error-messages">
            <Message
              severity="error"
              v-if="
                newGroupName &&
                !validateNewGroupNameLength(newGroupName) &&
                showNewGroupNameErrors
              "
              >{{
                messageValidationNewGroupNameLength('New Group Name')
              }}</Message
            >
          </div>
        </div>

        <div v-if="errorMessage" class="error-message">
          <Message severity="error">{{ errorMessage }}</Message>
        </div>

        <div>
          <Button
            class="groups-view__form-button"
            icon="pi pi-plus"
            @click.prevent="handleCreateNewGroup"
            :disabled="loadingNewGroupCreate || !newGroupName"
            :label="loadingNewGroupCreate ? 'Creating...' : 'Create new group'"
          ></Button>
        </div>
      </div>

      <div class="groups-view__form">
        <div class="groups-view__form-input card flex justify-center">
          <Select
            v-model="selectedMember"
            showClear
            filter
            :loading="loadingMembersNotInAnyGroup"
            :options="membersNotInAnyGroup"
            optionLabel="email"
            placeholder="Select member's email"
            :disabled="loadingMembersNotInAnyGroup"
            class="w-full md:w-56"
          ></Select>
          <Select
            v-model="selectedGroup"
            showClear
            filter
            :loading="loadingGroups"
            :options="groups"
            optionLabel="name"
            placeholder="Select a group"
            :disabled="loadingGroups"
            class="w-full md:w-56"
          ></Select>
        </div>
        <div>
          <Button
            class="groups-view__form-button"
            label="Assign member to the group"
            severity="secondary"
            @click="
              selectedMember &&
                selectedGroup &&
                addMember(selectedMember, selectedGroup)
            "
            :loading="loadingMemberToGroupAssign"
            :disabled="
              !selectedMember || !selectedGroup || loadingMemberToGroupAssign
            "
          ></Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useGroups } from '@/composables/useGroups'
import Toast from 'primevue/toast'
import ProgressSpinner from 'primevue/progressspinner'
import Message from 'primevue/message'
import FloatLabel from 'primevue/floatlabel'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import Badge from 'primevue/badge'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Select from 'primevue/select'
import {
  messageValidationNewGroupNameLength,
  validateNewGroupNameLength,
} from '@/constants/validation/groupValidation'
import type { TGroup } from '@/types/TGroup'
import type { TPlayer } from '@/types/TPlayer'

const {
  groups,
  loadingGroups,
  fetchGroups,
  membersNotInAnyGroup,
  loadingMembersNotInAnyGroup,
  fetchMembersNotInAnyGroup,
  loadingNewGroupCreate,
  createNewGroup,
  loadingMemberToGroupAssign,
  assignMemberToGroup,
} = useGroups()

const route = useRoute()

const selectedMember = ref<TPlayer | null>(null)
const selectedGroup = ref<TGroup | null>(null)
const newGroupName = ref('')
const errorMessage = ref('')
const showNewGroupNameErrors = ref(false)

const isNewGroupNameValid = computed(
  () => !newGroupName.value || validateNewGroupNameLength(newGroupName.value),
)

const validateNewGroupNameInput = () => {
  showNewGroupNameErrors.value = true
}

const showErrors = (message: string) => {
  errorMessage.value = message
}

watch(
  () => route.params.orchestraId,
  async orchestraId => {
    await fetchGroups(orchestraId.toString())
    await fetchMembersNotInAnyGroup(orchestraId.toString())
  },
  { immediate: true },
)

const handleCreateNewGroup = async () => {
  console.log('handleCreateGroup function starts...')

  // if (!newGroupName.value) {
  //   throw new Error('New Group Name is not available.')
  // }

  if (!newGroupName.value) {
    showErrors('Please fill in the field above.')
    return
  }

  // check if in groups the newGroupName already exists in the fetched groups
  if (groups.value.some(group => group.name === newGroupName.value)) {
    showErrors('Group name already exists.')
    return
  }

  errorMessage.value = ''

  try {
    await createNewGroup(
      route.params.orchestraId.toString(),
      newGroupName.value,
    )
  } catch (e) {
    const baseErrorMessage = 'Failed while createNewGroup.'
    console.error(baseErrorMessage, e)
  } finally {
    newGroupName.value = ''
    fetchGroups(route.params.orchestraId.toString())
  }
}

const addMember = async (selectedMember: TPlayer, selectedGroup: TGroup) => {
  console.log(
    'addMember: selectedMember, selectedGroup: ',
    selectedMember,
    selectedGroup,
  )

  try {
    await assignMemberToGroup(
      route.params.orchestraId.toString(),
      selectedGroup,
      selectedMember,
    )
  } finally {
    fetchGroups(route.params.orchestraId.toString())
    fetchMembersNotInAnyGroup(route.params.orchestraId.toString())
    selectedMember.value = null
    selectedGroup.value = null
  }
}
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
}
</style>
