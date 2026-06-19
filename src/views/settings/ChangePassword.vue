<script setup>
import { computed, reactive, ref } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
    faArrowLeft,
    faCircleCheck,
    faEye,
    faEyeSlash,
    faLock,
    faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import {
    EmailAuthProvider,
    getAuth,
    reauthenticateWithCredential,
    updatePassword,
} from "firebase/auth";
import { useUserAuth } from "@/stores/userAuth";
import { useUiStore } from "@/stores/uiStore"
const userAuth = useUserAuth();
const uiStore = useUiStore()
const form = reactive({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
});

const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const isSaving = ref(false);

const settingsRoute = computed(() => ({
    name: "Settings",
    params: { id: userAuth.user?.uid },
}));

const passwordRequirements = computed(() => [
    {
        label: "At least 8 characters",
        met: form.newPassword.length >= 8,
    },
    {
        label: "Matches confirmation",
        met: Boolean(form.newPassword) && form.newPassword === form.confirmPassword,
    },
]);

const passwordStrength = computed(() => {
    const password = form.newPassword;
    if (!password) return "";
    const hasLength = password.length >= 8;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);
    const score = [hasLength, hasLowercase, hasUppercase, hasNumber, hasSymbol].filter(Boolean).length;

    if (score <= 2) return "Weak";
    if (score === 3 || score === 4) return "Okay";
    return "Strong";
});

function validateForm() {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
        uiStore.showMessageModal("Fill in all password fields before saving.", 'error')
        return false;
    }

    if (form.newPassword.length < 8) {
        uiStore.showMessageModal("Your new password must be at least 8 characters long.", 'error')
        return false;
    }

    if (form.newPassword !== form.confirmPassword) {
        uiStore.showMessageModal("The new password and confirmation do not match.", 'error')
        return false;
    }

    if (form.currentPassword === form.newPassword) {
        uiStore.showMessageModal("Choose a different password from your current one.", 'error')
        return false;
    }

    return true;
}

async function savePassword() {
    if (!validateForm()) {
        return;
    }
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user || !user.email) {
        uiStore.showMessageModal("Your account is not ready for a password update.", 'error')
        return;
    }
    isSaving.value = true;
    try {
        const credential = EmailAuthProvider.credential(user.email, form.currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, form.newPassword);
        uiStore.showMessageModal("Your password has been updated successfully.", 'success')
        form.currentPassword = "";
        form.newPassword = "";
        form.confirmPassword = "";
    } catch (error) {
        const errorMap = {
            "auth/wrong-password": "The current password is incorrect.",
            "auth/invalid-credential": "The current password is incorrect.",
            "auth/requires-recent-login": "Please sign in again before changing your password.",
            "auth/weak-password": "Choose a stronger password.",
            "auth/network-request-failed": "Network error. Check your connection and try again.",
            "auth/too-many-requests": "Too many attempts. Try again later.",
        };
        uiStore.showMessageModal(errorMap[error.code] || "Unable to update your password right now.", 'error')
    } finally {
        isSaving.value = false;
    }
}
</script>

