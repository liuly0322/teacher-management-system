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
        <n-select v-model:value="formValue.type" class="w-60" :options="classTypeMap" />
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
import { classTypeMap } from '~/types'
const { data: classes, refresh } = useFetch('/api/classes')
const formValue = ref({
  id: '',
  name: '',
  type: 'UNDERGRADUATE',
  totalClassHour: 0
})
const newCourse = async () => {
  await useFetch('/api/classes', {
    method: 'post',
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
const classTableData = computed(() => classes.value?.map((class_) => {
  return {
    ...class_,
    type: classTypeMap.find(c => c.value === class_.type)?.label
  }
}))
</script>
