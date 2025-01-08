<template>
  <main class="flex-1 relative flex items-center">
    <div class="flex-1">
      <OrganizationChart :value="bst" v-if="bst">
        <template #default="slotProps">
          <div class="py-1">
            <div class="text-center">
              <span :key="slotProps.node.key" class="px-1 py-0">
                {{ slotProps.node.label }}
              </span>
            </div>
          </div>
        </template>
      </OrganizationChart>
      <h1 v-else class="text-center text-2xl font-semibold text-muted-color">
        Insert an element to get started...
      </h1>
    </div>
    <div>
      <ButtonGroup class="absolute bottom-8 left-1/2 -translate-x-1/2">
        <Button
          icon="pi pi-plus"
          rounded
          severity="secondary"
          raised
          @click="showAddNumber"
          v-tooltip.top="'Add number (+)'"
        ></Button>
        <Button
          icon="pi pi-minus"
          rounded
          severity="secondary"
          raised
          @click="showRemoveNumber"
          v-tooltip.top="'Remove number (-)'"
        ></Button>
        <Button
          icon="pi pi-cog"
          rounded
          severity="secondary"
          raised
          @click="showSettings"
          v-tooltip.top="'Settings (s)'"
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
import setttingsDialog from '@/components/bst/settingsDialog.vue'

type BSTNode = {
  key: number
  label: number | undefined
  children: Array<BSTNode>
  styleClass?: string
}

const bst = ref<BSTNode | undefined>()
const stepMode = ref(false)
const speed = ref(1000)

const dialog = useDialog()
const toast = useToast()

let globalKey = 0
let freezeHotkeys = false

async function wait() {
  return new Promise((resolve) => setTimeout(resolve, speed.value))
}

async function inform(message: string, highlightNodes: Array<BSTNode>) {
  if (stepMode.value) {
    for (const highlightNode of highlightNodes) {
      highlightNode.styleClass = '!bg-primary !text-primary-contrast'
    }
    showToast(message, 'info')
    await wait()
    for (const highlightNode of highlightNodes) {
      delete highlightNode.styleClass
    }
  }
}

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
        life: speed.value,
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

async function addNumber(number: number) {
  if (bst.value === undefined) {
    bst.value = {
      key: globalKey++,
      label: number,
      children: [],
    }
    await inform(`Adding ${number} to the root`, [bst.value])
    showToast(`Number ${number} added`, 'success')
    return
  }

  let current = bst.value

  while (true) {
    await inform(`Searching in node [${current.label}]`, [current])
    if (number < (current.label as number)) {
      if (current.children[0] === undefined) {
        current.children.push({
          key: globalKey++,
          label: number,
          children: [],
        })
        current.children.push({
          key: globalKey++,
          label: undefined,
          children: [],
        })
        await inform(`Adding ${number} to the left of ${current.label}`, [current.children[0]])
        showToast(`Number ${number} added`, 'success')
        return
      } else if (current.children[0].label === undefined) {
        current.children[0].label = number
        await inform(`Adding ${number} to the left of ${current.label}`, [current.children[0]])
        showToast(`Number ${number} added`, 'success')
        return
      } else {
        current = current.children[0]
      }
    } else if (number > (current.label as number)) {
      if (current.children[1] === undefined) {
        current.children.push({
          key: globalKey++,
          label: undefined,
          children: [],
        })
        current.children.push({
          key: globalKey++,
          label: number,
          children: [],
        })
        await inform(`Adding ${number} to the right of ${current.label}`, [current.children[1]])
        showToast(`Number ${number} added`, 'success')
        return
      } else if (current.children[1].label === undefined) {
        current.children[1].label = number
        await inform(`Adding ${number} to the right of ${current.label}`, [current.children[1]])
        showToast(`Number ${number} added`, 'success')
        return
      } else {
        current = current.children[1]
      }
    } else {
      showToast(`Number ${number} already exists`, 'error')
      return
    }
  }
}

