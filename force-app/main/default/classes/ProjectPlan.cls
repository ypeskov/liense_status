public with sharing class ProjectPlan {
    @AuraEnabled(cacheable=true)
    public static Project_Plan__c getProjectPlanByUserId(String userId) {
        System.debug(userId);

        String query = 'SELECT Id, ' +
            'Name, ' +
            'Account__c, ' +
            'Account__r.Name, ' +
            'toLabel(Project_Stage__c), ' +
            'toLabel(Project_Tasks__c), ' +
            'toLabel(Project_Phase__c), ' + 
            'Stage_Action__c, ' +
            'FORMAT(Project_Start_Date__c), ' +
            'FORMAT(MISA_License_Projected_Completion__c), ' +
            'FORMAT(Articles_of_Assoc_Projected_Completion__c), ' +
            'FORMAT(Company_reg_Projected_Completion__c), ' +
            'FORMAT(Chamber_of_Commerce_Projected_Completion__c), ' +
            'FORMAT(Ministry_of_Labor_Projected_Completion__c), ' +
            'FORMAT(zakat_Projected_Completion__c), ' +
            'FORMAT(Company_Stamp_Forecasted_Completion__c), ' +
            'FORMAT(GM_Visa_Forecasted_Completion__c), ' +
            'FORMAT(Residency_Forecasted_Completion__c), ' +
            'FORMAT(Handover_Projected_Completion__c), ' +
            //actual completions
            'FORMAT(MISA_License_Actual_Completion__c), ' +
            'FORMAT(Articles_of_Assoc_Actual_Completion__c), ' +
            'FORMAT(Company_Reg_Actual_Completion__c), ' +
            'FORMAT(Chamber_of_Commerce_Actual_Completion__c), ' +
            'FORMAT(Ministry_of_Labour_Actual_Completion__c), ' +
            'FORMAT(Zakat_Actual_Completion__c), ' +
            'FORMAT(Company_Stamp_Actual_Completion__c), ' +
            'FORMAT(GM_VIsa_Actual_Completion__c), ' +
            'FORMAT(Residency_Actual_Completion__c), ' +
            'Status_Note__c ' +
            'FROM Project_Plan__c ' +
            'WHERE Client__c = \'' + String.escapeSingleQuotes(userId) + '\'' +
            'LIMIT 1';

        Project_Plan__c projectPlan;
        projectPlan = Database.query(query);

        return projectPlan;
    }
}