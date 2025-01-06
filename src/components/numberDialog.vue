<template>
  <Form
    v-slot="$form"
    :resolver="resolver"
    @submit="onFormSubmit"
    class="flex flex-col gap-4 w-full sm:w-56"
  >
    <div class="flex flex-col gap-1">
      <InputText name="number" type="number" fluid />
      <Message v-if="$form.number?.invalid" severity="error" size="small" variant="simple">{{
        $form.number.error?.message
      }}</Message>
    </div>
    <Button type="submit" severity="secondary" label="Submit" />
  </Form>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'

const resolver = ref()
const dialogRef = inject('dialogRef')

resolver.value = ({ values }) => {
  const errors = {
    number: [],
  }

  const nr = parseInt(values.number)

  if (isNaN(nr)) {
    errors.number = [{ message: 'A number is required.' }]
  }

  return { errors, values }
}

const onFormSubmit = (e) => {
  if (e.valid) {
    dialogRef.value.close({
      number: e.values.number,
    })
  }
}
</script>
