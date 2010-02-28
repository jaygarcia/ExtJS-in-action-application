Ext.ns("TKE.window");

/**
 * @class TKE.window.UserLoginWindow
 * @extends Ext.Window
 * A class to manage user logins
 * @constructor
 */
TKE.window.UserLoginWindow = Ext.extend(Ext.Window, {
    /**
     * @cfg scope [Object} A refrence to the handler scope
     */
    /**
     * @cfg handler {Object} A reference to a method to be called to process the login
     */
    /**
     * @private
     * Configures the component, enforcing defaults
     */
    initComponent : function() {
        // Force defaults
        Ext.apply(this, {
            width     : 250,
            height    : 125,
            modal     : true,
            draggable : false,
            title     : 'Login to Department Manager',
            layout    : 'fit',
            center    : true,
            closable  : false,
            resizable : false,
            border    : false,
            items     : this.buildForm(),
            buttons   : [
                {
                    text    : 'Login',
                    handler : this.handler || Ext.emptyFn,
                    scope   : this.scope || this
                }
            ]
        });

        TKE.window.UserLoginWindow.superclass.initComponent.call(this);
    },
    //private builds the form.
    buildForm : function() {

        var formItemDefaults = {
            allowBlank : false,
            anchor     : '-5',
            listeners  : {
                scope      : this,
                specialkey : function(field, e) {
                    if (e.getKey() === e.ENTER && this.handler) {
                        this.handler.call(this.scope);
                    }
                }
            }
        };

        return {
            xtype       : 'form',
            defaultType : 'textfield',
            labelWidth  : 70,
            frame       : true,
            url         : 'userlogin.php',
            labelAlign  : 'right',
            defaults    : formItemDefaults,
            items       : [
                {
                    fieldLabel : 'User Name',
                    name       : 'user'
                },
                {
                    inputType  : 'password',
                    fieldLabel : 'Password',
                    name       : 'password'
                }
            ]
        };
    }

});