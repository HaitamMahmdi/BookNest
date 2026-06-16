<script setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faArrowLeft, faEnvelope, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { useUserAuth } from "@/stores/userAuth";
import { useUiStore } from "@/stores/uiStore";
import { auth } from "../../firebase.js";
import { reauthenticateWithCredential, EmailAuthProvider, updateEmail } from "firebase/auth";

const userAuth = useUserAuth();
const uiStore = useUiStore();
const currentPassword = ref("");
const newEmail = ref("");
const confirmEmail = ref("");
const loading = ref(false);
const fieldError = ref("");
const currentEmail = ref("");

const settingsRoute = computed(() => ({ name: "Settings", params: { id: userAuth.user?.uid } }));

onMounted(() => {
    currentEmail.value = auth.currentUser?.email || "";
});

function clear() {
    currentPassword.value = "";
    newEmail.value = "";
    confirmEmail.value = "";
    fieldError.value = "";
}

function validateInputs() {
    if (!currentPassword.value || !newEmail.value || !confirmEmail.value) {
        fieldError.value = "Please complete every field.";
        return false;
    }

    if (newEmail.value !== confirmEmail.value) {
        fieldError.value = "The new email addresses must match.";
        return false;
    }

    return true;
}

async function handleSubmit() {
    fieldError.value = "";
    if (!validateInputs()) {
        uiStore.showMessageModal(fieldError.value, "error");
        return;
    }

    if (!auth.currentUser) {
        uiStore.showMessageModal("No signed-in user found.", "error");
        return;
    }

    loading.value = true;
    try {
        const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword.value);
        await reauthenticateWithCredential(auth.currentUser, credential);
        await updateEmail(auth.currentUser, newEmail.value);
        currentEmail.value = newEmail.value;
        clear();
        uiStore.showMessageModal("Your email has been updated successfully.", "success");
    } catch (error) {
        const errorMessage = {
            "auth/wrong-password": "The current password is incorrect.",
            "auth/invalid-credential": "The current password is incorrect.",
            "auth/requires-recent-login": "Please sign in again before changing your email.",
            "auth/invalid-email": "Enter a valid email address.",
            "auth/email-already-in-use": "That email is already in use.",
            "auth/network-request-failed": "Network error. Please try again.",
        }[error.code] || error.message || "Unable to update your email right now.";

        uiStore.showMessageModal(errorMessage, "error");
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <section
        class="relative min-h-[calc(100vh-148px)]  bg-[url('../../../../public/assets/backGrounds/authBackGround.svg')] px-4 py-6 text-bg-section">
        <div class="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div class="space-y-6">
                <RouterLink :to="settingsRoute"
                    class="inline-flex items-center gap-2 rounded-full border border-bg-section/15 bg-bg-main px-5 py-3 text-sm font-medium text-text-main transition hover:border-bg-section/30 hover:bg-bg-main/50">
                    <FontAwesomeIcon :icon="faArrowLeft" />
                    Back to settings
                </RouterLink>

                <div class="rounded-lg bg-Shark p-6 shadow-sm shadow-black/10">
                    <div class="flex items-center gap-3 text-lg font-semibold text-bg-section">
                        <span
                            class="flex h-12 w-12 items-center justify-center rounded-2xl bg-bg-tertiary/15 text-[#f5b06f]">
                            <FontAwesomeIcon :icon="faEnvelope" />
                        </span>
                        <div>
                            <p class="text-sm  text-text-main">Current email</p>
                            <p class="mt-1 text-base font-semibold text-bg-section">{{ currentEmail || 'Not connected'
                                }}</p>
                        </div>
                    </div>
                    <p class="mt-4 text-sm leading-6 text-bg-section/70">
                        This email is used for login, recovery, and notifications. Update it below when you're ready.
                    </p>
                </div>
            </div>

            <div class="rounded-lg  bg-Shark p-6 shadow-sm shadow-black/10">
                <div class="mb-6">
                    <h1 class="text-2xl font-semibold text-text-main">Change email</h1>
                    <p class="mt-2 text-sm text-bg-section/65">
                        Confirm your password and enter a new email address for your BookNest account.
                    </p>
                </div>

                <form class="space-y-5" @submit.prevent="handleSubmit">
                    <label class="block">
                        <span class="mb-2 block text-sm font-medium text-bg-section/85">Current password</span>
                        <input v-model="currentPassword" type="password" autocomplete="current-password"
                            placeholder="Enter current password"
                            class="w-full rounded-2xl border border-bg-section/15 bg-bg-main/70 px-4 py-3 text-sm text-bg-section placeholder:text-bg-section/35 transition focus:border-bg-tertiary" />
                    </label>

                    <label class="block">
                        <span class="mb-2 block text-sm font-medium text-bg-section/85">New email</span>
                        <input v-model="newEmail" type="email" autocomplete="email" placeholder="Enter new email"
                            class="w-full rounded-2xl border border-bg-section/15 bg-bg-main/70 px-4 py-3 text-sm text-bg-section placeholder:text-bg-section/35 transition focus:border-bg-tertiary" />
                    </label>

                    <label class="block">
                        <span class="mb-2 block text-sm font-medium text-bg-section/85">Confirm new email</span>
                        <input v-model="confirmEmail" type="email" autocomplete="email" placeholder="Confirm new email"
                            class="w-full rounded-2xl border border-bg-section/15 bg-bg-main/70 px-4 py-3 text-sm text-bg-section placeholder:text-bg-section/35 transition focus:border-bg-tertiary" />
                    </label>

                    <div class="rounded-2xl  bg-error/10 p-4 text-sm ">
                        <p class="font-medium text-error">Need to know</p>
                        <p class="mt-2 leading-6 text-error">
                            Your new email will be used for account recovery and app communications. Make sure it is
                            active.
                        </p>
                    </div>

                    <div class="flex flex-wrap items-center gap-3">
                        <button type="submit" :disabled="loading"
                            class="ml-auto cursor-pointer rounded-full bg-[#f5b06f] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70">
                            {{ loading ? 'Saving...' : 'Update email' }}
                        </button>
                        <button type="button" @click="clear"
                            class="rounded-full cursor-pointer border border-bg-section/20 bg-bg-main px-6 py-3 text-sm font-medium text-bg-section transition hover:border-bg-section/30 hover:bg-bg-main/80">
                            Reset
                        </button>
                    </div>

                </form>
            </div>
        </div>
    </section>
</template>