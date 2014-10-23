package com.fid.prambean;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class ImageBean {
  
	private int imageId;
	private String imageName;
	private String imageLength;
	public int getImageId() {
		return imageId;
	}
	public void setImageId(int imageId) {
		this.imageId = imageId;
	}
	public String getImageName() {
		return imageName;
	}
	public void setImageName(String imageName) {
		this.imageName = imageName;
	}
	public String getImageLength() {
		return imageLength;
	}
	public void setImageLength(String imageLength) {
		this.imageLength = imageLength;
	}
	
  	
}
