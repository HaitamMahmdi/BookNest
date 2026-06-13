<script setup>
import { computed, ref } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
    faAngleRight,
    faDownload,
    faEnvelope,
    faFingerprint,
    faGlobe,
    faPalette,
    faShieldHalved,
    faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { faBell, faHeadphones, faUserAlt } from "@fortawesome/free-regular-svg-icons";
import { useUserAuth } from "@/stores/userAuth";
import { useUserStore } from "@/stores/userStore";

const userAuth = useUserAuth();
const userStore = useUserStore();

const profileName = computed(() => {
    return userAuth.user?.displayName || userAuth.user?.email?.split("@")[0] || "BookNest reader";
});

const profileEmail = computed(() => userAuth.user?.email || "No account connected");

const profileInitials = computed(() => {
    const source = userAuth.user?.displayName || userAuth.user?.email || "BN";
    return source
        .split(/\s|@|\./)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("")
        .slice(0, 2);
});

const supportTitle = ref("");
const supportMessage = ref("");
const emailNotifications = ref(true);
const readingReminders = ref(false);
const dataSync = ref(true);

const settingGroups = [
    {
        icon: faFingerprint,
        title: "Change password",
        description: "Update your sign-in credentials and keep your account secure.",
    },
    {
        icon: faEnvelope,
        title: "Email address",
        description: "Manage the address used for alerts, verification, and support.",
    },
    {
        icon: faDownload,
        title: "Download your data",
        description: "Export your books, reviews, and reading history.",
    },
];
</script>

