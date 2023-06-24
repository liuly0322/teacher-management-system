<template>
  <div>
    <n-form
      ref="formRef"
      inline
      :label-width="80"
      :model="formValue"
      size="medium"
    >
      <n-form-item label="课程号" path="id">
        <n-input v-model:value="formValue.id" maxlength="255" placeholder="输入课程号" />
      </n-form-item>
      <n-form-item label="课程名" path="name">
        <n-input v-model:value="formValue.name" placeholder="输入课程名" />
      </n-form-item>
      <n-form-item label="课程类型" path="type">
        <n-select v-model:value="formValue.type" class="w-60" :options="typeOptions" />
      </n-form-item>
      <n-form-item label="课时" path="totalClassHour ">
        <n-input-number v-model:value="formValue.totalClassHour " placeholder="输入课时" />
      </n-form-item>
      <n-form-item>
        <n-button attr-type="button" @click="newCourse">
          提交
        </n-button>
      </n-form-item>
    </n-form>
    <n-data-table
      :columns="columns"
      :data="classTableData??[]"
      :pagination="false"
      :bordered="false"
    />
  </div>
</template>

<script setup lang="ts">
import { classType } from '@prisma/client'
const { data: classes, refresh } = useFetch('/api/classes')
const formValue = ref({
  id: '',
  name: '',
  type: 'UNDERGRADUATE',
  totalClassHour: 0
})
const typeOptions: Array<{label:string, value: classType}> = [
  {
    label: '本科生课程',
    value: 'UNDERGRADUATE'
  },
  {
    label: '研究生课程',
    value: 'MASTER'
  }
]
const newCourse = async () => {
  await fetch('/api/classes', {
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
      title: '课程号',
      key: 'id'
    },
    {
      title: '课程名',
      key: 'name'
    },
    {
      title: '课程类型',
      key: 'type'
    },
    {
      title: '课时',
      key: 'total_class_hour'
    }
  ]
}
const columns = createColumns()
const classTableData = computed(() => classes.value?.map((c: any) => {
  const class_ = Object.assign({}, c)
  if (class_.type === 'MASTER') {
    class_.type = '研究生课程'
  } else {
    class_.type = '本科生课程'
  }
  return class_
}))
</script>
