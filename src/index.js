/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Behaviors from 'hyperview/src/services/behaviors';
import * as Components from 'hyperview/src/services/components';
import * as Events from 'hyperview/src/services/events';
import * as Namespaces from 'hyperview/src/services/namespaces';
import * as Render from 'hyperview/src/services/render';
import * as Stylesheets from 'hyperview/src/services/stylesheets';
import * as UrlService from 'hyperview/src/services/url';
import { Linking } from 'react-native';
import { XMLSerializer } from 'xmldom-instawork';
import LoadError from 'hyperview/src/core/components/load-error';
import Loading from 'hyperview/src/core/components/loading';
import HyperRef from 'hyperview/src/core/hyper-ref';
import Navigation, { ANCHOR_ID_SEPARATOR } from 'hyperview/src/services/navigation';
import { Parser } from 'hyperview/src/services/dom';
import React from 'react';
import { createProps, getFirstTag, later, shallowCloneToRoot, getFormData, getElementByTimeoutId, removeTimeoutId, setTimeoutId } from 'hyperview/src/services';
import { ACTIONS, NAV_ACTIONS, UPDATE_ACTIONS } from 'hyperview/src/types';


// Shared instance, used in dev mode only
const devXMLSerializer: ?XMLSerializer = __DEV__ ? new XMLSerializer() : null;

// Provides the date format function to use in date fields
// in the screen.
export const DateFormatContext = React.createContext();

/**
 *
 */
export default class HyperScreen extends React.Component {
  static createProps = createProps;
  static renderChildren = Render.renderChildren;

  constructor(props) {
    super(props);

    this.onUpdate = this.onUpdate.bind(this);
    this.reload = this.reload.bind(this);

    this.updateActions = ['replace', 'replace-inner', 'append', 'prepend'];
    this.parser = new Parser(
      this.props.fetch,
      this.props.onParseBefore,
      this.props.onParseAfter
    );

    this.needsLoad = false;
    this.state = {
      styles: null,
      doc: null,
      url: null,
      error: false,
    };

    // <HACK>
    // In addition to storing the document on the react state, we keep a reference to it
    // on the instance. When performing batched updates on the DOM, we need to ensure every
    // update occurence operates on the latest DOM version. We cannot rely on `state` right after
    // setting it with `setState`, because React does not guarantee the new state to be immediately
    // available (see details here: https://reactjs.org/docs/react-component.html#setstate)
    // Whenever we need to access the document for reasons other than rendering, we should use
    // `this.doc`. When rendering, we should use `this.state.doc`.
    this.doc = null;
    this.oldSetState = this.setState;
    this.setState = (...args) => {
      if (args[0].doc !== undefined) {
        this.doc = args[0].doc;
      }
      this.oldSetState(...args);
    }
    // </HACK>

    this.behaviorRegistry = Behaviors.getRegistry(this.props.behaviors);
    this.componentRegistry = Components.getRegistry(this.props.components);
    this.navigation = new Navigation(props.entrypointUrl, this.getNavigation());
  }

  getNavigationState = (props) => {
    if (props.navigation) {
      return props.navigation.state;
    }
    return { params: {} };
  }

  componentDidMount() {
    const { params } = this.getNavigationState(this.props);
    // The screen may be rendering via a navigation from another HyperScreen.
    // In this case, the url to load in the screen will be passed via navigation props.
    // Otherwise, use the entrypoint URL provided as a prop to the first HyperScreen.
    const url = params.url || this.props.entrypointUrl || null;

    const preloadScreen = params.preloadScreen
      ? this.navigation.getPreloadScreen(params.preloadScreen)
      : null;
    const preloadStyles = preloadScreen ? Stylesheets.createStylesheets(preloadScreen) : {};

    this.needsLoad = true;
    if (preloadScreen) {
      this.setState({
        doc: preloadScreen,
        styles: preloadStyles,
        error: false,
        url,
      });
    } else {
      this.setState({
        error: false,
        url,
      });
    }
  }

