@isTest
public with sharing class DependencyExtractorTest {
    @isTest(SeeAllData=True)
    public static void testGetDependencyMap() {
        DependencyExtraction.getDependencyMap('Project_Stage__c');
        DependencyExtraction.getDependencyMap('Project_Tasks__c');
    }
}
