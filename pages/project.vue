<template>
  <div>
    <n-form
      ref="formRef"
      class="flex flex-wrap"
      :label-width="80"
      :model="formValue"
      size="medium"
    >
      <n-form-item label="项目号" path="id">
        <n-input v-model:value="formValue.id" class="w-60" clearable placeholder="输入项目号" />
      </n-form-item>
      <n-form-item label="项目名称" path="name">
        <n-input v-model:value="formValue.name" placeholder="输入项目名称" />
      </n-form-item>
      <n-form-item label="项目来源" path="origin">
        <n-input v-model:value="formValue.origin" placeholder="输入项目来源" />
      </n-form-item>
      <n-form-item label="项目类型" path="type">
        <n-select v-model:value="formValue.type" class="w-60" clearable placeholder="选择项目类型" :options="projectTypeMap" />
      </n-form-item>
      <n-form-item label="项目经费" path="fund">
        <n-input-number v-model:value="formValue.fund" placeholder="输入总经费">
          <template #prefix>
            ￥
          </template>
        </n-input-number>
      </n-form-item>
      <n-form-item label="开始年份" path="startYear">
        <n-input-number v-model:value="formValue.startYear" clearable placeholder="开始年份" />
      </n-form-item>
      <n-form-item label="结束年份" path="endYear">
        <n-input-number v-model:value="formValue.endYear" clearable placeholder="结束年份" />
      </n-form-item>
      <n-form-item>
        <n-dynamic-input v-model:value="formValue.teacherFunds" :on-create="onCreate">
          <template #create-button-default />
          <template #default="{ value }">
            <div class="flex">
              <n-select v-model:value="value.teacherId" class="w-60" clearable placeholder="选择教师" :options="teacherOptions" />
              <n-input-number
                v-model:value="value.num"
                style="margin-right: 12px; width: 160px"
              >
                <template #prefix>
                  ￥
                </template>
              </n-input-number>
            </div>
          </template>
        </n-dynamic-input>
      </n-form-item>
      <n-form-item>
        <n-button attr-type="button" @click="queryProject">
          查询项目
        </n-button>
      </n-form-item>
      <n-form-item>
        <n-button attr-type="button" @click="newProject">
          新增项目
        </n-button>
      </n-form-item>
    </n-form>
    <n-data-table
      :columns="columns"
      :data="projectTableData??[]"
      :pagination="false"
      :bordered="false"
    />
  </div>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui'
import { projectTypeMap } from '~/types'
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
  id: null as null | string,
  name: null as null | string,
  origin: null as null | string,
  type: null as null | string,
  fund: 0,
  startYear: new Date().getFullYear(),
  endYear: new Date().getFullYear(),
  teacherFunds: [{
    teacherId: null as null | string,
    num: 0
  }]
})

type rowType = Exclude<ReturnType<
    typeof useFetch<void, unknown, '/api/projects'>
  >['data']['value'], null>[number];
const createColumns = () => {
  return [
    {
      title: '项目号',
      key: 'id'
    },
    {
      title: '项目名称',
      key: 'name',
      with: 400
    },
    {
      title: '项目来源',
      key: 'origin'
    },
    {
      title: '项目类型',
      key: 'type_'
    },
    {
      title: '起始年份',
      key: 'year_'
    },
    {
      title: '经费',
      key: 'fund_',
      width: 200
    },
    {
      title: '操作',
      key: 'actions',
      render (row: rowType) {
        return [h(
          NButton,
          {
            size: 'small',
            onClick: () => {
              formValue.value.id = row.id
              formValue.value.name = row.name
              formValue.value.origin = row.origin
              formValue.value.type = row.type
              formValue.value.fund = row.TeacherOnProject.reduce((acc, cur) => {
                return acc + cur.fund
              }, 0)
              formValue.value.startYear = row.start_year
              formValue.value.endYear = row.end_year
              formValue.value.teacherFunds = row.TeacherOnProject.map((teacher) => {
                return {
                  teacherId: teacher.teacher.id,
                  num: teacher.fund
                }
              })
            }
          },
          { default: () => '同步' }
        ), h(
          NButton,
          {
            size: 'small',
            onClick: () => { deleteProject(row.id) }
          },
          { default: () => '删除' }
        )]
      }
    }
  ]
}
const columns = createColumns()
const projectTableData = ref([] as rowType[])
const queryProject = async () => {
  const query = {
    ...formValue.value,
    fund: null,
    teacherFunds: null
  }
  const { data } = await useFetch('/api/projects', { query })
  projectTableData.value = data.value?.map((project) => {
    return {
      ...project,
      type_: projectTypeMap.find(t => t.value === project.type)!.label,
      year_: `${project.start_year}-${project.end_year}`,
      fund_: project.TeacherOnProject.map((t) => {
        return `${t.teacher.name}(${t.fund})`
      }).join(',')
    }
  }) || []
}
const newProject = async () => {
  const resp = await fetch('/api/projects', {
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
  await queryProject()
}
const deleteProject = async (id: string) => {
  await fetch('/api/projects', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id })
  })
  await queryProject()
}
</script>

<style scoped>
.n-form-item{
  margin: 0em 1em;
}
</style>
