import { TeacherTitle, Gender, classType, PaperType, PaperLevel, ProjectType, Term } from '@prisma/client'

export const genderMap: Array<{label:string, value: Gender}> = [
  {
    label: '男',
    value: 'MALE'
  },
  {
    label: '女',
    value: 'FEMALE'
  }
]

export const teacherTitleMap: Array<{label: string, value: TeacherTitle}> = [
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

export const classTypeMap: Array<{label:string, value: classType}> = [
  {
    label: '本科生课程',
    value: 'UNDERGRADUATE'
  },
  {
    label: '研究生课程',
    value: 'MASTER'
  }
]

export const paperTypeMap: Array<{label:string, value: PaperType}> = [
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

export const paperLevelMap: Array<{label: string, value: PaperLevel}> = [
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

export const projectTypeMap: Array<{label: string, value: ProjectType}> = [
  {
    label: '国家级项目',
    value: 'NATIONAL'
  },
  {
    label: '省级项目',
    value: 'PROVINCIAL'
  },
  {
    label: '市级项目',
    value: 'MUNICIPAL'
  },
  {
    label: '企业合作项目',
    value: 'ENTERPRISE'
  },
  {
    label: '其他项目',
    value: 'OTHER'
  }
]

export const classTermMap: Array<{label: string, value: Term}> = [
  {
    label: '春季学期',
    value: 'SPRING'
  },
  {
    label: '夏季学期',
    value: 'SUMMER'
  },
  {
    label: '秋季学期',
    value: 'AUTUMN'
  }
]
