<template>
  <main class="flex-1 relative flex items-center">
    <div class="flex-1">
      <h1 class="text-center text-2xl font-bold text-muted-color" v-if="data.label === undefined">
        Insert an element to get started
      </h1>
      <OrganizationChart :value="data" v-else>
        <template #default="slotProps">
          <span>{{ slotProps.node.label }}</span>
        </template>
      </OrganizationChart>
    </div>
    <div>
      <ButtonGroup class="absolute bottom-8 left-1/2 -translate-x-1/2">
        <Button
          icon="pi pi-plus"
          rounded
          severity="secondary"
          raised
          @click="showAddNumber"
        ></Button>
        <Button
          icon="pi pi-minus"
          rounded
          severity="secondary"
          raised
          @click="showRemoveNumber"
        ></Button>
      </ButtonGroup>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDialog } from 'primevue/usedialog'
import { useToast } from 'primevue/usetoast'

import numberDialog from '@/components/numberDialog.vue'

const data = ref({})
const dialog = useDialog()
const toast = useToast()

function showToast(message: string, severity: 'success' | 'info' | 'error') {
  switch (severity) {
    case 'success':
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: message,
        life: 3000,
      })
      break

    case 'info':
      toast.add({
        severity: 'info',
        summary: 'Info',
        detail: message,
        life: 1000,
      })
      break

    case 'error':
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: message,
      })
      break

    default:
      break
  }
}

function addNumber(number) {
  data.value.label += ' ' + number
  showToast(`Number ${number} added.`, 'success')
}

const showAddNumber = () => {
  dialog.open(numberDialog, {
    props: {
      header: 'Pick a number',
      modal: true,
    },
    onClose: (opt) => {
      addNumber(opt.data.number)
    },
  })
}
</script>
