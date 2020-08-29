import { LightningElement, track } from 'lwc';
import userId from '@salesforce/user/Id';
import getProjectPlanByUserId from '@salesforce/apex/ProjectPlan.getProjectPlanByUserId';

export default class License_status extends LightningElement {
    @track
    phases = {
        phase1: {
            order: 1,
            name: 'Establishing a Legal Entity (2-3 Weeks)',
            isActive: true,
        },
        phase2: {
            order: 2,
            name: 'Portals Registration & GM Visa (3-4 Weeks)',
            isActive: false,
        },
        phase3: {
            order: 3,
            name: 'Residency & Setup Finalisation (5-6 Weeks)',
            isActive: false,
        }
    };

    connectedCallback() {
        //hardcoded acccountId for dev
        getProjectPlanByUserId({accountId: '0013M0000057CHTQA2'})
        .then(result => {
            console.log(result);
        })
        .catch(err => {
            console.log('OOOOOOOOPS')
            console.log(err);
        });
    }
}