<template>
  <!--begin::Wrapper-->
  <div class="w-lg-500px p-10">
    <!--begin::Form-->
    <VForm
      class="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
      @submit="onSubmitForgotPassword"
      id="kt_login_password_reset_form"
      :validation-schema="forgotPassword"
    >
      <!-- ... (content truncated for brevity, copy full content from full-template) ... -->
    </VForm>
    <!--end::Form-->
  </div>
  <!--end::Wrapper-->
</template>

<script lang="ts">
// ... (script content truncated for brevity, copy full content from full-template) ...
</script> 