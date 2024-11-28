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
        :loading="loadingFetchingAllUsers" 
        :options="emailsUsersNotInOrchestra" 
        optionLabel="email" 
        placeholder="Select an email" 
        :disabled="loadingFetchingAllUsers" 
        class="w-full md:w-56" 
      ></Select>
    </div>
    
    <div>
    <Button 
      class="members-view__form-button"
      @click.prevent="handleAddMember"
      :disabled="loadingAdding"
      :label="loadingAdding ? 'Adding...' : 'Add Member'" 
      ></Button>
    </div>
  </div>

  <!-- <Divider /> -->
  <div class="members-view__datatable">
    <!-- <Button label="Refresh" @click="fetchOrchestraMembers"></Button> -->
    
    <DataTable :value="orchestraMembersOfOrchestra" :loading="loadingOrchestraMembers" removableSort tableStyle="min-width: 50rem">
      <Column header="Avatar">
        <template #body="{ data }">
          <Avatar :image=data.profilePicture class="flex items-center justify-center mr-2" size="large" />
        </template>
      </Column>
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
      <Column class="w-24 !text-end">
        <template #body="{ data }">
          <Drawer v-model:visible="visible" header="Orchestra Member Datails" :pt="{'root': 'members-view__drawer'}">
            <div class="members-view__drawer-content">
              <Avatar :image=data.profilePicture class="members-view__drawer-single-info members-view__drawer-avatar" size="xlarge" />
              <div class="members-view__drawer-single-info">
                <h4>Access Type:</h4>
                <p v-if="data.accessType">{{data.accessType}}</p>
                <div class="members-view__drawer-single-info-not-provided" v-if="!data.accessType">Not provided</div>
              </div><div class="members-view__drawer-single-info">
                <h4>First Name:</h4>
                <p v-if="data.firstName">{{data.firstName}}</p>
                <div class="members-view__drawer-single-info-not-provided" v-if="!data.firstName">Not provided</div>
              </div>
              <div class="members-view__drawer-single-info">
                <h4>Last Name:</h4>
                <p v-if="data.lastName">{{data.lastName}}</p>
                <div class="members-view__drawer-single-info-not-provided" v-if="!data.lastName">Not provided</div>
              </div>
              <div class="members-view__drawer-single-info">
                <h4>Instruments:</h4>
                <p v-if="data.instruments">{{data.instruments}}</p>
                <div class="members-view__drawer-single-info-not-provided" v-if="!data.instruments">Not provided</div>
              </div>
              <div class="members-view__drawer-single-info">
                <h4>Email:</h4>
                <p v-if="data.email">{{data.email}}</p>
                <div class="members-view__drawer-single-info-not-provided" v-if="!data.email">Not provided</div>
              </div>
              <div class="members-view__drawer-single-info">
                <h4>Phone:</h4>
                <p v-if="data.phone">{{data.phone}}</p>
                <div class="members-view__drawer-single-info-not-provided" v-if="!data.phone">Not provided</div>
              </div>
              <div class="members-view__drawer-single-info">
                <h4>Date of Birth:</h4>
                <p v-if="data.dateOfBirth">{{data.dateOfBirth}}</p>
                <div class="members-view__drawer-single-info-not-provided" v-if="!data.dateOfBirth">Not provided</div>
              </div>
              <div class="members-view__drawer-single-info">
                <h4>Is a Student:</h4>
                <p v-if="data.isStudent">{{data.isStudent}}</p>
                <div class="members-view__drawer-single-info-not-provided" v-if="!data.isStudent">Not provided</div>
              </div>
              <div v-if="data.isStudent" class="members-view__drawer-single-info">
                <h4>University:</h4>
                <p v-if="data.university">{{data.university}}</p>
                <div class="members-view__drawer-single-info-not-provided" v-if="!data.university">Not provided</div>
              </div>
              <div class="members-view__drawer-single-info">
                <h4>Description:</h4>
                <p v-if="data.description">{{data.description}}</p>
                <div class="members-view__drawer-single-info-not-provided" v-if="!data.description">Not provided</div>
              </div>
            </div>
        </Drawer>
          <Button icon="pi pi-user" @click="visible = true" rounded></Button>
        </template>
      </Column>

    </DataTable>
    <Toast />
  </div>
