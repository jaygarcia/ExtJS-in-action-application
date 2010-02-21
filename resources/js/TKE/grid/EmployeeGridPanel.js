Ext.ns('TKE.grid');

TKE.grid.EmployeeGridPanel = Ext.extend(Ext.grid.GridPanel, {
    url           : 'employees/listForDepartment',
    viewConfig    : { forceFit : true },
    columns       : [
        {
            header    : 'Last Name',
            dataIndex : 'lastName',
            sortable  : true
        },
        {
            header    : 'First Name',
            dataIndex : 'firstName',
            sortable  : true
        },
        {
            header    : 'Email',
            dataIndex : 'email',
            sortable  : true
        },
        {
            header    : 'Date Hired',
            dataIndex : 'dateHired',
            sortable  : true
        },
        {
            header    : 'Rate',
            dataIndex : 'rate',
            sortable  : true,
            renderer  : Ext.util.Format.usMoney
        }
    ],

    initComponent : function() {
        this.store = this.buildStore();
        TKE.grid.EmployeeGridPanel.superclass.initComponent.call(this);
    },
    buildStore : function() {
        return  {
            xtype    : 'jsonstore',
            url      : this.url,
            autoLoad : false,
            fields   : [
                'id', 'lastName', 'firstName', 'email',
                'dateHired', 'rate', 'departmentId'
            ],
            sortInfo : {
                field : 'lastName',
                dir   : 'ASC'
            }
        };
    },

    add : function(r) {
        var store = this.store;
        var sortInfo = store.sortInfo;
        
        if (Ext.isArray(r)) {
            Ext.each(r, function(rObj, ind) {
                if (! (rObj instanceof Ext.data.Record)) {
                    r[ind] = new this.store.recordType(rObj);
                }
            });
        }
        else if (Ext.isObject(r) && ! (r instanceof Ext.data.Record)) {
            r = new this.store.recordType(r);
        }
        
        store.add(r);
        store.sort(sortInfo.field, sortInfo.direction);
    },
    loadData : function(d) {
        return this.store.loadData(d);
    },
    load : function(o) {
        return this.store.load(o);
    },
    removeAll : function() {
        return this.store.removeAll();
    },
    
    remove    : function(r) {
        return this.store.remove(r);
    },
    getSelected : function() {
        return this.selModel.getSelections();
    }
});

Ext.reg('employeegridpanel', TKE.grid.EmployeeGridPanel)