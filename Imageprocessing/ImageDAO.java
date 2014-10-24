package com.fid.pramdao;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;

import com.fid.connection.ConnectionHelper;
import com.fid.prambean.ImageBean;

public class ImageDAO {
       
	   Logger logger= Logger.getLogger(ImageDAO.class);
	   
	   ConnectionHelper helper=new ConnectionHelper();
	   public void saveFile(File file,String fileName) throws SQLException, IOException {
		     try {
				helper.connectionDetails();
			     PreparedStatement pstmt=helper.getConnection().prepareStatement("insert into images values(?,?,?)");
			     InputStream uploadedInputStream= new FileInputStream(file);
			     String imageSize= (int)file.length()/1024+"kb";
			     pstmt.setString(1, imageSize);
			     pstmt.setString(2,fileName);
			     pstmt.setBinaryStream(3, uploadedInputStream, (int)file.length());
			     pstmt.executeUpdate();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		     finally{
		    	 helper.getConnection().close();
		     }
	    }
		  
	   public File getFile(int imageId) throws SQLException, IOException{
			
				helper.connectionDetails();
				Statement stmt=helper.getConnection().createStatement();
				ResultSet rs=stmt.executeQuery("select image_name,fullimage from images where image_id="
				+imageId+"");
                    rs.next();
				    String fileName=rs.getString(1); 
				    File file = new File(fileName); 
					InputStream in = rs.getBinaryStream(2);
					OutputStream f = new FileOutputStream(file);
					int c = 0;
					while ((c = in.read()) > -1) {
					f.write(c);
					}
					f.close();
					in.close();	
			return file;
	  }
	  
	   public List<ImageBean> getImageDetails(){
		   
		   List<ImageBean> imageList= new ArrayList<ImageBean>();
		   
		   try {
			helper.connectionDetails();
			Statement stmt=helper.getConnection().createStatement();
			ResultSet rs=stmt.executeQuery("select image_id,image_length,image_name from images");
			
			while(rs.next()){
				ImageBean imageDetails = new ImageBean();
              imageDetails.setImageId(rs.getInt(1));
              imageDetails.setImageLength(rs.getString(2));
              imageDetails.setImageName(rs.getString(3));
              imageList.add(imageDetails);			}
			
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return imageList;
		   
	   }
}
