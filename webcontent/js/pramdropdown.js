$(document).ready(function(){
	
	//date picker
    $('.input-daterange').datepicker({
    	  format: "yyyy-mm-dd",
    	  autoclose: true,
    	  todayHighlight: true,
    	  todayBtn: true,
    	  calendarWeeks: true,
    	  daysOfWeekDisabled: "5,6",
    });
    
    //Group Details
	function applicationDetail(group){
		this.appName=ko.observable(group.appName);
		this.appId = ko.observable(group.appId);	
	}
	
	//project details name
	function projectDetails(project){
		this.projectId=ko.observable(project.projectId);
		this.appId=ko.observable(project.appId);
		this.projectName=ko.observable(project.projectName);
		this.projectDesciption=ko.observable(project.projectDesciption);
		this.startDate=ko.observable(project.startDate);
		this.endDate=ko.observable(project.endDate);
		this.status=ko.observable(project.status);
		
		this.computedStatus=ko.computed(function(){
		 return this.status()+"%";	
		},this);
	}
	
	//view model
	function projectViewModel(){
		var self=this;
		self.applicationGroups=ko.observableArray([]);
		self.projects=ko.observableArray([]);
		self.selectedAppId=ko.observable(); //appId
		self.selectedAppName=ko.observable(""); //appName
		
		//New project observables
		
		self.newProjectName=ko.observable();
		self.newProjectDesc=ko.observable();
		self.newStartDate=ko.observable();
		self.newEndDate=ko.observable();
		
		self.selectedProject=ko.observable();
		
		self.selectedGroup=ko.observable();
		//Editing project
		self.editingProject= ko.observable();
		self.isItemEditing = function(itemToTest) {
		        return itemToTest== self.editingProject();
		 };
		
		//Loader image
		$('.holder').append('<div id="loading"><div class="loaderbg"></div><div class="loader"></div></div>');
        	
		$.ajax({
			type:'GET',
			url:'pram/service/application',
			dataType:'json',
			contentType:'application/json',
			success:function(data){
		        var mappedApplications = $.map(data, function(group) { return new applicationDetail(group);});
		        self.applicationGroups(mappedApplications);
		        var selectedAppId=mappedApplications[0].appId;
		        var selectedAppName=mappedApplications[0].appName;
		        selectedApp(selectedAppId(),selectedAppName());
		        
			},
			error:function(data){
				 $('#loading').remove();
			}
      
		});
		
		self.list = function() {
			var appId=[];
			if(self.selectedGroup()!=null){
			ko.utils.arrayForEach(self.selectedGroup(),function(group){
	        	appId.push(group.appId());
	         });
			}
			alert(appId);
			$.ajax({
				type:'GET',
				url:'pram/service/project/' +appId,
				dataType:'json',
				asyn:'false',
				contentType:'application/json',
				success:function(data){
	              var mappedProjects = $.map(data, function(project) { return new projectDetails(project);});
			        self.projects(mappedProjects);
			        $('#loading').remove();  
				},
			   error:function(data){
				   $('#loading').remove(); 
			}
			});
		};
		
		//display project details on load of page
		function selectedApp(appId,appName){
			
			self.selectedAppId(appId);
			self.selectedAppName(appName);
        	
			$.ajax({
				type:'GET',
				url:'pram/service/project/' +appId,
				dataType:'json',
				asyn:'false',
				contentType:'application/json',
				success:function(data){
	              var mappedProjects = $.map(data, function(project) { return new projectDetails(project);});
			        self.projects(mappedProjects);
			        $('#loading').remove();  
				},
			   error:function(data){
				   $('#loading').remove(); 
			}
			});
		}

        //list projects on selection of particular group
		self.listProjects=function(project, event){
			
			self.selectedAppId(project.appId());
			self.selectedAppName(project.appName());
			
			$('.holder').append('<div id="loading"><div class="loaderbg"></div><div class="loader"></div></div>');
	        $('.loaderbg').css('height',$('.panel').height());

		     $.ajax({
			 type:'GET',
			 url:'pram/service/project/'+project.appId(),
			 dataType:'json',
			 contentType:'application/json',
			 success:function(data){
				 var mappedProjects = $.map(data, function(project) { return new projectDetails(project);});
			        self.projects(mappedProjects);
			        
			      $("#loading").remove();
			},
			error:function(data){
				$("#loading").remove();
			}
      
		});
	};
		
		//create new project
		self.addProject=function(data, event){
		   event.preventDefault();
			
           var params=new Object();
           if(self.selectedAppId()!=null){
        	   params.appId=self.selectedAppId();
           }
           
           params.projectName=self.newProjectName(),
           params.projectDesciption=self.newProjectDesc();
           params.startDate=self.newStartDate();
           params.endDate=self.newEndDate();
           params.status=1;
           var jsonData=ko.toJSON(params);
           
			$('.holder').append('<div id="loading"><div class="loaderbg"></div><div class="loader"></div></div>');
	        $('.loaderbg').css('height',$('.panel').height());
           
		   $.ajax({
			 type:'POST',
			 url:'pram/service/project/create',
			 dataType:'json',
			 contentType:'application/json',
			 data:jsonData,
			 success:function(data){ 
				 self.projects.push(new projectDetails(data));
				 self.newProjectName("");
				 self.newProjectDesc("");
				 self.newStartDate("");
				 self.newEndDate("");
				 $("#loading").remove();
				 
				 alert("project details has been added successfully");
				 
			},
			error:function(data){
				$("#loading").remove();
			}
		  
		});
	};
		
		//remove particular project
		self.removeProject=function(project){	 
			 if(self.editingProject()==null) {
				 
				 self.selectedProject(project);
				 
				 if (confirm('Are you sure to delete this project')) {
					 $.ajax({
						 type:'DELETE',
						 url:'pram/service/project/remove/' + project.projectId(),
						 dataType:'json',
						 contentType:'application/json',
						 success:function(data){
							 self.projects.remove(project);
						},
						error:function(data){
							
						}
			     
					 });
						
					} else {
						 self.selectedProject(null);
					}  
			 };
		};
		
		self.editProject=function(project){
			if(self.editingProject()==null){
			self.editingProject(project);
			}
		};
		
		self.saveProject = function(project){
	         
	         var jsonData= ko.toJSON(project,function(key,value){
	        	 if (key=="computedStatus")
	        		 return undefined;
	        	 return value;
	         });
	         
	         $.ajax({
				 type:'PUT',
				 url:'pram/service/project/update/',
				 dataType:'json',
				 contentType:'application/json',
				 data:jsonData,
				 success:function(data){
					 var projectIndex = self.projects.indexOf(project);
					 self.projects.splice(projectIndex,1,new projectDetails(data));
					 self.editingProject(null);
					 alert("Project has been successfully updated");
				},
				error:function(data){
					
				}
	     
			 });
				
			} ;
	
			   self.cancelEdit = function (project) {   
				   
				   alert(ko.toJSON(project));
				   if(confirm("Do you want cancel editing?")){
					   
					   self.editingProject(null);
				   }
			    };
			    
				self.checkStatus=function(project,event){
					
					var inputVal= event.target.value;
					if(event.target.value>100){
						alert("Enter value less than 100");
						project.status('100');	
					}
					 if(inputVal.match(/[a-zA-Z$.@]$/))
					    {
					       alert("Please Enter Valid Number");
					    }
				};
		
	}
	
	
	ko.applyBindings(new projectViewModel());
});
