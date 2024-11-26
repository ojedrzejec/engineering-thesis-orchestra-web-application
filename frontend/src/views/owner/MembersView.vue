<template>
<div class="members-view">
  <div class="members-view__title">
    <h1>{{orchestraStore.selectedOrchestra?.name ? orchestraStore.selectedOrchestra?.name : "Orchestra"}} Members</h1>
  </div>

  <div class="members-view__form">
    <div class="profile-view__form-input card flex justify-center">
      <Select 
        v-model="selectedEmail" 
        showClear 
        filter 
        :loading="orchestraMemberStore.loadingFetchingAllUsers" 
        :options="emailsNotInOrchestra" 
        optionLabel="email" 
        placeholder="Select an email" 
        :disabled="orchestraMemberStore.loadingFetchingAllUsers" 
        class="w-full md:w-56" 
      ></Select>
    </div>
    
    <div>
    <Button 
      class="members-view__form-button"
      @click.prevent="handleAddMember"
      :disabled="loading"
      :label="loading ? 'Adding...' : 'Add Member'" 
      ></Button>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { API_BASE_URL } from '@/constants/config';
import { useAuthStore } from '@/stores/useAuthStore'
const authStore = useAuthStore()
import { useOrchestraStore } from '@/stores/useOrchestraStore'
const orchestraStore = useOrchestraStore()
import { useOrchestraMemberStore } from '@/stores/useOrchestraMemberStore'
const orchestraMemberStore = useOrchestraMemberStore()
import Select from 'primevue/select';
import Button from 'primevue/button';

const loading = ref(false);
// const loadingfetchEmails = ref(false);
const selectedEmail = ref();
const emailsNotInOrchestra = ref<string[]>([]);

onMounted(async() => {
  console.log("onMounted function");
  // loadingfetchEmails.value = true;
  await orchestraMemberStore.fetchEmailsOfAllUsersNotAssignedToSelectedOrchestra();
  if (orchestraMemberStore.allEmailsNotAssignedToSelectedOrchestra.length > 0) {
    console.log('Emails fetched')
    emailsNotInOrchestra.value = orchestraMemberStore.allEmailsNotAssignedToSelectedOrchestra;
    // loadingfetchEmails.value = false;
  } else {
    console.log('Emails not fetched OR no emails available')
  }
})

const handleAddMember = () => {
  console.log('Button clicked! Inside handleAddMember function.')
}
</script>

<style setup lang="scss">
.members-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  
  &__title {
    margin-bottom: 20px;
    // text-align: left;
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
}
</style>
