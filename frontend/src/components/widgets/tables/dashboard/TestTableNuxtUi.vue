<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { 
  CheckboxIndicator, 
  CheckboxRoot,
  ProgressIndicator,
  ProgressRoot,
  ToolbarButton,
  ToolbarLink,
  ToolbarRoot,
  ToolbarSeparator,
  ToolbarToggleGroup,
  ToolbarToggleItem,
} from 'reka-ui'
import { ref, onMounted } from 'vue'

const checkboxOne = ref(true)
const progressValue = ref(10)

onMounted(() => {
  const timer = setTimeout(() => (progressValue.value = 66), 500)
  return () => clearTimeout(timer)
})
</script>

<template>
  <!-- Checkbox Example -->
  <div class="d-flex align-items-center mb-5">
    <label class="d-flex align-items-center">
      <CheckboxRoot
        v-model="checkboxOne"
        class="reka-checkbox-root d-flex align-items-center justify-content-center border"
        style="width: 25px; height: 25px; border-radius: 4px; cursor: pointer; transition: all 0.15s ease-in-out;"
      >
        <CheckboxIndicator class="opacity-0 transition-opacity">
          <Icon icon="radix-icons:check" class="fs-6" />
        </CheckboxIndicator>
      </CheckboxRoot>
      <span class="text-dark fw-semibold fs-7 ms-3">Accept terms and conditions.</span>
    </label>
  </div>

  <!-- Progress Bar Example -->
  <div class="mb-5">
    <ProgressRoot
      v-model="progressValue"
      class="reka-progress-root position-relative overflow-hidden rounded-pill"
      style="width: 300px; height: 25px; transform: translateZ(0);"
    >
      <ProgressIndicator
        class="reka-progress-indicator w-100 h-100"
        style="transition: transform 660ms cubic-bezier(0.65, 0, 0.35, 1);"
        :style="`transform: translateX(-${100 - progressValue}%)`"
      />
    </ProgressRoot>
  </div>

  <!-- Toolbar Example -->
  <ToolbarRoot
    class="reka-toolbar-root d-flex p-3 w-100 shadow-sm rounded"
    style="min-width: max-content;"
    aria-label="Formatting options"
  >
    <ToolbarToggleGroup
      type="multiple"
      aria-label="Text formatting"
    >
      <ToolbarToggleItem
        class="reka-toolbar-item btn btn-sm me-1 d-inline-flex align-items-center justify-content-center"
        style="height: 25px; padding: 0 5px; font-size: 13px; line-height: 1;"
        value="bold"
        aria-label="Bold"
      >
        <Icon icon="radix-icons:font-bold" />
      </ToolbarToggleItem>
      <ToolbarToggleItem
        class="reka-toolbar-item btn btn-sm me-1 d-inline-flex align-items-center justify-content-center"
        style="height: 25px; padding: 0 5px; font-size: 13px; line-height: 1;"
        value="italic"
        aria-label="Italic"
      >
        <Icon icon="radix-icons:font-italic" />
      </ToolbarToggleItem>
    </ToolbarToggleGroup>

    <ToolbarSeparator class="reka-separator mx-3" style="width: 1px;" />

    <ToolbarButton
      class="btn btn-sm btn-primary text-white ms-auto"
      style="padding-left: 10px; padding-right: 10px;"
    >
      Share
    </ToolbarButton>
  </ToolbarRoot>
</template>

<style lang="scss" scoped>
// Styling khusus untuk interaction states
.reka-checkbox-root {
  .opacity-0 {
    opacity: 0;
  }
  
  &[data-state="checked"] {
    .opacity-0 {
      opacity: 1 !important;
    }
  }
}

.reka-toolbar-item {
  &[data-state='on'] {
    background-color: var(--kt-primary) !important;
    color: var(--kt-primary-inverse) !important;
  }
}

// Reset untuk button dan link
a, button {
  all: unset;
}
</style>