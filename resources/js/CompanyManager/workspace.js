Ext.ns("CompanyManager");
//Ext.chart.Chart.CHART_URL='resources/js/ext3/resources/charts.swf';
Ext.chart.Chart.CHART_URL='resources/js/overrides/chart/charts.swf';

/**
 * @class CompanyManager.workspace
 * NEEDS DESCRIPTION
 * <br />
 * @constructor
 * @singleton
 **/
CompanyManager.workspace = function() {
    var viewport, cardPanel, loginWindow,
        cookieUtil = Ext.util.Cookies;

    return {
        init : function() {
            if (! cookieUtil.get('loginCookie')) {
                if (! loginWindow) {
                    loginWindow = this.buildLoginWindow();
                }
                loginWindow.show();
            }
            else {
                this.buildViewport();
            }
        },

        buildLoginWindow : function() {
            return new TKE.window.UserLoginWindow({
                scope   : this,
                handler : this.onLogin
            });
        },
    
        
        buildViewport : function() {
            cardPanel = new Ext.Panel({
                layout     : 'card',
                activeItem : 0,
                border     : false,
                items      :  [
                    {
                        xtype  : 'dashboard'
                    },
                    {
                        xtype  : 'departmentmanager'
                    },
                    {
                        xtype  : 'employeemanager'
                    }
                ],
                tbar : [
                    {
                        text          : 'Dashboard',
                        iconCls       : 'icon-chart_curve',
                        toggleGroup   : 'navGrp',
                        itemType      : 'dashboard',
                        enableToggle  : true,
                        pressed       : true,
                        scope         : this,
                        handler       : this.onSwitchPanel
                    },
                    '-',
                    {
                        text         : 'Manage Departments',
                        iconCls      : 'icon-group_edit',
                        itemType     : 'departmentmanager',
                        toggleGroup  : 'navGrp',
                        enableToggle : true,
                        scope        : this,
                        handler      : this.onSwitchPanel
                    },
                    '-',
                    {
                        text         : 'Manage Employees',
                        iconCls      : 'icon-user_edit',
                        itemType     : 'employeemanager',
                        toggleGroup  : 'navGrp',
                        enableToggle : true,
                        scope        : this,
                        handler      : this.onSwitchPanel
                    },
                    '->',
                    {
                        text     : 'Log out',
                        iconCls  : 'icon-door_out',
                        scope    : this,
                        handler  : this.onLogOut
                    }
                ]
            });

            viewport = new Ext.Viewport({
                layout : 'fit',
                items  : cardPanel
            });
            Ext.getBody().unmask();
        },
        onLogin :  function() {
            var form = loginWindow.get(0);
            if (form.getForm().isValid()) {
                loginWindow.el.mask('Please wait...', 'x-mask-loading');

                form.getForm().submit({
                    success : this.onLoginSuccess,
                    failure : this.onLoginFailure,
                    scope   : this
                });
            }
        },

        onLoginSuccess : function() {
            loginWindow.el.unmask();
            var cookie = cookieUtil.get('loginCookie');
            if (cookie) {
                this.buildViewport();
                loginWindow.destroy();
                loginWindow = null;
            }
            else {
                this.onLoginFailure();
            }
        },

        onLoginFailure : function() {
            loginWindow.el.unmask();
            Ext.MessageBox.alert('Failure', "Login failed. Please try again");
        },

        onLogOut : function() {
            Ext.MessageBox.confirm(
                'Please confirm',
                'Are you sure you want to log out?',
                function(btn) {
                    if (btn === 'yes') {
                       this.doLogOut();
                    }
                },
                this
            );
        },
        doLogOut : function() {
            Ext.getBody().mask('Logging out...', 'x-mask-loading');

            Ext.Ajax.request({
                url          : 'userlogout.php',
                params       : { user : cookieUtil.get('loginCookie') },
                scope        : this,
                callback     : this.onAfterAjaxReq,
                succCallback : this.onAfterLogout
            });
        },
        onAfterLogout : function() {
            this.destroy();
        },

        onSwitchPanel : function(btn) {
            var xtype    = btn.itemType,
                panels   = cardPanel.findByType(xtype),
                newPanel = panels[0];

            var newCardIndex = cardPanel.items.indexOf(newPanel);
            this.switchToCard(newCardIndex);
        },
        switchToCard : function(newCardIndex) {
            var layout         = cardPanel.getLayout(),
                activePanel    = layout.activeItem,
                activePanelIdx = cardPanel.items.indexOf(activePanel);

            if (activePanelIdx !== newCardIndex) {
                var  newPanel = cardPanel.items.itemAt(newCardIndex);

                layout.setActiveItem(newCardIndex);

                if (newPanel.cleanSlate) {
                    newPanel.cleanSlate();
                }
            }
        },

        onAfterAjaxReq : function(options, success, result) {
            Ext.getBody().unmask();
            if (success === true) {
                var jsonData;
                try {
                    jsonData = Ext.decode(result.responseText);
                }
                catch (e) {
                    Ext.MessageBox.alert('Error!', 'Data returned is not valid!');
                }
                options.succCallback.call(options.scope, jsonData, options);

            }
            else {
                Ext.MessageBox.alert('Error!', 'The web transaction failed!');
            }
        },

        destroy : function() {
            viewport.destroy();
            viewport  = null;
            cardPanel = null;
            this.init();
        }
    };
}();


Ext.onReady(CompanyManager.workspace.init, CompanyManager.workspace);