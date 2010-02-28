Ext.ns('TKE.chartpanel');
/**
 * @class TKE.chartpanel.CompanySnapshot
 * @extends TKE.chartpanel.ChartPanelBaseCls
 * An canned implementation extension to {@link TKE.chartpanel.ChartPanelBaseCls}, which provides a means to display
 * the number of employees obtained, retained since the company's creation. <br />
 * <br />
 * <!--
 * {@link TKE.chartpanel.ChartPanelBaseCls#methodOne this is method one} <br/>
 * {@link TKE.chartpanel.ChartPanelBaseCls#methodOne} <br/>
 * {@link #methodOne another link} <br/>
 * {@link #methodOne} <br/>
 * {@link TKE.chartpanel.ChartPanelBaseCls} <br/>
 * {@link TKE.chartpanel.ChartPanelBaseCls sample class} <br/>
 *  -->
 * @constructor
 * @xtype total_employees_chart
 **/
TKE.chartpanel.CompanySnapshot = Ext.extend(TKE.chartpanel.ChartPanelBaseCls, {
    //private
    //An implementation of the {@link TKe.chartpanel.ChartPanelBaseCls#buildChart TKE.chartpanel.ChartPanelBaseCls.buildChart} method.
    buildChart : function() {
        return {
            xtype       : 'stackedcolumnchart',
            store       : this.buildStore(),
            xField      : 'year',
            tipRenderer : this.tipRenderer,
            series      : this.buildSeries(),
            extraStyle  : this.chartExtraStyles,
            xAxis       : new Ext.chart.CategoryAxis({
                title : 'Year Hired'
            }),
            yAxis : new Ext.chart.NumericAxis({
                stackingEnabled : true,
                title           : 'Number of employees'
            })
        };
    },
    // private
    // An implementation of the {@link TKe.chartpanel.ChartPanelBaseCls#buildStore TKE.chartpanel.ChartPanelBaseCls.buildStore} method.
    buildStore : function() {
        return  {
            xtype    : 'jsonstore',
            autoLoad : true,
            url      : this.url,
            fields   : [
                'year','numFired', 'prevHired', 'total', 'newHires'
            ]
        };
    },
    //private
    // An implementation of the {@link TKe.chartpanel.ChartPanelBaseCls#buildSeries TKE.chartpanel.ChartPanelBaseCls.buildSeries} method.
    buildSeries : function() {
        var seriesStyles = this.seriesStyles;

        return [
            {
                yField      : 'numFired',
                displayName : 'Lost',
                style       : seriesStyles.red
            },
            {
                yField      : 'prevHired',
                displayName : 'Retained',
                style       : seriesStyles.yellow
            },
            {
                yField      : 'newHires',
                displayName : 'Obtained',
                style       : seriesStyles.green
            },
            {
                type        : 'line',
                yField      : 'total',
                displayName : 'Total',
                style       : seriesStyles.blue
            }
        ];
    }
});

Ext.reg('companysnapshot', TKE.chartpanel.CompanySnapshot);
