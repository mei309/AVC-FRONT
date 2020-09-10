export function includesValdaite(result, original) : boolean {
    const controls = Object.keys(original);
    if(controls.every(i => {
            if(original[i]) {
                if (result.hasOwnProperty(i) && result[i]) {
                    if(original[i] instanceof Array) {
                        return includesArray(result[i], original[i]);
                    } else if(original[i] instanceof Object) {
                        return includesValdaite(result[i], original[i]);
                    } else if(i === 'version') {
                        return true;
                    } else if(result[i] != original[i]) {
                        // console.log(result[i]);
                        // console.log(original[i]);
                        // console.log(result);
                        // console.log(original);
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            } else {
                return true;
            }
        })) {
            return true;
        } else {
            // console.log(result);
            // console.log(original);
            return false;
        }
}

export function includesArray(result, original) : boolean {
    if(!original.length) {
        return true;
    }
    if(!result.length) {
        return !original.some(element => {
            const controls = Object.keys(element);
            return controls.some(val => { 
                if(original[val] && original[val] !== ''){
                    return true;
                } else {
                    return false;
                }
            });
        });
    }
    return original.every(line => {
            return result.some(res => {
                    return includesValdaite(res, line);
                });
        });
}

