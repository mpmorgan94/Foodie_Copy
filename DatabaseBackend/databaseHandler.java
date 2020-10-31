import java.sql.ResultSet;

class databaseHandler {

    static QueryConnection qc;

    public static void main(String[] args) {

        //start connection to the database
        qc = new QueryConnection();
        qc.OpenConnection();

        // this is a series of test
        testFunctions();

        // state that the main has finished
        System.out.println("End...");

    }

    public static void testQuery() {

        System.out.println("Preforming test query...");
        String queryToRun = "SELECT * FROM public.users;";
        ResultSet res = qc.PerformQuery(queryToRun);

        try {
            while (res.next()) {
                System.out.println("username: " +
                    res.getString("username") +
                    " password: " + res.getString("password"));
            }
        }
        catch (Exception e) {
            System.out.println("Error. Could not run test query.");
        }
        System.out.println("Test query complete...");

    }

    public static void createUser(String username, String password) {

        // if user already exist, stop user creation process
        if (userExist(username)) {
            System.out.println("This username is already taken.");
        }
        else {

            PasswordHasher ph = new PasswordHasher();
            String hashedPassword = ph.hashPassword(password);

            String command = "INSERT INTO users(username, password)" + "VALUES ('" + username + "', '" + hashedPassword + "');";
            if (password == "") {
                System.out.println("Password can not be empty");
            }
            else {
                qc.PerformQuery(command);
            }
        }

    }

    public static void deleteUser(String username) {

        if (userExist(username) == false) {
            System.out.println("This username does not exist. Can not delete.");
        }
        else {
            String command = "DELETE FROM users WHERE username='" + username + "';";
            qc.PerformQuery(command);
            System.out.println("Deleted user: " + username);
        }

    }

    public static boolean userExist(String username) {

        String queryString = "SELECT username FROM users WHERE username='" + username + "';";
        ResultSet res = qc.PerformQuery(queryString);
        try {
            if (res.next()) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (Exception e) {
            System.out.println("Error. Could not check if user exist. Returning true by default.");
            System.out.println(e.getMessage());
            return true;
        }

    }

    public static boolean verifyCreds(String username, String password) {

        if (userExist(username) == false) {
            System.out.println("Username not found.");
            return false;
        }
        else {
            String queryString = "SELECT password FROM users WHERE username='" + username + "';";
            // stored password is initialized to "" and therefore
            // we can not allow any passwords to be blank/empty/null
            String storedPassword = "";

            ResultSet res = qc.PerformQuery(queryString);
            try {
                while (res.next()) {
                    storedPassword = res.getString("password");
                    PasswordHasher ph = new PasswordHasher();
                    String hasedPassword = ph.hashPassword(password);
                    //System.out.println("Password=====" + password);
                    //System.out.println("hashedPassword=====" + hasedPassword);
                    //System.out.println("storedPassword=====" + storedPassword);
                    if (storedPassword.equals(hasedPassword) && storedPassword.equals("") == false) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
            catch (Exception e) {
                System.out.println("Failed to verify password. Returning false.");
                System.out.println(e.getMessage());
                return false;
            }

            // by default, return false
            System.out.println("Unknown Error.");
            return false;
        }

    }

    public static void createRecipe(String user, String id) {
      String command = "INSERT INTO recipes(users, ids)" + "VALUES ('" + user + "','" + id + "');";
      if (id == "")
      {
        System.out.println("Recipe ID entered is blank!!!");
      }
      else if (user == "")
      {
        System.out.println("user entered is blank!!!");
      }
      else
      {
        qc.PerformQuery(command);
      }
    }

    public static void deleteRecipe(String user, String id){
      if (RecipeExists(user, id) == false) {
          System.out.println("This Recipe does not exist. Can not delete.");
      }
      else {
          String command = "DELETE FROM recipes" + " WHERE (users = '" + user + "') AND (ids = '" + id + "');";
          System.out.println(command);
          qc.PerformQuery(command);
          System.out.println("Deleted Recipe: " + id);
      }


    }

    public static boolean RecipeExists(String user, String id){
      String queryString = "SELECT ids FROM recipes" + " WHERE (users = '" + user + "') AND (ids = '" + id + "');";
      ResultSet res = qc.PerformQuery(queryString);
      try {
          if (res.next()) {
              return true;
          }
          else {
              return false;
          }
      }
      catch (Exception e) {
          System.out.println("Error. Could not check if recipe exists. Returning true by default.");
          System.out.println(e.getMessage());
          return true;
      }

    }

    public static void testFunctions() {


        /**  Commenting out old test code
        // test query connection
        testQuery();
        System.out.println("\n\n");

        // test deleteUser
        deleteUser("testusername1");
        deleteUser("testusername2");
        System.out.println("\n\n");

        // test userExist functionality
        if (userExist("morganpat")) {
            System.out.println("user exist");
        }
        else {
            System.out.println("user does not exist");
        }
        System.out.println("\n\n");

        // test createUser
        createUser("testusername1", "password1");
        System.out.println("\n\n");
        createUser("testusername2", "password2");
        System.out.println("\n\n");

        // test verifyCreds
        if (verifyCreds("testusername1", "password1")) {
            System.out.println("Correct Creds.");
        }
        else {
            System.out.println("Incorrect Creds.");
        }
        System.out.println("\n\n");
        // test verifyCreds 2
        if (verifyCreds("testusername2", "password2")) {
            System.out.println("Correct Creds.");
        }
        else {
            System.out.println("Incorrect Creds.");
        }
        System.out.println("\n\n");
        *//////

        createRecipe("Freddy Torres", "123456");
        createRecipe("Freddy Torres", "123456");
        createRecipe("Freddy Torres", "123456");
        deleteRecipe("James Gandolfini", "123456");
        //deleteRecipe("Freddy Torres", "123456");


    }

}
