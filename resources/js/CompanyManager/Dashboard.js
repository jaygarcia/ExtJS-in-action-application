Ext.ns('CompanyManager');

/**
 * @class CompanyManager.Dashboard
 * @extends Ext.Container
 * An Ext.Container implementation that contains at least two implementations of {@link TKE.chartpanel.ChartPanelBaseCls}.  <br />
 * The first (left) chart is a 
 * It uses the {@link Ext.layout.VboxLayout vbox} layout to organize the {@link TKE.chartpanel.ChartPanelBaseCls} implementations.
 * <br />
 * @constructor
 * @param {Object} config The config object
 * @xtype company_snapshot_panel
 **/
CompanyManager.Dashboard = Ext.extend(Ext.Container, {
    border  : false,
    /**
     * @cfg {Object} layout  The layout that you desire to use.
     * defaults to { type : 'hbox', align : 'stretch' }
     */
    layout  : {
        type  : 'hbox',
        align : 'stretch'
    },
    //private
    defaults : {
        style : 'background-color: #DFE8F6; padding: 10px',
        flex  : 1
    },
    /**
     * @cfg {Object} msgs an object containing messages. <br />
     * defaults to { deptBreakdown : 'Department breakdown for year: {0}' }
     */
    msgs : {
        deptBreakdown : 'Department breakdown for year: {0}'
    },
    //private
    // Instantiates the instance of the CompanySnapshot and DepartmentBreakdown and configures accordingly.
    initComponent : function() {
        this.items =  [
            {
                xtype     : 'companysnapshot',
                itemId    : 'companysnapshot',
                url       : 'stats/getYearlyStats',
                title     : 'Company Snapshot',
                listeners : {
                    scope     : this,
                    itemclick : this.onCompanySnapshotItemClick
                }
            },
            {
                xtype  : 'departmentbreakdown',
                url    : 'stats/getDeptBreakdown',
                itemId : 'departmentbreakdown',
                title  : 'Department Breakdown'
            }
        ];
        
        CompanyManager.Dashboard.superclass.initComponent.call(this);
    },
    //private
    // The listener for the relayed item click
    onCompanySnapshotItemClick : function(evtObj){
        var record = evtObj.component.store.getAt(evtObj.index);
        var dptBrkDwnChart = this.getComponent('departmentbreakdown');
        dptBrkDwnChart.loadStoreByParams({
            year : record.get('year')
        });

        var msg = String.format(this.msgs.deptBreakdown, record.get('year'));
        dptBrkDwnChart.setTitle(msg);
    }
});

Ext.reg('dashboard', CompanyManager.Dashboard);