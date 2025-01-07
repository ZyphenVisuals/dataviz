<template>
  <p>{{ dialogRef.data.message }}</p>
  <div class="flex gap-4 pt-4 justify-end">
    <Button label="No" severity="secondary" @click="denyAndQuit"></Button>
    <Button label="Yes" severity="danger" @click="confirmAndQuit"></Button>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dialogRef: any = inject('dialogRef')

const confirmAndQuit = () => {
  dialogRef.value.close({
    confirm: true,
  })
}

const denyAndQuit = () => {
  dialogRef.value.close({
    confirm: false,
  })
}
</script>
