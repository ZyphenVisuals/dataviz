<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'

const headerItems = ref([
  { label: 'Home', route: '/' },
  {
    label: 'Trees',
    items: [
      { label: 'Binary Search Tree', route: '/bst' },
      { label: 'B-Tree', route: '/btree' },
    ],
  },
  { label: 'About', route: '/about' },
])

const darkMode = ref(false)

function toggleDarkMode() {
  document.documentElement.classList.toggle('dark-mode')
  darkMode.value = !darkMode.value

  localStorage.setItem('darkMode', darkMode.value.toString())
}

onMounted(() => {
  // check local storage
  if (localStorage.getItem('darkMode') === 'true') {
    toggleDarkMode()
    return
  } else if (localStorage.getItem('darkMode') === 'false') {
    return
  }

  // check device preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    toggleDarkMode()
  }
})
</script>

<template>
  <DynamicDialog></DynamicDialog>
  <Toast position="bottom-right"></Toast>
  <div class="flex flex-col min-h-screen">
    <header class="p-4">
      <Menubar :model="headerItems">
        <template #item="{ item, props, hasSubmenu }">
          <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
            <a v-ripple :href="href" v-bind="props.action" @click="navigate">
              <span :class="item.icon" />
              <span>{{ item.label }}</span>
            </a>
          </router-link>
          <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
            <span :class="item.icon" />
            <span>{{ item.label }}</span>
            <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down" />
          </a>
        </template>
        <template #end>
          <Button
            :icon="'pi ' + (darkMode ? 'pi-moon' : 'pi-sun')"
            variant="outlined"
            severity="secondary"
            @click="toggleDarkMode"
          ></Button>
        </template>
      </Menubar>
    </header>
    <RouterView />
  </div>
</template>