  /**
   * Potentially updates state when navigating back to the mounted screen.
   * If the navigation params have a different URL than the screen's URL, Update the
   * preload screen and URL to load.
   */
  componentWillReceiveProps(nextProps) {
    const oldNavigationState = this.getNavigationState(this.props);
    const newNavigationState = this.getNavigationState(nextProps);

    const newUrl = newNavigationState.params.url;
    const oldUrl = oldNavigationState.params.url;
    const newPreloadScreen = newNavigationState.params.preloadScreen;
    const oldPreloadScreen = oldNavigationState.params.preloadScreen;

    if (newPreloadScreen !== oldPreloadScreen) {
      this.navigation.removePreloadScreen(oldPreloadScreen);
    }

    // TODO: If the preload screen is changing, delete the old one from
    // this.navigation.preloadScreens to prevent memory leaks.

    if (newUrl && newUrl !== oldUrl) {
      this.needsLoad = true;

      const preloadScreen = newPreloadScreen
        ? this.navigation.getPreloadScreen(newPreloadScreen)
        : null;

      const doc = preloadScreen || this.doc;
      const styles = preloadScreen ? Stylesheets.createStylesheets(preloadScreen) : this.state.styles;

      this.setState({ doc, styles, url: newUrl });
    }
  }

  /**
   * Clear out the preload screen associated with this screen.
   */
  componentWillUnmount() {
    const { params } = this.getNavigationState(this.props);
    const { preloadScreen } = params;
    if (preloadScreen && this.navigation.getPreloadScreen(preloadScreen)) {
      this.navigation.remove(preloadScreen);
    }
  }

  /**
   * Fetch data from the url if the screen should reload.
   */
  componentDidUpdate(prevProps, prevState) {
    if (this.needsLoad) {
      this.load(this.state.url);
      this.needsLoad = false;
    }
  }

  /**
   * Performs a full load of the screen.
   */
  load = async () => {
    const { params, key: routeKey } = this.getNavigationState(this.props);

    try {
      if (params.delay) {
        await later(parseInt(params.delay, 10));
      }

      const url = this.state.url;
      const doc = await this.parser.load(url);

      // Make sure the XML has the required elements: <doc>, <screen>, <body>.
      const docElement = getFirstTag(doc, 'doc');
      if (!docElement) {
        throw new Error(`No <doc> tag found in the response from ${url}.`);
      }

      const screenElement = getFirstTag(docElement, 'screen');
      if (!screenElement) {
        throw new Error(`No <screen> tag found in the <doc> tag from ${url}.`);
      }

      const bodyElement = getFirstTag(screenElement, 'body');
      if (!bodyElement) {
        throw new Error(`No <body> tag found in the <screen> tag from ${url}.`);
      }

      const stylesheets = Stylesheets.createStylesheets(doc);
      this.navigation.setRouteKey(url, routeKey);
      this.setState({
        doc,
        styles: stylesheets,
        error: false,
      });

    } catch (err) {
      this.setState({
        doc: null,
        styles: null,
        error: true,
      });
      console.error(err.message);
    }
  }

  /**
   * Reload if an error occured.
   * @param opt_href: Optional string href to use when reloading the screen. If not provided,
   * the screen's current URL will be used.
   */
  reload = (opt_href) => {
    const url = (opt_href === undefined || opt_href === '#')
      ? this.state.url
      : UrlService.getUrlFromHref(opt_href, this.state.url);
    this.needsLoad = true;
    this.setState({
      error: false,
      url,
    });
  }

  /**
   * Renders the XML doc into React components. Shows blank screen until the XML doc is available.
   */
  render() {
    const { doc, url, error } = this.state;
    if (error) {
      return (
        <LoadError onPressReload={this.reload} />
      );
    }
    if (!doc) {
      return (
        <Loading />
      );
    }
    const body = doc.getElementsByTagNameNS(Namespaces.HYPERVIEW, 'body')[0];
    const screenElement = Render.renderElement(
      body,
      this.state.styles,
      this.onUpdate,
      {
        screenUrl: url,
        componentRegistry: this.componentRegistry,
      },
    );

    return (
      <DateFormatContext.Provider value={this.props.formatDate}>
        {screenElement}
      </DateFormatContext.Provider>
    );
  }

  /**
   * Returns a navigation object similar to the one provided by React Navigation,
   * but connected to props injected by the parent app.
   */
  getNavigation = () => ({
    back: this.props.back,
    push: this.props.push,
    replace: this.props.replace,
    navigate: this.props.navigate,
    openModal: this.props.openModal,
    closeModal: this.props.closeModal,
  })

