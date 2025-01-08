<template>
  <Form
    v-slot="$form"
    :resolver="resolver"
    :initialValues="initialValues"
    @submit="onFormSubmit"
    class="flex flex-col gap-4 w-full sm:w-56"
  >
    <div class="flex flex-col gap-1">
      <label for="branchingFactor" class="pb-2"
        >Branching factor (t)<span
          class="pi pi-question-circle ml-2"
          v-tooltip="'The number of keys will be between t&#8209;1 and 2t&#8209;1.'"
        ></span>
      </label>
      <InputText name="branchingFactor" type="number" fluid />
      <Message
        v-if="$form.branchingFactor?.invalid"
        severity="error"
        size="small"
        variant="simple"
        >{{ $form.branchingFactor.error?.message }}</Message
      >
    </div>
    <div class="flex flex-col gap-1">
      <label for="stepMode" class="pb-2">Step by step</label>
      <Checkbox name="stepMode" fluid binary />
      <Message v-if="$form.stepMode?.invalid" severity="error" size="small" variant="simple">{{
        $form.stepMode.error?.message
      }}</Message>
    </div>
    <div class="flex flex-col gap-1">
      <label for="speed" class="pb-2">Animation delay</label>
      <Slider name="speed" fluid :min="500" :max="3000" :step="100" />
      <span class="pt-2">{{ $form.speed?.value }} ms</span>
      <Message v-if="$form.speed?.invalid" severity="error" size="small" variant="simple">{{
        $form.speed.error?.message
      }}</Message>
    </div>
    <Button type="submit" severity="secondary" label="Save" />
  </Form>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'

const resolver = ref()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dialogRef: any = inject('dialogRef')

const initialValues = {
  branchingFactor: dialogRef.value.data.branchingFactor,
  stepMode: dialogRef.value.data.stepMode,
  speed: dialogRef.value.data.speed,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
resolver.value = ({ values }: any) => {
  const errors: { branchingFactor: Array<object>; stepMode: Array<object>; speed: Array<object> } =
    {
      branchingFactor: [],
      stepMode: [],
      speed: [],
    }

  const bf = parseInt(values.branchingFactor)

  if (isNaN(bf)) {
    errors.branchingFactor = [{ message: 'Must be a number.' }]
  }

  if (bf < 2) {
    errors.branchingFactor = [{ message: 'Must be at least 2.' }]
  }

  if (bf > 10) {
    errors.branchingFactor = [{ message: 'Must be at most 10.' }]
  }

  if (values.stepMode === undefined) {
    errors.stepMode = [{ message: 'Must be a boolean.' }]
  }

  if (values.speed < 500) {
    errors.speed = [{ message: 'Must be at least 500.' }]
  }

  if (values.speed > 3000) {
    errors.speed = [{ message: 'Must be at most 3000.' }]
  }

  return { errors, values }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onFormSubmit = (e: any) => {
  if (e.valid) {
    dialogRef.value.close({
      branchingFactor: parseInt(e.values.branchingFactor),
      stepMode: e.values.stepMode,
      speed: e.values.speed,
    })
  }
}
</script>
