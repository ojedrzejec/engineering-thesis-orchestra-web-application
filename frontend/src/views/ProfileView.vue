<template>
<div class="profile-view">
    <Toast />
    <div class="profile-view__title">
      <h1>My Profile</h1>
    </div>
    <Form>
        <Fluid>
            <div class="profile-view__form">
                <div class="profile-view__form-input">
                    <FloatLabel variant="on">
                    <InputText 
                        class="profile-view__form-input-field"
                        id="firstName" 
                        v-model="orchestraMember.firstName" 
                        @input="validateFirstNameInput" 
                        :invalid="!isFirstNameValid && showFirstNameErrors"
                    ></InputText>
                    <label for="firstName">First Name</label>
                    </FloatLabel>
                    <div class="profile-view__form-error-messages">
                    <Message severity="error" v-if="!orchestraMember.firstName && showFirstNameErrors">{{ messageInputRequired }}</Message>
                    <Message severity="error" v-if="orchestraMember.firstName && !validateFirstLastNameLength(orchestraMember.firstName) && showFirstNameErrors">{{ messageValidationFirstLastNameLength("First Name") }}</Message>
                    <Message severity="error" v-if="orchestraMember.firstName && !validateLettersAndWhitespaces(orchestraMember.firstName) && showFirstNameErrors">{{ messageValidationLettersAndWhitespaces }}</Message>
                    </div>
                </div>

                <div class="profile-view__form-input">
                    <FloatLabel variant="on">
                    <InputText 
                        class="profile-view__form-input-field"
                        id="lastName" 
                        v-model="orchestraMember.lastName" 
                        @input="validateLastNameInput" 
                        :invalid="!isLastNameValid && showLastNameErrors"
                    ></InputText>
                    <label for="lastName">Last Name</label>
                    </FloatLabel>
                    <div class="profile-view__form-error-messages">
                    <Message severity="error" v-if="!orchestraMember.lastName && showLastNameErrors">{{ messageInputRequired }}</Message>
                    <Message severity="error" v-if="orchestraMember.lastName && !validateFirstLastNameLength(orchestraMember.lastName) && showLastNameErrors">{{ messageValidationFirstLastNameLength("Last Name") }}</Message>
                    <Message severity="error" v-if="orchestraMember.lastName && !validateLettersAndWhitespaces(orchestraMember.lastName) && showLastNameErrors">{{ messageValidationLettersAndWhitespaces }}</Message>
                    </div>
                </div>

                <div class="profile-view__form-input">
                    <div class="profile-view__text-color">Instruments:</div>
                    <div v-for="(instrument, ix) in instruments" :key="ix" class="profile-view__form-input-instruments">
                    <div class="profile-view__form-input-instrument-header profile-view__text-color">
                        Instrument: {{ ix + 1 }}
                        <i class="pi pi-trash" style="color: slateblue" @click="removeInstrument(ix)"></i>
                    </div>
                    <div>
                        <FloatLabel variant="on">
                        <InputText 
                            class="profile-view__form-input-field"
                            id="instrument" 
                            v-model="instrument.name"
                            @input="validateInstrumentInput" 
                            @update="handleInstrumentsUpdate(instrument, ix)"
                            :invalid="!isInstrumentValid && showInstrumentErrors"
                        ></InputText>
                        <label for="instrument">Instrument Name</label>
                        </FloatLabel>
                        <div class="profile-view__form-error-messages">
                        <Message severity="error" v-if="!instrument.name && showInstrumentErrors">{{ messageInputRequired }}</Message>
                        <Message severity="error" v-if="instrument.name && !validateLettersAndWhitespaces(instrument.name) && showInstrumentErrors">{{ messageValidationLettersAndWhitespaces }}</Message>
                        </div>
                    </div>
                    </div>
                    <div>
                    <Button 
                        class="p-button-outlined"
                        @click.prevent="addNewInstrument"
                        :disabled="instruments.length > 0 && !instruments[instruments.length - 1].name"
                        :label="loading ? 'Adding Instrument...' : 'Add Instrument'" 
                    ></Button>
                    </div>
                </div>

                <div class="profile-view__form-input">
                    <FloatLabel variant="on">
                    <InputText 
                        class="profile-view__form-input-field"
                        v-model="orchestraMember.phone"
                        id="phone" 
                        @input="validatePhoneInput" 
                        :invalid="!isPhoneValid && showPhoneErrors"
                        v-keyfilter="{ pattern: /^[\+]?([0-9]{1,11})?$/, validateOnly: true }"
                        ></InputText>
                    <label for="phone">Phone Number</label>
                    </FloatLabel>
                    <div class="profile-view__form-error-messages">
                    <Message severity="error" v-if="!orchestraMember.phone && showPhoneErrors">{{ messageInputRequired }}</Message>
                    <Message severity="error" v-if="orchestraMember.phone && !validatePhoneNumber(orchestraMember.phone) && showPhoneErrors">{{ messageValidationPhoneNumber }}</Message>
                    </div>
                </div>

                <div class="profile-view__form-input">
                    <FloatLabel variant="on">
                    <DatePicker 
                        v-model="orchestraMember.dateOfBirth"
                        dateFormat="dd/mm/yy" 
                        showIcon 
                        inputId="dateOfBirth" 
                        iconDisplay="input" 
                        @input="validateDateOfBirthInput"
                        :invalid="!orchestraMember.dateOfBirth && showDateOfBirthErrors"
                    />
                    <label for="dateOfBirth">Date of Birth</label>
                    </FloatLabel>
                    <div class="profile-view__form-error-messages">
                    <Message severity="error" v-if="!orchestraMember.dateOfBirth && showDateOfBirthErrors">{{ messageInputRequired }}</Message>
                    </div>
                </div>

                <div class="profile-view__form-input">
                    <SelectButton 
                    v-model="orchestraMember.isStudent" 
                    :options="options"
                    optionLabel="name"
                    optionValue="value"
                    @click="validateIsStudentInput"
                    :invalid="orchestraMember.isStudent === null && showIsStudentErrors" 
                    />
                    <div class="profile-view__form-error-messages">
                    <Message severity="error" v-if="orchestraMember.isStudent === null && showIsStudentErrors">{{ messageInputRequired }}</Message>
                    </div>

                    <div v-if="orchestraMember.isStudent">
                    <FloatLabel variant="on">
                        <Textarea 
                        id="university" 
                        v-model="orchestraMember.university" 
                        rows="1" 
                        cols="30" 
                        autoResize
                        @input="validateUniversityInput"
                        :invalid="!orchestraMember.university && showUniversityErrors"
                        ></Textarea>
                        <label for="university">University Name</label>
                    </FloatLabel>
                    <div class="profile-view__form-error-messages">
                        <Message severity="error" v-if="!orchestraMember.university && showUniversityErrors">{{ messageInputRequired }}</Message>
                    </div>
                    </div>
                </div>

                <div class="profile-view__form-input profile-view__file">
                    <FileUpload
                    mode="advanced"
                    accept="image/*"
                    :maxFileSize="1000000"
                    ref="fileupload"
                    name="demo[]"
                    @select="onFileSelect"
                    customUpload
                    :invalid="!orchestraMember.profilePicture"
                    class="p-button-outlined" 
                    :showCancelButton=false
                    :show-upload-button=false
                    :chooseLabel="orchestraMember.profilePicture ? 'Change Profile Picture' : 'Choose Your Profile Picture'"
                    @remove="removeFileCallback"
                    >
                    <template #empty>
                        <span>Drag and drop files to here to upload.</span>
                    </template>
                    </FileUpload>
                </div>

                <div class="profile-view__form-input">
                    <FloatLabel variant="on">
                    <Textarea 
                        id="description" 
                        v-model="orchestraMember.description" 
                        rows="6" 
                        cols="30" 
                        autoResize
                    ></Textarea>
                    <label for="description">Description - write a few words about yourself <i class="pi pi-face-smile"></i></label>
                    </FloatLabel>
                </div>

                <div v-if="errorMessage" class="error-message">
                    <Message severity="error">{{ errorMessage }}</Message>
                </div>

                <div>
                    <Button 
                    class="profile-view__form-button"
                    @click.prevent="handleUpdate"
                    :disabled="loading"
                    :label="loading ? 'Updating...' : 'Update'" 
                    ></Button>
                </div>
            </div>
        </Fluid>
    </Form>
