// @flow

/**
 * Copyright (c) Garuda Labs, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Behaviors from 'hyperview/src/services/behaviors';
import * as Namespaces from 'hyperview/src/services/namespaces';
import type {
  DOMString,
  Element,
  HvComponentProps,
  StyleSheet,
} from 'hyperview/src/types';
import React, { PureComponent } from 'react';
import {
  createStyleProp,
  createTestProps,
  getNameValueFormInputValues,
} from 'hyperview/src/services';
import { LOCAL_NAME } from 'hyperview/src/types';
import type { Node } from 'react';
import Picker from 'hyperview/src/core/components/picker';
import { View } from 'react-native';
/**
 * A picker field renders a form field with values that come from a pre-defined list.
 * - On iOS, pressing the field brings up a custom bottom sheet with a picker and action buttons.
 * - On Android, the system picker is rendered inline on the screen. Pressing the picker
 *   opens a system dialog.
 */
export default class HvPickerField extends PureComponent<HvComponentProps> {
  static namespaceURI = Namespaces.HYPERVIEW;

  static localName = LOCAL_NAME.PICKER_FIELD;

  static localNameAliases = [];

  static getFormInputValues = (element: Element): Array<[string, string]> => {
    return getNameValueFormInputValues(element);
  };

  /**
   * Returns a string representing the value in the field.
   */
  getValue = (): string => this.props.element.getAttribute('value') || '';

  /**
   * Returns a string representing the value in the picker.
   */
  getPickerValue = (): string => this.props.element.getAttribute('value') || '';

  getPickerItems = (): Element[] =>
    Array.from(
      // $FlowFixMe: flow thinks `element` is a `Node` instead of an `Element`
      this.props.element.getElementsByTagNameNS(
        Namespaces.HYPERVIEW,
        LOCAL_NAME.PICKER_ITEM,
      ),
    );

  /**
   * Hides the picker without applying the chosen value.
   */
  onCancel = () => {
    const newElement = this.props.element.cloneNode(true);
    newElement.setAttribute('focused', 'false');
    newElement.removeAttribute('picker-value');
    this.props.onUpdate(null, 'swap', this.props.element, { newElement });
  };

  /**
   * Hides the picker and applies the chosen value to the field.
   */
  onDone = (newValue?: string) => {
    const pickerValue =
      newValue !== undefined ? newValue : this.getPickerValue();
    const value = this.getValue();
    const newElement = this.props.element.cloneNode(true);
    newElement.setAttribute('value', pickerValue);
    newElement.removeAttribute('picker-value');
    newElement.setAttribute('focused', 'false');
    this.props.onUpdate(null, 'swap', this.props.element, { newElement });

    const hasChanged = value !== pickerValue;
    if (hasChanged) {
      Behaviors.trigger('change', newElement, this.props.onUpdate);
    }
  };

  render = (): Node => {
    const onChange = (value: ?string) => {
      if (value === undefined) {
        this.onCancel();
      } else {
        this.onDone(value || '');
      }
    };

    const style: Array<StyleSheet> = createStyleProp(
      this.props.element,
      this.props.stylesheets,
      {
        ...this.props.options,
        styleAttr: 'field-text-style',
      },
    );
    const { testID, accessibilityLabel } = createTestProps(this.props.element);
    const value: ?DOMString = this.props.element.getAttribute('value');
    const placeholderTextColor: ?DOMString = this.props.element.getAttribute(
      'placeholderTextColor',
    );
    if ([undefined, null, ''].includes(value) && placeholderTextColor) {
      style.push({ color: placeholderTextColor });
    }

    const fieldStyle: Array<StyleSheet> = createStyleProp(
      this.props.element,
      this.props.stylesheets,
      {
        ...this.props.options,
        styleAttr: 'field-style',
      },
    );

    // Gets all of the <picker-item> elements. All picker item elements
    // with a value and label are turned into options for the picker.
    const children = this.getPickerItems()
      .filter(Boolean)
      .map((item: Element) => {
        const l: ?DOMString = item.getAttribute('label');
        const v: ?DOMString = item.getAttribute('value');
        if (!l || typeof v !== 'string') {
          return null;
        }
        return <Picker.Item key={l + v} label={l} value={v} />;
      });

    return (
      <View
        accessibilityLabel={accessibilityLabel}
        style={fieldStyle}
        testID={testID}
      >
        <Picker
          onBlur={() =>
            Behaviors.trigger('blur', this.props.element, this.props.onUpdate)
          }
          onFocus={() =>
            Behaviors.trigger('focus', this.props.element, this.props.onUpdate)
          }
          onValueChange={onChange}
          selectedValue={this.getPickerValue()}
          style={style}
        >
          {children}
        </Picker>
      </View>
    );
  };
}
