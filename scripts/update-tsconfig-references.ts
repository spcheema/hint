import * as shell from 'shelljs';

type PackageJSON = {
    dependencies?: { [name: string ]: string };
    devDependencies?: { [name: string ]: string };
    peerDependencies?: { [name: string ]: string };
};

type TSConfig = {
    references?: { path: string }[];
};

const getReferencesFromDependencies = (packagePath: string): string[] => {
    const packageJSONPath = `${packagePath}/package.json`;
    const packageJSON: PackageJSON = require(`../../${packageJSONPath}`);

    const dependencies = Object.keys(packageJSON.dependencies || {});
    const devDependencies = Object.keys(packageJSON.devDependencies || {});
    const peerDependencies = Object.keys(packageJSON.peerDependencies || {});
    const allDependencies = [...dependencies, ...devDependencies, ...peerDependencies];
    const uniqueDependencies = Array.from(new Set(allDependencies));

    // Map `hint` and `@hint/*` dependencies from `package.json` to `tsconfig.json` reference names.
    return uniqueDependencies
        .filter((name) => {
            return name === 'hint' || name.startsWith('@hint/');
        })
        .map((name) => {
            return name.replace('@hint/', '');
        });
};

const compactReferences = (json: string): string => {
    // Condense JSON-serialized references to fit on a single line.
    return json.replace(/\{\r?\n\s*("path": "[^"]+")\r?\n\s*}/g, '{ $1 }');
};

const updateFile = (filePath: string, content: string) => {
    const writeContent = (shell as any)['ShellString']; // eslint-disable-line dot-notation

    writeContent(content).to(filePath);
};

const main = () => {

    // Include all sub-packages (except configurations which don't use TypeScript).
    const subPackages = shell.ls('-d', 'packages/!(configuration-*)');

    // For the root and every package in this repo.
    ['.', ...subPackages].forEach((packagePath: string) => {

        const tsconfigPath = `${packagePath}/tsconfig.json`;
        const tsconfigJSON: TSConfig = require(`../../${tsconfigPath}`);

        let prefix: string;
        let references: string[];

        if (packagePath === '.') {

            // Include all sub-packages as references in the root `tsconfig.json`.
            prefix = '';
            references = subPackages.filter((path) => {
                // Exclude `connector-edge` as it only builds on Windows (can be built separately as-needed).
                return path !== 'packages/connector-edge';
            });

        } else {

            // Only include explicit dependencies in sub-packages.
            prefix = '../';
            references = getReferencesFromDependencies(packagePath);

        }

        // Convert references to the expected `tsconfig.json` format.
        tsconfigJSON.references = references
            .sort()
            .map((reference) => {
                return { path: `${prefix}${reference}` };
            });

        // Omit the references section if none exist.
        if (!tsconfigJSON.references.length) {
            delete tsconfigJSON.references;
        }

        // Serialize the updated `tsconfig.json`, keeping references on one line each.
        const json = JSON.stringify(tsconfigJSON, null, 4);
        const compactedJSON = compactReferences(json);

        // Save the changes to `tsconfig.json`.
        updateFile(tsconfigPath, `${compactedJSON}\n`);
    });

};

main();
