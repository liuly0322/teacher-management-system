<template>
  <div>
    <n-form
      ref="formRef"
      class="flex flex-wrap"
      :label-width="80"
      :model="formValue"
      size="medium"
    >
      <n-form-item label="课程" path="id">
        <n-select v-model:value="formValue.id" class="w-60" clearable placeholder="选择课程" :options="classOptions" />
      </n-form-item>
      <n-form-item label="年份" path="year">
        <n-input-number v-model:value="formValue.year" placeholder="输入发表年份" />
      </n-form-item>
      <n-form-item label="学期" path="year">
        <n-select v-model:value="formValue.term" class="w-60" clearable placeholder="选择学期" :options="classTermMap" />
      </n-form-item>
      <n-form-item>
        <n-dynamic-input v-model:value="formValue.teachHours" :on-create="onCreate">
          <template #create-button-default />
          <template #default="{ value }">
            <div class="flex">
              <n-select v-model:value="value.teacherId" class="w-60" clearable placeholder="选择教师" :options="teacherOptions" />
              <n-input-number
                v-model:value="value.num"
                style="margin-right: 12px; width: 160px"
              />
            </div>
          </template>
        </n-dynamic-input>
      </n-form-item>
      <n-form-item>
        <n-button attr-type="button" @click="queryTeachClass">
          查询课程
        </n-button>
      </n-form-item>
      <n-form-item>
        <n-button attr-type="button" @click="newTeachClass">
          新增课程
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
import { NButton } from 'naive-ui'
import { classTermMap } from '~/types'
const { data: classes } = useFetch('/api/classes')
const classOptions = computed(() => {
  return classes.value?.map((class_) => {
    return {
      label: `${class_.name}(${class_.total_class_hour})`,
      value: class_.id
    }
  })
})
const { data: teachers } = useFetch('/api/teachers')
const teacherOptions = computed(() => {
  return teachers.value?.map((teacher) => {
    return {
      label: teacher.name,
      value: teacher.id
    }
  })
})
const onCreate = () => {
  return {
    teacherId: null,
    num: 0
  }
}

const formValue = ref({
  id: null,
  term: 'SPRING',
  year: new Date().getFullYear(),
  teachHours: [{
    teacherId: null,
    num: 0
  }]
})

const createColumns = () => {
  return [
    {
      title: '课程号',
      key: 'id'
    },
    {
      title: '课程',
      key: 'class'
    },
    {
      title: '年份',
      key: 'year'
    },
    {
      title: '学期',
      key: 'term'
    },
    {
      title: '教师',
      key: 'teacher'
    },
    {
      title: '承担课时',
      key: 'classHour'
    },
    {
      title: '操作',
      key: 'actions',
      render (row: any) {
        return h(
          NButton,
          {
            size: 'small',
            onClick: () => { deleteTeachClass(row) }
          },
          { default: () => '删除' }
        )
      }
    }
  ]
}
const columns = createColumns()
const classTableData = ref([] as any[])
const queryTeachClass = async () => {
  // 请求 classId 参数即可
  const { data: teachClasses } = await useFetch('/api/teachClasses', {
    query: formValue.value.id
      ? {
          classId: formValue.value.id
        }
      : {}
  })

  classTableData.value = teachClasses.value!.map((teachClass) => {
    return {
      id: teachClass.classId,
      class: classes.value?.find(class_ => class_.id === teachClass.classId)?.name,
      year: teachClass.year,
      term: classTermMap.find(term => term.value === teachClass.term)?.label,
      teacher: teachers.value?.find(teacher => teacher.id === teachClass.teacherId)?.name,
      classHour: teachClass.class_hour
    }
  })
}
const newTeachClass = async () => {
  const resp = await fetch('/api/teachClasses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formValue.value)
  })
  if (resp.status === 500) {
    const res = await resp.json()
    alert(res.message)
    return
  }
  await queryTeachClass()
}
const deleteTeachClass = async (row: { id: any; year: any; term: any; }) => {
  await fetch('/api/teachClasses', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id: row.id, year: row.year, term: row.term })
  })
  await queryTeachClass()
}
</script>

<style scoped>
.n-form-item{
  margin: 0em 1em;
}
</style>
