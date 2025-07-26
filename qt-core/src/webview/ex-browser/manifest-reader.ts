// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import _ from 'lodash';
import * as fs from 'fs';
import { XMLParser } from 'fast-xml-parser';
import { ParsedExampleData } from '../shared/ex-types';

const xmlOptions = {
  // attributes
  ignoreAttributes: false,
  attributeNamePrefix: '',
  attributesGroupName: 'attributes',

  // text
  textNodeName: 'text',
  alwaysCreateTextNode: true,

  // tag
  isArray: (
    tagName: string,
    _jPath: string,
    _isLeafNode: boolean,
    _isAttribute: boolean
  ): boolean => {
    void _jPath;
    void _isLeafNode;
    void _isAttribute;

    return tagName === 'example'
      || tagName === 'fileToOpen'
      || tagName === 'entry';
  }
};

const text = 'text'
const attr = 'attributes'

export function parseXml(absPath: string) {
  const data = fs.readFileSync(absPath);
  const parser = new XMLParser(xmlOptions);
  const o: unknown = parser.parse(data);

  const module = _.get(o, `instructionals.${attr}.module`, '');
  const examples = _.get(o, "instructionals.examples.example", []);

  if (!Array.isArray(examples)) {
    return undefined;
  }

  examples.forEach(ex => {
    const attrs = _.get(ex, attr, {});

    const parsed: ParsedExampleData = {
      description: _.get(ex, `description.${text}`, ''),
      tags: _.get(ex, 'tags', ''),
      name: _.get(attrs, 'name', ''),
      docUrl: _.get(attrs, 'docUrl', ''),
      imageUrl: _.get(attrs, 'imageUrl', ''),
      isHighlighted: Boolean(_.get(attrs, 'isHighlighted', '')),
      projectPath: _.get(attrs, 'projectPath', ''),

      filesToOpen: {
        all: [],
        mainIndex: -1
      },

      metaEntries: []
    }

    // meta
    const metaEntryArray = _.get(ex, 'meta.entry', []);
    if (Array.isArray(metaEntryArray)) {
      metaEntryArray.forEach(entry => {
        const name = _.get(entry, `${attr}.name`, '');
        const value = _.get(entry, text, '');
        parsed.metaEntries.push({ name, value });
      })
    }

    // files to open
    const filesToOpenArray = _.get(ex, 'fileToOpen', []);
    if (Array.isArray(filesToOpenArray)) {
      filesToOpenArray.forEach((f, i) => {
        parsed.filesToOpen.all.push(_.get(f, text, ''));
        if (Boolean(_.get(f, `${attr}.mainFile`, '')) === true) {
          parsed.filesToOpen.mainIndex = i;
        }
      })
    }

    console.log('---------------------');
    console.log(module, parsed);
  })

  // console.log(module);
  // console.log(examples);

  return o;
}
