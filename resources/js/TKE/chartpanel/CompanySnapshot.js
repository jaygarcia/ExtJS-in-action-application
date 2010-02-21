Ext.ns('TKE.chartpanel');
/**
 * @class TKE.chartpanel.CompanySnapshot
 * @extends TKE.chartpanel.ChartPanelBaseClass
 * An canned implementation extension to {@link TKE.chartpanel.ChartPanelBaseClass}, which provides a means to display
 * the number of employees obtained, retained since the company's creation. <br />
 * <br />
 * <!--
 * {@link TKE.chartpanel.ChartPanelBaseClass#methodOne this is method one} <br/>
 * {@link TKE.chartpanel.ChartPanelBaseClass#methodOne} <br/>
 * {@link #methodOne another link} <br/>
 * {@link #methodOne} <br/>
 * {@link TKE.chartpanel.ChartPanelBaseClass} <br/>
 * {@link TKE.chartpanel.ChartPanelBaseClass sample class} <br/>
 *  -->
 * @constructor
 * @xtype total_employees_chart
 **/
TKE.chartpanel.CompanySnapshot = Ext.extend(TKE.chartpanel.ChartPanelBaseClass, {
    //private
    //An implementation of the {@link TKe.chartpanel.ChartPanelBaseClass#buildChart TKE.chartpanel.ChartPanelBaseClass.buildChart} method.
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
    // An implementation of the {@link TKe.chartpanel.ChartPanelBaseClass#buildStore TKE.chartpanel.ChartPanelBaseClass.buildStore} method.
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
    // An implementation of the {@link TKe.chartpanel.ChartPanelBaseClass#buildSeries TKE.chartpanel.ChartPanelBaseClass.buildSeries} method.
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
