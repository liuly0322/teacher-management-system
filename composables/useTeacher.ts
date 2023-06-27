const { data: teachers } = useFetch('/api/teachers')

export default () => {
  return computed(() => {
    return teachers.value?.map((teacher) => {
      return {
        label: teacher.name,
        value: teacher.id
      }
    })
  })
}

export function teacherIdToName (id: string) {
  return teachers.value?.find(teacher => teacher.id === id)?.name
}
