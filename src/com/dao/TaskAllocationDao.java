package com.fid.pramdao;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.fid.connection.ConnectionHelper;
import com.fid.prambean.TaskAllocation;

public class TaskAllocationDao {

	ConnectionHelper helper = new ConnectionHelper();

	public List<TaskAllocation> getAllocationDetails(int taskId)
			throws SQLException {

		List<TaskAllocation> taskAllocations = new ArrayList<TaskAllocation>();
		try {
			helper.connectionDetails();
			PreparedStatement pstmt = helper
					.getConnection()
					.prepareStatement(
							"select t.corp_id,t.task_id,t.start_date,t.end_date,t.status_complete,t.allocation,t.assign_id from taskallocation t,resources r,task_details ta"
									+ " where t.corp_id = r.corp_id and t.task_id = ta.task_id and t.task_id=?");
			pstmt.setInt(1, taskId);
			ResultSet rs = pstmt.executeQuery();
			while (rs.next()) {
				taskAllocations.add(processRow(rs));
			}

		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			helper.getConnection().close();
		}
		return taskAllocations;
	}

	public TaskAllocation creatTaskAllocation(TaskAllocation taskAllocation) throws SQLException {

		try {
			helper.connectionDetails();
			PreparedStatement pstmt = helper
					.getConnection()
					.prepareStatement(
							"insert into taskallocation (corp_id,task_id,start_date,end_date,status_complete,allocation)"
									+ "values(?,?,?,?,?,?)");
			pstmt.setString(1, taskAllocation.getCorpId());
			pstmt.setInt(2, taskAllocation.getTaskId());
			pstmt.setDate(3, taskAllocation.getStartDate());
			pstmt.setDate(4, taskAllocation.getEndDate());
			pstmt.setInt(5, taskAllocation.getStatus());
			pstmt.setInt(6, taskAllocation.getAllocation());

			pstmt.executeUpdate();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        finally{
        	helper.getConnection().close();
        }
		return taskAllocation;
	}

	public TaskAllocation updateTaskAllocation(TaskAllocation taskAllocation){
		try {
			helper.connectionDetails();
			PreparedStatement pstmt=helper.getConnection().prepareStatement("update taskallocation set corp_id=?,task_id=?,start_date=?,end_date=?,status_complete=?,allocation=? where assign_id=?");
			pstmt.setString(1, taskAllocation.getCorpId());
			pstmt.setInt(2, taskAllocation.getTaskId());
			pstmt.setDate(3, taskAllocation.getStartDate());
			pstmt.setDate(4, taskAllocation.getEndDate());
			pstmt.setInt(5, taskAllocation.getStatus());
			pstmt.setInt(6, taskAllocation.getAllocation());
			pstmt.setInt(7, taskAllocation.getAssignId());
			pstmt.executeUpdate();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return taskAllocation;
	}
	
	public boolean deleteTaskAllocation(int assignId) throws SQLException{
		
		 int count=0;
		try {
			helper.connectionDetails();
			PreparedStatement pstmt=helper.getConnection().prepareStatement("delete from taskallocation where assign_id=?");
			pstmt.setInt(1, assignId);
			count=pstmt.executeUpdate();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		finally{
			helper.getConnection().close();
		}
		return count==1;	
	}
	
	private TaskAllocation processRow(ResultSet rs) throws SQLException {
		TaskAllocation taskAllocation = new TaskAllocation();
		taskAllocation.setCorpId(rs.getString(1));
		taskAllocation.setTaskId(rs.getInt(2));
		taskAllocation.setStartDate(rs.getDate(3));
		taskAllocation.setEndDate(rs.getDate(4));
		taskAllocation.setStatus(rs.getInt(5));
		taskAllocation.setAllocation(rs.getInt(6));
		taskAllocation.setAssignId(rs.getInt(7));
		return taskAllocation;
	}
}