</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { API_BASE_URL } from '@/constants/config';
import type { TOrchestraMember } from '@/types/TOrchestraMember';
import type { TInstrument } from '@/types/TInstrument';
import { initOrchestraMember } from '@/constants/initOrchestraMember';
import { 
  messageInputRequired,
} from '@/constants/validation/loginValidation';
import { 
  messageValidationFirstLastNameLength,
  messageValidationLettersAndWhitespaces,
  messageValidationPhoneNumber,
  validateFirstLastNameLength,
  validateLettersAndWhitespaces,
  validatePhoneNumber,
} from '@/constants/validation/registrationValidation';
import Button from 'primevue/button';
import SelectButton from 'primevue/selectbutton';
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import Textarea from 'primevue/textarea';
import Message from 'primevue/message';
import Divider from 'primevue/divider';
import Fluid from 'primevue/fluid';
import DatePicker from 'primevue/datepicker';
import FileUpload from 'primevue/fileupload';
import { Form } from '@primevue/forms';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore()
const toast = useToast();

const orchestraMember = ref<TOrchestraMember>(initOrchestraMember)

onMounted(async() => {
    console.log("onMounted function");
    const response = await fetch(`${API_BASE_URL}/orchestra-member/single`, {
        method: 'GET',
        headers: { 
            Authorization: `Bearer ${authStore.getToken()}`,
        }
    });

    if (!response.ok) {
        toast.add({ severity: 'error', summary: 'Error loading user data.', life: 3000 });
        console.error('Error loading data');
        return;
    }

    const data = await response.json();
    console.log("data");
    console.log("data: ", data);
    
    orchestraMember.value.firstName = data.first_name;
    orchestraMember.value.lastName = data.last_name;
    orchestraMember.value.phone = data.phone;
    orchestraMember.value.dateOfBirth = new Date(data.birth_date);
    orchestraMember.value.isStudent = data.are_you_student;
    orchestraMember.value.university = data.university;
    orchestraMember.value.description = data.description;
    orchestraMember.value.profilePicture = data.profile_picture;
    
    toast.add({ severity: 'success', summary: 'Success loading user data!', life: 3000 });
})

