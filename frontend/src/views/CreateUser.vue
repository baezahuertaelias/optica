<template>
  <div class="p-3">
    <h1>{{ isNew ? "Crear Usuario" : "Modificar Usuario" }}</h1>
    <form @submit.prevent="saveUser">
      <InputText v-model="user.username" placeholder="Username" required />
      <Password
        v-model="user.password"
        placeholder="Password"
        required
      />
      <Dropdown
        v-model="user.userTypeId"
        :options="userTypes"
        optionLabel="type"
        optionValue="id"
        placeholder="Select User Type"
        required
      />
      <InputSwitch v-model="user.status" trueValue="true" falseValue="false" />
      <Button label="Guardar" class="mt-3" type="submit"/>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import InputSwitch from 'primevue/inputswitch'
import apiClient from '../axios-config'

const router = useRouter()
const route = useRoute()

// State to hold user data
const user = ref({
  username: '',
  password: '',
  userTypeId: null,
  status: true
})

const isNew = ref(true)
const userTypes = ref([])

onMounted(() => {
  const userId = route.query.id || route.params.id // Use query or params to get the ID
  console.log('onmounted userid', userId);
  
  if (userId) {
    isNew.value = false
    fetchUser(userId)
  }
  fetchUserTypes()
})

const fetchUser = async (id) => {
  try {
    const response = await apiClient.get(`/users/${id}`)
 
    if (response.status === 200) {
      console.log(`fetchUser with ID=${id}`, response.data.user);
      
      user.value = response.data.user
    }
  } catch (error) {
    console.error('Failed to fetch user:', error)
  }
}

const fetchUserTypes = async () => {
  try {
    
    const response = await apiClient.get('users/types/usertypes')
    
    if (response.status === 200) {
      userTypes.value = response.data.userTypes
    }
  } catch (error) {
    console.error('Failed to fetch user types:', error)
  }
}

const saveUser = async () => {
  try {
    const userData = { ...user.value }

    // Hash the password before saving if it's a new user or password is changed
    if (isNew.value || user.value.password) {
      userData.password = await bcrypt.hash(user.value.password, 10)
    } else {
      delete userData.password // Remove password field for update if not changed
    }

    let response
    if (isNew.value) {
      response = await apiClient.post('/users', userData)
    } else {
      response = await apiClient.put(`/users/${user.value.id}`, userData)
    }

    if (response.status === 200 || response.status === 201) {
      router.push({ name: 'listUser' })
    }
  } catch (error) {
    console.error('Failed to save user:', error)
  }
}
</script>

<style scoped>
.page-container {
  padding: 1rem;
}

.card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.field {
  margin-bottom: 1rem;
}

.w-100 {
  width: 100%;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}
</style>