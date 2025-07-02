<template>
  <!--begin::Menu-->
  <div
    class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold py-4 fs-6 w-275px"
    data-kt-menu="true"
  >
    <!--begin::Menu item-->
    <div class="menu-item px-5">
      <a @click="signOut()" class="menu-link px-5"> Sign Out </a>
    </div>
  </div>
  <!--end::Menu-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { computed, defineComponent } from "vue";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "kt-user-menu",
  components: {},
  setup() {
    const router = useRouter();
    const i18n = useI18n();
    const store = useAuthStore();

    i18n.locale.value = localStorage.getItem("lang")
      ? (localStorage.getItem("lang") as string)
      : "en";

    const countries = {
      en: {
        flag: getAssetPath("media/flags/united-states.svg"),
        name: "English",
      },
      es: {
        flag: getAssetPath("media/flags/spain.svg"),
        name: "Spanish",
      },
      de: {
        flag: getAssetPath("media/flags/germany.svg"),
        name: "German",
      },
      ja: {
        flag: getAssetPath("media/flags/japan.svg"),
        name: "Japanese",
      },
      fr: {
        flag: getAssetPath("media/flags/france.svg"),
        name: "French",
      },
    };

    const signOut = () => {
      store.logout();
      router.push({ name: "sign-in" });
    };

    const setLang = (lang: string) => {
      localStorage.setItem("lang", lang);
      i18n.locale.value = lang;
    };

    const currentLanguage = computed(() => {
      return i18n.locale.value;
    });

    const currentLangugeLocale = computed(() => {
      return countries[i18n.locale.value as keyof typeof countries];
    });

    return {
      signOut,
      setLang,
      currentLanguage,
      currentLangugeLocale,
      countries,
      getAssetPath,
    };
  },
});
</script> 