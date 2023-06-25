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
        <n-select v-model:value="formValue.type" class="w-60" clearable placeholder="选择项目类型" :options="typeOptions" />
      </n-form-item>
      <n-form-item label="项目经费" path="fund">
        <n-input-number v-model:value="formValue.fund" placeholder="输入总经费">
          <template #prefix>
            ￥
          </template>
        </n-input-number>
      </n-form-item>
      <n-form-item label="起始年份" path="startYear">
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
import { ProjectType } from '@prisma/client'
import { NButton } from 'naive-ui'
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
  name: null,
  origin: null,
  type: null,
  fund: 0,
  startYear: new Date().getFullYear(),
  endYear: new Date().getFullYear(),
  teacherFunds: [{
    teacherId: null,
    num: 0
  }]
})

const typeOptions: Array<{label: string, value: ProjectType}> = [
  {
    label: '国家级',
    value: 'NATIONAL'
  },
  {
    label: '省级',
    value: 'PROVINCIAL'
  },
  {
    label: '市级别',
    value: 'MUNICIPAL'
  },
  {
    label: '企业合作',
    value: 'ENTERPRISE'
  },
  {
    label: '其他',
    value: 'OTHER'
  }
]

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
      key: 'type'
    },
    {
      title: '起始年份',
      key: 'year'
    },
    {
      title: '经费',
      key: 'fund',
      width: 200
    },
    {
      title: '操作',
      key: 'actions',
      render (row: any) {
        return h(
          NButton,
          {
            size: 'small',
            onClick: () => { deleteProject(row.id) }
          },
          { default: () => '删除' }
        )
      }
    }
  ]
}
const columns = createColumns()
const projectTableData = ref([] as any[])
const queryProject = async () => {
  const data = {
    ...formValue.value,
    fund: null,
    teacherFunds: null
  }
  const param = Object.entries(data).filter(([_, value]) => {
    return value
  }).map(([key, value]) => {
    return `${key}=${value}`
  }).join('&')
  const resp = await fetch(encodeURI(`/api/projects?${param}`))
  const json = await resp.json()
  projectTableData.value = json.map((project: { id: any; name: any; origin: any; type: any; start_year: any; end_year: any; TeacherOnProject: any[]; }) => {
    return {
      id: project.id,
      name: project.name,
      origin: project.origin,
      type: typeOptions.find(t => t.value === project.type)?.label,
      year: `${project.start_year}-${project.end_year}`,
      fund: project.TeacherOnProject.map((t) => {
        return `${t.teacher.name}(${t.fund})`
      }).join(',')
    }
  })
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
