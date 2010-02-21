Ext.ns("TKE.listpanel");

/**
 * @class TKE.listpanel.EmployeeList
 * @extends TKE.listpanel.ListPanelBaseClass
 * A configuration instance of {@link TKE.listpanel.ListPanelBaseClass}
 * <br />
 * @constructor
 * @param {Object} config The config object
 **/
TKE.listpanel.EmployeeList = Ext.extend(TKE.listpanel.ListPanelBaseClass, {
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