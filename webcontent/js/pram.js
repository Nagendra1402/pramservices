$(document).ready(function(){
	
	//date picker
    $('.input-daterange').datepicker({
    	format: "yyyy-mm-dd",
    	  autoclose: true,
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
		
		this.statusCompletion=ko.computed(function(){
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
		
		//Editing project
		self.editingProject= ko.observable();
		self.isItemEditing = function(itemToTest) {
		        return itemToTest== self.editingProject();
		 };
		
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
				
			}
      
		});
		
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
				}
			});
		}

        //list projects on selection of particular group
		self.listProjects=function(data, event){
			
			self.selectedAppId(event.target.value);
			self.selectedAppName(event.target.text);

		     $.ajax({
			 type:'GET',
			 url:'pram/service/project/'+event.target.value,
			 dataType:'json',
			 contentType:'application/json',
			 success:function(data){
				 var mappedProjects = $.map(data, function(project) { return new projectDetails(project);});
			        self.projects(mappedProjects);
			},
			error:function(data){
				
			}
      
		});
	};
		
		//create new project
		self.addProject=function(data, event){
           var params=new Object();
           params.appId=self.selectedAppId(),
           params.projectName=self.newProjectName(),
           params.projectDesciption=this.newProjectDesc();
           params.startDate=this.newStartDate();
           params.endDate=this.newEndDate();
           params.status=1;
           
           var jsonData=ko.toJSON(params);
           
		   $.ajax({
			 type:'POST',
			 url:'pram/service/project/create',
			 dataType:'json',
			 contentType:'application/json',
			 data:jsonData,
			 success:function(data){ 
				 self.projects.push(data);
			},
			error:function(data){
				
			}
		  
		});
	};
		
		//remove particular project
		self.removeProject=function(project,event){	 
			 if(self.editingProject()==null) {
				 
				 self.selectedProject(project);
				 
				 if (confirm('Are you sure to delete this project')) {
					 $.ajax({
						 type:'DELETE',
						 url:'pram/service/project/remove/' + event.target.value,
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
			 }
		};
		
		self.editProject=function(project){
			if(self.editingProject()==null){
			self.editingProject(project);
			}
		};
		
		self.saveProject = function(project){
			
	         var jsonData=ko.toJSON(project);
	         
	         $.ajax({
				 type:'PUT',
				 url:'pram/service/project/update/',
				 dataType:'json',
				 contentType:'application/json',
				 data:jsonData,
				 success:function(data){
					 
					 var projectIndex = self.projects.indexOf(project);
					 self.projects.splice(projectIndex,1,data);
					 self.editingProject(null);
					 alert("Project has been successfully updated");
				},
				error:function(data){
					
				}
	     
			 });
				
			} ;
	
			   self.cancelEdit = function (project) {   
				   
				   if(confirm("Do you want cancel editing?")){
				        //  hides the edit fields
					   self.editingProject(null);
				   }
			    };
		
	}
	
	
	ko.applyBindings(new projectViewModel());
});
