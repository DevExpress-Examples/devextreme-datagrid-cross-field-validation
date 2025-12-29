$(() => {
  const grid = $('#gridContainer')
    .dxDataGrid({
      dataSource: employees,
      keyExpr: 'ID',
      showBorders: true,
      paging: {
        enabled: false,
      },
      editing: {
        mode: 'row',
        allowUpdating: true,
        allowDeleting: true,
        allowAdding: true,
      },
      onInitNewRow(e) {
        e.data.BirthDate = null;
        e.data.HireDate = null;
      },

      onEditorPreparing(e) {
        const mode = e.component.option('editing.mode');
        const isGridCellMode = ['batch', 'cell', 'row'].includes(mode);

        if (e.dataField === 'BirthDate' && e.parentType === 'dataRow') {
          const defaultHandler = e.editorOptions.onValueChanged;

          e.editorOptions.onValueChanged = (args) => {
            defaultHandler(args);

            const hireCell = e.component.getCellElement(e.row.rowIndex, 'HireDate');
            const validator = isGridCellMode ? $(hireCell).dxValidator('instance') : $(hireCell).find('.dx-texteditor').dxValidator('instance');
            validator.validate();
          };
        }
      },

      columns: [
        'FirstName',
        {
          dataField: 'BirthDate',
          validationRules: [{ type: 'required' }],
          dataType: 'date',
        },
        {
          dataField: 'HireDate',
          validationRules: [
            { type: 'required' },
            {
              type: 'custom',
              message: 'Hire date cannot be earlier than birth date',
              reevaluate: true,
              validationCallback(params) {
                return new Date(params.value) > new Date(params.data.BirthDate);
              },
            },
          ],
          dataType: 'date',
        },
      ],
    })
    .dxDataGrid('instance');

  $('#editingMode').dxSelectBox({
    items: [
      { text: 'Row', value: 'row' },
      { text: 'Form', value: 'form' },
      { text: 'Popup', value: 'popup' },
    ],
    displayExpr: 'text',
    valueExpr: 'value',
    value: 'row',
    onValueChanged(e) {
      grid.option('editing.mode', e.value);
    },
  });
});
