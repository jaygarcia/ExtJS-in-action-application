Ext.ns("CompanyManager");
/**
 * @class CompanyManager.DepartmentManager
 * @extends Ext.Panel
 * NEEDS A DESCRIPTION
 * <br />
 * @constructor
 * @param {Object} config The config object
 * @xtype CompanyManager_manage_departments
 **/
CompanyManager.DepartmentManager = Ext.extend(Ext.Panel, {
    layout        : 'border',
    border        : false,
    msgs          : {
        empSavedSuccessfully   : 'Employee {0}, {1} was saved successfully',
        doSomethingOnEmployees : '{0} {1} employees.',
        deleteEmployeeConfirm  : 'Are you sure you want delete these {0} employees?',
        assocEmployeeConfirm   : 'Are you sure you want to associate {0} employees to {1}?',
        immediateChanges       : 'Warning! Changes are <span style="color: red;">immediate</span>.',
        associatingEmployees   : 'Associating {0} employees to {1}',
        assocEmployeeSuccess   : 'Successfully associated {0} employee(s) with {1}.',
        confirmDeleteDept      : 'Are you sure you want to deactivate the {0} department and all of its employees?',
        deactivatingDepartment : 'Deactivating {0}...',
        succDeleteDept         : '{0} and all associated employee(s) have been deleted successfully.' ,
        savingData             : 'Saving {0}...',
        errorSavingDepartment  : 'There was an error saving the {0} department.',
        succSaveDepartment     : '{0} was saved successfully.'
    },
    initComponent : function() {
        this.items =  [
            this.buildDepartmentList(),
            this.buildDepartmentForm()
        ];

        CompanyManager.DepartmentManager.superclass.initComponent.call(this);
    },
    buildDepartmentList : function() {
        return {
            xtype     : 'departmentlist',
            itemId    : 'departmentList',
            flex      : 1,
            split     : true,
            resizable : true,
            region    : 'west',
            width     : 155,
            border    : false,
            style     : 'border-right: 1px solid #99BBE8;',
            listeners : {
                scope : this,
                click : this.onDepartmentListClick
            },
            tbar      :  [
                {
                    text    : 'New Department',
                    iconCls : 'icon-group_add',
                    scope   : this,
                    handler : this.onNewDepartment
                }
            ]
        };
    },
    buildDepartmentForm : function() {
        return {
            xtype     : 'departmentform',
            itemId    : 'departmentForm',
            region    : 'center',
            border    : false,
            style     : 'border-left: 1px solid #99BBE8;',
            listeners : {
                scope           : this,
                save            : this.onDeptFormSave,
                newemployee     : this.onDeptFormNewEmployee,
                editemployee    : this.onDeptFormEditEmployee,
                deleteemployee  : this.onDeleteEmployees,
                assocemployees  : this.onAssociateEmployees,
                unsetdepartment : this.onDeptFormDeleteDept
            }
        };
    },

    onDepartmentListClick : function() {
        var selectedDepartment =
               this.getComponent('departmentList').getSelected();

        this.getComponent('departmentForm').loadData(selectedDepartment.data);
    },

    onNewDepartment : function() {
        this.clearFormPanel();
        var departmentForm = this.getComponent('departmentForm');
        departmentForm.getForm().setValues({
            dateActive : new Date()
        });
        departmentForm.disableEmployeeGridBtns();
    },

    onDeptFormSave : function(panel, vals) {
       if (this.getComponent('departmentForm').getForm().isValid()) {
            var msg = String.format(this.msgs.savingData, vals.name);
            Ext.getBody().mask(msg, 'x-mask-loading');

            this.getComponent('departmentForm').getForm().submit({
                url     : 'departments/setDepartment',
                scope   : this,
                success : this.onDeptFormSaveSuccess,
                failure : this.onDeptFormSaveFailure
            });
       }
    },

    onDeptFormSaveSuccess : function(form, action) {
        var selectedDeptRecord = this.getComponent('departmentList').getSelected();
        var resultData = action.result.data;

        if (selectedDeptRecord) {
            for (var key in resultData) {
                selectedDeptRecord.set(key, resultData[key]);
            }
            selectedDeptRecord.commit();
        }
        else {
            this.getComponent('departmentList').createAndSelectRecord(resultData);
        }

        var departmentForm = this.getComponent('departmentForm');
        departmentForm.loadData(resultData);
        departmentForm.enableEmployeeGridBtns();
        Ext.getBody().unmask();

        var msg = String.format(
            this.msgs.succSaveDepartment,
            resultData.name
        );
        Ext.MessageBox.alert('Success', msg);
    },

    onDeptFormSaveFailure : function() {
        var vals = this.getComponent('departmentForm').getForm().getValues();

        var msg = String.format(this.msgs.errorSavingDepartment, vals.name);
        Ext.getBody().unmask();
        Ext.MessageBox.alert('Error!', msg);
    },

    onDeptFormDeleteDept : function() {
        var selectedDeptRecord =  this.getComponent('departmentList').getSelected();
        var msg = String.format(this.msgs.confirmDeleteDept, selectedDeptRecord.get('name'));
        Ext.MessageBox.confirm(
            this.msgs.immediateChanges,
            msg,
            this.onConfirmDeleteDept,
            this
        );
    },

    onConfirmDeleteDept : function(btn) {
        if (btn === 'yes') {
            var selectedDeptRecord = this.getComponent('departmentList').getSelected();

            var msg = String.format(
                this.msgs.deactivatingDepartment,
                selectedDeptRecord.get('name')
            );

            Ext.getBody().mask(msg, 'x-mask-loading');
            Ext.Ajax.request({
                url          : 'departments/unsetDepartment',
                scope        : this,
                callback     : this.workspace.onAfterAjaxReq,
                succCallback : this.onAfterConfirmDeleteDept,
                params       : {
                    id : selectedDeptRecord.get('id')
                }
            });
        }
    },

    onAfterConfirmDeleteDept : function() {
        var selectedDeptRecord = this.getComponent('departmentList').getSelected();

        var msg = String.format(
            this.msgs.succDeleteDept,
            selectedDeptRecord.get('name')
        );
        Ext.MessageBox.alert('Success', msg);
        selectedDeptRecord.store.remove(selectedDeptRecord);
        this.clearFormPanel();

        Ext.getBody().unmask();
    },


    onDeptFormEditEmployee : function(departmentForm, grid, record) {
        new CompanyManager.EmployeeEditorWindow({
            record    : record,
            listeners : {
                employeesaved : {
                    single : true,
                    scope  : this,
                    fn     : this.onEmployeeWindowSaveSuccess
                }
            }
        }).show();
    },

    onDeptFormNewEmployee : function(departmentForm) {
        var departmentId = departmentForm.getValues().id;
        new CompanyManager.EmployeeEditorWindow({
            departmentId : departmentId,
            listeners    : {
                employeeSaved : {
                    single : true,
                    scope  : this,
                    fn     : this.onEmployeeWindowSaveSuccess
                }
            }
        }).show();
    },

    onEmployeeWindowSaveSuccess : function(formVals, action, record) {
        var msg = String.format(
            this.msgs.empSavedSuccessfully,
            formVals.firstName,
            formVals.lastName
        );


        if (record) {
            if (formVals.departmentId !== record.get('departmentId')) {
                record.store.remove(record);
            }
            else {
                for (var val in formVals) {
                    record.set(val, formVals[val]);
                }
                record.commit();
            }
        }
        else {
            this.getComponent('departmentForm').addRecordsToEmployeeGrid(action.result.data);
        }
        Ext.MessageBox.alert('Success', msg);
    },


    onDeleteEmployees : function(records) {
        var employees = this.spoolEmpIdsFromRecords(records);
        if (employees.length > 0) {
            var msg = String.format(this.msgs.deleteEmployeeConfirm, records.length);
            
            Ext.MessageBox.confirm(
                'Please Confirm',
                msg,
                function(btn) {
                    if (btn === 'yes')  {
                        this.onConfirmDeleteEmployees(records, employees);
                    }
                },
                this
             );
        }
    },

    onConfirmDeleteEmployees : function(records, employees) {
        var msg = String.format(this.msgs.doSomethingOnEmployees, 'Deleteing', records.length);
        Ext.getBody().mask(msg, 'x-mask-loading');

        Ext.Ajax.request({
            url          : 'employees/deleteEmployees',
            scope        : this,
            callback     : this.workspace.onAfterAjaxReq,
            succCallback : this.onAfterConfirmDeleteEmployees,
            records      : records,
            params       : {
                employeeIds : Ext.encode(employees)
            }
        });
    },

    onAfterConfirmDeleteEmployees : function(jsonData, options) {
        Ext.each(options.records, function(record) {
            record.store.remove(record);
        });
        var msg = String.format(this.msgs.doSomethingOnEmployees, 'Deleted', options.records.length);
        Ext.MessageBox.alert('Success', msg);
    },

    onAssociateEmployees : function(records, windowGrid, assocWindow) {
        var deptRec =  this.getComponent('departmentList').getSelected();
        var msg = String.format(
            this.msgs.assocEmployeeConfirm,
            records.length,
            deptRec.get('name')
        );

        Ext.MessageBox.confirm(
            this.msgs.immediateChanges,
            msg,
            function(btn) {
                if (btn === 'yes') {
                    this.onConfirmAssocEmployees(records,  windowGrid, assocWindow, deptRec);
                }
            },
            this
        );
    },

    onConfirmAssocEmployees : function(recs, windowGrid, assocWindow, deptRec) {

        var employees = this.spoolEmpIdsFromRecords(recs);
        var msg = String.format(
            this.msgs.associatingEmployees,
            recs.length,
            deptRec.get('name')
        );

        Ext.getBody().mask(msg, 'x-mask-loading');

        Ext.Ajax.request({
            url          : 'employees/assocToDepartment',
            scope        : this,
            callback     : this.workspace.onAfterAjaxReq,
            succCallback : this.onAfterAssocEmployees,
            records      : recs,
            deptName     : deptRec.get('name'),
            windowGrid   : windowGrid,
            params       : {
                departmentId : deptRec.get('id'),
                employeeIds  : Ext.encode(employees)
            }
        });

    },

    onAfterAssocEmployees : function(jsonData, options) {
        var msg = String.format(
            this.msgs.assocEmployeeSuccess,
            options.records.length,
            options.deptName
        );
        Ext.MessageBox.alert('Success', msg);
        options.windowGrid.remove(options.records);
        this.getComponent('departmentForm').addRecordsToEmployeeGrid(options.records);
    },
    
    clearFormPanel : function() {
         this.getComponent('departmentList').clearSelections();
         this.getComponent('departmentForm').clearForm();
     },

    spoolEmpIdsFromRecords : function(records) {
        var employees = [];
    
        Ext.each(records, function(record) {
            employees.push({
                id : record.get('id')
            });
        });

        return employees;
    },
    cleanSlate : function() {
        this.clearFormPanel();
        this.getComponent('departmentList').refreshView();
    }

});

Ext.reg('departmentmanager', CompanyManager.DepartmentManager);