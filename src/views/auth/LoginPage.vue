<template>
  <div class="relative flex items-center justify-center min-h-screen w-full">
    <!-- Copyright -->
     <div class="absolute bottom-4 text-xs text-background text-center">
       &copy; 2025 CV Udumbara Informatika
     </div>
    <!-- Gradient Glow Border -->
    <div
      class="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary to-secondary opacity-30 blur-2xl animate-pulse">
    </div>
    <div class="relative w-[500px] sm:w-[420px] h-[420px] animate-floating">
      <!-- Logo di luar mask -->
      <div
        class="absolute z-10 -top-5 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-1 border-primary flex items-center justify-center">
        <img src="/images/logo.svg" alt="Logo" class="w-full h-full" />
      </div>
      <div class="relative flex flex-col items-center justify-center w-full h-full gap-2 p-4">
        <img src="/images/box-login.svg" alt="Login" class="w-full h-full absolute top-0 left-0" />
        <div class="mt-2 -mb-2 text-background text-lg font-medium animate-fade-in" style="letter-spacing: 0.05em">
          SELAMAT
          DATANG</div>
        <div class="mt-0 text-background text-lg animate-fade-in" style="letter-spacing: 0.05em">di Sistem
          Informasi Apotek</div>
        <div class=" -mb-2 mt-3 text-background text-xs font-thin animate-fade-in delay-200"
          style="letter-spacing: 0.2em">Harap Login untuk Melanjutkan</div>
        <div class="flex flex-col gap-4 my-4 w-full px-12 transition animate-fade-in delay-200">
          <u-input login label="Username" v-model="form.login" required :error="isError('login')"
            :error-message="errorMessage('login')" />
          <u-input login label="Password" type="password" v-model="form.password" required :error="isError('password')"
            :error-message="errorMessage('password')" @keydown.enter="handleSubmit" />

        </div>
        <!-- <div class="animate-fade-in delay-500">
          <u-checklist login label="Ingat saya" />
        </div> -->
        <div class="animate-fade-in delay-500">
          <u-btn :loading="store.loading" @click="handleSubmit" variant="secondary" label="Sign in" class="mt-2 " />
        </div>

      </div>

    </div>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useFormError } from '@/composables/useFormError'
import { useRouter } from 'vue-router'
import { useMenuStore } from '@/stores/menus'

const store = useAuthStore()
const router = useRouter()
const menustore = useMenuStore()
const form = ref({
  login: '',
  password: '',
})
const { isError, errorMessage } = useFormError(form.value, store)

async function handleSubmit(e) {
    e.preventDefault()
    e.stopPropagation()
    await store.login(form.value)
    
    .then(() => {
      store.getProfile()
      // .then(() => {
      //   if (store.user?.items?.length) {
      //     router.push({ path: '/admin' })
      //   } else {
      //     router.push({ path: '/login' })
      //   }
      //   // router.push({ path: '/admin' })
      //   // window.location.reload()
      // })
     
    })
}

watch(() => store.user, (newVal) => {
  console.log('User changed:', newVal)

  if (newVal) {
      window.location.reload()
        // router.push({ path: '/admin' })
      }
}, { immediate: true })

</script>

<style scoped>
.hexagon-mask {
  -webkit-mask-image: url("data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PScwIDAgMTAwIDEwMCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cGF0aCBmaWxsPSdibGFjaycgZD0nTTMgNTAgQzMgNDgsIDQgNDUsIDYgNDMgTDI3IDcgQzI5IDUsIDMyIDQsIDM1IDQgTDY1IDQgQzY4IDQsIDcxIDUsIDczIDcgTDk0IDQzIEM5NiA0NSwgOTcgNDgsIDk3IDUwIEM5NyA1MiwgOTYgNTUsIDk0IDU3IEw3MyA5MyBDNzEgOTUsIDY4IDk2LCA2NSA5NiBMMzUgOTYgQzMyIDk2LCAyOSA5NSwgMjcgOTMgTDYgNTcgQzQgNTUsIDMgNTIsIDMgNTAgWicvPjwvc3ZnPg==");
  -webkit-mask-size: 100% 100%;
  -webkit-mask-repeat: no-repeat;
  mask-image: url("data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PScwIDAgMTAwIDEwMCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cGF0aCBmaWxsPSdibGFjaycgZD0nTTMgNTAgQzMgNDgsIDQgNDUsIDYgNDMgTDI3IDcgQzI5IDUsIDMyIDQsIDM1IDQgTDY1IDQgQzY4IDQsIDcxIDUsIDczIDcgTDk0IDQzIEM5NiA0NSwgOTcgNDgsIDk3IDUwIEM5NyA1MiwgOTYgNTUsIDk0IDU3IEw3MyA5MyBDNzEgOTUsIDY4IDk2LCA2NSA5NiBMMzUgOTYgQzMyIDk2LCAyOSA5NSwgMjcgOTMgTDYgNTcgQzQgNTUsIDMgNTIsIDMgNTAgWicvPjwvc3ZnPg==");
  mask-size: 100% 100%;
  mask-repeat: no-repeat;
}


@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-up {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease forwards;
}

.animate-slide-up {
  animation: slide-up 1s ease forwards;
}

.delay-200 {
  animation-delay: 0.2s;
}

.delay-500 {
  animation-delay: 0.5s;
}


/* Floating Anim */
@keyframes floating {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-floating {
  animation: floating 4s ease-in-out infinite;
}
</style>