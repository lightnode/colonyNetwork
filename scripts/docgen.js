#!/usr/bin/env node
/* eslint-disable */

const fs = require('fs');
const path = require('path');

const INTERFACES = [
  {
    file: path.resolve(__dirname, '..', 'contracts', 'IColony.sol'),
    templateFile: path.resolve(__dirname, '..', 'docs', 'templates', '_API_Colony.template.md'),
    output: path.resolve(__dirname, '..', 'docs', 'public', '_API_Colony.md'),
  },
  {
    file: path.resolve(__dirname, '..', 'contracts', 'IColonyNetwork.sol'),
    templateFile: path.resolve(__dirname, '..', 'docs', 'templates', '_API_ColonyNetwork.template.md'),
    output: path.resolve(__dirname, '..', 'docs', 'public', '_API_ColonyNetwork.md'),
  },
  {
    file: path.resolve(__dirname, '..', 'contracts', 'IMetaColony.sol'),
    templateFile: path.resolve(__dirname, '..', 'docs', 'templates', '_API_MetaColony.template.md'),
    output: path.resolve(__dirname, '..', 'docs', 'public', '_API_MetaColony.md'),
  },
  {
    file: path.resolve(__dirname, '..', 'contracts', 'IReputationMiningCycle.sol'),
    templateFile: path.resolve(__dirname, '..', 'docs', 'templates', '_API_ReputationMiningCycle.template.md'),
    output: path.resolve(__dirname, '..', 'docs', 'public', '_API_ReputationMiningCycle.md'),
  },
];

const generateMarkdown = ({ file, templateFile, output }) => {

  const template = fs.readFileSync(templateFile).toString();
  const printInterface = fs.readFileSync(file).toString();

  const md = `
 ${template}
 \`\`\`javascript
 ${printInterface}
 \`\`\`
 `.trim();

  fs.writeFileSync(output, md);
};

// TODO: actually get a solidity parser working. And make the docs less silly.

INTERFACES.forEach(generateMarkdown);
