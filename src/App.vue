<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ref } from 'vue'

const headerItems = ref([
  { label: 'Home', route: '/' },
  {
    label: 'Trees',
    items: [{ label: 'B-Tree', route: '/btree' }],
  },
  { label: 'About', route: '/about' },
])
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
      </Menubar>
    </header>
    <RouterView />
  </div>
</template>
