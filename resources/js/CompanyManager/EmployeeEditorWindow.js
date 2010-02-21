Ext.ns('CompanyManager');

/**
 * @class CompanyManager.EmployeeEditorWindow
 * @extends Ext.Window
 * An Ext.Window implementation that contains  the {@link Ext.layout.FitLayout fit} layout to
 *  present {@link TKE.form.EmployeeForm} implementation.
 * <br />
 * @constructor
 * @param {Object} config The config object
 **/
CompanyManager.EmployeeEditorWindow = Ext.extend(Ext.Window, {
    layout    : 'fit',
    modal     : true,
    width     : (Ext.isIE) ? 620 : 590,
    height    : (Ext.isIE) ? 255 : 245,
    resizable : false,
    draggable : false,
    center    : true,
    closable  : false,
    initComponent : function() {

        var employeeMgrMsgs = CompanyManager.EmployeeManager.prototype.msgs;

        this.msgs = Ext.apply({
            saving       : "Saving {0}, {1}...",
            editingTitle : 'Editing : {0}, {1}',
            newTitle     : "Add new employee"
        }, employeeMgrMsgs);

        Ext.applyIf(this,{
            title   : this.configureTitle(),
            iconCls : (this.record) ? 'icon-user_edit' : 'icon-user_add',
            items   : this.buildEmployeeForm(),
            buttons : this.buildButtons()
        });

        this.addEvents({
            employeesaved : true
        });
        
        CompanyManager.EmployeeEditorWindow.superclass.initComponent.call(this);

        if (! this.record && this.departmentId) {
            this.getComponent('employeeForm').getForm().setValues({
                departmentId : this.departmentId,
                dateHired    : new Date()
            });
        }
    },

    buildEmployeeForm : function() {
        return {
            xtype  : 'employeeform',
            border : false,
            itemId : 'employeeForm',
            record : this.record,
            tbar   : null
        };
    },

    buildButtons : function() {
        return [
            {
                text    : 'Cancel',
                iconCls : 'icon-cross',
                scope   : this,
                handler : this.onCancelBtn
            },
            {
                text    : 'Save',
                iconCls : 'icon-disk',
                scope   : this,
                handler : this.onSaveBtn
            }
        ];
    },

    configureTitle : function() {
        if (this.record && this.record instanceof Ext.data.Record) {
            return String.format(
                this.msgs.editingTitle,
                this.record.get('lastName'),
                this.record.get('firstName')
            );
        }
        else {
            return this.msgs.newTitle;
        }
    },

    onSaveBtn : function() {
        var formPanel = this.getComponent('employeeForm');

        if (formPanel.getForm().isValid()) {
            var vals = formPanel.getValues();

            var msg = String.format(
                this.msgs.saving,
                vals.firstName,
                vals.lastName
            );

            var onSaveFailure = CompanyManager.EmployeeManager.prototype.onEmpFormSaveFailure;

            this.el.mask(msg, 'x-mask-loading');

            formPanel.getForm().submit({
                url     : 'employees/setEmployee',
                scope   : this,
                success : this.onFormSaveSuccess,
                failure : onSaveFailure
            });
        }
        else {
            Ext.MessageBox.alert(
                'Error!',
                this.msgs.errorsInForm
            );
        }
    },
    onCancelBtn : function() {
        this.close();
    },
    onFormSaveSuccess : function(form, action) {
        var vals = form.getValues();
        this.fireEvent('employeesaved', vals, action, this.record);
        this.close();
    }
});