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
	@Path("/download/{imageId}")
	@Produces({"image/png", "image/jpeg", "image/gif" ,"application/pdf"})
	public Response getImage(@PathParam("imageId") int imageId) throws SQLException, IOException{
		 File file=imageDao.getFile(imageId);
		  String fileName=file.getName();
          ResponseBuilder response = Response.ok((Object) file);
		  response.header("Content-Disposition","attachment; filename=\"" + fileName+ "\"");
			return response.build();
		
	}
	@GET
	@Path("/getimages")
	@Produces({ MediaType.APPLICATION_JSON })
	public List<ImageBean> getImageDetails(){
		return imageDao.getImageDetails();
	}
