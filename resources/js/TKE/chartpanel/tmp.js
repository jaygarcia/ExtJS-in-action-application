Ext.ns("CompanyManager");
CompanyManager.DepartmentManager = Ext.extend(Ext.Panel, {
     layout : 'border',
     border : false,
     msgs   : {},

     initComponent       : function() {},                                 // 1
     buildDepartmentList : function() {},
     buildDepartmentForm : function() {},

     onDepartmentListClick : function() {},                               // 2
     onNewDepartment       : function() {},

     onDeptFormSave        : function() {},                               // 3
     onDeptFormSaveSuccess : function() {},
     onDeptFormSaveFailure : function() {},

     onDeptFormDeactivateDept     : function() {},                        // 4
     onConfirmDeactivateDept      : function() {},
     onAfterConfirmDeactivateDept : function() {},

     onDeptFormNewEmployee       : function() {},                         // 5
     onDeptFormEditEmployee      : function() {},
     onEmployeeWindowSaveSuccess : function() {},

     onDeleteEmployees        : function() {},                            // 6
     onConfirmDeleteEmployees : function() {},
     onAfterDeleteEmployees   : function() {},

     onAssociateEmployees    : function() {},                             // 7
     onConfirmAssocEmployees : function() {},
     onAfterAssocEmployees   : function() {},

     clearFormPanel         : function() {},
     spoolEmpIdsFromRecords : function() {},
     cleanSlate             : function() {}

 });