<template>
    <section
        class="relative px-4 py-6 mx-auto min-h-[calc(100vh-148px)] bg-[url('../../../../public/assets/backGrounds/authBackGround.svg')] overflow-hidden">

        <div class="relative mx-auto  max-w-125 ">
            <div class="rounded-lg mb-4 flex items-end justify-start  ">
                <RouterLink :to="settingsRoute"
                    class=" items-center gap-2 rounded-full border border-bg-section/15 bg-bg-main px-5 py-3 text-sm font-medium text-bg-section transition hover:border-bg-section/30 hover:bg-bg-main/50">
                    <FontAwesomeIcon :icon="faArrowLeft" />
                    Back to settings
                </RouterLink>


            </div>

            <div class="rounded-lg  bg-Shark p-6 sm:p-8">
                <div class="flex items-center gap-3 text-lg font-semibold text-white">
                    <span
                        class="flex h-11 w-11 items-center justify-center rounded-2xl bg-bg-tertiary/15  text-[#f5b06f]">
                        <FontAwesomeIcon :icon="faLock" />
                    </span>
                    Password form
                </div>

                <form class="mt-6 space-y-5" @submit.prevent="savePassword">
                    <label class="block">
                        <span class="mb-2 block text-sm font-medium text-bg-section/85">Current password</span>
                        <div class="relative">
                            <input v-model="form.currentPassword" :type="showCurrentPassword ? 'text' : 'password'"
                                autocomplete="current-password"
                                class="w-full rounded-2xl border border-bg-section/15 bg-bg-main/70 px-4 py-3 pr-12 text-sm text-bg-section placeholder:text-bg-section/35 transition focus:border-bg-tertiary"
                                placeholder="Enter your current password" />
                            <button type="button"
                                class="absolute cursor-pointer inset-y-0 right-0 flex items-center px-4 text-bg-section/55 transition hover:text-bg-section"
                                @click="showCurrentPassword = !showCurrentPassword">
                                <FontAwesomeIcon :icon="showCurrentPassword ? faEyeSlash : faEye" />
                            </button>
                        </div>
                    </label>

                    <label class="block">
                        <span class="mb-2 block text-sm font-medium text-bg-section/85">New password</span>
                        <div class="relative">
                            <input v-model="form.newPassword" :type="showNewPassword ? 'text' : 'password'"
                                autocomplete="new-password"
                                class="w-full rounded-2xl border border-bg-section/15 bg-bg-main/70 px-4 py-3 pr-12 text-sm text-bg-section placeholder:text-bg-section/35 transition focus:border-bg-tertiary"
                                placeholder="Create a new password" />
                            <button type="button"
                                class="absolute cursor-pointer inset-y-0 right-0 flex items-center px-4 text-bg-section/55 transition hover:text-bg-section"
                                @click="showNewPassword = !showNewPassword">
                                <FontAwesomeIcon :icon="showNewPassword ? faEyeSlash : faEye" />
                            </button>
                        </div>
                        <div v-if="form.newPassword" class="mt-2 text-xs text-bg-section/55">
                            Password strength: <span class="font-semibold text-[#f5b06f]">{{ passwordStrength }}</span>
                        </div>
                    </label>

                    <label class="block">
                        <span class="mb-2 block text-sm font-medium text-bg-section/85">Confirm new password</span>
                        <div class="relative">
                            <input v-model="form.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
                                autocomplete="new-password"
                                class="w-full rounded-2xl border border-bg-section/15 bg-bg-main/70 px-4 py-3 pr-12 text-sm text-bg-section placeholder:text-bg-section/35 transition focus:border-bg-tertiary"
                                placeholder="Repeat the new password" />
                            <button type="button"
                                class="absolute cursor-pointer inset-y-0 right-0 flex items-center px-4 text-bg-section/55 transition hover:text-bg-section"
                                @click="showConfirmPassword = !showConfirmPassword">
                                <FontAwesomeIcon :icon="showConfirmPassword ? faEyeSlash : faEye" />
                            </button>
                        </div>
                    </label>

                    <div
                        class="grid gap-3 rounded-2xl border border-bg-section/15 bg-bg-main/50 p-4 text-sm text-bg-section/75">
                        <p class="font-medium text-bg-section">Password checks</p>
                        <div v-for="item in passwordRequirements" :key="item.label" class="flex items-center gap-3">
                            <span class="flex h-5 w-5 items-center justify-center rounded-full"
                                :class="item.met ? 'bg-successbg text-success' : 'bg-bg-section/10 text-bg-section/35'">
                                <FontAwesomeIcon :icon="faCircleCheck" />
                            </span>
                            <span>{{ item.label }}</span>
                        </div>
                    </div>


                    <div class="">
                        <p class="text-sm leading-6 text-bg-section/55">
                            This will update the password for the account currently signed in to BookNest.
                        </p>

                        <button type="submit" :disabled="isSaving"
                            class=" ml-auto cursor-pointer block mt-4 mr-1 rounded-full bg-[#f5b06f] border-bg-tertiary px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70">
                            {{ isSaving ? 'Saving...' : 'Update password' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </section>
</template>