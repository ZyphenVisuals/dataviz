<template>
  <main class="flex-1 relative flex items-center">
    <div class="flex-1">
      <OrganizationChart :value="btree" v-if="btree.keys.length > 0">
        <template #default="slotProps">
          <div class="py-1">
            <div class="text-center">
              <span v-for="key in slotProps.node.keys" :key="key" class="px-1 py-0">
                {{ key }}
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
import setttingsDialog from '@/components/btree/settingsDialog.vue'
import confirmDialog from '@/components/confirmDialog.vue'

type BTreeNode = {
  keys: Array<number>
  children: Array<BTreeNode>
  styleClass?: string
  key: number
}

const btree = ref<BTreeNode>({
  keys: [],
  children: [],
  key: 0,
})
const branchingFactor = ref(3)
const stepMode = ref(false)

let globalKey = 1

const dialog = useDialog()
const toast = useToast()

async function wait() {
  return new Promise((resolve) => setTimeout(resolve, 1000))
}

async function inform(message: string, highlightNodes: Array<BTreeNode>) {
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

async function insertNonFull(node: BTreeNode, number: number) {
  let i = node.keys.length - 1

  if (node.children.length === 0) {
    await inform(
      `Inserting ${number} into ${node.keys.length > 0 ? 'node [' + node.keys.join(' ') + ']' : ' the root node'}...`,
      [node],
    )

    // insert the number into the node
    while (i >= 0 && number < node.keys[i]) {
      i--
    }

    // check the number is not already in the node
    if (node.keys.includes(number)) {
      showToast(`Number ${number} is already in the tree.`, 'error')
      return
    }

    node.keys.splice(i + 1, 0, number)
    showToast(`Number ${number} added.`, 'success')
  } else {
    await inform(`Searching children of node [${node.keys.join(' ')}]...`, [node])
    // find the child to insert into
    while (i >= 0 && number < node.keys[i]) {
      i--
    }
    i++

    // check the number is not already in the node
    if (node.keys.includes(number)) {
      showToast(`Number ${number} is already in the tree.`, 'error')
      return
    }

    // if the child is full, split it
    if (node.children[i].keys.length === 2 * branchingFactor.value - 1) {
      await inform(`Splitting child node [${node.children[i].keys.join(' ')}]...`, [
        node,
        node.children[i],
      ])

      splitChild(node, i)

      // determine which of the two children to insert into
      if (number > node.keys[i]) {
        i++
      }
    }

    await insertNonFull(node.children[i], number)
  }
}

function splitChild(parent: BTreeNode, index: number) {
  const child = parent.children[index]
  const newChild: BTreeNode = {
    keys: [],
    children: [],
    key: globalKey++,
  }

  // insert the new child into the parent
  parent.children.splice(index + 1, 0, newChild)

  // find the middle key
  const middle = Math.floor(child.keys.length / 2)
  const middleKey = child.keys[middle]

  // move the middle key to the parent
  parent.keys.splice(index, 0, middleKey)

  // move the right half of the keys to the new child
  newChild.keys = child.keys.splice(middle + 1)

  // move the right half of the children to the new child
  if (child.children.length > 0) {
    newChild.children = child.children.splice(middle + 1)
  }

  // remove the middle key from the child
  child.keys.pop()
}

async function addNumber(number: number) {
  // if the root is full, increase the height of the tree
  if (btree.value.keys.length === 2 * branchingFactor.value - 1) {
    await inform('Splitting root...', [btree.value])
    const newRoot = {
      keys: [],
      children: [btree.value],
      key: globalKey++,
    }
    btree.value = newRoot

    // split the old root
    splitChild(btree.value, 0)
  }

  // otherwise insert into it
  await insertNonFull(btree.value, number)
}

const showAddNumber = () => {
  dialog.open(numberDialog, {
    props: {
      header: 'Add number',
      modal: true,
    },
    onClose: (opt) => {
      addNumber(opt?.data.number)
    },
  })
}

const showRemoveNumber = () => {
  dialog.open(numberDialog, {
    props: {
      header: 'Remove number',
      modal: true,
    },
    onClose: (opt) => {
      console.log(opt)
      //removeNumber(opt?.data.number)
    },
  })
}

const showSettings = () => {
  dialog.open(setttingsDialog, {
    data: {
      branchingFactor: branchingFactor.value,
      stepMode: stepMode.value,
    },
    props: {
      header: 'Setttings',
      modal: true,
    },
    onClose: (opt) => {
      stepMode.value = opt?.data.stepMode

      if (branchingFactor.value !== opt?.data.branchingFactor && btree.value.keys.length > 0) {
        // warn user about losing data
        dialog.open(confirmDialog, {
          data: {
            message:
              'Changing the branching factor will clear the tree. Are you sure you want to continue?',
          },
          props: {
            header: 'Warning',
            modal: true,
          },
          onClose: (optC) => {
            console.log(opt)
            if (optC?.data.confirm) {
              branchingFactor.value = opt?.data.branchingFactor
              btree.value = {
                keys: [],
                children: [],
                key: 0,
              }
              globalKey = 1
            }
          },
        })
      } else {
        branchingFactor.value = opt?.data.branchingFactor
      }
    },
  })
}

onkeyup = (e: KeyboardEvent) => {
  if (e.key === '+') {
    showAddNumber()
  } else if (e.key === '-') {
    showRemoveNumber()
  } else if (e.key === 's') {
    showSettings()
  }
}
</script>
