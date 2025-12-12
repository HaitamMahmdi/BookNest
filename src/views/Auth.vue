<script setup>
import { useUserAuth } from "../stores/userAuth";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faFacebook,
  faGithub,
  faGoogle,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faUser, faEnvelope, faEye } from "@fortawesome/free-regular-svg-icons";
import {
  faInfoCircle,
  faExclamation,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { computed, reactive, ref } from "vue";
const isSignup = ref(true);
const userAuth = useUserAuth();
const user = computed(() => userAuth.user);
const features = ref(null);
const inputs = reactive({
  firstName: {
    text: "",
    isValid: false,
    validateFirst() {
      const regx = /^[a-zA-Z]+$/;
      if (regx.test(this.text)) {
        this.isValid = true;
      } else {
        this.isValid = false;
      }
    },
  },
  lastName: {
    text: "",
    isValid: false,
    validateLast() {
      const regx = /^[a-zA-Z]+$/;
      if (regx.test(this.text)) {
        this.isValid = true;
      } else {
        this.isValid = false;
      }
    },
  },
  email: {
    text: "",
    isValid: false,
    validateEmail() {
      const regx = /^[a-zA-Z0-9_]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
      if (!regx.test(this.text)) {
        this.isValid = false;
      }
      if (regx.test(this.text)) {
        this.isValid = true;
      }
    },
  },
  password: {
    text: "",
    isValid: false,
    validatePassword() {
      const regx =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      console.log(regx.test(this.text));
      if (!regx.test(this.text)) {
        this.isValid = false;
      }
      if (regx.test(this.text)) {
        this.isValid = true;
      }
    },
  },
  password2: {
    text: "",
    isValid: false,
  },
});

const leftButton = ref(null);
const rightButton = ref(null);
function scrollToLeft() {
  if (features.value.scrollLeft < 500) {
    leftButton.value.classList.add(`active`);
    rightButton.value.classList.remove(`active`);

    features.value.scrollTo({
      left: features.value.scrollLeft + 50,
      behavior: "smooth",
    });
    requestAnimationFrame(scrollToLeft);
  } else {
  }
}
function scrollToRight() {
  if (features.value.scrollLeft > 0) {
    leftButton.value.classList.remove(`active`);
    rightButton.value.classList.add(`active`);
    features.value.scrollTo({
      left: features.value.scrollLeft - 50,
      behavior: "smooth",
    });
    requestAnimationFrame(scrollToRight);
  }
}
const showError = ref("");
async function submit() {
  if (
    !inputs.email.isValid ||
    !inputs.firstName.isValid ||
    !inputs.lastName.isValid ||
    !inputs.password.isValid ||
    !inputs.password2.isValid
  ) {
    return (showError.value = "please fill the required fields");
  } else {
    showError.value = "";

    try {
      await userAuth.createAccount(inputs.email.text, inputs.password.text);
    } catch (error) {
      const mapErrors = {
        "auth/email-already-in-use": "This email is already registered. ",
        "auth/invalid-email": "Please enter a valid email.",
        "auth/weak-password": "Password must be at least 8 characters.",
      };
      showError.value = mapErrors[error.code];
    }
  }
}
async function loginUser() {
  if (!inputs.email.isValid || !inputs.password.isValid) {
    return (showError.value = "please fill the required fields");
  }
  try {
    await userAuth.signIn(inputs.email.text, inputs.email.text);
  } catch (error) {
    const mapErrors = {
      "auth/invalid-credential": "Incorrect email or password.",
      "auth/invalid-email": "Please enter a valid email.",
      "auth/user-disabled": "This account has been disabled.",
      "auth/user-not-found": "No account found with this email.",
      "auth/wrong-password": "Incorrect password. Please try again.",
      "auth/too-many-requests": "Too many attempts. Please try again later.",
      "auth/network-request-failed": "Network error. Check your connection.",
      "auth/operation-not-allowed": "Email/password sign-in is not enabled.",
    };
    showError.value = mapErrors[error.code];
  }
}
function reset() {
  inputs.email.text = "";
  inputs.firstName.text = "";
  inputs.lastName.text = "";
  inputs.password.text = "";
  inputs.password2.text = "";
  showError.value = "";
  isSignup.value = !isSignup.value;
}
</script>

<template>
  <div
    class="w-full min-h-screen bg-[url('../../public/assets/backGrounds/authBackGround.svg')] bg-cover"
  >
    <div v-if="!user" class="container mx-auto">
      <section
        class="flex flex-wrap max-w-[1350px] mx-auto min-h-screen items-center 1xl:justify-between justify-center"
      >
        <form
          @submit.prevent
          class="1xl:w-[720px] w-fit max-xl:h-fit flex flex-col justify-center 1xl:px-10 p-4 h-[850px] bg-bg-section"
        >
          <h2 class="text-5xl text-bg-tertiary font-bold text-center">
            Welcome
          </h2>
          <div class="relative w-fit mx-auto max-sm:w-full mt-10">
            <FontAwesomeIcon
              class="text-bg-tertiary text-2xl absolute left-0 top-3/6 transform -translate-y-3/6"
              :icon="faEnvelope"
            />
            <input
              type="email"
              v-model="inputs.email.text"
              placeholder="Email   example@gmail.com"
              @input="inputs.email.validateEmail"
              :class="inputs.email.isValid ? 'text-green-400 ' : 'text-error '"
              class="bg-transparent font-bold focus:bg-text-main placeholder:text-bg-tertiary placeholder:font-bold border-b border-bg-tertiary h-14 w-lg max-sm:w-full outline-0 pl-8"
            />
          </div>
          <div v-if="isSignup" class="relative w-fit mx-auto max-sm:w-full">
            <FontAwesomeIcon
              class="text-bg-tertiary text-2xl absolute left-0 top-3/6 transform -translate-y-3/6"
              :icon="faUser"
            />
            <input
              v-model="inputs.firstName.text"
              @input="inputs.firstName.validateFirst"
              :class="
                inputs.firstName.isValid ? 'text-green-400 ' : 'text-error '
              "
              placeholder="First Name"
              class="bg-transparent font-bold focus:bg-text-main placeholder:text-bg-tertiary placeholder:font-bold border-b border-bg-tertiary h-14 w-lg max-sm:w-full outline-0 pl-8"
            />
          </div>
          <div v-if="isSignup" class="relative w-fit mx-auto max-sm:w-full">
            <FontAwesomeIcon
              class="text-bg-tertiary text-2xl absolute left-0 top-3/6 transform -translate-y-3/6"
              :icon="faUser"
            />
            <input
              :class="
                inputs.lastName.isValid ? 'text-green-400 ' : 'text-error '
              "
              @input="inputs.lastName.validateLast"
              v-model="inputs.lastName.text"
              type="text"
              placeholder="Last Name"
              class="bg-transparent font-bold focus:bg-text-main placeholder:text-bg-tertiary placeholder:font-bold border-b border-bg-tertiary h-14 w-lg max-sm:w-full outline-0 pl-8"
            />
          </div>
          <div class="relative w-fit mx-auto max-sm:w-full">
            <FontAwesomeIcon
              class="text-bg-tertiary text-2xl absolute left-0 top-3/6 transform -translate-y-3/6"
              :icon="faEye"
            />
            <input
              v-model="inputs.password.text"
              @input="inputs.password.validatePassword"
              type="password"
              :class="
                inputs.password.isValid ? 'text-green-400 ' : 'text-error '
              "
              placeholder="password"
              class="bg-transparent font-bold focus:bg-text-main placeholder:text-bg-tertiary placeholder:font-bold border-b border-bg-tertiary h-14 w-lg max-sm:w-full outline-0 pl-8"
            />
          </div>
          <div v-if="isSignup" class="relative w-fit mx-auto max-sm:w-full">
            <FontAwesomeIcon
              class="text-bg-tertiary text-2xl absolute left-0 top-3/6 transform -translate-y-3/6"
              :icon="faEye"
            />
            <input
              type="password"
              v-model="inputs.password2.text"
              @input="
                inputs.password.text === inputs.password2.text &&
                inputs.password.isValid
                  ? (inputs.password2.isValid = true)
                  : (inputs.password2.isValid = false)
              "
              :class="
                inputs.password2.isValid ? 'text-green-400 ' : 'text-error '
              "
              placeholder="confirm password"
              class="bg-transparent font-bold focus:bg-text-main placeholder:text-bg-tertiary placeholder:font-bold border-b border-bg-tertiary h-14 w-lg max-sm:w-full outline-0 pl-8"
            />
          </div>

          <p
            v-if="isSignup"
            class="text-[14px] font-medium text-bg-tertiary mt-5 w-[520px] max-sm:w-full mx-auto flex items-start"
          >
            <FontAwesomeIcon
              class="text-bg-tertiary mt-1.5 mr-2"
              :icon="faInfoCircle"
            />
            <span>
              password must be at least 8 characters long & has 1 Lowercase
              letter & 1 Uppercase letter ,Number,Special symbol (@$!%*?&)
            </span>
          </p>
          <p
            v-if="showError.length"
            class="text-[18px] text-center uppercase font-bold text-error mt-5"
          >
            <FontAwesomeIcon class="mt-1.5 mr-2" :icon="faExclamation" />
            <span>{{ showError }}</span>
          </p>
          <button
            @click="isSignup ? submit() : loginUser()"
            class="text-bg-tertiary cursor-pointer uppercase p-2 mt-10 w-fit mx-auto block text-2xl font-semibold border-b border-bg-tertiary"
          >
            {{ isSignup ? "create an account" : "logIn" }}
          </button>
          <p
            v-if="isSignup"
            class="text-bg-tertiary w-[520px] max-sm:w-full text-center text-2xl font-bold mx-auto mt-5 p-2"
          >
            Or
          </p>
          <div v-if="isSignup" class="flex w-fit mx-auto mt-5">
            <button
              class="bg-error cursor-pointer w-fit flex justify-center items-center aspect-square"
            >
              <FontAwesomeIcon
                class="text-text-main text-5xl"
                :icon="faGoogle"
              />
            </button>
            <button
              class="bg-text-secondary cursor-pointer w-fit flex justify-center items-center aspect-square"
            >
              <FontAwesomeIcon
                class="text-text-main text-5xl"
                :icon="faXTwitter"
              />
            </button>
            <button
              class="bg-[#3b5998] cursor-pointer w-fit flex justify-center items-center aspect-square"
            >
              <FontAwesomeIcon
                class="text-text-main text-5xl"
                :icon="faFacebook"
              />
            </button>
            <button
              class="bg-text-secondary cursor-pointer w-fit flex justify-center items-center aspect-square"
            >
              <FontAwesomeIcon
                class="text-text-main text-5xl"
                :icon="faGithub"
              />
            </button>
          </div>
          <p
            v-if="isSignup"
            class="text-bg-tertiary w-[520px] max-sm:w-full mx-auto mt-10 p-2"
          >
            have an account ?
            <button @click="reset" class="font-bold cursor-pointer">
              login
            </button>
          </p>
          <p
            v-if="!isSignup"
            class="text-bg-tertiary w-[520px] max-sm:w-full mx-auto mt-10 p-2"
          >
            dont have an account ?
            <button @click="reset" class="font-bold cursor-pointer">
              Signup
            </button>
          </p>
        </form>
        <div class="features max-xl:hidden relative">
          <div
            ref="features"
            style="scroll-behavior: smooth; scrollbar-width: none"
            class="grid grid-cols-[516px_516px] overflow-x-scroll select-none relative w-[516px] pt-10 h-[850px] bg-bg-main"
          >
            <div class="h-full">
              <img
                src="/assets/authors/book.webp"
                alt="a book image"
                draggable="false"
                class="max-w-3xs aspect-square mx-auto mb-20"
              />
              <p class="text-text-main text-2xl text-center max-w-96 mx-auto">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque
                debitis nesciunt cum est ex nemo a at nisi accusantium alias
                saepe eligendi impedit esse, rem cumque vitae dolores nostrum
                ipsam.
              </p>
            </div>
            <div class="relative">
              <div class="relative w-full h-96">
                <img
                  style="animation-delay: 0.3s; animation-direction: reverse"
                  class="absolute animate-float2 w-32 left-2/3 top-3/5 z-30 aspect-square rounded-full"
                  src="/assets/authors/author.webp"
                  loading="lazy"
                  alt="author"
                  draggable="false"
                />
                <img
                  style="animation-delay: 0.2s"
                  class="absolute animate-float2 w-28 left-7 z-20 top-3/6 aspect-square rounded-full"
                  src="/assets/authors/author1.webp"
                  loading="lazy"
                  alt="author1"
                  draggable="false"
                />
                <img
                  style="animation-delay: 0.4s; animation-direction: reverse"
                  class="absolute animate-float w-3xs left-28 z-10 top-2/6 aspect-square rounded-full"
                  src="/assets/authors/author2.webp"
                  loading="lazy"
                  alt="author2"
                  draggable="false"
                />
                <img
                  style="animation-delay: 0.5s"
                  class="absolute animate-float2 w-36 left-9 top-6 aspect-square rounded-full"
                  src="/assets/authors/author3.webp"
                  loading="lazy"
                  alt="author3"
                  draggable="false"
                />
                <img
                  style="animation-delay: 0.9s; animation-direction: reverse"
                  class="absolute animate-float left-1/3 w-32 z-10 aspect-square rounded-full"
                  src="/assets/authors/author4.webp"
                  loading="lazy"
                  alt="author4"
                  draggable="false"
                />
                <img
                  style="animation-delay: 0.8s"
                  class="absolute animate-float2 left-3/6 w-52 aspect-square rounded-full"
                  src="/assets/authors/author5.webp"
                  loading="lazy"
                  alt="author5"
                  draggable="false"
                />
              </div>
              <p
                class="text-text-main text-2xl mt-10 text-center max-w-96 mx-auto"
              >
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Distinctio possimus eveniet dicta maiores officiis doloribus
                obcaecati inventore ipsam voluptatum! Dignissimos aspernatur
                aliquam facere et accusamus quia, ipsam natus odit incidunt?
              </p>
            </div>
          </div>

          <div
            class="text-6xl absolute left-3/6 bottom-10 transform -translate-x-3/6 text-text-main mx-auto w-fit"
          >
            <button
              @click="scrollToRight"
              ref="rightButton"
              class="w-2.5 cursor-pointer transition aspect-square mr-2.5 rounded-full bg-white"
            ></button>
            <button
              @click="scrollToLeft"
              ref="leftButton"
              class="w-2.5 cursor-pointer transition aspect-square rounded-full bg-white"
            ></button>
          </div>
        </div>
      </section>
    </div>
    <div
      v-else
      class="bg-text-main absolute top-3/6 left-3/6 transform -translate-3/6 text-[24px] font-bold flex items-center"
    >
      <div class="bg-green-400">
        <FontAwesomeIcon
          class="text-white p-4 text-4xl"
          :icon="faCircleCheck"
        />
      </div>
      <div class="px-4">
        <p>We’ve sent a verification email to your email address</p>
        <p>click on the link to finish verifying your email</p>
      </div>
    </div>
  </div>
</template>
<style scoped>
.active {
  background-color: var(--color-bg-tertiary);
}
</style>