  /**
   * Fetches the provided reference.
   * - If the references is an id reference (starting with #),
   *   returns a clone of that element.
   * - If the reference is a full URL, fetches the URL.
   * - If the reference is a path, fetches the path from the host of the URL
   *   used to render the screen.
   * Returns a promise that resolves to a DOM element.
   */
  fetchElement = async (href, method, root, formData) => {
    if (href[0] === '#') {
      const element = root.getElementById(href.slice(1));
      if (element) {
        return element.cloneNode(true);
      }
      throw new Error();
    }

    try {
      const url = UrlService.getUrlFromHref(href, this.state.url, method);
      const document = await this.parser.load(url, formData, method);
      return document.documentElement;
    } catch (err) {
      this.setState({
        doc: null,
        styles: null,
        error: true,
      });
      console.error(err.message);
    }
  }



  /**
   *
   */
  onUpdate = (href, action, currentElement, opts) => {
    if (action === ACTIONS.RELOAD) {
      this.reload(href);
    } else if (action === ACTIONS.DEEP_LINK) {
      Linking.openURL(href);
    } else if (Object.values(NAV_ACTIONS).includes(action)) {
      this.navigation.setUrl(this.state.url);
      this.navigation.setDocument(this.doc);
      this.navigation.navigate(href || ANCHOR_ID_SEPARATOR, action, currentElement, opts);
    } else if (Object.values(UPDATE_ACTIONS).includes(action)) {
      this.onUpdateFragment(href, action, currentElement, opts);
    } else if (action === ACTIONS.SWAP) {
      this.onSwap(currentElement, opts.newElement);
    } else if (action === ACTIONS.DISPATCH_EVENT) {
      const { behaviorElement } = opts;
      const eventName = behaviorElement.getAttribute('event-name');
      const trigger = behaviorElement.getAttribute('trigger');
      const ranOnce = behaviorElement.getAttribute('ran-once');
      const once = behaviorElement.getAttribute('once');
      const delay = behaviorElement.getAttribute('delay');

      if (once === 'true' && ranOnce === 'true') {
        return;
      } else if (once === 'true') {
        behaviorElement.setAttribute('ran-once', 'true');
      }

      // Check for event loop formation
      if (trigger === 'on-event') {
        throw new Error('trigger="on-event" and action="dispatch-event" cannot be used on the same element');
      }
      if (!eventName) {
        throw new Error('dispatch-event requires an event-name attribute to be present');
      }

      const dispatch = () => {
        // Log the dispatched action before emitting to ensure it appears first in logs
        if (devXMLSerializer) {
          const emitterElement: Element = behaviorElement.cloneNode(false);
          console.log(
            `[dispatch-event] action [${eventName}] emitted by:`,
            devXMLSerializer.serializeToString(emitterElement),
          );
        }
        Events.dispatch(eventName);
      }

      if (delay) {
        setTimeout(dispatch, parseInt(delay, 10));
      } else {
        dispatch();
      }
    } else {
      const { behaviorElement } = opts;
      this.onCustomUpdate(behaviorElement);
    }
  }