async function removeNumber(number: number) {
  if (bst.value === undefined) {
    showToast('Tree is empty', 'error')
    return
  }

  let current = bst.value

  while (true) {
    // inform the user that we are searching for the number
    await inform(`Searching in node [${current.label}]`, [current])

    // if the number is the node
    if (number === current.label) {
      // if the node is a leaf node
      if (current.children[0] === undefined) {
        // remove the node
        current.label = undefined
        await inform(`Removing ${number}`, [current])
        showToast(`Number ${number} removed`, 'success')
        return
      }

      // if the node has only one child
      if (current.children[0].label === undefined || current.children[1].label === undefined) {
        // remove the node and replace it with its child
        const child =
          current.children[0].label === undefined ? current.children[1] : current.children[0]
        current.label = child.label
        current.children = child.children
        await inform(`Removing ${number}`, [current])
        showToast(`Number ${number} removed`, 'success')
        return
      }

      // if the node has two children
      // find the smallest node in the right subtree
      let smallest = current.children[1]
      await inform(`Finding the smallest node in the right subtree of ${number}`, [smallest])
      while (smallest.children[0] !== undefined && smallest.children[0].label !== undefined) {
        smallest = smallest.children[0]
        await inform(`Finding the smallest node in the right subtree of ${number}`, [smallest])
      }

      await inform(
        `Found the smallest node [${smallest.label}] in the right subtree of ${number}`,
        [smallest],
      )

      // replace the node with the smallest node
      await inform(`Replacing ${number} with ${smallest.label}`, [current])
      current.label = smallest.label

      if (smallest.children[1] === undefined) {
        await inform(`Removing ${smallest.label}`, [smallest])
        smallest.label = undefined
      } else {
        await inform(`Replacing ${smallest.label} with its right child`, [
          smallest,
          smallest.children[1],
        ])
        smallest.label = smallest.children[1].label
        smallest.children[1].label = undefined
      }

      showToast(`Number ${number} removed`, 'success')
      return
    }

    if (number < (current.label as number)) {
      // if the number is less than the node
      if (current.children[0] === undefined || current.children[0].label === undefined) {
        showToast(`Number ${number} not found`, 'error')
        return
      }

      current = current.children[0]
    } else {
      // if the number is greater than the node
      if (current.children[1] === undefined || current.children[1].label === undefined) {
        showToast(`Number ${number} not found`, 'error')
        return
      }

      current = current.children[1]
    }
  }
}

function cleanUp(node: BSTNode) {
  if (bst.value === undefined) return

  if (bst.value.label === undefined) {
    bst.value = undefined
    return
  }

  if (node.children[0] !== undefined && node.children[0].label !== undefined) {
    cleanUp(node.children[0])
  }

  if (node.children[1] !== undefined && node.children[1].label !== undefined) {
    cleanUp(node.children[1])
  }

  if (
    node.children[0] !== undefined &&
    node.children[0].label === undefined &&
    node.children[1] !== undefined &&
    node.children[1].label === undefined
  ) {
    node.children = []
  }
}

const showAddNumber = () => {
  freezeHotkeys = true
  dialog.open(numberDialog, {
    props: {
      header: 'Add number',
      modal: true,
    },
    onClose: (opt) => {
      freezeHotkeys = false
      addNumber(opt?.data.number)
    },
  })
}

const showRemoveNumber = () => {
  freezeHotkeys = true
  dialog.open(numberDialog, {
    props: {
      header: 'Remove number',
      modal: true,
    },
    onClose: async (opt) => {
      freezeHotkeys = false
      await removeNumber(opt?.data.number)
      cleanUp(bst.value as BSTNode)
    },
  })
}

const showSettings = () => {
  freezeHotkeys = true
  dialog.open(setttingsDialog, {
    data: {
      stepMode: stepMode.value,
      speed: speed.value,
    },
    props: {
      header: 'Setttings',
      modal: true,
    },
    onClose: (opt) => {
      freezeHotkeys = false
      stepMode.value = opt?.data.stepMode
      speed.value = opt?.data.speed
    },
  })
}

onkeyup = (e: KeyboardEvent) => {
  if (freezeHotkeys) return

  if (e.key === '+') {
    showAddNumber()
  } else if (e.key === '-') {
    showRemoveNumber()
  } else if (e.key === 's') {
    showSettings()
  }
}
</script>
