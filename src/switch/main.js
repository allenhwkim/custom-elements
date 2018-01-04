import {observeAttrChange, setTabbable} from '../mce-util.js';

( function() {
  //https://material.io/guidelines/layout/structure.html#structure-app-bar

  /**
   * [Material Design Spec](https://material.io/guidelines/components/selection-controls.html#)
   * Switches allow a selection to be turned on or off.
   * ## Examples
   * ```
   * <a-switch id="checkbox21"></a-switch> <label for="checkbox21">Unchecked</label>
   * ```
   * 
   * ### `a-switch` Attributes 
   * It accepts all `input` checkbox attributes. E.g., id, name, value, disaled, or checked
   */

  class Switch extends HTMLElement {
    
    connectedCallback() {
      this.inputAttrs = ['id', 'name', 'value', 'disabled', 'checked'];
      this.inputEl = this._addRealInput();
      observeAttrChange(this, (attr, val) => {
        val === null ? this.inputEl.removeAttribute(attr) : this.inputEl.setAttribute(attr, val);
      });
      setTabbable(this, _ => this.inputEl.click());
    }

    _addRealInput() {
      let inputEl = document.createElement('input');
      inputEl.setAttribute("type", "checkbox");
      Array.from(this.attributes).forEach( attr => {
        if (this.inputAttrs.includes(attr.name) && attr.value !== null) {
         inputEl.setAttribute(attr.name, attr.value);
         (attr.name === 'id') && this.setAttribute('id', 'a-switch-'+attr.value);
        }
      })
      inputEl.addEventListener('click', _ => {
        inputEl.checked ? this.setAttribute('checked', '') : this.removeAttribute('checked');
      });
      this.appendChild(inputEl);
      return inputEl;
    }

  }
  
  customElements.define('a-switch', Switch); //name, class
})();
