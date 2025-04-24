import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)

  function setUser(newUser) {
    user.value = newUser
  }

  return { user, setUser }
})
