Ext.ns('TKE.chartpanel');

/**
 * @class TKE.chartpanel.DepartmentBreakdown
 * @extends TKE.chartpanel.ChartPanelBaseCls
 * An canned implementation extension to {@link TKE.chartpanel.ChartPanelBaseCls}, which provides a means to display
 * the number of employees obtained, retained and lost within a given year. <br />
 * <br />
 * @constructor
 * @xtype department_breakdown_chart
 **/
TKE.chartpanel.DepartmentBreakdown = Ext.extend(TKE.chartpanel.ChartPanelBaseCls, {
    //private
    //An implementation of the {@link TKe.chartpanel.ChartPanelBaseCls#buildChart TKE.chartpanel.ChartPanelBaseCls.buildChart} method.
    buildChart : function() {
        return {
            xtype      : 'stackedbarchart',
            store      : this.buildStore(),
            yField     : 'name',
            series     : this.buildSeries(),
            extraStyle : this.chartExtraStyles,
            xAxis      : new Ext.chart.NumericAxis({
                xField          : 'newHires',
                stackingEnabled : true
            }),
            yAxis      :  new Ext.chart.CategoryAxis({
                xField : 'newHires',
                yField : 'name'
            })
        };
    },
    // private
    // An implementation of the {@link TKe.chartpanel.ChartPanelBaseCls#buildStore TKE.chartpanel.ChartPanelBaseCls.buildStore} method.
    buildStore : function() {
        return {
            xtype    : 'jsonstore',
            autoLoad : false,
            url      : this.url,
            fields   : [
                'name','numFired', 'prevHired', 'total', 'newHires'
            ]
        };
    },
    //private
    // An implementation of the {@link TKe.chartpanel.ChartPanelBaseCls#buildSeries TKE.chartpanel.ChartPanelBaseCls.buildSeries} method.
    buildSeries : function() {
        var seriesStyles = this.seriesStyles;

        return [
            {
                xField      : 'numFired',
                displayName : 'Lost',
                style       : seriesStyles.red
            },
            {
                xField      : 'prevHired',
                displayName : 'Retained',
                style       : seriesStyles.yellow
            },
            {
                xField      : 'newHires',
                displayName : 'Obtained',
                style       : seriesStyles.green
            },
            {
                type        : 'line',
                xField      : 'total',
                displayName : 'Total',
                style       : seriesStyles.blue
            }
        ];
    }
});

Ext.reg('departmentbreakdown', TKE.chartpanel.DepartmentBreakdown);