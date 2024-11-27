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
  <div class="members-view__datatable">
    <Button label="Refresh" @click="fetchOrchestraMembers"></Button>
    <DataTable :value="orchestraMembersOfOrchestra" :loading="loadingOrchestraMembers" removableSort tableStyle="min-width: 50rem">
      <!-- <Column field="id" header="ID"></Column> -->
      <Column field="email" header="Email" sortable style="width: 25%"></Column>
      <Column field="firstName" header="First Name" sortable style="width: 25%"></Column>
      <Column field="lastName" header="Last Name" sortable style="width: 25%"></Column>
      <!-- <Column field="phone" header="Phone"></Column> -->
      <!-- <Column field="dateOfBirth" header="Date of Birth"></Column> -->
      <!-- <Column field="isStudent" header="Is Student"></Column> -->
      <!-- <Column field="university" header="University"></Column> -->
      <!-- <Column field="profilePicture" header="Profile Picture"></Column> -->
      <!-- <Column field="description" header="Description"></Column> -->
      <Column field="instruments" header="Instruments" sortable style="width: 25%"></Column>
      <Column field="accessType" header="Access Type" sortable style="width: 25%"></Column>
    </DataTable>
  </div>
</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { API_BASE_URL } from '@/constants/config';
import type { TOrchestraMember } from '@/types/TOrchestraMember';
import { useAuthStore } from '@/stores/useAuthStore'
const authStore = useAuthStore()
import { useOrchestraStore } from '@/stores/useOrchestraStore'
const orchestraStore = useOrchestraStore()
import { useOrchestraMemberStore } from '@/stores/useOrchestraMemberStore'
const orchestraMemberStore = useOrchestraMemberStore()
import Select from 'primevue/select';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';                   // optional
import type { TInstrument } from '@/types/TInstrument';

const loading = ref(false);
// const loadingfetchEmails = ref(false);
const selectedEmail = ref();
const emailsNotInOrchestra = ref<string[]>([]);
const orchestraMembersOfOrchestra = ref<TOrchestraMember[]>([]);

const orchestraMembers = ref(orchestraMemberStore.allOrchestraMembersOfOrchestra);
const loadingOrchestraMembers = ref(orchestraMemberStore.loadingFetchingOrchestraMembers);

onMounted(async() => {
  fetchEmails()
  fetchOrchestraMembers()
})

const fetchEmails = async () => {
  await orchestraMemberStore.fetchEmailsOfAllUsersNotAssignedToSelectedOrchestra();

  if (orchestraMemberStore.allEmailsNotAssignedToSelectedOrchestra.length > 0) {
    console.log('Emails fetched')
    emailsNotInOrchestra.value = orchestraMemberStore.allEmailsNotAssignedToSelectedOrchestra;
    // loadingfetchEmails.value = false;
  } else {
    console.log('Emails not fetched OR no emails available')
  }
}

const fetchOrchestraMembers = async () => {
  await orchestraMemberStore.fetchAllOrchestraMembersOfOrchestraWithRoles();

  if(orchestraMemberStore.allOrchestraMembersOfOrchestra.length > 0) {
    console.log('Orchestra members fetched')
    orchestraMembersOfOrchestra.value = orchestraMemberStore.allOrchestraMembersOfOrchestra;
    console.log('orchestraMembersOfOrchestra: ', JSON.stringify(orchestraMembersOfOrchestra.value, null, 2))
  } else {
    console.log('Orchestra members not fetched OR no members available')
  }

  // convert instruments string array to string of instruments
  orchestraMembersOfOrchestra.value.forEach((orchestraMember) => {
    orchestraMember.instruments = orchestraMember.instruments.map((instrument) => instrument).join(', ');
  });
};

const handleAddMember = () => {
  console.log('Button clicked! Inside handleAddMember function.')


  
  fetchEmails()
  fetchOrchestraMembers()
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
