Ext.ns("TKE.form");

/**
 * @class TKE.form.EmployeeForm
 * @extends TKE.form.FormPanelBaseCls
 *  An Ext.form.FormPanel implementation that contains a number of fields to manage employee data
 * <br />
 * @constructor
 * @param {Object} config The config object
 * @xtype employeeform
 **/
TKE.form.EmployeeForm = Ext.extend(TKE.form.FormPanelBaseCls, {
    border        : true,
    autoScroll    : true,
    bodyStyle     : 'background-color: #DFE8F6; padding: 10px',
    layout        : 'form',
    labelWidth    : 40,
    defaultType   : 'textfield',
    defaults      : {
        width      : 200,
        maxLength  : 255,
        allowBLank : false
    },
    //private
    //constructs the form layout elements.
    initComponent : function() {
        Ext.applyIf(this, {
            tbar  : this.buildTbar(),
            items : this.buildFormItems()
        });

        TKE.form.EmployeeForm.superclass.initComponent.call(this);

        this.addEvents({
            /**
             * @event newemp
             * Fired after the new employee button is pressed
             *
             */
            newemp    : true,
            saveemp   : true,
            delemp    : true
        });

        if (this.record) {
            this.on({
                scope  : this,
                render : {
                    single : true,
                    fn     : this.loadFormAfterRender
                }
            });
        }
    },

    buildTbar : function() {
        return [
            {
                text    : 'Save',
                iconCls : 'icon-disk',
                scope   : this,
                handler : this.onSave
            },
            '-',
            {
                text    : 'Reset',
                iconCls : 'icon-arrow_undo',
                scope   : this,
                handler : this.onReset
            },
            '-',
            {
                text    : 'New Employee',
                iconCls : 'icon-user_add',
                scope   : this,
                handler : this.onNew
            },
            '->',
            {
                text    : 'Delete Employee',
                iconCls : 'icon-user_delete',
                scope   : this,
                handler : this.onDelete
            }
        ];
    },
    buildFormItems : function() {
        var nameContainer             = this.buildNameContainer(),
            departmentSalaryContainer = this.buildDepartmentInfoContainer(),
            emailDobContainer         = this.buildEmailDobContainer(),
            cityStateZip              = this.buildCityStateZipContainer(),
            phoneNumbers              = this.buildPhoneNumbersContainer();
             
        return [
            {
                xtype : 'hidden',
                name  : 'id'
            },
            {
                xtype : 'hidden',
                name  : 'departmentId'
            },
            nameContainer,
            emailDobContainer,
            phoneNumbers,
            departmentSalaryContainer,
            {
                fieldLabel : 'Street',
                name       : 'street',
                width      : 300
            },
            cityStateZip
        ];
    },

    buildNameContainer : function() {
        return {
            xtype          : 'container',
            layout         : 'column',
            anchor         : '-10',
            defaultType    : 'container',
            defaults       : {
                width      : 150,
                labelWidth : 40,
                layout     : 'form'
            },
            items          : [
                {
                    labelWidth : 40,
                    items      :  {
                        xtype      : 'textfield',
                        fieldLabel : 'Last',
                        name       : 'lastName',
                        anchor     : '-10',
                        allowBlank : false,
                        maxLength  : 50
                    }
                },
                {
                    items      :  {
                        xtype      : 'textfield',
                        fieldLabel : 'Middle',
                        name       : 'middle',
                        anchor     : '-10',
                        maxLength  : 50
                    }
                },
                {
                    labelWidth : 30,
                    items      :  {
                        xtype      : 'textfield',
                        fieldLabel : 'First',
                        name       : 'firstName',
                        anchor     : '-10',
                        allowBlank : false,
                        maxLength  : 50
                    }
                },
                {
                    labelWidth : 30,
                    width      : 90,
                    items      :  {
                        xtype      : 'textfield',
                        fieldLabel : 'Title',
                        name       : 'title',
                        anchor     : '-10',
                        maxLength  : 5
                    }
                }
            ]
        };
    },
    buildDepartmentInfoContainer : function() {
        return {
            xtype       : 'container',
            layout      : 'column',
            anchor      : '-10',
            defaultType : 'container',
            defaults    : {
                width      : 200,
                layout     : 'form'
            },
            items       : [
                {
                    labelWidth : 40,
                    width      : 175,
                    items      :  {
                        xtype      : 'datefield',
                        fieldLabel : 'Hired',
                        anchor     : '-10',
                        name       : 'dateHired'
                    }
                },
                {
                    labelWidth : 50,
                    width      : 145,
                    items      :  {
                        xtype            : 'numberfield',
                        fieldLabel       : 'Rate/hr',
                        name             : 'rate',
                        allowDecimals    : true,
                        anchor           : '-10',
                        decimalPrecision : 2
                    }
                }
            ]
        };
    },
    buildEmailDobContainer : function() {
        return {
            xtype       : 'container',
            layout      : 'column',
            defaultType : 'container',
            anchor      : '-10',
            defaults    : {
                layout     : 'form'
            },
            items   : [
                {
                    labelWidth : 40,
                    width      : 325,
                    items      : {
                        xtype      : 'textfield',
                        fieldLabel : 'Email',
                        name       : 'email',
                        anchor     : '-10',
                        maxLength  : 50
                    }
                },
                {
                    width      : 140,
                    labelWidth : 30,
                    items      : {
                        xtype      : 'datefield',
                        fieldLabel : 'DOB',
                        name       : 'dob',
                        allowBlank : true,
                        anchor     : '-10'
                    }
                }

            ]
        };
    },
    buildCityStateZipContainer : function() {
        return {
            xtype       : 'container',
            layout      : 'column',
            defaultType : 'container',
            anchor      : '-10',
            defaults    : {
                width      : 175,
                labelWidth : 40,
                layout     : 'form'
            },
            items   : [
                {
                    items : {
                        xtype      : 'textfield',
                        fieldLabel : 'City',
                        anchor     : '-10',
                        name       : 'city'
                    }
                },
                {
                    items  : {
                        xtype         : 'combo',
                        fieldLabel    : 'State',
                        name          : 'state',
                        displayField  : 'state',
                        editable      : false,
                        valueField    : 'state',
                        triggerAction : 'all',
                        anchor        : '-10',
                        store         : {
                            xtype  : 'jsonstore',
                            url    : 'states/getList',
                            fields : ['state']
                        }
                    }
                },
                {
                    labelWidth : 30,
                    items      : {
                        xtype      : 'numberfield',
                        fieldLabel : 'Zip',
                        name       : 'zip',
                        anchor     : '-10',
                        minLength  : 4,
                        maxLength  : 5
                    }
                }
            ]
        };
    },
    buildPhoneNumbersContainer : function() {
        return {
            xtype       : 'container',
            layout      : 'column',
            anchor      : '-10',
            defaultType : 'container',
            defaults    : {
                width      : 175,
                labelWidth : 40,
                layout     : 'form'
            },
            items   : [
                {
                    items : {
                        xtype      : 'textfield',
                        fieldLabel : 'Office',
                        anchor     : '-10',
                        name       : 'officePhone'
                    }
                },
                {
                    items : {
                        xtype      : 'textfield',
                        fieldLabel : 'Home',
                        anchor     : '-10',
                        name       : 'homePhone'
                    }
                },
                {
                    items : {
                        xtype      : 'textfield',
                        fieldLabel : 'Mobile',
                        anchor     : '-10',
                        name       : 'mobilePhone'
                    }
                }
            ]
        };
    },

    onNew : function() {
        this.clearForm();
        this.fireEvent('newemp', this);
    },
    onSave : function() {
        if (this.isValid()) {
            this.fireEvent('saveemp', this, this.getValues());
        }
    },
    onReset : function() {
        this.reset();
    },
    onDelete : function() {
        var vals = this.getValues();
        if (vals.id.length > 0) {
            this.fireEvent('delemp', this, vals);
        }
    },
    loadFormAfterRender : function() {
        this.load({
            url    : 'employees/getEmployee',
            params : {
                id  : this.record.get('id')
            }
        });
    }
});

Ext.reg('employeeform', TKE.form.EmployeeForm);

