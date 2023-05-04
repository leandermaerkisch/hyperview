import * as Dom from 'hyperview/src/services/dom';
import Hyperview from 'hyperview';
import * as Contexts from 'hyperview/src/contexts';
import HyperNavigator from 'hyperview/src/hv-nav-navigator';
import { getProp, getRootNode } from 'hyperview/src/navigator-helpers';
import { LOCAL_NAME } from 'hyperview/src/types';

import { Component } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';

/**
 * HyperviewRoute provides logic to process a <screen> or <navigator> element as the first child of a <doc> element.
 * Props:
 * - url or entrypointUrl: the url of the document to load
 */
export default class HyperviewRoute extends Component {
  constructor(props) {
    super(props);
  }

  static contextType = Contexts.FetchContext;

  componentDidMount() {
    this.load();
  }

  load = async () => {
    try {
      const url =
        getProp(this.props, 'entrypointUrl') || getProp(this.props, 'url');

      this.parser = new Dom.Parser(
        this.context.fetch,
        this.context.onParseBefore,
        this.context.onParseAfter,
      );
      const { doc, staleHeaderType } = await this.parser.loadDocument(url);
      this.setState({
        doc,
        error: null,
      });
    } catch (err) {
      this.setState({
        doc: null,
        error: err,
      });
    }
  };

  render() {
    if (!this.state || (!this.state.doc && !this.state.error)) {
      return (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text>ROUTE WAITING</Text>
          <ActivityIndicator />
        </View>
      );
    } else if (this.state.error) {
      return (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text>ROUTE ERROR: {this.state.error.message ?? this.state.url}</Text>
        </View>
      );
    }

    const firstNode = getRootNode(this.state.doc);
    if (!firstNode) {
      return (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text>ROUTE ERROR: no first node</Text>
        </View>
      );
    }

    switch (firstNode.nodeName) {
      case LOCAL_NAME.NAVIGATOR:
        return <HyperNavigator doc={firstNode} />;
      case LOCAL_NAME.SCREEN:
        return (
          <Contexts.DateFormatContext.Consumer>
            {formatter => (
              <Hyperview
                entrypointUrl={firstNode.getAttribute('href')}
                fetch={this.context.fetch}
                formatDate={formatter}
                // back={actions.back}
                // closeModal={actions.close}
                // navigate={actions.navigate}
                // openModal={actions.openModal}
                // push={actions.push}
                push={this.props.navigation?.push}
                navigation={this.props.navigation}
                route={this.props.route}
              />
            )}
          </Contexts.DateFormatContext.Consumer>
        );
      default:
        return (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text>ROUTE ERROR: UNKNOWN TYPE: {firstNode?.nodeName}</Text>
          </View>
        );
    }
  }
}
