import { LightningElement, api } from 'lwc';

import { getRecord } from 'lightning/uiRecordApi';

export default class License_phase_block extends LightningElement {
    @api phaseDetails;

    @api projectDetails;

    connectedCallback() {

    }
}