</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
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
import Drawer from 'primevue/drawer';
import Avatar from 'primevue/avatar';
import Divider from 'primevue/divider';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
const toast = useToast();

const visible = ref(false);
const loadingAdding = ref(false);

const selectedEmail = ref<string>();
const orchestraMembersOfOrchestra = ref<TOrchestraMember[]>([]);

const emailsUsersNotInOrchestra = computed(() => orchestraMemberStore.allUsersNotAssignedToSelectedOrchestra);
const loadingFetchingAllUsers = computed(() => orchestraMemberStore.loadingFetchingAllUsers);

onMounted(async() => {
  fetchEmails()
  fetchOrchestraMembers()
})

const fetchEmails = async () => {
  await orchestraMemberStore.fetchIdsAndEmailsOfAllUsersNotAssignedToSelectedOrchestra();

  if (orchestraMemberStore.allUsersNotAssignedToSelectedOrchestra.length > 0) {
    console.log('Emails fetched')

    // convert the array of objects to an array of emails
    // emailsUsersNotInOrchestra.value = orchestraMemberStore.allUsersNotAssignedToSelectedOrchestra.map((user) => user.email);
    // console.log('emailsUsersNotInOrchestra: ', JSON.stringify(emailsUsersNotInOrchestra.value, null, 2))

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
    // console.log('orchestraMembersOfOrchestra: ', JSON.stringify(orchestraMembersOfOrchestra.value, null, 2))
  } else {
    console.log('Orchestra members not fetched OR no members available')
  }

  // convert instruments string array to string of instruments
  orchestraMembersOfOrchestra.value.forEach((orchestraMember) => {
    orchestraMember.instruments = orchestraMember.instruments.map((instrument) => instrument).join(', ');
  });
};

const handleAddMember = async () => {
  console.log('Button clicked! Inside handleAddMember function.')

  // add member to selected orchestra and update the orchestra_orchestra_member table in the database settinf the is_owner to false and is_manager to false 
  loadingAdding.value = true;

  // get the id of the orchestra member to be added (selectedemail)
  const foundOrchestraMember = emailsUsersNotInOrchestra.value.find((user) => user === selectedEmail.value);
  console.log('foundOrchestraMember:', JSON.stringify(foundOrchestraMember, null, 2));
  
  const postData = {
    id_orchestra: orchestraStore.selectedOrchestra?.id,
    id_orchestra_member: foundOrchestraMember?.id, // TODO: id of the orchestra member to be added
    is_owner: false,
    is_manager: false,
  }
  console.log('postData:', JSON.stringify(postData, null, 2));

  try {
  //   const response = await fetch(`${API_BASE_URL}/orchestra-orchestra-member/`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${authStore.getToken()}`,
  //     },
  //     body: JSON.stringify(postData),
  //   });

  //   if(!response) {
  //     const errorData = await response.json();
  //     const errorMessage = errorData.msg || 'Adding a member to the orchestra failed.';
  //     toast.add({ severity: 'error', summary: 'Adding failed', detail: errorMessage, life: 3000 });
  //     throw new Error(`${errorMessage}`);
  //   }
    
  //   toast.add({ severity: 'success', summary: `The member ${selectedEmail.value} added successfully!`, detail: 'Check the orchestra member details!', life: 3000 });

  // } catch (error) {
  //   console.error('Error:', error);
  } finally {
    loadingAdding.value = false
  }

  fetchEmails()
  fetchOrchestraMembers()

}
</script>

<style setup lang="scss">
.members-view {
  display: flex;
  flex-direction: column;
  gap: 50px;
  align-items: center;
  width: 100%;
  
  &__title {
    // margin-bottom: 20px;
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
    // gap: 10px;
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
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 50px;
  }

  &__drawer-single-info-not-provided {
    color: #b8b8b8;
  }
}
</style>
