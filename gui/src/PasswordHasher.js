
class PasswordHasher {

    constructor () {}

    hashPassword (password) {

        let hash = 9;
        let prime1 = 488353;
        let prime2 = 7687;

        let passwordLength = password.length;
        let charInt = 1;

        var i;
        for (i = 0; i < passwordLength; i++) {
            charInt = charInt * password.charCodeAt(i);
        }

        let hash1 = hash * charInt * prime2 + prime1 / passwordLength;
        let hash2 = prime2 / passwordLength + prime1 * charInt;
        let hashConc = hash1.toString().substring(1, hash1.length) + hash2.toString().substring(1, hash2.length);

        return hashConc;
    }
}

export default PasswordHasher;