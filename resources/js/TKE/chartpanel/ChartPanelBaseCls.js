Ext.ns('TKE.chartpanel');

/**
 * @class TKE.chartpanel.ChartPanelBaseCls
 * @extends Ext.Panel
 * A base class that contains the reusable bits of configuration, such as the extraChartStyles object
 * and seriesStyles object. <br />
 * It uses the {@link Ext.layout.FitLayout fit} layout to stretch the {@link Ext.chart.Chart} instance.
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
 * @param {Object} config The config object
 **/
TKE.chartpanel.ChartPanelBaseCls = Ext.extend(Ext.Panel, {
    frame       : false,
    layout      : 'fit',
    //private
    chartExtraStyles : {
        xAxis : {
           majorGridLines : {color: 0x999999,  size  : 1}
        },
        yAxis: {
            titleRotation  : -90
        },
        legend : {
            display : "bottom",
            padding : 5,
            spacing : 2,
            font    : { color : 0x000000,  family : "Arial", size   : 12 },
            border  : { size : 1, color  : 0x999999 }
        }
    },
    //private
    // The reusable series styles
    seriesStyles : {
        red : {
            fillColor   : 0xFFAAAA,
            borderColor : 0xAA3333,
            lineColor   : 0xAA3333
        },
        yellow : {
            fillColor   : 0xFFFFAA,
            borderColor : 0xFFAA33,
            lineColor   : 0x33AA33
        },
        green :  {
            fillColor   : 0xAAFFAA,
            borderColor : 0x33AA33,
            lineColor   : 0x33AA33
        },
        blue : {
            fillColor   : 0xAAAAFF,
            borderColor : 0x3333FF,
            lineColor   : 0x3333FF
        }
    },
    //private
    //Provides all of the setup required to make this class embed a chart with a fit layout. 
    initComponent : function() {
        this.items = this.buildChart();
        TKE.chartpanel.ChartPanelBaseCls.superclass.initComponent.call(this);
        /**
           * @event itemclick
           * Fires after the internal {Ext.chartpanel.Chart} has been clicked (relayed from the {Ext.chartpanel.Chart} instance)
           * @param {Ext.Panel} p the Panel which has been resized.
           * @param {Number} width The Panel's new width.
           * @param {Number} height The Panel's new height.
           */

        this.relayEvents(this.getChart(), ['itemclick']);
    },
    /**
     * Stub/template method designed to be implemented by subclasses.
     * @return {Object} Config object for Ext.chartpanel.Chart
     */
    buildChart : function() {
       return {};
    },
    /**
     * Stub/template method designed to be implemented by subclasses.
     * @return {Array} An array of series objects.
     */
    buildSeries : function() {
        return [];
    }, /**
     * Stub/template method designed to be implemented by subclasses.
     * @return {Object} A Ext.data.Store configuration object or instance of.
     */
    buildStore : function() {
        return [];
    },
    /**
     * A convenience method designed to return the only child item of this {@link Ext.Panel Panel} extension
     * @return {Ext.chartpanel.Chart}
     */
    getChart : function() {
        return this.items.items[0];
    },
    /**
     * A convenience method whose sole purpose is to return the {@link Ext.data.Store Ext.data.Store} that
     * the embedded {@link Ext.chartpanel.Chart Ext.chartpanel.Chart} is bound to.
     * @return {Ext.data.Store}
     */
    getStore : function() {
        return this.getChart().store;
    },
    /**
     * A cnovenience method to load the chart's Store based on passed params
     * @param params {Object} containg the typical parameters
     */
    loadStoreByParams : function(params) {
        params = params || {};
        this.getStore().load({
            params : params
        });
    },
    /**
     * The reusable tipRenderer method used by subclasses.  It is called by the {@link Ext.chartpanel.Chart} class and is <b>not to be called directly!</b>
     * @param chart {Object} {@link Ext.chartpanel.Chart}
     * @param record {Object} {@link Ext.data.Record}
     * @param index  {Number}
     * @param series {Object} {@link Ext.chartpanel.Series}
     * @return {String} The string data required to display the tip in the Ext.chartpanel.Chart falsh object.
     */
    tipRenderer :  function(chart, record, index, series){
        var yearInfo = "Year: " + record.get('year');
        var empInfo  =  'Employees ' + series.displayName + ': '+ record.get(series.yField);
        return yearInfo + '\n' + empInfo ;
    }
});
