<template>
  <div class="groups-view">
    <div class="groups-view__title">
      <h1>Groups</h1>
    </div>

    <pre>
      {{ route.params }}
      {{ { groups } }}
    </pre>

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
        <pre>
          See all Orchestra Groups: 
          -> delete group 
          -> see all assigned members
        </pre>
      </div>
      <div class="groups-view__form">
        <pre>
          Create Orchestra Group (form):
          - name
          = button (Create new group)
        </pre>
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
            class="members-view__form-button"
            @click.prevent="handleCreateNewGroup"
            :disabled="loadingNewGroupCreate || !newGroupName"
            :label="loadingNewGroupCreate ? 'Creating...' : 'Create Group'"
          ></Button>
        </div>
      </div>
      <div>
        <pre>
          Add Orchesstra Member to the Group (form): - orchestra member email
          (select) - orchestra group (select) = button (Assign Member to the
          Group)
        </pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useGroups } from '@/composables/useGroups'
import ProgressSpinner from 'primevue/progressspinner'
import Message from 'primevue/message'
import FloatLabel from 'primevue/floatlabel'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import {
  messageValidationNewGroupNameLength,
  validateNewGroupNameLength,
} from '@/constants/validation/groupValidation'

const {
  groups,
  loadingGroups,
  fetchGroups,
  loadingNewGroupCreate,
  createNewGroup,
} = useGroups()

const route = useRoute()

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
