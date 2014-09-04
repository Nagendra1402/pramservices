package com.fid.pramdao;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.fid.connection.ConnectionHelper;
import com.fid.prambean.ProjectDetails;

public class ProjectDetailsDao {

	ConnectionHelper helper = new ConnectionHelper();

	public List<ProjectDetails> getprojectDetails(int appId)
			throws SQLException {
		List<ProjectDetails> projectDetails = new ArrayList<ProjectDetails>();
		String queryString = "select p.project_id,p.group_id,p.project_name,p.project_desc,p.start_date,p.end_date,p.status from PROJECT_DETAILS p,groups g where p.group_id=g.group_id and p.group_id="
				+ appId + "";
		try {
			helper.connectionDetails();
			Statement st = helper.getConnection().createStatement();
			ResultSet rs = st.executeQuery(queryString);
			while (rs.next()) {
				projectDetails.add(processRow(rs));
			}
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			helper.getConnection().close();
		}
		return projectDetails;
	}

	 public ProjectDetails createProject(ProjectDetails projectDetails) throws SQLException {
		try {
			helper.connectionDetails();
			PreparedStatement pstmt = helper.getConnection()
					.prepareStatement(
							"INSERT INTO PROJECT_DETAILS (project_name,group_id,project_desc,start_date,end_date,status) VALUES (?,?,?,?,?,?)",
							Statement.RETURN_GENERATED_KEYS);
			pstmt.setString(1,projectDetails.getProjectName());
			pstmt.setInt(2,projectDetails.getAppId());
			pstmt.setString(3, projectDetails.getProjectDesciption());
			pstmt.setDate(4, projectDetails.getStartDate());
			pstmt.setDate(5, projectDetails.getEndDate());
			pstmt.setInt(6, projectDetails.getStatus());
			
			pstmt.executeUpdate();
			ResultSet rs=pstmt.getGeneratedKeys();
			rs.next();
			projectDetails.setProjectId(rs.getInt(1));
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		finally{
    		helper.getConnection().close();
    	}
		return projectDetails;
	}

	public ProjectDetails updateProject(ProjectDetails projectDetails) throws SQLException{
		
		try {
			helper.connectionDetails();
			PreparedStatement pstmt=helper.getConnection().prepareStatement("update project_details set project_name=?,project_desc=?,start_date=?,end_date=?,status=? where project_id=?");
			pstmt.setString(1, projectDetails.getProjectName());
			pstmt.setString(2, projectDetails.getProjectDesciption());
			pstmt.setDate(3, projectDetails.getStartDate());
			pstmt.setDate(4, projectDetails.getEndDate());
			pstmt.setInt(5, projectDetails.getStatus());
			pstmt.setInt(6, projectDetails.getProjectId());
			pstmt.executeUpdate();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		finally{
			helper.getConnection().close();
		}
		return projectDetails;
	}
	
	public boolean removeProject(int projectId){
		int count=0;
		try {
			helper.connectionDetails();
			PreparedStatement pstmt=helper.getConnection().prepareStatement("delete from project_Details where project_id=?");
			pstmt.setInt(1, projectId);
			count=pstmt.executeUpdate();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return count==1;	
	}
	private ProjectDetails processRow(ResultSet rs) throws SQLException {
		ProjectDetails projectDetails = new ProjectDetails();
		projectDetails.setProjectId(rs.getInt(1));
		projectDetails.setAppId(rs.getInt(2));
		projectDetails.setProjectName(rs.getString(3));
		projectDetails.setProjectDesciption(rs.getString(4));
		projectDetails.setStartDate(rs.getDate(5));
		projectDetails.setEndDate(rs.getDate(6));
		projectDetails.setStatus(rs.getInt(7));
		return projectDetails;
	}
}
