<template>
  <div>
    <n-layout class="m-auto max-w-6xl">
      <n-layout-header>
        <Header />
      </n-layout-header>
      <n-layout-content content-style="padding: 24px;">
        <NuxtPage />
      </n-layout-content>
    </n-layout>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: '教务管理系统'
})
</script>
