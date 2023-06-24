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
        <n-select v-model:value="formValue.gender" class="w-40" :options="genderOptions" />
      </n-form-item>
      <n-form-item label="职称" path="title">
        <n-select v-model:value="formValue.title" class="w-40" :options="titleMap" />
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
import { TeacherTitle, Gender } from '@prisma/client'
const { data: teachers, refresh } = useFetch('/api/teachers')
const formValue = ref({
  id: '',
  name: '',
  gender: 'MALE',
  title: 'PROFESSOR'
})
const genderOptions: Array<{label:string, value: Gender}> = [
  {
    label: '男',
    value: 'MALE'
  },
  {
    label: '女',
    value: 'FEMALE'
  }
]
const titleMap: Array<{label: string, value: TeacherTitle}> = [
  {
    label: '教授',
    value: 'PROFESSOR'
  },
  {
    label: '特任教授',
    value: 'TENURED_PROFESSOR'
  },
  {
    label: '副教授',
    value: 'ASSOCIATE_PROFESSOR'
  },
  {
    label: '讲师',
    value: 'LECTURER'
  },
  {
    label: '助教',
    value: 'ASSISTANT_PROFESSOR'
  },
  {
    label: '博士后',
    value: 'POSTDOC'
  },
  {
    label: '助理研究员',
    value: 'ASSISTANT_RESEARCHER'
  },
  {
    label: '特任副研究员',
    value: 'TENURED_ASSOCIATE_RESEARCHER'
  },
  {
    label: '副研究员',
    value: 'ASSOCIATE_RESEARCHER'
  },
  {
    label: '特任研究员',
    value: 'TENURED_RESEARCHER'
  },
  {
    label: '研究员',
    value: 'RESEARCHER'
  }
]
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
const teacherTableData = computed(() => teachers.value?.map((t: any) => {
  const teacher = Object.assign({}, t)
  for (const title of titleMap) {
    if (title.value === teacher.title) {
      teacher.title = title.label
      break
    }
  }
  if (teacher.gender === 'MALE') {
    teacher.gender = '男'
  } else if (teacher.gender === 'FEMALE') {
    teacher.gender = '女'
  }
  return teacher
}))
</script>
