package com.fid.connection;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConnectionHelper {
	private Connection connection;

	public void connectionDetails() throws SQLException {

		String connectionurl = "jdbc:sqlserver://INDCDA145681:1444;instance=Testing;databaseName=pamdb;user=pamdbdev;password=pamdbdev";

		try {
			Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver").newInstance();
            setConnection(DriverManager.getConnection(connectionurl));
			
		} catch (InstantiationException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	public Connection getConnection() {
		return connection;
	}

	public void setConnection(Connection connection) {
		this.connection = connection;
	}
}
