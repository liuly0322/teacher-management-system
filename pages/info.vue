<template>
  <div>
    <div>
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
        <n-form-item label="开始年份" path="startYear">
          <n-input-number v-model:value="formValue.startYear" placeholder="输入开始年份" />
        </n-form-item>
        <n-form-item label="开始年份" path="startYear">
          <n-input-number v-model:value="formValue.endYear" placeholder="输入结束年份" />
        </n-form-item>
        <n-form-item>
          <n-button attr-type="button" @click="queryTeacher">
            查询
          </n-button>
        </n-form-item>
        <n-form-item>
          <n-button attr-type="button" @click="exportInfo">
            导出
          </n-button>
        </n-form-item>
      </n-form>
    </div>
    <div v-if="queryResult" id="info" class="max-w-2xl mx-auto">
      <div class="mx-4">
        <h1>教师教学科研工作统计（{{ formValue.startYear }}-{{ formValue.endYear }}）</h1>
        <div>
          <h2>教师基本信息</h2>
          <hr>
          <div class="flex">
            <div class="flex-item">
              工号：{{ queryResult.id }}
            </div>
            <div class="flex-item">
              姓名：{{ queryResult.name }}
            </div>
            <div class="flex-item">
              性别：{{ genderMap.find(g => g.value == queryResult.gender)?.label }}
            </div>
            <div class="flex-item">
              职称：{{ teacherTitleMap.find(t => t.value == queryResult.title)?.label }}
            </div>
          </div>
        </div>
        <div v-if="queryResult.TeacherOnClass.length > 0">
          <h2>教学情况</h2>
          <hr>
          <div v-for="class_ in queryResult.TeacherOnClass" :key="class_" class="flex">
            <div class="flex-item">
              课程号：{{ class_.class.id }}
            </div>
            <div class="flex-item">
              课程名称：{{ class_.class.name }}
            </div>
            <div class="flex-item">
              主讲学时：{{ class_.class_hour }}
            </div>
            <div class="flex-item">
              学期：{{ class_.year }} {{ classTermMap.find(c => c.value === class_.term)?.label }}
            </div>
          </div>
        </div>
        <div v-if="queryResult.TeacherOnPaper.length > 0">
          <h2>发表论文情况</h2>
          <hr>
          <div v-for="(paper, i) in queryResult.TeacherOnPaper" :key="paper">
            {{ i+1 }}：{{ paper.paper.name }}，{{ paper.paper.origin }}，{{ paper.paper.year }}，{{ paperLevelMap.find(p => p.value === paper.paper.level)?.label }}，排名第 {{ paper.rank }}
            <span v-if="paper.is_communicating_author">，通讯作者</span>
          </div>
        </div>
        <div v-if="queryResult.TeacherOnProject.length > 0">
          <h2>承担项目情况</h2>
          <hr>
          <div v-for="(project, i) in queryResult.TeacherOnProject" :key="project">
            {{ i+1 }}：{{ project.project.name }}，{{ project.project.origin }}，{{ projectTypeMap.find(p => p.value === project.project.type)?.label }}，{{ project.project.start_year }}—{{ project.project.end_year }}，总经费 {{ project.project.total_fund }}，承担经费 {{ project.fund }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { classTermMap, genderMap, paperLevelMap, projectTypeMap, teacherTitleMap } from '~/types'

const formValue = ref({
  id: null,
  startYear: new Date().getFullYear(),
  endYear: new Date().getFullYear()
})

const queryResult: Ref<any> = ref(null)
const queryTeacher = async () => {
  const { id, startYear, endYear } = formValue.value
  const { data: teacherInfo } = await useFetch('/api/teacherInfo', {
    query: { id, startYear, endYear }
  })
  queryResult.value = teacherInfo.value
}

const exportInfo = () => {
  if (typeof window.html2pdf === 'undefined') {
    function addScript (url: string) {
      const script = document.createElement('script')
      script.type = 'application/javascript'
      script.src = url
      document.head.appendChild(script)
    }
    addScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js')
  }
  const loop = setInterval(() => {
    if (typeof window.html2pdf !== 'undefined') {
      clearInterval(loop)
      window.html2pdf(document.getElementById('info'))
    }
  }, 100)
}
</script>

<style scoped>
#info h1 {
  margin-top: 2em;
  margin-bottom: 2em;
  text-align: center;
  font-size: 1.2em;
  font-weight: bold;
}

#info h2 {
  font-size: 1.1em;
  font-weight: bold;
}

#info .flex-item {
  margin: 0 20px 0 0;
}

#info hr+div, #info hr+ol {
  margin: 1em 0;
}
</style>
