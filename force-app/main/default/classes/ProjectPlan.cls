public with sharing class ProjectPlan {
    @AuraEnabled(cacheable=true)
    public static Project_Plan__c getProjectPlanByUserId(String accountId, String userId) {
        System.debug(userId);

        String query = 'SELECT Id, ' +
            'Name, ' +
            'Account__c, ' +
            'toLabel(Project_Stage__c), ' +
            'toLabel(Project_Tasks__c), ' +
            'toLabel(Project_Phase__c), ' + 
            'Stage_Action__c, ' +
            'Project_Start_Date__c, ' +
            'MISA_License_Projected_Completion__c, ' +
            'Articles_of_Assoc_Projected_Completion__c, ' +
            'Company_reg_Projected_Completion__c, ' +
            'Chamber_of_Commerce_Projected_Completion__c, ' +
            'Ministry_of_Labor_Projected_Completion__c, ' +
            'Zakat_Projected_Completion__c, ' +
            'Company_Stamp_Forecasted_Completion__c, ' +
            'GM_Visa_Forecasted_Completion__c, ' +
            'Residency_Forecasted_Completion__c, ' +
            'Handover_Projected_Completion__c, ' +
            //actual completions
            'MISA_License_Actual_Completion__c, ' +
            'Articles_of_Assoc_Actual_Completion__c, ' +
            'Company_Reg_Actual_Completion__c, ' +
            'Chamber_of_Commerce_Actual_Completion__c, ' +
            'Ministry_of_Labour_Actual_Completion__c, ' +
            'Zakat_Actual_Completion__c, ' +
            'Company_Stamp_Actual_Completion__c, ' +
            'GM_VIsa_Actual_Completion__c, ' +
            'Residency_Actual_Completion__c, ' +
            'Status_Note__c ' +
            'FROM Project_Plan__c ' +
            'WHERE Client__c = \'' + String.escapeSingleQuotes(userId) + '\'' +
            'LIMIT 1';

        Project_Plan__c projectPlan;
        try {
            projectPlan = Database.query(query);
        } catch(Exception e) {
            projectPlan = new Project_Plan__c();
            return projectPlan;
        }
        

        if (projectPlan.Project_Phase__c == NULL) {
            projectPlan.Project_Phase__c = '';
        }
        
        if (projectPlan.Project_Stage__c == NULL) {
            projectPlan.Project_Stage__c = '';
        }

        if (projectPlan.Project_Tasks__c == NULL) {
            projectPlan.Project_Tasks__c = '';
        }

        return projectPlan;
    }
}