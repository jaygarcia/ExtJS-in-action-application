Ext.ns("CompanyManager");

/**
 * @class CompanyManager.EmployeeManager
 * @extends Ext.Panel
 * An Ext.Window implementation that contains  the {@link Ext.layout.FitLayout fit} layout to
 *  present {@link TKE.form.EmployeeForm} implementation.
 * <br />
 * @constructor
 * @param {Object} config The config object
 **/
CompanyManager.EmployeeManager = Ext.extend(Ext.Panel, {
    border : false,
    layout : {
        type  : 'hbox',
        align : 'stretch'
    },
    msgs          : {
        immediateChanges : 'Warning! Changes are <span style="color: red;">immediate</span>.',
        errorsInForm     : 'There are errors in the form. Please correct and try again.',
        empSavedSuccess  : 'Saved {0}, {1} successfully.',
        fetchingDataFor  : 'Fetching data for {0}, {1}',
        couldNotLoadData : 'Could not load data for {0}, {1}!',
        saving           : 'Saving {0}, {1}...',
        errorSavingData  : 'There was an error saving the form.',
        deletingEmployee : 'Deleting employee {0}, {1}...',
        deleteEmpConfirm : 'Are you sure you want to delete employee {0}, {1}?',
        deleteEmpSuccess : 'Employee {0}, {1} was deleted successfully.',
        deleteEmpFailure : 'Employee {0}, {1} was not deleted due to a failure.'
    },
    initComponent : function() {
        this.items = [
            this.buildDepartmentListView(),
            this.buildEmployeeListView(),
            this.buildEmployeeForm()
        ];

        CompanyManager.DepartmentManager.superclass.initComponent.call(this);
    },

    buildDepartmentListView : function() {
        return {
            xtype     : 'departmentlist',
            itemId    : 'departmentList',
            width     : 190,
            border    : false,
            style     : 'border-right: 1px solid #99BBE8;',
            title     : 'Departments',
            listeners : {
                scope : this,
                click : this.onDepartmentListClick
            }
        };
    },

    buildEmployeeListView : function() {
        return {
            xtype     : 'employeelist',
            itemId    : 'employeeList',
            width     : 190,
            border    : false,
            style     : 'border-right: 1px solid #99BBE8;',
            title     : 'Employees',
            listeners : {
                scope  : this,
                click  : this.onEmployeeListClick
            }
        };
    },

    buildEmployeeForm : function() {
        return {
            xtype     : 'employeeform',
            itemId    : 'employeeForm',
            flex      : 1,
            border    : false,
            listeners : {
                scope   : this,
                newemp  : this.onNewEmployee,
                delemp  : this.onDeleteEmployee,
                saveemp : this.onSaveEmployee
            }
        };

    },

    onDepartmentListClick : function() {
        var selectedDepartment = this.getComponent('departmentList').getSelected();

        this.getComponent('employeeList').loadStoreByParams({
            id : selectedDepartment.get('id')
        });

        this.getComponent('employeeForm').clearForm();
        this.prepareFormForNew(selectedDepartment);
    },

    onEmployeeListClick : function() {
        var record = this.getComponent('employeeList').getSelected();
        var msg = String.format(
            this.msgs.fetchingDataFor,
            record.get('lastName'),
            record.get('firstName')
        );
    
        Ext.getBody().mask(msg, 'x-mask-loading');

        this.getComponent('employeeForm').load({
            url     : 'employees/getEmployee',
            scope   : this,
            success : this.clearMask,
            failure : this.onEmployeeFormLoadFailure,
            params  : {
                id : record.get('id')
            }
        });
    },

    onEmployeeFormLoadFailure : function() {
        var record = this.getComponent('employeeList').getSelected();
        var msg = String.format(
            this.msgs.couldNotLoadData,
            record.get('lastName'),
            record.get('firstName')
        );

        Ext.MessageBox.show({
            title   : 'Error',
            msg     : msg,
            buttons : Ext.MessageBox.OK,
            icon    : Ext.MessageBox.WARNING
        });

        this.clearMask();
    },
    
    onNewEmployee : function() {
        this.getComponent('employeeList').clearSelections();
        this.prepareFormForNew();
    },

    onDeleteEmployee : function(formPanel, vals) {
        var msg = String.format(this.msgs.deleteEmpConfirm, vals.lastName, vals.firstName);
        Ext.MessageBox.confirm(
            this.msgs.immediateChanges,
            msg,
            this.onConfirmDeleteEmployee,
            this
        );
    },

    onConfirmDeleteEmployee : function(btn) {
        if (btn === 'yes') {
            var vals = this.getComponent('employeeForm').getValues();

            var msg = String.format(
                this.msgs.deletingEmployee,
                vals.lastName,
                vals.firstName
            );

            Ext.getBody().mask(msg, 'x-mask-loading');

            Ext.Ajax.request({
                url          : 'employees/deleteEmployee',
                scope        : this,
                callback     : this.workspace.onAfterAjaxReq,
                succCallback : this.onAfterDeleteEmployee,
                params       : {
                    id : vals.id
                }
            });
        }
    },

    onAfterDeleteEmployee : function(jsonData) {
        var msg,
           selectedEmployee = this.getComponent('employeeList').getSelected();
        if (jsonData.success === true) {

            msg = String.format(
                this.msgs.deleteEmpSuccess,
                selectedEmployee.get('lastName'),
                selectedEmployee.get('firstName')
            );

            Ext.MessageBox.alert('success', msg);

            selectedEmployee.store.remove(selectedEmployee);
            this.getComponent('employeeForm').clearForm();
        }
        else {

            msg = String.format(
                this.msgs.deleteEmpFailure,
                selectedEmployee.get('lastName'),
                selectedEmployee.get('firstName')
            );

            Ext.MessageBox.alert('Error', msg);
        }

        this.clearMask();
    },

    onSaveEmployee : function(employeeForm, vals) {
        if (employeeForm.getForm().isValid()) {
            var msg = String.format(
                this.msgs.saving,
                vals.lastName,
                vals.firstName
            );

            Ext.getBody().mask(msg, 'x-mask-loading');

            employeeForm.getForm().submit({
                url     : 'employees/setEmployee',
                scope   : this,
                success : this.onEmpFormSaveSuccess,
                failure : this.onEmpFormSaveFailure
            });
        }
        else {
            Ext.MessageBox.alert('Error', this.msgs.errorsInForm);
        }
    },

    onEmpFormSaveSuccess : function(form, action) {
        var record = this.getComponent('employeeList').getSelected();
        var vals = form.getValues();

        var msg = String.format(
            this.msgs.empSavedSuccess,
            vals.lastName,
            vals.firstName
        );

        if (record) {
            record.set('lastName', vals.lastName);
            record.set('firstName', vals.firstName);
            record.commit();
        }
        else {
            var resultData = action.result.data;
            this.getComponent('employeeList').createAndSelectRecord(resultData);
            this.getComponent('employeeForm').setValues(resultData);
        }
        Ext.MessageBox.alert('Success', msg);

        this.clearMask();
    },

    onEmpFormSaveFailure : function() {
        this.clearMask();
        Ext.MessageBox.alert('Error', this.msgs.errorSavingData);
    },


    prepareFormForNew : function(selectedDept) {
        selectedDept = selectedDept || this.getComponent('departmentList').getSelected();

        if (selectedDept) {
            this.getComponent('employeeForm').setValues({
                departmentId : selectedDept.get('id'),
                dateHired    : new Date()
            });
        }
    },

    clearMask : function() {
        Ext.getBody().unmask();
    },

    cleanSlate : function () {
        this.getComponent('departmentList').refreshView();
        this.getComponent('employeeList').clearView();
        this.getComponent('employeeForm').clearForm();
    }

});

Ext.reg('employeemanager', CompanyManager.EmployeeManager);