Ext.ns("TKE.listpanel");

/**
 * @class TKE.listpanel.EmployeeList
 * @extends TKE.listpanel.ListPanelBaseCls
 * A configuration instance of {@link TKE.listpanel.ListPanelBaseCls}
 * <br />
 * @constructor
 * @param {Object} config The config object
 **/
TKE.listpanel.EmployeeList = Ext.extend(TKE.listpanel.ListPanelBaseCls, {
    url           : 'employees/listForDepartment',
    buildListView : function() {
        return {
            xtype         : 'listview',
            singleSelect  : true,
            store         : this.buildStore(),
            style         : 'background-color: #FFFFFF;',
            columns       : [
                {
                    header    : 'Last Name',
                    dataIndex : 'lastName'
                },
                {
                    header    : 'First Name',
                    dataIndex : 'firstName'
                }
            ]
        };
    },
    buildStore : function() {
         return {
             xtype       : 'jsonstore',
             autoLoad    : this.autoLoadStore || false,
             url         : this.url,
             fields      : [ 'lastName', 'firstName', 'id' ],
             sortInfo    :  {
                 field     : 'lastName',
                 direction : 'ASC'
             }
         };
    }
});
Ext.reg('employeelist', TKE.listpanel.EmployeeList);