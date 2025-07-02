<template>
  <!--begin::Row-->
  <div class="row gy-5 g-xl-10">
    <!--begin::Col-->
    <div class="col-xl-4">
      <MixedWidget12
        widget-classes="card-xl-stretch mb-xl-10"
        widget-color="#F7D9E3"
        chart-height="100"
      />
    </div>
    <!--end::Col-->

    <!--begin::Col-->
    <div class="col-xl-4">
      <MixedWidget13
        widget-classes="card-xxl-stretch mb-xl-10"
        widget-color="#CBF0F4"
        chart-height="100"
      />
    </div>
    <!--end::Col-->

    <!--begin::Col-->
    <div class="col-xl-4">
      <MixedWidget14
        widget-classes="card-xxl-stretch mb-5 mb-xl-10"
        widget-color="#CBD4F4"
      />
    </div>
    <!--end::Col-->
  </div>
  <!--end::Row-->
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from "vue";
import MixedWidget12 from "@/components/widgets/mixed/Widget12.vue";
import MixedWidget13 from "@/components/widgets/mixed/Widget13.vue";
import MixedWidget14 from "@/components/widgets/mixed/Widget14.vue";

export default defineComponent({
  name: "main-dashboard",
  components: {
    MixedWidget12,
    MixedWidget13,
    MixedWidget14,
  },
  setup() {
    //TODO
  },
});
</script> 