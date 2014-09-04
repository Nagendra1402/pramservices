package com.fid.pramdao;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.fid.connection.ConnectionHelper;
import com.fid.prambean.GroupDetails;

public class GroupDetailsDao {

	ConnectionHelper helper = new ConnectionHelper();

	public List<GroupDetails> getGroupDetails() throws SQLException {
		List<GroupDetails> groupDetails = new ArrayList<GroupDetails>();
		String query = "select group_id,group_name from groups";
		try {
			helper.connectionDetails();
			Statement st = helper.getConnection().createStatement();
			ResultSet rs = st.executeQuery(query);
			while (rs.next()) {
				groupDetails.add(processRow(rs));
			}
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			helper.getConnection().close();
		}
		return groupDetails;
	}

	public GroupDetails createGroup(GroupDetails groupDetails)
			throws SQLException {
		try {
			helper.connectionDetails();
			PreparedStatement pstmt = helper.getConnection().prepareStatement(
					"insert into groups (group_name) values(?)",
					Statement.RETURN_GENERATED_KEYS);
			pstmt.setString(1, groupDetails.getAppName());
			pstmt.executeUpdate();

			ResultSet rs = pstmt.getGeneratedKeys();
			rs.next();
			groupDetails.setAppId(rs.getInt(1));

		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			helper.getConnection().close();
		}
		return groupDetails;
	}

	public boolean removeGroup(int groupId) throws SQLException {
		int count = 0;
		try {
			helper.connectionDetails();
			PreparedStatement pstmt = helper.getConnection().prepareStatement(
					"delete from groups where group_id=?");
			pstmt.setInt(1, groupId);
			count = pstmt.executeUpdate();
			return count == 1;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			helper.getConnection().close();
		}
		return count == 1;
	}

	public GroupDetails updateGroup(GroupDetails groupDetails)
			throws SQLException {
		String sql = "update groups SET group_name=? where group_id=?";
		try {
			helper.connectionDetails();
			PreparedStatement pstmt = helper.getConnection().prepareStatement(
					sql);
			pstmt.setString(1, groupDetails.getAppName());
			pstmt.setInt(2, groupDetails.getAppId());
			pstmt.executeUpdate();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			helper.getConnection().close();
		}
		return groupDetails;
	}

	private GroupDetails processRow(ResultSet rs) throws SQLException {

		GroupDetails details = new GroupDetails();
		details.setAppId(rs.getInt(1));
		details.setAppName(rs.getString(2));
		return details;
	}
}
