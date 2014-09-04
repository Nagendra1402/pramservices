package com.fid.prambean;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class GroupDetails {

	private int appId;
	private String appName;

	public int getAppId() {
		return appId;
	}

	public void setAppId(int appId) {
		this.appId = appId;
	}

	public String getAppName() {
		return appName;
	}

	public void setAppName(String appName) {
		this.appName = appName;
	}

}
