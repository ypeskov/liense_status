public with sharing class ProjectPlan {
    @AuraEnabled(cacheable=true)
    public static Project_Plan__c getProjectPlanByUserId(String accountId) {
        String query = 'SELECT Id, ' +
            'Name, ' +
            'Account__c, ' +
            'Project_Stage__c, ' +
            'Project_Tasks__c, ' +
            'Project_Phase__c ' + 
            'FROM Project_Plan__c WHERE Account__c = \'' + String.escapeSingleQuotes(accountId) + '\'';
        Project_Plan__c projectPlan = Database.query(query);

        return projectPlan;
    }
}