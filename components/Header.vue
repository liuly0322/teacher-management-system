<script setup lang="ts">
import { RouterLink } from 'vue-router'
const router = useRouter()
const routePath = useRoute()

const menuOptions = [
  {
    label: '添加教师',
    to: '/',
    match: '/$'
  },
  {
    label: '添加课程',
    to: 'class',
    match: '/class$'
  },
  {
    label: '发表论文',
    to: '/paper',
    match: '/paper$'
  },
  {
    label: '承担项目',
    to: '/project',
    match: '/project$'
  },
  {
    label: '主讲课程',
    to: '/teachClass',
    match: '/teachClass$'
  },
  {
    label: '个人统计',
    to: '/info',
    match: '/info$'
  }
]
</script>

<template>
  <header class="p-2.5">
    <n-card
      content-style="display:flex;align-items:center;justify-content:space-between"
    >
      <div class="flex items-center">
        <img
          src="https://q2.qlogo.cn/g?b=qq&nk=453026205&s=100"
          alt="liuly"
          class="rounded-full cursor-pointer"
          height="48"
          width="48"
          @click="router.push('/')"
        >
        <span class="pl-5 text-lg">教师教学科研登记系统</span>
      </div>
      <div class="inline-flex">
        <RouterLink
          v-for="option in menuOptions"
          :key="option.to"
          class="block px-5"
          :style="routePath.path.match(option.match) ? 'color: #42b883' : ''"
          :to="option.to"
        >
          {{ option.label }}
        </RouterLink>
      </div>
    </n-card>
  </header>
</template>
