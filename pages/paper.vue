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
        <n-input-number v-model:value="formValue.year" placeholder="输入发表年份" />
      </n-form-item>
      <n-form-item label="类型" path="type">
        <n-select v-model:value="formValue.type" class="w-60" :options="typeOptions" />
      </n-form-item>
      <n-form-item label="级别" path="level">
        <n-select v-model:value="formValue.level" class="w-60" :options="levelOptions" />
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
// 论文名称，发表源，年份，类型，级别，作者，通讯作者
const formValue = ref({
  name: '',
  origin: '',
  year: new Date().getFullYear(),
  type: '',
  level: '',
  authors: [],
  communicationAuthor: null
})

const typeOptions = [
  {
    label: '任意',
    value: ''
  },
  {
    label: 'full',
    value: 'FULL'
  },
  {
    label: 'short',
    value: 'SHORT'
  },
  {
    label: 'other',
    value: 'POSTER'
  },
  {
    label: 'demo',
    value: 'DEMO'
  }
]

const levelOptions = [
  {
    label: '任意',
    value: ''
  },
  {
    label: 'CCF_A',
    value: 'CCF_A'
  },
  {
    label: 'CCF_B',
    value: 'CCF_B'
  },
  {
    label: 'CCF_C',
    value: 'CCF_C'
  },
  {
    label: '中文 CCF_A',
    value: 'Chinese_CCF_A'
  },
  {
    label: '中文 CCF_B',
    value: 'Chinese_CCF_B'
  },
  {
    label: '其他',
    value: 'None'
  }
]

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
      key: 'type'
    },
    {
      title: '级别',
      key: 'level'
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
      render (row: any) {
        return h(
          NButton,
          {
            size: 'small',
            onClick: () => { deletePaper(row.id) }
          },
          { default: () => '删除' }
        )
      }
    }
  ]
}
const columns = createColumns()
const paperTableData = ref([] as any[])
const queryPaper = async () => {
  // name, origin, year, type, level, authors 作为 GET 的 url 参数
  const param = Object.entries(formValue.value).map(([key, value]) => {
    if (key === 'authors') {
      return [key, (value as string[]).join(',')]
    }
    return [key, value]
  })
  const query = param.filter(([_, value]) => value).map(([key, value]) => `${key}=${value}`).join('&')
  const data = await fetch(encodeURI(`/api/papers?${query}`))
  const res = await data.json()
  paperTableData.value.splice(0, paperTableData.value.length)
  paperTableData.value.push(...res.map((paper: any) => {
    return {
      ...paper,
      authors: paper.TeacherOnPaper.map((teacher: { teacher: { name: any; }; }) => teacher.teacher.name).join(','),
      communicationAuthor: paper.TeacherOnPaper.filter((teacher: { is_communicating_author: any; }) => teacher.is_communicating_author).map((teacher: { teacher: { name: any; }; }) => teacher.teacher.name).join(',')
    }
  }))
}
const newPaper = async () => {
  const data = await fetch('/api/papers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formValue.value)
  })
  const res = await data.json()
  paperTableData.value.splice(0, paperTableData.value.length)
  paperTableData.value.push({
    ...formValue.value,
    id: res.paper.id,
    authors: formValue.value.authors.map((author: string) => teachers.value?.find(t => t.id === author)?.name).join(','),
    communicationAuthor: teachers.value?.find(t => t.id === formValue.value.communicationAuthor)?.name
  })
}
const deletePaper = async (id: number) => {
  await fetch('/api/papers', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id })
  })
  await queryPaper()
}
</script>

<style scoped>
.n-form-item{
  margin: 0em 1em;
}
</style>
