Ext.ns("TKE.listpanel");

/**
 * @class TKE.listpanel.DepartmentList
 * @extends TKE.listpanel.ListPanelBaseClass
 * A configuration instance of {@link TKE.listpanel.ListPanelBaseClass}
 * <br />
 * @constructor
 * @param {Object} config The config object
 **/

TKE.listpanel.DepartmentList = Ext.extend(TKE.listpanel.ListPanelBaseClass, {
    url : 'departments/getList',
    buildListView : function() {
        return {
            xtype         : 'listview',
            singleSelect  : true,
            store         : this.buildStore(),
            style         : 'background-color: #FFFFFF;',
            columns       : [
                {
                    header    : 'Department Name',
                    dataIndex : 'name'
                }
            ]
        };
    },
    
    buildStore : function() {
        return  {
            xtype    : 'jsonstore',
            autoLoad : this.autoLoadStore,
            url      : this.url,
            fields   : [ 'name', 'id', 'description', 'dateActive' ],
            sortInfo : {
                field : 'name',
                dir   : 'ASC'
            }
        };
    }

});
Ext.reg('departmentlist', TKE.listpanel.DepartmentList);

