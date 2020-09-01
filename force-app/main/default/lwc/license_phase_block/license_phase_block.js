import { LightningElement, api, track } from 'lwc';

import { getRecord } from 'lightning/uiRecordApi';

export default class License_phase_block extends LightningElement {
    @api phaseDetails;
    @api projectDetails;

}