  /**
   * Handler for behaviors on the screen.
   * @param href {string} A reference to the XML to fetch. Can be local (via id reference prepended
   *        by #) or a
   * remote resource.
   * @param action {string} The name of the action to perform with the returned XML.
   * @param currentElement {Element} The XML DOM element triggering the behavior.
   * @param options {Object} Optional attributes:
   *  - verb: The HTTP method to use for the request
   *  - targetId: An id reference of the element to apply the action to. Defaults to currentElement
   *    if not provided.
   *  - showIndicatorIds: Space-separated list of id references to show during the fetch.
   *  - hideIndicatorIds: Space-separated list of id references to hide during the fetch.
   *  - delay: Minimum time to wait to fetch the resource. Indicators will be shown/hidden during
   *    this time.
   *  - once: If true, the action should only trigger once. If already triggered, onUpdate will be
   *    a no-op.
   *  - onEnd: Callback to run when the resource is fetched.
   *  - behaviorElement: The behavior element triggering the behavior. Can be different from
   *    the currentElement.
   */
  onUpdateFragment = (href, action, currentElement, opts) => {
    const options = opts || {};
    const {
      verb, targetId, showIndicatorIds, hideIndicatorIds, delay, once, onEnd, behaviorElement,
    } = options;

    const showIndicatorIdList = showIndicatorIds ? showIndicatorIds.split(' ') : [];
    const hideIndicatorIdList = hideIndicatorIds ? hideIndicatorIds.split(' ') : [];

    const formData = getFormData(currentElement);

    // TODO: Check ran-once on the behavior element, not current element.
    if (once) {
      if (currentElement.getAttribute('ran-once')) {
        // This action is only supposed to run once, and it already ran,
        // so there's nothing more to do.
        onEnd && onEnd();
        return;
      } else {
        currentElement.setAttribute('ran-once', 'true');
      }
    }

    let newRoot = this.doc;
    newRoot = Behaviors.setIndicatorsBeforeLoad(showIndicatorIdList, hideIndicatorIdList, newRoot);
    // Re-render the modifications
    this.setState({
      doc: newRoot,
    });

    // Fetch the resource, then perform the action on the target and undo indicators.
    const fetchAndUpdate = () => this.fetchElement(href, verb, newRoot, formData)
      .then((newElement) => {
        // If a target is specified and exists, use it. Otherwise, the action target defaults
        // to the element triggering the action.
        let targetElement = targetId ? this.doc.getElementById(targetId) : currentElement;
        if (!targetElement) {
          targetElement = currentElement;
        }

        newRoot = Behaviors.performUpdate(action, targetElement, newElement);
        newRoot = Behaviors.setIndicatorsAfterLoad(showIndicatorIdList, hideIndicatorIdList, newRoot);
        // Re-render the modifications
        this.setState({
          doc: newRoot,
        });

        // in dev mode log the updated xml for debugging purposes
        if (devXMLSerializer) {
          console.log('Updated XML:', devXMLSerializer.serializeToString(newRoot.documentElement));
        }

        onEnd && onEnd();
      });

    if (delay) {
      /**
       * Delayed behaviors will only trigger after a given amount of time.
       * During that time, the DOM may change and the triggering element may no longer
       * be in the document. When that happens, we don't want to trigger the behavior after the time
       * elapses. To track this, we store the timeout id (generated by setTimeout) on the triggering
       * element, and then look it up in the document after the elapsed time. If the timeout id is not
       * present, we update the indicators but don't execute the behavior.
       */
      var delayMs = parseInt(delay, 10);
      var timeoutId = null;
      timeoutId = setTimeout(() => {
        // Check the current doc for an element with the same timeout ID
        const timeoutElement = getElementByTimeoutId(this.doc, timeoutId.toString());
        if (timeoutElement) {
          // Element with the same ID exists, we can execute the behavior
          removeTimeoutId(timeoutElement);
          fetchAndUpdate();
        } else {
          // Element with the same ID does not exist, we don't execute the behavior and undo the indicators.
          newRoot = Behaviors.setIndicatorsAfterLoad(showIndicatorIdList, hideIndicatorIdList, this.doc);
          this.setState({
            doc: newRoot,
          });
          onEnd && onEnd();
        }
      }, delayMs);
      // Store the timeout ID
      setTimeoutId(currentElement, timeoutId.toString());
    } else {
      // If there's no delay, fetch immediately and update the doc when done.
      fetchAndUpdate();
    }
  }

  /**
   * Used internally to update the state of things like select forms.
   */
  onSwap = (currentElement, newElement) => {
    const parentElement = currentElement.parentNode;
    parentElement.replaceChild(newElement, currentElement);
    const newRoot = shallowCloneToRoot(parentElement);
    this.setState({
      doc: newRoot,
    });
  }

  /**
   * Extensions for custom behaviors.
   */
  onCustomUpdate = (behaviorElement: Element) => {
    const action = behaviorElement.getAttribute('action');
    const behavior = this.behaviorRegistry[action];
    if (behavior) {
      const updateRoot = (newRoot) => this.setState({ doc: newRoot });
      const getRoot = () => this.doc;
      behavior.callback(behaviorElement, this.onUpdate, getRoot, updateRoot);
    } else {
      // No behavior detected.
      console.warn(`No behavior registered for action "${action}"`);
    }
  }
}

export * from 'hyperview/src/types';
export { Events, Namespaces };
