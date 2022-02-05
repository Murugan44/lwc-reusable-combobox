import { LightningElement, api, track } from "lwc";
const delay = 350;

export default class App extends LightningElement {
  //functional properties
  @api fieldLabel = 'Product';
  @track optionsToDisplay;
  @api options= [
    {label:'test', value: '3.00', class: 'slds-icon_container slds-icon-utility-pricing_workspace', icon:'utility:pricing_workspace'},
    {label:'test1', value: '2.00'}
  ]

  @track openDropDown = false;
  @api disabled = false;

  @api placeholder = "";
  @track label = "";
  @api value = "";
  @track inputValue = "";

  delaytimeout
 

  //getter setter for labelClass
    get labelClass() {
        return (this.fieldLabel && this.fieldLabel != "" ? "slds-form-element__label slds-show" : "slds-form-element__label slds-hide")
    }

    //getter setter for dropDownClass
    get dropDownClass() {
        return (this.openDropDown ? "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open" : "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click");
    }

    get isDropdownOpen() {
        return (this.openDropDown ? true : false);
    }

    //constructor
    constructor() {
        super();
    }

    connectedCallback() {
        this.setOptionsAndValues();
    }

    renderedCallback() {
        if (this.openDropDown) {
            this.template.querySelectorAll('.search-input-class').forEach(inputElem => {
                inputElem.focus();
            });
        }
    }

    //Public Method to set options and values
    @api setOptionsAndValues() {
        this.optionsToDisplay = (this.options && this.options.length > 0 ? this.options : []);
        if (this.value && this.value != "") {
            let label = this.getLabel(this.value);
            if (label && label != "") {
                this.label = label;
            }
        }
        else {
            this.label = "";
        }
    }

    //Method to get Label for value provided
    getLabel(value) {
        let selectedObjArray = this.options.filter(obj => obj.value === value);
        if (selectedObjArray && selectedObjArray.length > 0) {
            return selectedObjArray[0].label;
        }
        return null;
    }


    //Method to handle readonly input click
    handleInputClick(event) {
        this.resetParameters();
        this.toggleOpenDropDown(true);
    }

    //Method to reset necessary properties
    resetParameters() {
        this.setInputValue("");
        this.optionsToDisplay = this.options;
    }

    //Method to set inputValue for search input box
    setInputValue(value) {
        this.inputValue = value;
    }

    //Method to toggle openDropDown state
    toggleOpenDropDown(toggleState) {
        this.openDropDown = toggleState;
    }

    //Method to handle key press on text input
    handleKeyPress(event) {
        const searchKey = event.target.value;
        this.setInputValue(searchKey);
        if (this.delaytimeout) {
            window.clearTimeout(this.delaytimeout);
        }

        this.delaytimeout = setTimeout(() => {
            //filter dropdown list based on search key parameter
            this.filterDropdownList(searchKey);
        }, delay);
    }

    //Method to filter dropdown list
    filterDropdownList(key) {
        const filteredOptions = this.options.filter(item => item.label.toLowerCase().includes(key.toLowerCase()));
        this.optionsToDisplay = filteredOptions;
    }

    //Method to close listbox dropdown
    closeDropdown(event) {
	
        if (event.relatedTarget && event.relatedTarget.tagName == "UL" && event.relatedTarget.className.includes('customClass')) {
            console.log(JSON.stringify(event.relatedTarget.className));
            if (this.openDropDown) {
                this.template.querySelectorAll('.search-input-class').forEach(inputElem => {
                    inputElem.focus();
                });
            }
        }else {
            window.setTimeout(() => {
                this.toggleOpenDropDown(false);
            }, 300);
        }
    }

    //Method to handle selected options in listbox
    optionsClickHandler(event) {
        const value = event.target.closest('li').dataset.value;
        console.log('value::', value)
        const label = event.target.closest('li').dataset.label;
        this.setValues(value, label);
        this.toggleOpenDropDown(false);
        const detail = {};
        detail["value"] = value;
        detail["label"] = label;
        this.dispatchEvent(new CustomEvent('change', { detail: detail }));
    }

    //Method to set label and value based on
    //the parameter provided
    setValues(value, label) {
        this.label = label;
        this.value = value;
    }

    // //Method to open listbox dropdown
    // openDropDown(event) {
    //     this.toggleOpenDropDown(true);
    // }
}
