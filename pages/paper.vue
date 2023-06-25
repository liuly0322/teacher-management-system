<template>
  <div>
    <n-form
      ref="formRef"
      class="flex flex-wrap"
      :label-width="80"
      :model="formValue"
      size="medium"
    >
      <n-form-item label="论文名称" path="name">
        <n-input v-model:value="formValue.name" maxlength="255" placeholder="输入论文名称" />
      </n-form-item>
      <n-form-item label="发表源" path="origin">
        <n-input v-model:value="formValue.origin" placeholder="输入发表源" />
      </n-form-item>
      <n-form-item label="年份" path="year">
        <n-input-number v-model:value="formValue.year" clearable placeholder="输入发表年份" />
      </n-form-item>
      <n-form-item label="类型" path="type">
        <n-select v-model:value="formValue.type" clearable placeholder="选择类型" class="w-60" :options="paperTypeMap" />
      </n-form-item>
      <n-form-item label="级别" path="level">
        <n-select v-model:value="formValue.level" clearable placeholder="选择级别" class="w-60" :options="paperLevelMap" />
      </n-form-item>
      <n-form-item label="作者" path="authors">
        <n-select v-model:value="formValue.authors" class="w-60" multiple placeholder="选择作者" :options="teacherOptions" />
      </n-form-item>
      <n-form-item label="通讯作者" path="communicationAuthor">
        <n-select v-model:value="formValue.communicationAuthor" class="w-40" placeholder="选择作者" clearable :options="teacherOptions" />
      </n-form-item>
      <n-form-item>
        <n-button attr-type="button" @click="queryPaper">
          查询论文
        </n-button>
      </n-form-item>
      <n-form-item>
        <n-button attr-type="button" @click="newPaper">
          新增论文
        </n-button>
      </n-form-item>
    </n-form>
    <n-data-table
      :columns="columns"
      :data="paperTableData??[]"
      :pagination="false"
      :bordered="false"
    />
  </div>
</template>

<script setup lang="ts">
import { PaperLevel, PaperType } from '@prisma/client'
import { NButton } from 'naive-ui'
import { paperTypeMap, paperLevelMap } from '~/types'
const { data: teachers } = useFetch('/api/teachers')
const teacherOptions = computed(() => {
  return teachers.value?.map((teacher) => {
    return {
      label: teacher.name,
      value: teacher.id
    }
  })
})
// 论文名称，发表源，年份，类型，级别，作者，通讯作者
const formValue = ref({
  name: '',
  origin: '',
  year: new Date().getFullYear(),
  type: null as (null | PaperType),
  level: null as (null | PaperLevel),
  authors: [] as string[],
  communicationAuthor: null as (null | string)
})

type rowType = Exclude<ReturnType<
    typeof useFetch<void, unknown, '/api/papers'>
  >['data']['value'], null>[number];
const createColumns = () => {
  return [
    {
      title: '论文号',
      key: 'id'
    },
    {
      title: '论文名',
      key: 'name',
      width: 400
    },
    {
      title: '论文源',
      key: 'origin'
    },
    {
      title: '发表年份',
      key: 'year'
    },
    {
      title: '类型',
      key: 'type_'
    },
    {
      title: '级别',
      key: 'level_'
    },
    {
      title: '作者',
      key: 'authors'
    },
    {
      title: '通讯作者',
      key: 'communicationAuthor'
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
              formValue.value.name = row.name
              formValue.value.origin = row.origin
              formValue.value.year = row.year
              formValue.value.type = row.type
              formValue.value.level = row.level
              formValue.value.authors = row.TeacherOnPaper.map(t => t.teacher.id)
              formValue.value.communicationAuthor = row.TeacherOnPaper.find(t => t.is_communicating_author)!.teacher.id
            }
          },
          { default: () => '同步' }
        ), h(
          NButton,
          {
            size: 'small',
            onClick: () => { deletePaper(row.id) }
          },
          { default: () => '删除' }
        )]
      }
    }
  ]
}
const columns = createColumns()
const paperTableData = ref([] as rowType[])
const queryPaper = async () => {
  // name, origin, year, type, level, authors 作为 GET 的 url 参数
  const query = { ...formValue.value, authors: formValue.value.authors.join(',') }
  const { data } = await useFetch('/api/papers', { query })
  paperTableData.value = data.value?.map((paper) => {
    return {
      ...paper,
      type_: paperTypeMap.find(p => p.value === paper.type)?.label,
      level_: paperLevelMap.find(p => p.value === paper.level)?.label,
      authors: paper.TeacherOnPaper.map(teacher => teacher.teacher.name).join(','),
      communicationAuthor: paper.TeacherOnPaper.filter(teacher => teacher.is_communicating_author).map(teacher => teacher.teacher.name).join(',')
    }
  }) || []
}
const newPaper = async () => {
  await useFetch('/api/papers', {
    method: 'post',
    body: JSON.stringify(formValue.value)
  })
  await queryPaper()
}
const deletePaper = async (id: number) => {
  await useFetch('/api/papers', {
    method: 'delete',
    body: { id }
  })
  await queryPaper()
}
</script>

<style scoped>
.n-form-item{
  margin: 0em 1em;
}
</style>
