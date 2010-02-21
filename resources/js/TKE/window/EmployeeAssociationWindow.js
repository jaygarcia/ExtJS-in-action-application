Ext.ns("TKE.window");

/**
 * @class TKE.window.EmployeeAssociationWindow
 * @extends Ext.Window
 * An Ext.Window implementation that contains at least two implementations of {@link TKE.chartpanel.ChartPanelBaseClass}.  <br />
 * The first (left) chart is a
 * It uses the {@link Ext.layout.VBoxLayout vbox} layout to organize the {@link TKE.chartpanel.ChartPanelBaseClass} implementations.
 * <br />
 * @constructor
 * @param {Object} config The config object
 * @xtype company_snapshot_panel
 **/

TKE.window.EmployeeAssociationWindow = Ext.extend(Ext.Window, {
    width          : 600,
    height         : 400,
    maxWidth       : 600,
    maxHeight      : 500,
    modal          : true,
    border         : false,
    closable       : false,
    center         : true,
    constrain      : true,
    resizable      : true,
    departmentName : ' ',
    departmentId   : null,
    layout         :  {
        type  : 'hbox',
        align : 'stretch'
    },

    initComponent  : function() {

        Ext.apply(this, {
            title   : 'Add employees to ' + this.departmentName,
            buttons : this.buildButtons(),
            items   : [
                this.buildListViewPanel(),
                this.buildGridPanel()
            ]
        });

        TKE.window.EmployeeAssociationWindow.superclass.initComponent.call(this);
        this.addEvents({
            assocemployees : true
        });
    },

    buildButtons : function() {
         return [
            {
                 text    : 'Close',
                 iconCls : 'icon-cross',
                 scope   : this,
                 handler : this.onClose
            },
            {
                text    : 'Add',
                iconCls : 'icon-user_add',
                scope   : this,
                handler : this.onAddToDepartment
            }
        ];
    },

    buildListViewPanel : function() {
        return {
            xtype         : 'departmentlist',
            itemId        : 'departmentList',
            title         : 'Departments',
            frame         : true,
            width         : 150,
            autoLoadStore : true,
            listeners     : {
                scope : this,
                click : this.onDepartmentListClick,
                load  : this.onDepartmentStoreLoad
            }
        };
    },

    buildGridPanel : function() {
        return {
            xtype    : 'employeegridpanel',
            itemId   : 'employeeGrid',
            loadMask : true,
            frame    : true,
            title    : 'Employees',
            flex     : 1
        };
    },

    onClose : function() {
        this.close();
    },

    onAddToDepartment : function() {
        var employeeGrid = this.getComponent('employeeGrid');
        var selectedRecords = employeeGrid.getSelected();

        if (selectedRecords.length > 0) {
           this.fireEvent('assocemployees', selectedRecords, employeeGrid, this);
        }
    },
    

    onDepartmentListClick : function(listView) {
        var record = listView.getSelectedRecords()[0];
        var employeeGrid = this.getComponent('employeeGrid');
        employeeGrid.load({
            params : {
                id : record.get('id')
            }
        });

        employeeGrid.setTitle('Employees for department ' + record.get('name'));
    },

    onDepartmentStoreLoad : function(store) {
        var deptRecInd = store.find('id', this.departmentId);
        store.remove(store.getAt(deptRecInd));
    }
});