<template>
<pre>
{{ orchestra }}
</pre>
<div class="create-orchestra-view">
  <Toast />
  <div>
    <h1 class="create-orchestra-view__title">Create new orchestra</h1>
  </div>
  <Form>
    <Fluid>
      <div class="create-orchestra-view__form">
        <div class="create-orchestra-view__form-input">
          <FloatLabel variant="on">
            <InputText 
              class="create-orchestra-view__form-input-field"
              id="name" 
              v-model="orchestra.name" 
              @input="validateNameInput" 
              :invalid="!isNameValid && showNameErrors"
            ></InputText>
            <label for="name">Orchestra’s Name</label>
          </FloatLabel>
          <div class="create-orchestra-view__form-error-messages">
            <Message severity="error" v-if="!orchestra.name && showNameErrors">{{ messageInputRequired("Name") }}</Message>
            <Message severity="error" v-if="orchestra.name && !validateNameLength(orchestra.name) && showNameErrors">{{ messageValidationInputLength("Name") }}</Message>
            <Message severity="error" v-if="orchestra.name && !validateWhitespaces(orchestra.name) && showNameErrors">{{ messageValidationWhitespaces("Name") }}</Message>
          </div>
        </div>

        <div class="create-orchestra-view__form-input create-orchestra-view__file" style="align-items: center;">
          <FileUpload
            mode="advanced"
            name="logo"
            accept="image/*"
            :maxFileSize="1000000"
            class="p-button-outlined" 
            :auto="false"
            :customUpload="true"
            :show-cancel-button="false"
            :show-upload-button="false"
            :chooseLabel="orchestra.logo ? 'Change Logo' : 'Choose Orchestra Logo'"
            @remove="removeFileCallback"
            @select="onFileSelect"
            @upload="onFileSelect"
          >
            <template v-if="!orchestra.logo" #empty>
              <span>Drag and drop files to here to upload.</span>
            </template>
          </FileUpload>
        </div>

        <div class="create-orchestra-view__form-input">
          <FloatLabel variant="on">
            <InputText 
              class="create-orchestra-view__form-input-field"
              id="email" 
              v-model="orchestra.email" 
              v-keyfilter="/[^\s]/"
              @input="validateEmailInput" 
              :invalid="!isEmailValid && showEmailErrors"
            ></InputText>
            <label for="email">Email</label>
          </FloatLabel>
          <div class="create-orchestra-view__form-error-messages">
            <Message severity="error" v-if="orchestra.email && !isEmailValid && showEmailErrors">{{ messageValidationEmail }}</Message>
          </div>
        </div>
        
        <div class="create-orchestra-view__form-input">
          <FloatLabel variant="on">
            <Textarea 
              id="address" 
              v-model="orchestra.address" 
              rows="2" 
              cols="30" 
              autoResize
            ></Textarea>
            <label for="address">Address</label>
          </FloatLabel>
        </div>

        <div class="create-orchestra-view__form-input">
          <FloatLabel variant="on">
            <Textarea 
              id="history" 
              v-model="orchestra.history" 
              rows="7" 
              cols="30" 
              autoResize
            ></Textarea>
            <label for="history">History</label>
          </FloatLabel>
        </div>

        <div v-if="errorMessage" class="error-message">
          <Message severity="error">{{ errorMessage }}</Message>
        </div>

        <div>
          <Button 
            class="create-orchestra-view__form-button"
            @click.prevent="handleOrchestraCreation"
            :disabled="loading"
            :label="loading ? 'Creating...' : 'Create'" 
          ></Button>
        </div>
      </div>
    </Fluid>
  </Form>
</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import { Form } from '@primevue/forms';
import Fluid from 'primevue/fluid';
import FloatLabel from 'primevue/floatlabel';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Message from 'primevue/message';
import FileUpload from 'primevue/fileupload';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
const toast = useToast();

import {
  messageValidationInput, 
  messageInputRequired, 
  messageValidationInputLength, 
  messageValidationWhitespaces,
  messageValidationEmail,
  messageValidationLink,
  validateNameLength, 
  validateWhitespaces,
  validateEmail, 
  validateFacebookLink, 
  validateInstagramLink, 
  validateYouTubeLink, 
} from '@/constants/validation/orchestraCreationValidation';
import type { TOrchestra } from '../types/TOrchestra';
import { initOrchestra } from '@/constants/initOrchestra';

const orchestra = ref<TOrchestra>(initOrchestra);

const loading = ref(false);
const errorMessage = ref('');
const showNameErrors = ref(false);
const showEmailErrors = ref(false);

const isNameValid = computed(() => orchestra.value.name && validateNameLength(orchestra.value.name) && validateWhitespaces(orchestra.value.name));
const isEmailValid = computed(() => !orchestra.value.email || validateEmail(orchestra.value.email));

const validateNameInput = () => {
  showNameErrors.value = true;
}
const validateEmailInput = () => {
  showEmailErrors.value = true;
}

const showErrors = () => {
  showNameErrors.value = true;
  showEmailErrors.value = true;
};

const onFileSelect = async (event) => {
  const file = event.files[0];
  if (file) {
    orchestra.value.logo = await fileToBase64(file) as string;
  }
};

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const removeFileCallback = (file) => {
  console.log(file);
  orchestra.value.logo = null;
};

const handleOrchestraCreation = () => {
  console.log('Button clicked! Inside handleOrchestraCreation function');

  if (!isNameValid.value || !isEmailValid.value) {
    showErrors();
    return;
  }

  loading.value = true;
  errorMessage.value = '';
}
</script>

<style>
</style>
