import { getHintPath } from 'hint/dist/src/lib/utils/hint-helpers';
import generateHTMLPage from 'hint/dist/src/lib/utils/misc/generate-html-page';
import readFile from 'hint/dist/src/lib/utils/fs/read-file';
import { HintTest } from '@hint/utils-tests-helpers/dist/src/hint-test-type';
import * as hintRunner from '@hint/utils-tests-helpers/dist/src/hint-runner';

import { ignoredConnectors } from './_ignored-connectors';

const hintPath = getHintPath(__filename, true);

const generateHTMLConfig = (fileName: string) => {
    const path = 'fixtures/html';
    const htmlFile = readFile(`${__dirname}/${path}/${fileName}.html`);

    return { '/': generateHTMLPage(undefined, htmlFile) };
};

/*
 * Tests for html features that were removed / deprecated.
 * More information about how `hintRunner` can be configured is
 * available in:
 * https://webhint.io/docs/contributor-guide/how-to/test-hints/
 */

const elementAddedAlwaysTrue: HintTest[] = [
    {
        name: 'Elements that have added as true should pass.',
        serverConfig: generateHTMLConfig('div')
    }
];

hintRunner.testHint(hintPath, elementAddedAlwaysTrue, { browserslist: ['last 2 Edge versions'], ignoredConnectors });

const elementAttrAddedAlwaysTrue: HintTest[] = [
    {
        name: 'Element attributes that have added as true should pass.',
        serverConfig: generateHTMLConfig('img')
    }
];

hintRunner.testHint(hintPath, elementAttrAddedAlwaysTrue, { browserslist: ['> 1%'], ignoredConnectors });

const elementAttrVersionAddedFalse: HintTest[] = [
    {
        name: 'Element attributes that have version added as false and not deprecated should fail.',
        reports: [{ message: 'srcset attribute of the img element is not supported by ie.', position: { match: 'img' } }],
        serverConfig: generateHTMLConfig('img-srcset')
    }
];

hintRunner.testHint(hintPath, elementAttrVersionAddedFalse, { browserslist: ['ie 9'], ignoredConnectors });

const elementVersionAddedNull: HintTest[] = [
    {
        name: 'Elements that have version added as null should pass.',
        serverConfig: generateHTMLConfig('canvas')
    }
];

hintRunner.testHint(hintPath, elementVersionAddedNull, { browserslist: ['and_chr 69'], ignoredConnectors });

const elementVersionAddedFalse: HintTest[] = [
    {
        name: 'Elements that have version added as false and deprecated should not fail',
        serverConfig: generateHTMLConfig('blink')
    }
];

hintRunner.testHint(hintPath, elementVersionAddedFalse, { browserslist: ['last 2 Chrome versions'], ignoredConnectors });

const elementAddedInVersionBeforeTargetedBrowserVersion: HintTest[] = [
    {
        name: 'Elements added in version before targeted browser should pass.',
        serverConfig: generateHTMLConfig('video')
    }
];

hintRunner.testHint(hintPath, elementAddedInVersionBeforeTargetedBrowserVersion, { browserslist: ['ie 10'], ignoredConnectors });

const elementAddedVersionOfTargetedBrowser: HintTest[] = [
    {
        name: 'Elements that were added the version of the targeted browser should pass.',
        serverConfig: generateHTMLConfig('video')
    }
];

hintRunner.testHint(hintPath, elementAddedVersionOfTargetedBrowser, { browserslist: ['ie 9'], ignoredConnectors });

const elementAddedInVersionAfterTargetedBrowserVersion: HintTest[] = [
    {
        name: 'Elements added in version after targeted browser should fail.',
        reports: [{ message: 'video element is not supported by ie 8.', position: { match: 'video' } }],
        serverConfig: generateHTMLConfig('video')
    }
];

hintRunner.testHint(hintPath, elementAddedInVersionAfterTargetedBrowserVersion, { browserslist: ['ie 8'], ignoredConnectors });

const elementAttrVersionAddedNull: HintTest[] = [
    {
        name: 'Element attributes that have version added as null should pass.',
        serverConfig: generateHTMLConfig('img-onerror')
    }
];

hintRunner.testHint(hintPath, elementAttrVersionAddedNull, { browserslist: ['last 2 Edge versions'], ignoredConnectors });

/*
 * GLOBAL ATTRIBUTES
 */
const globalAttrVersionAddedNull: HintTest[] = [
    {
        name: 'Global attributes that have version added as null should pass.',
        serverConfig: generateHTMLConfig('global-attr-autofocus')
    }
];

hintRunner.testHint(hintPath, globalAttrVersionAddedNull, { browserslist: ['last 2 and_chr versions'], ignoredConnectors });

