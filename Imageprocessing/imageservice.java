	@POST
	@Path("/upload")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response putImage(
	           @FormDataParam("file") File file,
	           @FormDataParam("file") FormDataContentDisposition contentDispositionHeader) throws SQLException, IOException{
		String filePath = SERVER_UPLOAD_LOCATION_FOLDER + contentDispositionHeader.getFileName();
		String fileName=contentDispositionHeader.getFileName();
		imageDao.saveFile(file, fileName);
		 String output = "File saved to server location : " + filePath;
		 return Response.status(200).entity(output).build();
		
	}
	@GET
	@Path("/download")
	@Produces({"image/png", "image/jpeg", "image/gif"})
	public Response getImage() throws SQLException{
		String filePath = SERVER_UPLOAD_LOCATION_FOLDER;
		imageDao.getFile(filePath);
		 String output = "File saved to server location : " + filePath;
		 return Response.status(200).entity(output).build();
		
	}
	@GET
	@Path("/getimages")
	@Produces({ MediaType.APPLICATION_JSON })
	public List<ImageBean> getImageDetails(){
		return imageDao.getImageDetails();
	}
