Ext.ns("TKE.form");

/**
 * @class TKE.form.DepartmentForm
 * @extends TKE.form.FormPanelBaseCls
 * An Ext.Panel implementation that contains all of the fields to manage departments, including an instance of
 * {@link TKE.grid.EmployeeGridPanel Employee Grid Panel class}.
 * <br />
 * @constructor
 * @param {Object} config The config object
 * @xtype dept_form
 **/
TKE.form.DepartmentForm = Ext.extend(TKE.form.FormPanelBaseCls, {
    //private
    style         : 'border-top: 0px;',

    //private
    layout        : {
        type  : 'vbox',
        align : 'stretch'
    },

    //private
    initComponent : function() {
        this.items =  [
            this.buidGeneralInfoForm(),
            this.buildEmployeeGrid()
        ];

        TKE.form.DepartmentForm.superclass.initComponent.call(this);

        this.addEvents({
            /**
             * @event save
             * Fires when the Save button on top of the panel is clicked.
             * @param {Object} CompanyMgr.DepartmentForm
             * @param {Object} values containing values from the form.
             */
            save            : true,
            /**
             * @event newemployee
             * Fires when the new employee button on top of the Employee grid panel is clicked.
             * @param {Object} TKE.grid.EmployeeGridPanel
             * @param {Object} CompanyMgr.DepartmentForm
             */
            newemployee     : true,
            /**
             * @event editemployee
             * Fires when a record in the Employee grid panel is clicked.
             * @param {Object} TKE.grid.EmployeeGridPanel
             * @param {Object} CompanyMgr.DepartmentForm
             * @param {Object} Ext.data.Record Containing the data for the row that was double clicked or the edit employee button is pressed.
             */
            editemployee    : true,
            /**
             * @event deleteemployee
             * Fires when the delete button in the Employee grid panel is clicked.
             * @param {Array} Ext.data.Record Containing the data for the row that was selected when the button was
             *  clicked.
             * @param {Object} TKE.grid.EmployeeGridPanel
             * @param {Object} CompanyMgr.DepartmentForm
             */
            deleteemployee  : true,
            /**
             * @event unsetdepartment
             * Fires when the delete department button in the top of this panel is clicked.
             * @param {Number} ID The id of the department that is currently being viewed.
             */
            unsetdepartment : true
        });
    },

    //private
    // Constructs the top portion of the panel.
    // @return {Object} A config object to contain the two halves of the form.
    buidGeneralInfoForm : function() {
        var leftHalf = this.buildGeneralInfoFormLeftHalf();

        var rightHalf = {
            xtype      : 'container',
            title      : 'Description',
            flex       : 1,
            bodyStyle  : 'padding: 1px; margin: 0px;',
            layout     : 'form',
            labelWidth : 70,
            items      : {
                xtype      : 'textarea',
                fieldLabel : 'Description',
                name       : 'description',
                anchor     : '100% 100%'
            }
        } ;

        return {
            tbar         : this.buildTbar(),
            layout       : 'hbox',
            height       : 100,
            bodyStyle    : 'background-color: #DFE8F6; padding: 10px',
            layoutConfig : { align : 'stretch' },
            border       : false,
            items        : [
                leftHalf,
                rightHalf
            ]
        };
    },

    //private
    // constructs the Top most toolbar
    // @return {Array} An array of {@link Ext.Toolbar.Item}'s
    buildTbar : function() {
        return [
            {
                text    : 'Save',
                iconCls : 'icon-disk',
                scope   : this,
                handler : this.onSave
            },
            {
                text    : 'Reset',
                iconCls : 'icon-arrow_undo',
                scope   : this,
                handler : this.onReset

            },
            '->',
            {
                text    : 'Deactivate Department',
                iconCls : 'icon-delete',
                scope   : this,
                handler : this.onUnsetDepartment
            }
        ];
    },

    //Private
    // Constructs the left half of the department management form.
    // @return {Object} Ext.Container, which contains the form elements.
    buildGeneralInfoFormLeftHalf : function() {
        return {
            xtype       : 'container',
            layout      : 'form',
            flex        : 1,
            labelWidth  : 60,
            defaultType : 'textfield',
            defaults    : { anchor: '-10' },
            items       : [
                {
                    xtype      : 'hidden',
                    name       : 'id'
                },
                {
                    fieldLabel : 'Name',
                    name       : 'name',
                    allowBlank : false,
                    maxLength  : 255
                },
                {
                    xtype      : 'datefield',
                    fieldLabel : 'Activated',
                    name       : 'dateActive'
                }
            ]
        };
    },

    //private
    //Constructs the instance of TKE.grid.EmployeeGridPanel that will sit at the bottom of the screen.
    //@return {Object} TKE.grid.EmployeeGridPanel
    buildEmployeeGrid : function() {
        var tbar = [
                '<b>Employees</b>',
                '->',
            {
                text    : 'New Employee',
                iconCls : 'icon-user_add',
                scope   : this,
                handler : this.onNewEmployee
            },
            '-',
            {
                text    : 'Edit Employee',
                iconCls : 'icon-user_edit',
                scope   : this,
                handler : this.onEditEmployee
            },
            '-',
            {
                text    : 'Delete employee',
                iconCls : 'icon-user_delete',
                scope   : this,
                handler : this.onDeleteEmployee
            },
            '-',
            {
                text    : 'Associate Employee(s)',
                iconCls : 'icon-link_add',
                scope   : this,
                handler : this.onAssociateEmployee
            }
        ];

        return {
            xtype     : 'employeegridpanel',
            itemId    : 'employeeGrid',
            flex      : 1,
            loadMask  : true,
            tbar      : tbar,
            style     : 'background-color: #DFE8F6; padding: 10px',
            listeners : {
                scope       : this,
                rowdblclick : this.onGridRowDblClick
            }
        };
    },

    //private
    //Fires the editemployee event.
    onGridRowDblClick : function(grid, rowIndex) {
        var record = grid.store.getAt(rowIndex);

        this.fireEvent('editemployee', this, grid, record);
    },

    //private
    //Fires the internal save event.
    onSave : function() {
        if (this.getForm().isValid()) {
            this.fireEvent('save', this, this.getValues());
        }
    },

    //private
    //Resets the form
    onReset : function() {
        if (this.data) {
            this.loadData(this.data);
        }
        else {
            this.getForm().reset();
        }
    },

    //private
    //Fires the newemployee event.
    onNewEmployee : function() {
        var employeeGrid = this.getComponent('employeeGrid');
        if (this.data) {
            this.fireEvent('newemployee', this, employeeGrid);
        }
    },

    onEditEmployee : function() {
        var employeeGrid = this.getComponent('employeeGrid');
        var selectedEmployeeRec = employeeGrid.getSelected()[0];
        if (selectedEmployeeRec) {
            this.fireEvent('editemployee', this, employeeGrid, selectedEmployeeRec);
        }
    },

    //private
    //Opens up a new instance of TKE.window.EmployeeAssociationWindow
    onAssociateEmployee : function() {
        if (this.data && this.data.id) {
            var empSelectionWindow = new TKE.window.EmployeeAssociationWindow({
                departmentId   : this.data.id,
                departmentName : this.data.name
            });

            this.relayEvents(empSelectionWindow, ['assocemployees']);
            empSelectionWindow.show();
        }
    },

    //private
    //Fires the
    onDeleteEmployee : function(btn) {
        var selectedRecs = this.getEmployeeGridSelections();
        var employeeGrid = this.getComponent('employeeGrid');
        if (selectedRecs.length > 0) {
            this.fireEvent('deleteemployee', selectedRecs, employeeGrid, this);
        }
    },
     //private
    //Fires the unsetdepartment event.
    onUnsetDepartment : function() {
        if (this.data) {
            this.fireEvent('unsetdepartment', this.data.id);
        }
    },

    /**
     * Convenience method to clear the form's values and internal this.data reference.
     */
    clearForm : function() {
        TKE.form.DepartmentForm.superclass.clearForm.call(this);
        this.getComponent('employeeGrid').removeAll();
        this.disableEmployeeGridBtns();
    },

    /**
     * A convenience method to load the internal form and {@link TKE.grid.EmployeeGridPanel} data or clear the entire
     * panel's content.
     * @param {Object} data The data for the form and grid panel.
     */
    loadData : function(data) {  
        TKE.form.DepartmentForm.superclass.loadData.call(this, data);
        this.loadEmployeeGrid();
    },

    //private
    //A convenience method to load the internal TKE.grid.EmployeeGridPanel
    loadEmployeeGrid : function(data) {
        if (this.data && this.data.id) {
            this.getComponent('employeeGrid').load({
                params : {
                    id : this.data.id
                }
            });
            
            this.enableEmployeeGridBtns();
        }
    },
    
    /**
     * Convenience method to add records directly to the internal instance of TKE.grid.EmployeeGridPanel
     * @param {Array} records An array of Ext.data.Records
     */
    addRecordsToEmployeeGrid : function(records) {
        this.getComponent('employeeGrid').add(records);
    },
   
    /**
     * Convenience method to retrieve te list of records selected in the internal instance of TKE.grid.EmployeeGridPanel
     * @return {Array} An array of Ext.data.Records
     */
    getEmployeeGridSelections: function() {
        return this.getComponent('employeeGrid').selModel.getSelections();
    },


    disableEmployeeGridBtns : function() {
        var tbar = this.getComponent('employeeGrid').getTopToolbar();

        tbar.items.each(function(item) {
            if (item.disable) {
                item.disable();
            }
        });
    },
    
    enableEmployeeGridBtns : function() {
        var tbar = this.getComponent('employeeGrid').getTopToolbar();

        tbar.items.each(function(item) {
            if (item.enable) {
                item.enable();
            }
        });

    }
});

Ext.reg('departmentform', TKE.form.DepartmentForm);