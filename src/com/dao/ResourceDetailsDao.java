package com.fid.pramdao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.fid.connection.ConnectionHelper;
import com.fid.prambean.ResourceDetails;

public class ResourceDetailsDao {

	ConnectionHelper helper = new ConnectionHelper();
	Connection con;

	public List<ResourceDetails> getResourceDetails(int appId)
			throws SQLException {

		List<ResourceDetails> resourceList = new ArrayList<ResourceDetails>();
		try {
			helper.connectionDetails();
			PreparedStatement pstmt = helper
					.getConnection()
					.prepareStatement(
							"WITH resource_hierarchy (corp_id,group_id,resource_name,contact_no,designation,skill_set,reporting_manager,level) AS (select corp_id,group_id,resource_name,contact_no,designaton,skill_set,reporting_manager,0 from resources where reporting_manager IS NULL and group_id=? UNION ALL select r.corp_id,r.group_id,r.resource_name,r.contact_no,r.designaton,r.skill_set,r.reporting_manager,r.level+ 1 from resources r INNER JOIN resource_hierarchy ON r.reporting_manager= resource_hierarchy.corp_id) select * from resource_hierarchy ORDER BY level");
			pstmt.setInt(1, appId);
			ResultSet rs = pstmt.executeQuery();
			while (rs.next()) {
				resourceList.add(processRow(rs));
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			helper.getConnection().close();
		}

		return resourceList;
	}

	public ResourceDetails createResource(ResourceDetails resourceDetails)
			throws SQLException {

		try {
			helper.connectionDetails();
			PreparedStatement pstmt = helper
					.getConnection()
					.prepareStatement(
							"insert into resources(corp_id,group_id,resource_name,contact_no,designaton,skill_set,reporting_manager,level) values(?,?,?,?,?,?,?,?)");
			pstmt.setString(1, resourceDetails.getCorpId());
			pstmt.setInt(2, resourceDetails.getAppId());
			pstmt.setString(3, resourceDetails.getResourceName());
			pstmt.setString(4, resourceDetails.getContactNumber());
			pstmt.setString(5, resourceDetails.getDesignation());
			pstmt.setString(6, resourceDetails.getSkillSet());
			pstmt.setString(7, resourceDetails.getReportingManager());
			pstmt.setInt(8, resourceDetails.getLevel());
			pstmt.executeUpdate();
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			helper.getConnection().close();
		}
		return resourceDetails;
	}

	public ResourceDetails updateResource(ResourceDetails resourceDetails)
			throws SQLException {

		try {
			helper.connectionDetails();
			con = helper.getConnection();
			PreparedStatement pstmt = con
					.prepareStatement("update resources set group_id=?, resource_name=?,contact_no=?,designaton=?,skill_set=?,reporting_manager=? where corp_id=?");
			pstmt.setInt(1, resourceDetails.getAppId());
			pstmt.setString(2, resourceDetails.getResourceName());
			pstmt.setString(3, resourceDetails.getContactNumber());
			pstmt.setString(4, resourceDetails.getDesignation());
			pstmt.setString(5, resourceDetails.getSkillSet());
			pstmt.setString(6, resourceDetails.getReportingManager());
			pstmt.setInt(7, resourceDetails.getLevel());
			pstmt.setString(8, resourceDetails.getCorpId());
			pstmt.executeUpdate();
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			con.close();
		}

		return resourceDetails;
	}

	public boolean deleteResource(ResourceDetails resourceDetails) {
		int count = 0;
		try {
			helper.connectionDetails();
			con = helper.getConnection();
			PreparedStatement pstmt = con
					.prepareStatement("delete from resources where corp_id=?");
			pstmt.setString(1, resourceDetails.getCorpId());
			count = pstmt.executeUpdate();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return count == 1;
	}

	private ResourceDetails processRow(ResultSet rs) throws SQLException {
		ResourceDetails resourceDetails = new ResourceDetails();
		resourceDetails.setCorpId(rs.getString(1));
		resourceDetails.setAppId(rs.getInt(2));
		resourceDetails.setResourceName(rs.getString(3));
		resourceDetails.setContactNumber(rs.getString(4));
		resourceDetails.setDesignation(rs.getString(5));
		resourceDetails.setSkillSet(rs.getString(6));
		resourceDetails.setReportingManager(rs.getString(7));
		resourceDetails.setLevel(rs.getInt(8));
		return resourceDetails;
	}
}
