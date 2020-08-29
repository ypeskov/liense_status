import { LightningElement, track } from 'lwc';
import userId from '@salesforce/user/Id';
import getProjectPlanByUserId from '@salesforce/apex/ProjectPlan.getProjectPlanByUserId';

export default class License_status extends LightningElement {
    @track phases = {
        phase1: {
            order: 1,
            title: 'Establishing a Legal Entity (2-3 Weeks)',
            isActive: true,
            classes: 'phase-box',
            startDate: null,
            endDate: null,
        },
        phase2: {
            order: 2,
            title: 'Portals Registration & GM Visa (3-4 Weeks)',
            isActive: false,
            classes: 'phase-box',
            startDate: null,
            endDate: null,
        },
        phase3: {
            order: 3,
            title: 'Residency & Setup Finalisation (5-6 Weeks)',
            isActive: false,
            classes: 'phase-box',
            startDate: null,
            endDate: null,
        }
    };

    @track projectDetails = {
        Project_Stage__c: '',
        Project_Tasks__c: '',
        Stage_Action__c: '',
        Status_Note__c: '',
    };

    stages = {
        //------- Phase 1 
        'MISA License': ['MISA_License_Projected_Completion__c', 1],
        'Articles of Association': ['Articles_of_Assoc_Projected_Completion__c', 1],
        'Company Registration': ['Company_reg_Projected_Completion__c', 1],
        'Chamber of Commerce': ['Chamber_of_Commerce_Projected_Completion__c', 1],
        //-----------Phase 2
        'Ministry of Labor': ['Ministry_of_Labor_Projected_Completion__c', 2],
        'Zakat': ['Zakat_Projected_Completion__c', 2],
        'Company Stamp': ['Company_Stamp_Forecasted_Completion__c', 2],
        'GM Visa': ['GM_Visa_Forecasted_Completion__c', 2],
        //-------- Phase 3
        'Residency': ['Residency_Forecasted_Completion__c', 3],
        'Handover / Closure': ['Handover_Projected_Completion__c', 3]
    };

    connectedCallback() {
        //hardcoded acccountId for dev
        getProjectPlanByUserId({accountId: '0013M0000057CHTQA2'})
        .then(result => {
            // console.log(result);
            this.projectDetails = result;
            this.processResponseData();
        })
        .catch(err => {
            console.log('OOOOOOOOPS')
            console.log(err);
        });
    }

    /**
     * process the response and setup values in the current project's phase
     */
    processResponseData() {
        let activePhaseNumber = 1;
        for(let phase in this.phases) {
            let state = this.phases[phase];

            if (state.title === this.projectDetails.Project_Phase__c) {
                activePhaseNumber = state.order;
                state.isActive = true;
                state.classes = 'phase-box enabled';
            } else {
                state.isActive = false;
            }
        }

        //generate start and end dates
        const currentStage = this.stages[this.projectDetails.Project_Stage__c];
        this.phases[`phase${activePhaseNumber}`].endDate = this.projectDetails[currentStage[0]];
        
        try {
            this.phases.phase1.startDate = this.projectDetails.Project_Start_Date__c;
            this.phases.phase3.endDate = this.projectDetails.Handover_Projected_Completion__c;
        } catch(err) {
            //do nothing. we don't care and will not display the date
        }

        for(let phase in this.phases) {
            let tmpPhase = this.phases[phase];

            if (tmpPhase.order < activePhaseNumber) {
                tmpPhase.classes = `${tmpPhase.classes} striked`;
            }
        }
    }
}