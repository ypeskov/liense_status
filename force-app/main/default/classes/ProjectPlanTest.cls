@isTest
public with sharing class ProjectPlanTest {
    @isTest(SeeAllData=True)
    public static void testGetProjectPlanByUserId() {
        Profile profileId = [SELECT Id FROM Profile WHERE Name = 'Standard User' LIMIT 1];
        
     	User user = new User(LastName = 'LIVESTON',
                           FirstName='JASON',
                           Alias = 'jliv',
                           Email = 'jason.liveston@asdf.com',
                           Username = 'yurit.peskov.l@gmail.com',
                           ProfileId = profileId.id,
                           TimeZoneSidKey = 'GMT',
                           LanguageLocaleKey = 'en_US',
                           EmailEncodingKey = 'UTF-8',
                           LocaleSidKey = 'en_US'
                           );
        insert user;
        
        Account acc = new Account(Name='qwerty');
        insert acc;
        
        Project_Plan__c plan = new Project_Plan__c(
                                        Client__c=user.Id
                                        );
        plan.Project_Phase__c = 'Establishing a Legal Entity (2-3 Weeks)';
        plan.Project_Stage__c = 'MISA License';
        plan.Account__c = acc.Id;

        insert plan;
        // System.debug(plan);

        ProjectPlan.getProjectPlanByUserId(user.Id);
    }
}
