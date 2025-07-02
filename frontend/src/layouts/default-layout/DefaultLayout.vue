<template>
  <!-- begin:: Body -->
  <div class="page d-flex flex-row flex-column-fluid">
    <div id="kt_wrapper" class="wrapper d-flex flex-column flex-row-fluid">
      <KTHeader />

      <!-- begin:: Content -->
      <div
        id="kt_content"
        class="d-flex flex-column-fluid align-items-start"
        :class="{
          'container-fluid': contentWidthFluid,
          'container-xxl': !contentWidthFluid,
        }"
      >
        <KTAside
          v-if="asideEnabled"
          :lightLogo="themeLightLogo"
          :darkLogo="themeDarkLogo"
        />
        <div class="content flex-row-fluid" id="kt_content_container">
          <router-view />
        </div>

        <!-- <KTSidebar v-if="displaySidebar" /> -->
      </div>
      <!-- end:: Content -->
      <KTFooter />
    </div>
  </div>
  <!-- end:: Body -->
  <KTScrollTop />

  <!-- <KTHelpDrawer /> -->
</template>

<script lang="ts">
import {
  defineComponent,
  nextTick,
  onBeforeMount,
  onMounted,
  watch,
} from "vue";
import { useRoute } from "vue-router";
import KTAside from "@/layouts/default-layout/components/aside/Aside.vue";
import KTHeader from "@/layouts/default-layout/components/header/Header.vue";
import KTFooter from "@/layouts/default-layout/components/footer/Footer.vue";
import KTScrollTop from "@/layouts/default-layout/components/extras/ScrollTop.vue";
// import KTHelpDrawer from "@/layouts/default-layout/components/extras/HelpDrawer.vue";
import { reinitializeComponents } from "@/core/plugins/keenthemes";
import {
  asideEnabled,
  contentWidthFluid,
  displaySidebar,
  loaderEnabled,
  loaderLogo,
  subheaderDisplay,
  themeDarkLogo,
  themeLightLogo,
  toolbarDisplay,
} from "@/layouts/default-layout/config/helper";
import LayoutService from "@/core/services/LayoutService";

export default defineComponent({
  name: "default-layout",
  components: {
    KTAside,
    KTHeader,
    KTFooter,
    KTScrollTop,
    // KTHelpDrawer,
  },
  setup() {
    const route = useRoute();

    onBeforeMount(() => {
      LayoutService.init();
    });

    onMounted(() => {
      nextTick(() => {
        reinitializeComponents();
        // Fallback manual trigger for aside drawer
        const asideToggle = document.getElementById('kt_aside_toggle');
        const aside = document.getElementById('kt_aside');
        if (asideToggle && aside) {
          asideToggle.onclick = () => {
            aside.classList.toggle('drawer-on');
          };
        }
      });
    });

    watch(
      () => route?.path,
      () => {
        nextTick(() => {
          reinitializeComponents();
        });
      }
    );

    return {
      toolbarDisplay,
      loaderEnabled,
      contentWidthFluid,
      loaderLogo,
      asideEnabled,
      subheaderDisplay,
      displaySidebar,
      themeLightLogo,
      themeDarkLogo,
    };
  },
});
</script> 