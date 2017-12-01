/**
 *    * `matchingPath`, values to match the url, {startsWith: '/foo/bar', re: /fooz/ }
 *  # Route
 *    Active element of a router,`<a-router>`
 *
 *  ### Attributes
 *    * `path`
 *      _required_,  path to respond
 *    * `import`
 *      _required_,  url to load
 *    * `no-cache`
 *      Optional,Indicates that the route view template is not cached.
 *    * `resolve-func`
 *     Optional, route level resolve function. e.g. data loading. The resolved data will be set to `<a-route>` element as a data. e.g. `$0.data.foo`, `$0.data.bar`
 *    * `on-route-start`
 *      Optional, injector function to be executed before route starts.
 *    * `on-route-end`
 *      Optional, injector function to be executed after route ends.
 *  
 *  ### Properties
 *    * `path`, attribute value.
 *    * `cachedTemplate`, template HTML cached
 *    * `noCache`, attribute value
 *    * `import`, attribute value
 *    * `resolveFunc`, attribute value
 *    * `onRouteStart`, attribute value
 *    * `onRouteEnd`, attribute value
 * ### Usage
 *  ```
 *  <a-router>
 *     <a-route path="/path1" import="path1.html">
 *       <a-router>    <!-- knows that parent path is /path1 -->
 *         <a-route path="/foo" import="foo.html" ></a-route> <!-- responds to /path1/foo -->
 *         <a-route path="/bar" import="bar.html"></a-route> <!-- responds to /path1/bar -->
 *       </a-router>
 *     </a-route>
 *  </a-router>
 *  ```
 */

import '../ce-polyfill.js';
import {getScopedObj} from '../util.js';

(function() {

  //https://material.io/guidelines/layout/structure.html#structure-app-bar
  class Route extends HTMLElement {
    connectedCallback() {
      // add this to the parent route
      this.router = this.closest('a-router');
      this.path = this.getAttribute('path');
      this.import = this.getAttribute('import');
      this.redirect = this.getAttribute('redirect');
      this.noCache = (this.getAttribute('no-cache') !== null);
      this.cachedTemplate = null;
      this.resolveFunc = getScopedObj(window, this.getAttribute('resolve-func'));
      this.onRouteStart =getScopedObj(window, this.getAttribute('on-route-start'));
      this.onRouteEnd = getScopedObj(window, this.getAttribute('on-route-end'));
      if (!this.path && !(this.import || this.redirect)) {
        throw "Invalid attributes for a-route, required path and import"
      }
    }

    activate() {
      let aPromise = _ => Promise.resolve();
      let routerResolveFn = this.router.resolveFunc || aPromise;
      let routeResolveFn = this.resolveVund || aPromise;
      let onRouteStartFn = this.onRouteStart || aPromise;
      let onRouteEndFn = this.onRouteEnd || aPromise;

      this.state = window.history.stae;

      this.router.showLoadingEl(true);
      routerResolveFn(this)    // resolve router resolveFunc
      .then(routerData => {
        this.router.data = routerData;
        return routeResolveFn(this); // resolve route resolveFunc
      }).then(routeData => {
        this.data = routeData;
        return onRouteStartFn(this); // run onRouteStart 
      }).then(_ => {
        if (this.cachedTemplate) {
          return this.cachedTemplate;
        } else {  // fetch if not cached                       
          let options = this.router.onHttpStart(this);
          return fetch(this.import, options || {})
            .then(response => {
              this.router.onHttpEnd && this.router.onHttpEnd(response);
              if (!response.ok) {
                throw Error(`url: ${this.import}, status: ${response.statusText}`);
              }
              return response.text();
            });
        }
      }).then(html => {
        !this.noCache && (this.cachedTemplate = html);
        // TODO: make a transition here
        //   by moving making the existing old, then sliding it in
        this.router.targetEl.innerHTML = html; 
        // TODO: execute <script> tags in html
        //   https://stackoverflow.com/questions/2592092/executing-script-elements-inserted-with-innerhtml
        this.router.showLoadingEl(false);
        return onRouteEndFn(this);
      }).catch(error => {
        console.error('routing-error', error);
        this.router.showLoadingEl(false);
      })
    }
  }
  customElements.define('a-route', Route); //name, class

})();