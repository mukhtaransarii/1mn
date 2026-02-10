<template>
    
    <div v-if="_$p.data.curr.data.addrow" class="border-y border-[#e3e8ef] px-4 py-2">
      <Button label="New" icon="pi pi-plus" style="padding: 2px 8px; background-color: black; border: none;" @click="openNew"/>
    </div>
    
    <DataTable
      :value="rows"
      editMode="cell"
      :pt="_$p.data.curr.data.pt"
      @cell-edit-complete="onCellEditComplete"
    >
      <Column
        v-for="c in _$p.data.curr.data.columns"
        :key="c.field"
        :field="c.field"
        :header="c.header"
        :style="c.style"
      >
        <template #body="{ data, field } : any">
          {{ data[field] }}
        </template>

        <template #editor="{ data, field }">
          <component
            :is="typeof data[field] === 'number' ? InputNumber : InputText"
            v-model="data[field]"
            fluid
          />
        </template>
      </Column>

      <!-- DELETE COLUMN -->
      <Column v-if="_$p.data.curr.data.deleterow" header="Action" style="width:6rem; text-align:center">
        <template #body="{ data }">
          <svg @click="askDelete(data)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-red-500">
            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </template>
      </Column>
    </DataTable>

    <!-- ADD ROW DIALOG -->
    <Dialog v-model:visible="showDialog" header="Add Row" modal style="width: 400px">
      <div class="flex flex-col gap-3">
        <div v-for="c in _$p.data.curr.data.columns" :key="c.field">
          <label class="block text-sm mb-1">{{ c.header }}</label>

          <component
            :is="c.type === 'number' ? InputNumber : InputText"
            v-model="newRow[c.field]"
            fluid
          />
        </div>
      </div>

      <template #footer>
        <Button label="Cancel" text @click="showDialog = false" />
        <Button label="Save" icon="pi pi-check" @click="saveRow" />
      </template>
    </Dialog>
    
    <!-- CONFIRM DELETE ROW DIALOG -->
    <Dialog
      v-model:visible="confirmDelete"
      header="Confirm Delete"
      modal
      style="width: 350px"
    >
      <div class="flex items-center gap-3">
        <i class="pi pi-exclamation-triangle text-red-500 text-xl" />
        <span>Are you sure you want to delete this row?</span>
      </div>

      <template #footer>
        <Button label="No" text @click="confirmDelete = false" />
        <Button
          label="Yes"
          severity="danger"
          @click="confirmDeleteRow"
        />
      </template>
    </Dialog>
</template>



<script lang="ts" setup>
  import type { _p_TYP, _$p_TYP } from "../shared/types";
  const { _p, _$p } = defineProps<{ _p: _p_TYP; _$p: _$p_TYP }>();

  import DataTable from "primevue/datatable";
  import Column from "primevue/column";
  import InputText from "primevue/inputtext";
  import InputNumber from "primevue/inputnumber";
  import Button from "primevue/button";
  import Dialog from "primevue/dialog";
  import 'primeicons/primeicons.css'

  import { ref } from "vue";

  const rows = ref<any[]>([]);
  rows.value = _$p.data.curr.data.rows || [];

  const showDialog = ref(false);
  const newRow = ref<any>({});
  const confirmDelete = ref(false);
  const rowToDelete = ref<any>(null);

  const openNew = () => {
    newRow.value = {};
    _$p.data.curr.data.columns.forEach((c: any) => {
      newRow.value[c.field] = c.type === "number" ? 0 : "";
    });
    showDialog.value = true;
  };

  const saveRow = () => {
    rows.value.push({ ...newRow.value });

    _p.f.call("msg", {
      type: "datatable:add-row",
      custom: { row: newRow.value },
      _p,
      _$p
    });

    showDialog.value = false;
  };

  const askDelete = (row: any) => {
    rowToDelete.value = row;
    confirmDelete.value = true;
  };

  const confirmDeleteRow = () => {
    const i = rows.value.indexOf(rowToDelete.value);
    if (i > -1) rows.value.splice(i, 1);

    _p.f.call("msg", {
      type: "datatable:delete-row",
      custom: { row: rowToDelete.value },
      _p,
      _$p
    });

    confirmDelete.value = false;
    rowToDelete.value = null;
  };

  const onCellEditComplete = ({ data, field, value, newValue }: any) => {
    // ⛔ ignore focus / same value
    if (newValue === value) return;

    const isNumber = typeof data[field] === "number";

    if (isNumber) {
      const n = Number(newValue);
      if (!Number.isFinite(n)) return;
      data[field] = n;
    } else {
      if (!newValue?.trim()) return;
      data[field] = newValue;
    }

    _p.f.call("msg", {
      type: "datatable:cell-edit",
      custom: { row: data, field, value: data[field] },
      _p,
      _$p
    });
  };
</script>