const options = ref([
    { name: 'I am a student currently.', value: true },
    { name: 'I am NOT a student currently.', value: false }
]);
const instruments = ref<TInstrument[]>([]);

const loading = ref(false);
const errorMessage = ref('');
const showFirstNameErrors = ref(false);
const showLastNameErrors = ref(false);
const showIsStudentErrors = ref(false);
const showUniversityErrors = ref(false);
const showInstrumentErrors = ref(false);
const showDateOfBirthErrors = ref(false);
const showPhoneErrors = ref(false);

// Computed Properties for Validation
const isFirstNameValid = computed(() => orchestraMember.value.firstName && validateFirstLastNameLength(orchestraMember.value.firstName) && validateLettersAndWhitespaces(orchestraMember.value.firstName));
const isLastNameValid = computed(() => orchestraMember.value.lastName && validateFirstLastNameLength(orchestraMember.value.lastName) && validateLettersAndWhitespaces(orchestraMember.value.lastName));
const isInstrumentValid = computed(() => instruments.value.every(instrument => instrument.name && validateLettersAndWhitespaces(instrument.name)));
const isPhoneValid = computed(() => orchestraMember.value.phone && validatePhoneNumber(orchestraMember.value.phone));

// Validation Methods
const validateFirstNameInput = () => {
  showFirstNameErrors.value = true;
};
const validateLastNameInput = () => {
  showLastNameErrors.value = true;
};
const validateInstrumentInput = () => {
  showInstrumentErrors.value = true;
};
const validateDateOfBirthInput = () => {
  showDateOfBirthErrors.value = true;
};
const validateIsStudentInput = () => {
  showIsStudentErrors.value = true;
};
const validateUniversityInput = () => {
  showUniversityErrors.value = true;
};
const validatePhoneInput = () => {
  showPhoneErrors.value = true;
}

const showErrors = () => {
  showFirstNameErrors.value = true;
  showLastNameErrors.value = true;
  showInstrumentErrors.value = true;
  showPhoneErrors.value = true;
  showDateOfBirthErrors.value = true;
  showIsStudentErrors.value = true;
  showUniversityErrors.value = true;
};

const removeInstrument = (ix: number) => {
  instruments.value = instruments.value.filter((_, index) => index !== ix)
}

const addNewInstrument = () => {
  instruments.value = [...instruments.value, Object.assign({}, initInstrument)]
}

const handleInstrumentsUpdate = (instrument: TInstrument, ix: number) => {
  instruments.value = instruments.value.map((inst, i) => i === ix ? instrument : inst)
}

const onFileSelect = async (event) => {
  const file = event.files[0];
  if (file) {
    orchestraMember.value.profilePicture = await fileToBase64(file);
  }
};

const removeFileCallback = (file) => {
  console.log(file);
  orchestraMember.value.profilePicture = null;
};

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const handleUpdate = () => {
    console.log("handleUpdate function");
}
</script>

<style setup lang="scss">
.profile-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  
  &__title {
    margin-bottom: 20px;
  }

  &__form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
  }
  
  &__form-input {
    display: flex;
    flex-direction: column;
    /* align-items: center; */
    gap: 5px;
    min-width: 300px;
  }
  
  &__form-error-messages {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  &__info {
    margin-bottom: 40px;
    text-align: center;
  }
  
  &__form-button {
    width: 100%;
    min-width: 300px;
  }

  &__form-input-instruments {
    margin: 10px 0 10px;
  }

  &__form-input-instrument-header {
    display: flex; 
    justify-content: space-between; 
    margin-bottom: 8px
  }

  &__text-color {
    color: #475569;
  }

  &__file {
    .p-fileupload-file-badge {
      display: none !important;
    }
  }
}
</style>