const globalAttrVersionAddedFalse: HintTest[] = [
    {
        name: 'Global attributes that have version added as false and not deprecated should fail.',
        reports: [{ message: 'global attribute dropzone is not supported by edge, firefox, ie.', position: { match: 'div' } }],
        serverConfig: generateHTMLConfig('global-attr-dropzone')
    }
];

hintRunner.testHint(hintPath, globalAttrVersionAddedFalse, { browserslist: ['last 2 edge versions', 'last 2 firefox versions', 'last 2 ie versions', 'Chrome 60'], ignoredConnectors });

const globalAttrAddedInVersionBeforeTargetedBrowserVersion: HintTest[] = [
    {
        name: 'Global attributes added in version before targeted browser should pass.',
        serverConfig: generateHTMLConfig('div')
    }
];

hintRunner.testHint(hintPath, globalAttrAddedInVersionBeforeTargetedBrowserVersion, { browserslist: ['firefox 34'], ignoredConnectors });

const globalAttrAddedVersionOfTargetedBrowser: HintTest[] = [
    {
        name: 'Global attributes added in version of targeted browser should pass.',
        serverConfig: generateHTMLConfig('div')
    }
];

hintRunner.testHint(hintPath, globalAttrAddedVersionOfTargetedBrowser, { browserslist: ['firefox 34'], ignoredConnectors });

const globalAttrAddedInVersionAfterTargetedBrowserVersion: HintTest[] = [
    {
        name: 'Global attributes added in version after targeted browser should fail.',
        reports: [{ message: 'global attribute class is not supported by firefox 31.', position: { match: 'div' } }],
        serverConfig: generateHTMLConfig('div')
    }
];

hintRunner.testHint(hintPath, globalAttrAddedInVersionAfterTargetedBrowserVersion, { browserslist: ['firefox 31'], ignoredConnectors });

/*
 * INPUT TYPES
 * Presently there are no input types that have been removed.
 */
const inputTypeVersionAddedNull: HintTest[] = [
    {
        name: 'Input types that have version added as null should pass.',
        serverConfig: generateHTMLConfig('input-color')
    }
];

hintRunner.testHint(hintPath, inputTypeVersionAddedNull, { browserslist: ['last 2 and_chr versions'], ignoredConnectors });

const inputTypeVersionAddedFalse: HintTest[] = [
    {
        name: 'Input types that have version added as false and not deprecated should fail.',
        reports: [{ message: 'input type color is not supported by ie.', position: { match: 'input' } }],
        serverConfig: generateHTMLConfig('input-color')
    }
];

hintRunner.testHint(hintPath, inputTypeVersionAddedFalse, { browserslist: ['ie 9'], ignoredConnectors });

const inputTypeVersionAddedAfterTargetedBrowsers: HintTest[] = [
    {
        name: 'Input types added in a version after the targeted browsers should fail.',
        reports: [{ message: 'input type color is not supported by chrome 19, firefox 28.', position: { match: 'input' } }],
        serverConfig: generateHTMLConfig('input-color')
    }
];

hintRunner.testHint(hintPath, inputTypeVersionAddedAfterTargetedBrowsers, { browserslist: ['chrome 19', 'firefox 28', 'edge 15'], ignoredConnectors });

/*
 * IGNORE HINT OPTION
 */

const mixedFeaturedCompatibility: HintTest[] = [
    {
        name: 'Features with mixed compatibility (not supported for specific version and never supported) and not deprecated should throw errors for browsers in which the feature is not supported.',
        reports: [{ message: 'integrity attribute of the link element is not supported by edge, ie, safari, safari_ios, samsunginternet_android 4, webview_android 4.', position: { match: 'link' } }],
        serverConfig: generateHTMLConfig('link-integrity')
    }
];

hintRunner.testHint(hintPath, mixedFeaturedCompatibility, {
    browserslist: ['firefox 28', 'edge 15', 'ie 10', 'safari 11', 'ios_saf 11', 'samsung 4', 'android 4'],
    hintOptions: { enable: ['integrity'] },
    ignoredConnectors
});

const fixturesWithIgnoredFeatures = [
    'link-integrity',
    'script-integrity',
    'link-crossorigin',
    'spellcheck'
];

const defaultIgnoredFeatures: HintTest[] = fixturesWithIgnoredFeatures.map((filename: string) => {
    return {
        name: `Ignored features by default should pass (${filename}).`,
        serverConfig: generateHTMLConfig(filename)
    };
});

hintRunner.testHint(hintPath, defaultIgnoredFeatures, { browserslist: ['ie 10', 'chrome 24'], ignoredConnectors });
