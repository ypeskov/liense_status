import { LightningElement, track } from 'lwc';
import userId from '@salesforce/user/Id';
import getProjectPlanByUserId from '@salesforce/apex/ProjectPlan.getProjectPlanByUserId';

export default class License_status extends LightningElement {
    @track phases = {
        phase1: {
            order: 1,
            title: 'Establishing a Legal Entity (2-3 Weeks)',
            isActive: true,
        },
        phase2: {
            order: 2,
            title: 'Portals Registration & GM Visa (3-4 Weeks)',
            isActive: false,
        },
        phase3: {
            order: 3,
            title: 'Residency & Setup Finalisation (5-6 Weeks)',
            isActive: false,
        }
    };

    @track projectDetails = {
        Project_Stage__c: '',
        Project_Tasks__c: '',
        Stage_Action__c: '',
        Status_Note__c: '',
    };

    connectedCallback() {
        //hardcoded acccountId for dev
        getProjectPlanByUserId({accountId: '0013M0000057CHTQA2'})
        .then(result => {
            console.log(result);

            this.projectDetails = result;

            for(let phase in this.phases) {
                let state = this.phases[phase];

                if (state.title === result.Project_Phase__c) {
                    state.isActive = true;
                } else {
                    state.isActive = false;
                }
            }
        })
        .catch(err => {
            console.log('OOOOOOOOPS')
            console.log(err);
        });
    }
}