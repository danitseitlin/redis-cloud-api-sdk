export function loadArguments(): {[key: string]: string} {
    let loadedArguments: {[key: string]: string} = {};
    for(const argument of process.argv) {
        if(argument.indexOf('=') !== -1 && argument.indexOf('--') !== -1) {
            const splitContent: string[] = argument.split('=');
            loadedArguments[splitContent[0].replace('--', '')] = splitContent[1];
        }
    }
    return loadedArguments;
}