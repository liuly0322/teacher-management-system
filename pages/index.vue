<template>
  <div>
    <!-- submit new teacher -->
    <n-form
      ref="formRef"
      inline
      :label-width="80"
      :model="formValue"
      size="medium"
    >
      <n-form-item label="工号" path="id">
        <n-input v-model:value="formValue.id" maxlength="5" placeholder="输入工号" />
      </n-form-item>
      <n-form-item label="姓名" path="name">
        <n-input v-model:value="formValue.name" placeholder="输入姓名" />
      </n-form-item>
      <n-form-item label="性别" path="gender">
        <n-select v-model:value="formValue.gender" class="w-40" :options="genderMap" />
      </n-form-item>
      <n-form-item label="职称" path="title">
        <n-select v-model:value="formValue.title" class="w-40" :options="teacherTitleMap" />
      </n-form-item>
      <n-form-item>
        <n-button attr-type="button" @click="newTeacher">
          提交
        </n-button>
      </n-form-item>
    </n-form>
    <n-data-table
      :columns="columns"
      :data="teacherTableData??[]"
      :pagination="false"
      :bordered="false"
    />
  </div>
</template>

<script setup lang="ts">
// fetch teachers
import { teacherTitleMap, genderMap } from '~/types'
const { data: teachers, refresh } = useFetch('/api/teachers')
const formValue = ref({
  id: '',
  name: '',
  gender: 'MALE',
  title: 'PROFESSOR'
})

const newTeacher = async () => {
  await fetch('/api/teachers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formValue.value)
  })
  await refresh()
}
const createColumns = () => {
  return [
    {
      title: '工号',
      key: 'id'
    },
    {
      title: '姓名',
      key: 'name'
    },
    {
      title: '性别',
      key: 'gender'
    },
    {
      title: '职称',
      key: 'title'
    }
  ]
}
const columns = createColumns()
const teacherTableData = computed(() => teachers.value?.map((teacher: any) => {
  return {
    ...teacher,
    title: teacherTitleMap.find(t => t.value === teacher.title)?.label,
    gender: genderMap.find(g => g.value === teacher.gender)?.label
  }
}))
</script>