<template>
    <div class="relative mx-auto min-h-screen overflow-hidden px-4 py-6 text-bg-section sm:px-6 lg:px-8">
        <div class="mx-auto w-full max-w-6xl">
            <header
                class="mb-6 flex flex-col gap-3 border-b border-bg-section/20 pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 class="mt-2 text-3xl font-semibold sm:text-4xl">Settings</h1>

                </div>

            </header>

            <div class="grid gap-6 lg:grid-cols-[320px_1fr]">
                <aside class="space-y-6">
                    <section class="rounded-lg border border-bg-section/20 bg-Shark p-6 ">
                        <div class="flex items-center gap-4">
                            <div
                                class="flex h-18 w-18 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-bg-main text-lg font-semibold tracking-wide text-bg-section">
                                <img v-if="userStore.profileImgURL?.url" :src="userStore.profileImgURL.url"
                                    alt="Profile photo" class="h-full w-full object-cover" />
                                <span v-else>{{ profileInitials }}</span>
                            </div>
                            <div class="min-w-0">
                                <p class="truncate text-lg font-semibold">{{ profileName }}</p>
                                <p class="truncate text-sm text-bg-section/65">{{ profileEmail }}</p>
                            </div>
                        </div>

                        <div class="mt-5 rounded-lg bg-bg-main/80 p-4">
                            <p class="text-xs uppercase tracking-[0.25em] text-bg-section/45">About</p>
                            <p class="mt-2 text-sm leading-6 text-bg-section/80">
                                {{ userStore.about || `Add a short bio in your profile to make your account feel more
                                personal.` }}
                            </p>
                        </div>

                        <dl class="mt-5 text-sm">
                            <div
                                class="rounded-lg mb-4 border border-bg-section/20 bg-bg-main  p-4 cursor-pointer hover:border-bg-section">
                                <dt
                                    class="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-bg-section/45">
                                    <span
                                        class="flex h-8 w-8 items-center justify-center rounded-full bg-bg-section/10 text-bg-section">
                                        <FontAwesomeIcon :icon="faShieldHalved" />
                                    </span>
                                    Premium
                                </dt>
                                <dd class="mt-3 text-sm font-semibold text-bg-section">Get Premium</dd>
                                <p class="mt-2 text-xs leading-5 text-bg-section/60">
                                    Unlock extra reading tools and a cleaner experience.
                                </p>
                            </div>
                            <div
                                class="rounded-lg border border-bg-section/20 p-4 bg-bg-main cursor-pointer hover:border-bg-section">
                                <dt
                                    class="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-bg-section/45">
                                    <span
                                        class="flex h-8 w-8 items-center justify-center rounded-full bg-bg-section/10 text-bg-section">
                                        <FontAwesomeIcon :icon="faUsers" />
                                    </span>
                                    Author
                                </dt>
                                <dd class="mt-3 text-sm font-semibold text-bg-section">Become author</dd>
                                <p class="mt-2 text-xs leading-5 text-bg-section/60">
                                    Share your writing and grow an audience inside BookNest.
                                </p>
                            </div>
                        </dl>
                    </section>

                    <section class="rounded-lg border border-bg-section/20 bg-Shark p-6 ">
                        <div class="flex items-center gap-2 text-lg font-semibold">
                            <FontAwesomeIcon :icon="faUserAlt" />
                            <h2>Shortcuts</h2>
                        </div>

                        <div class="mt-4 space-y-3">
                            <button v-for="item in settingGroups" :key="item.title" type="button"
                                class="flex w-full cursor-pointer items-start gap-3 rounded-lg border border-bg-section/20 bg-bg-section/5 p-4 text-left transition hover:border-bg-section/20 hover:bg-bg-section/8">
                                <span
                                    class="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-bg-main text-bg-section">
                                    <FontAwesomeIcon :icon="item.icon" />
                                </span>
                                <span class="min-w-0 flex-1">
                                    <span class="flex items-center justify-between gap-3">
                                        <span class="text-sm font-medium">{{ item.title }}</span>
                                        <FontAwesomeIcon class="text-bg-section/35" :icon="faAngleRight" />
                                    </span>
                                    <span class="mt-1 block text-sm leading-5 text-bg-section/60">{{ item.description
                                        }}</span>
                                </span>
                            </button>
                        </div>
                    </section>

                    <section class="grid gap-4 mt-6">
                        <article class="rounded-lg border border-bg-section/20 bg-Shark/60 p-5 ">
                            <div class="flex items-center gap-3">
                                <span
                                    class="flex h-11 w-11 items-center justify-center rounded-lg bg-bg-main text-bg-section">
                                    <FontAwesomeIcon :icon="faDownload" />
                                </span>
                                <div>
                                    <p class="text-xs uppercase tracking-[0.25em] text-bg-section/45">Download</p>
                                    <h2 class="mt-1 text-base font-semibold">Take BookNest with you</h2>
                                </div>
                            </div>
                            <p class="mt-4 text-sm leading-6 text-bg-section/65">
                                Install the app on your device so your shelves, progress, and reviews stay close at
                                hand.
                            </p>
                            <button type="button"
                                class="mt-5 cursor-pointer inline-flex items-center gap-2 rounded-full border border-bg-section/20 bg-bg-main px-4 py-2 text-sm font-medium transition hover:border-bg-section/20 hover:bg-bg-secondary">
                                <FontAwesomeIcon :icon="faDownload" />
                                Download app
                            </button>
                        </article>

                        <article class="rounded-lg border border-bg-section/20 bg-Shark/60 p-5 ">
                            <div class="flex items-center gap-3">
                                <span
                                    class="flex h-11 w-11 items-center justify-center rounded-lg bg-bg-main text-bg-section">
                                    <FontAwesomeIcon :icon="faUsers" />
                                </span>
                                <div>
                                    <p class="text-xs uppercase tracking-[0.25em] text-bg-section/45">Invite</p>
                                    <h2 class="mt-1 text-base font-semibold">Call a friend to use the app</h2>
                                </div>
                            </div>
                            <p class="mt-4 text-sm leading-6 text-bg-section/65">
                                Share BookNest with a friend so they can start tracking books, reviews, and reading
                                progress too.
                            </p>
                            <button type="button"
                                class="mt-5 cursor-pointer inline-flex items-center gap-2 rounded-full border border-bg-section/20 bg-bg-main px-4 py-2 text-sm font-medium transition hover:border-bg-section/20 hover:bg-bg-secondary">
                                <FontAwesomeIcon :icon="faUsers" />
                                Invite a friend
                            </button>
                        </article>
                    </section>
                </aside>

                <main class="space-y-6">
                    <section class="rounded-lg border border-bg-section/20 bg-Shark p-6 ">
                        <div class="flex items-center gap-2 text-lg font-semibold">
                            <FontAwesomeIcon :icon="faShieldHalved" />
                            <h2>Account and security</h2>
                        </div>

                        <div class="mt-5 grid gap-4 md:grid-cols-2">
                            <article v-for="item in settingGroups" :key="item.title"
                                class="rounded-lg border border-bg-main bg-bg-section/5 p-5 transition hover:border-bg-section">
                                <div class="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 class="font-medium text-bg-section">{{ item.title }}</h3>
                                        <p class="mt-2 text-sm leading-6 text-bg-section/65">{{ item.description }}</p>
                                    </div>
                                    <button type="button"
                                        class="flex h-10 w-10 cursor-pointer shrink-0 items-center justify-center rounded-xl border border-bg-section/20 bg-bg-main text-bg-section transition hover:border-bg-section/20 hover:bg-bg-secondary">
                                        <FontAwesomeIcon :icon="faAngleRight" />
                                    </button>
                                </div>
                            </article>
                        </div>
                    </section>

                    <section class="rounded-lg border border-bg-section/20 bg-Shark p-6 ">
                        <div class="flex items-center gap-2 text-lg font-semibold">
                            <FontAwesomeIcon :icon="faBell" />
                            <h2>Preferences</h2>
                        </div>

                        <div class="mt-5 grid gap-4 md:grid-cols-2">
                            <label
                                class="flex items-center cursor-pointer justify-between gap-4 rounded-lg border border-bg-section/20 bg-bg-section/5 p-4">
                                <span>
                                    <span class="block font-medium">Email notifications</span>
                                    <span class="mt-1 block text-sm text-bg-section/60">Receive updates about reviews
                                        and
                                        activity.</span>
                                </span>
                                <input v-model="emailNotifications" type="checkbox"
                                    class="cursor-pointer h-5 w-5 accent-[#eb8634]" />
                            </label>

                            <label
                                class="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-bg-section/20 bg-bg-section/5 p-4">
                                <span>
                                    <span class="block font-medium">Reading reminders</span>
                                    <span class="mt-1 block text-sm text-bg-section/60">Get nudges to continue your
                                        current
                                        book.</span>
                                </span>
                                <input v-model="readingReminders" type="checkbox"
                                    class="cursor-pointer h-5 w-5 accent-[#eb8634]" />
                            </label>

                            <label
                                class="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-bg-section/20 bg-bg-section/5 p-4">
                                <span>
                                    <span class="block font-medium">Cloud sync</span>
                                    <span class="mt-1 block text-sm text-bg-section/60">Keep books and progress in sync
                                        across devices.</span>
                                </span>
                                <input v-model="dataSync" type="checkbox"
                                    class="cursor-pointer h-5 w-5 accent-[#eb8634]" />
                            </label>

                            <div class="rounded-lg border border-bg-section/20 bg-bg-section/5 p-4">
                                <div class="flex items-center gap-2 font-medium">
                                    <FontAwesomeIcon :icon="faPalette" />
                                    Appearance
                                </div>
                                <p class="mt-2 text-sm leading-6 text-bg-section/60">
                                    The app is using the BookNest reading theme with warm contrast and low-glare
                                    surfaces.
                                </p>
                                <button type="button"
                                    class="mt-4 inline-flex items-center gap-2 rounded-full border border-bg-section/20 bg-bg-main px-4 py-2 text-sm font-medium transition hover:border-bg-section/20 hover:bg-bg-secondary">
                                    <FontAwesomeIcon :icon="faGlobe" />
                                    Language and region
                                </button>
                            </div>
                        </div>
                    </section>

                    <section class="rounded-lg border border-bg-section/20 bg-Shark p-6 ">
                        <div class="flex items-center gap-2 text-lg font-semibold">
                            <FontAwesomeIcon :icon="faHeadphones" />
                            <h2>Help and support</h2>
                        </div>

                        <form class="mt-5 space-y-4" @submit.prevent>
                            <input v-model="supportTitle" type="text"
                                class="w-full  rounded-lg border border-bg-section/20 bg-bg-main focus:border-bg-section transition px-4 py-3 text-sm text-bg-section placeholder:text-bg-section/40"
                                placeholder="Title of the message" />
                            <textarea v-model="supportMessage" placeholder="Message body"
                                class="block min-h-52 w-full rounded-lg border border-bg-section/20 focus:border-bg-section transition bg-bg-main px-4 py-3 text-sm  text-bg-section placeholder:text-bg-section/40"></textarea>
                            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <p class="text-sm text-bg-section/55">Send feedback, report an issue, or ask for help
                                    with
                                    your account.</p>
                                <button type="submit"
                                    class="inline-flex cursor-pointer items-center justify-center rounded-full bg-[#eb8634] px-5 py-3 text-sm font-semibold text-bg-section transition hover:brightness-110">
                                    Send message
                                </button>
                            </div>
                        </form>
                    </section>
                </main>
            </div>
        </div>
    </div>
</template>