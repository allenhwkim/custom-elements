import {observeAttrChange} from '../mce-util.js';

( function() {
  /**
   * Menus display a list of choices on a transient sheet of material. 
   *
   * [Material Design Spec.](https://material.io/guidelines/components/menus.html#menus-specs)
   * 
   * ### example
   * ```
   *  <a href="javascript:showDemoMenu()">Show/Hide Menu</a>
   *  <a-menu id="demo-menu" position="bottom-left">
   *    <a-nav-item icon="favorite" shortcut="ctrl-d">nav item text</a-nav-item>
   *    <hr>
   *    <a-nav-item class="disabled">Disabled</a-nav-item>
   *    <a-nav-item shortcut="ctrl-d">nav-item text</a-nav-item>
   *    <a-nav-item icon="search">nav-item text</a-nav-item>
   *  </a-menu>
   * ```
   *
   * <p data-height="300" data-theme-id="32189" data-slug-hash="BJmaeb" data-default-tab="html,result" data-user="allenhwkim" data-embed-version="2" data-pen-title="mce template" class="codepen">See the Pen <a href="https://codepen.io/allenhwkim/pen/PEJKKo/">mce template</a> by Allen kim (<a href="https://codepen.io/allenhwkim">@allenhwkim</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
   *
   * 
   * ### `a-button` Style Classes
   *  |name||description|
   *  |---|---|
   *  |visible|Indicates menu is visible or not
   * 
   * ### `a-button` Child Element Attributes 
   *  |name|value|description|
   *  |---|---|---|
   *  |position| string| Indicates the position of menu. Value is one of bottom-right, bottom-left, top-left, or top-right
   *  
   * ### `a-button` Child Element Style Classes
   *  |name||description|
   *  |---|---|
   *  |divider| An horizontal line that separates group of menus.
   */
  class Menu extends HTMLElement {
    connectedCallback() {
      observeAttrChange(this, (attr, val) => {
        if (attr == 'class' && this.classList.contains('visible')) {
          this.open();
        }
      });
      this.hideMenu = this.close.bind(this); // so that hideMenu can be done from outside
      this._addEventListener();
    }

    disconnectedCallback() {
      document.removeEventListener('click', this.hideMenu);
    }

    /**
     * open the menu by adding `visible` class
     * when a menu is opening, all other menus are closed
     * @returns null
     */
    open() {
      // show only this
      if (!this.classList.contains('visible')) { //  without, infinite loop, add <-> observe
        this.classList.add('visible');
      }
      // hide all other menus
      Array.from(document.querySelectorAll('a-menu')).forEach(menu => {
        (this.isSameNode(menu) === false) && menu.classList.remove('visible');
      });
      // When document is clicked, it closes all menus, but this remained to open
      this.justShown = true; // in case when attribute is changed by outside of this
      setTimeout(_ => this.justShown = false, 100);
    }

    /**
     * close the menu by removing `visible` class
     */
    close(event) {
      if (!this.justShown && !this.contains(event.target)) { // if not clicked on menu
        this.classList.remove('visible');
      }
    }

    _addEventListener() {
      document.addEventListener('click', this.hideMenu);
      this.addEventListener('close', _ => {
        this.classList.remove('visible');
      }); //child can fire close. then close it
    }
  }
  
  customElements.define('a-menu', Menu);
})();
