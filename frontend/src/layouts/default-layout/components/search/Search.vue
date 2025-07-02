<template>
  <!--begin::Search-->
  <div
    id="kt_header_search"
    class="header-search d-flex align-items-stretch"
    data-kt-menu-target="#kt-search-menu"
    data-kt-menu-trigger="click"
    data-kt-menu-attach="parent"
    data-kt-menu-placement="bottom-end"
    data-kt-menu-flip="bottom"
  >
    <!--begin::Search toggle-->
    <div
      class="search-toggle-mobile d-flex align-items-center"
      id="kt_header_search_toggle"
    >
      <div
        class="btn btn-icon btn-color-gray-700 btn-active-color-primary btn-outline w-40px h-40px"
      >
        <KTIcon icon-name="magnifier" icon-class="fs-2 fs-md-1" />
      </div>
    </div>
    <!--end::Search toggle-->
  </div>
  <!--end::Search-->
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "KTSearch",
  components: {},
  setup() {
    return {};
  },
});
</script> 