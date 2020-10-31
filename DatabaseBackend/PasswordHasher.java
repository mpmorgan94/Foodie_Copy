class PasswordHasher {

    private static int hash = 987875;
    private static int prime1 = 488353;
    private static int prime2 = 7687;


    PasswordHasher () {

    }

    public static String hashPassword(String password) {

        int passwordLength = password.length();
        int charInt = 1;
        for (int i = 0; i < passwordLength; i++) {
            charInt = charInt * password.charAt(i);
        }

        int hash1 = hash * charInt*prime2 + prime1/passwordLength;
        int hash2 = prime2/passwordLength + prime1*charInt;
        String hashConc = Integer.toString(hash1).substring(1) + Integer.toString(hash2).substring(1);

        return hashConc;
    }

}