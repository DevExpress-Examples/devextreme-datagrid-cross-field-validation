<script setup lang="ts">
import DxDataGrid, {
  DxColumn,
  DxEditing,
  DxPaging,
  DxValidationRule,
  type DxDataGridTypes,
} from 'devextreme-vue/data-grid';
import { type DxDateBoxTypes } from 'devextreme-vue/date-box';
import DxSelectBox, { type DxSelectBoxTypes } from 'devextreme-vue/select-box';
import type { ValidationCallbackData } from 'devextreme/common';
import 'devextreme/dist/css/dx.material.blue.light.compact.css';
import 'devextreme/ui/validator';
import Validator from 'devextreme/ui/validator';
import { ref } from 'vue';
import { getEmployees, type EmployeeModel } from '../services/data';

const gridRef = ref<DxDataGrid | null>(null);

const employees = ref<EmployeeModel[]>(getEmployees());

const editingModes = [
  { text: 'Row', value: 'row' },
  { text: 'Form', value: 'form' },
  { text: 'Popup', value: 'popup' },
];

const editingMode = ref<'row' | 'form' | 'popup'>('row');

function changeEditingMode(e: DxSelectBoxTypes.ValueChangedEvent) {
  gridRef.value?.instance?.option('editing.mode', e.value);
}

function onInitNewRow(e: DxDataGridTypes.InitNewRowEvent): void {
  e.data.BirthDate = null;
  e.data.HireDate = null;
}

function onEditorPreparing(e: DxDataGridTypes.EditorPreparingEvent): void {
  const mode = e.component.option('editing.mode') as string;
  const isGridCellMode = ['batch', 'cell', 'row'].includes(mode);

  if (e.dataField === 'BirthDate' && e.parentType === 'dataRow') {
    const defaultHandler = e.editorOptions.onValueChanged;

    e.editorOptions.onValueChanged = (
      args: DxDateBoxTypes.ValueChangedEvent
    ): void => {
      defaultHandler(args);

      if (e.row?.rowIndex !== undefined) {
        const hireCell = e.component.getCellElement(e.row.rowIndex, 'HireDate');

        if (hireCell) {
          const validator = isGridCellMode
            ? (Validator.getInstance(hireCell) as Validator)
            : (Validator.getInstance(
                hireCell.querySelector('.dx-texteditor') as Element
            ) as Validator);

          validator?.validate();
        }
      }
    };
  }
}

function hireDateValidationCallback(params: ValidationCallbackData): boolean {
  return new Date(params.value) > new Date(params.data.BirthDate);
}
</script>
<template>
  <div class="demo-container">
    <div class="options">
      <div class="caption">Options</div>
      <div class="dx-fieldset">
        <div class="dx-field">
          <div class="dx-field-label">Editing Mode</div>
          <div class="dx-field-value">
            <DxSelectBox
              :items="editingModes"
              display-expr="text"
              value-expr="value"
              v-model:value="editingMode"
              @value-changed="changeEditingMode"
            />
          </div>
        </div>
      </div>
    </div>

    <DxDataGrid
      ref="gridRef"
      :data-source="employees"
      key-expr="ID"
      :show-borders="true"
      @init-new-row="onInitNewRow"
      @editor-preparing="onEditorPreparing"
    >
      <DxEditing
        :mode="editingMode"
        :allow-updating="true"
        :allow-adding="true"
      />

      <DxPaging :enabled="false"/>

      <DxColumn data-field="FirstName"/>

      <DxColumn
        data-field="BirthDate"
        data-type="date"
      >
        <DxValidationRule type="required"/>
      </DxColumn>

      <DxColumn
        data-field="HireDate"
        data-type="date"
      >
        <DxValidationRule type="required"/>
        <DxValidationRule
          type="custom"
          message="Hire date cannot be earlier than birth date"
          :reevaluate="true"
          :validation-callback="hireDateValidationCallback"
        />
      </DxColumn>
    </DxDataGrid>
  </div>
</template>
<style scoped>
.options {
  padding: 20px;
  background-color: rgb(191 191 191 / 15%);
}

.options .dx-fieldset {
  margin: 0;
}

.option {
  margin-top: 10px;
}

.caption {
  font-size: 18px;
  font-weight: 500;
  padding-right: 15px;
}

.option > span {
  margin-right: 10px;
}

.option > .dx-widget {
  display: inline-block;
  vertical-align: middle;
}
</style>
