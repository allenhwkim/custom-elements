import {windowResizeHandler} from '../mce-util.js';

( function() {
  /**
   * The app bar is a special kind of toolbar that’s used for branding, navigation, search, and actions.
   *
   * [Material Design Spec](https://material.io/guidelines/layout/structure.html#structure-app-bar)
   * 
   * ### example
   * ```
   * <mce-app-bar app-title="app-bar" class="mce-light">
   *   <div class="mce-nav-icon">
   *     <mce-icon>menu</mce-icon>
   *   </div>
   *   <span class="mce-title">App Bar Light</span>
   *   <div class="mce-icons">
   *     <mce-icon>favorite</mce-icon>
   *     <mce-icon>search</mce-icon>
   *     <mce-icon>more_vert</mce-icon>
   *   </div>
   * </mce-app-bar>
   * ```
   *
   * <p datmce-height="300" datmce-theme-id="32189" datmce-slug-hash="EobYmr" datmce-default-tab="html,result" datmce-user="allenhwkim" datmce-embed-version="2" datmce-pen-title="mce template" class="codepen">See the Pen <a href="https://codepen.io/allenhwkim/pen/PEJKKo/">mce template</a> by Allen kim (<a href="https://codepen.io/allenhwkim">@allenhwkim</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
   *
   * ### `mce-app-bar` style classes
   *  |name|value|description|
   *  |---|---|---|
   *  |mce-light| | if defined, light background with dark icons and text
   * 
   * 
   * ### Child element of `mce-app-bar` style classes
   *  |name|value|description|
   *  |---|---|---|
   *  |mce-nav-icon| | the container class of left-side navigation icon(s)
   *  |mce-icons| | the container class of right-side icons
   *  |mce-title| | the container class of title, which is positioned after navigation icons
   *
   */
  class AppBar extends HTMLElement {
    connectedCallback() {
      if (window.ce && window.ce.resizeHandler) {} else {
        window.ce = {resizeHandler: windowResizeHandler};
        window.addEventListener('resize', window.ce.resizeHandler);
      }
      this._addFiller();
    }

    /**
     * sets the title of app bar
     * @param {string} title title for the app bar
     */
    setTitle(title) {
      this.querySelector('.mce-title').innerHTML = title;
    }

    _addFiller() {
      let el = document.createElement('div');
      el.classList.add('mce-app-bar-filler');
      this.parentElement.insertBefore(el, this.nextSibling);
    }
  }
  
  window.customElements.define('mce-app-bar', AppBar);
})();