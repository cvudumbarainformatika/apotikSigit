import { computed, watch } from 'vue'

export function useFormError(formRef, store) {


  const error = computed(() => {
    const err = store.error
    const isValidationError = err?.status === 422
    if (isValidationError) {
      return err?.response?.data?.errors
    }
    return null
  })

  function isError(field) {
    return !!error.value?.[field]
  }

  function errorMessage(field) {
    return error.value?.[field]?.[0] ?? null
  }

  watch(
    () => ({ ...formRef }),
    (newForm, oldForm) => {
      // console.log('🔥 watch form', newForm, oldForm);
      
      for (const key in newForm) {
        if (newForm[key] !== oldForm[key]) {
          store.clearFieldError(key)
        }
      }
    },
    { deep: true }
  )

  return {
    error,
    isError,
    errorMessage
  }
}
