<template>
  <FileUpload
    mode="advanced"
    name="fileUpload[]"
    :url="_$p.data.curr.data.url"
    :multiple="_$p.data.curr.data.multiple"
    :accept="_$p.data.curr.data.accept"
    :maxFileSize="_$p.data.curr.data.maxFileSize"
    :auto="_$p.data.curr.data.auto"
    :style="_$p.data.curr.data.style"
    @upload="onUpload"
    @select="onSelect"
    class="w-full"
  >
    <template #empty>
      <div class="h-32 grid place-items-center">
        <span class="text-gray-500">{{ _$p.data.curr.data.emptyText }}</span>
      </div>
    </template>
  </FileUpload>
</template>

<script lang="ts" setup>
import FileUpload from 'primevue/fileupload';
import { ref } from "vue";
import type { _p_TYP, _$p_TYP } from "../shared/types";

const { _p, _$p } = defineProps<{
  _p: _p_TYP,
  _$p: _$p_TYP,
}>();

// reactive variable (same name rule ✔)
const fileUpload = ref([]);

// when files are selected (before upload)
const onSelect = (event: any) => {
  fileUpload.value = event.files;

  _p.f.call('msg', {
    type: 'fileUpload:value',
    custom: { fileUpload: fileUpload.value },
    _p,
    _$p
  });
};

// when upload is completed
const onUpload = (event: any) => {
  _p.f.call('msg', {
    type: 'fileUpload:uploaded',
    custom: { fileUpload: event.files },
    _p,
    _$p
  });
};
</script>
