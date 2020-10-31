//package project2;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

/**
 *
 * @author johnpatranella
 */
public class QueryConnection {
    
    //public connection within QueryConnection
    Connection conn;
    
    // Constructor
    QueryConnection() {
        System.out.println("Constructed the connection.");
        conn = null;
    }
    
    void OpenConnection() {
        System.out.println("Trying to open the connection...");
        conn = null;
        try {
            //Class.forName("org.postgresql.Driver");
            conn = DriverManager.getConnection(
                    "jdbc:postgresql://csce-315-proj3.czwkocow5s07.us-east-2.rds.amazonaws.com/",
                    "postgres", "o7NAWrjCdVk1rjMjicAB");
        }
        catch (Exception e) {
            e.printStackTrace();
            System.err.println(e.getClass().getName()+": "+e.getMessage());
            System.exit(0);
        }//end try catch
        System.out.println("Opened database successfully");
    }
    
    void CloseConnection() {
        //closing the connection
        try {
            conn.close();
            System.out.println("Connection Closed.");
        }
        catch(Exception e) {
            System.out.println("Connection NOT Closed.");
        }//end try catch
    }
    
    ResultSet PerformQuery(String queryString) {
        ResultSet retQuery = null;
        try {
            //create a statement object
            Statement stmt = conn.createStatement();
            //send statement to DBMS
            System.out.println("Performing Query...");
            retQuery = stmt.executeQuery(queryString);
        }
        catch (Exception e) {
            System.out.println("Error accessing Database.");
            System.out.println(e.getMessage());
        }
        
        return retQuery;
    }
    
}