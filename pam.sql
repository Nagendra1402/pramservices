create table GROUPS(
group_id int primary KEY IDENTITY(1,1),
group_name varchar(50),
);

create table PROJECT_DETAILS(
project_id int IDENTITY(1,1),
project_name varchar(50),
group_id int FOREIGN KEY REFERENCES GROUPS(group_id),
project_desc varchar(255),
start_date date,
end_date  date,
status int,
PRIMARY KEY(project_id),
); 

create table resources
(
corp_id varchar(8) Primary key,
group_id int FOREIGN KEY REFERENCES GROUPS(group_id),
resource_name varchar(50),
contact_no int,
designaton varchar(50),
skill_set varchar(200),
level int,
reporting_manager varchar(8),	
)

create table images
(
imageid int IDENTITY(1,1),
imagename varbinary(100),
)

drop table images;
create table taskallocation
(
corp_id varchar(8) FOREIGN KEY REFERENCES resources(corp_id),
task_id int FOREIGN KEY REFERENCES TASK_DETAILS(task_id),
start_date date,
end_date date,
status_complete int,
allocation int,
)

ALTER TABLE taskallocation ADD assign_id int primary KEY IDENTITY(1,1)
insert into taskallocation values('a521927',7,'10-07-2014','10-08-2014',10,34);

select * from taskallocation
select * from resources
insert into resources values('a505625',2,'aditya','Senior Software Engineer','JAVA, Jquery','a424754',2);

update resources set LEVEL=1 where corp_id='a404686'

WITH resource_hierarchy (corp_id,resource_name,contact_no,designation,skill_set,reporting_manager,level) AS
(
select corp_id,resource_name,contact_no,designaton,skill_set,reporting_manager,0 from resources where reporting_manager IS NULL and group_id=3
UNION ALL 
select r.corp_id,r.resource_name,r.contact_no,r.designaton,r.skill_set,r.reporting_manager,r.level+ 1 from resources r INNER JOIN resource_hierarchy ON r.reporting_manager= resource_hierarchy.corp_id
)
select * from resource_hierarchy
ORDER BY level



INSERT INTO GROUPS VALUES ('FIT-CM-Prime Services');
INSERT INTO GROUPS VALUES ('FIT-CM-ECA WIRELESS');
INSERT INTO GROUPS VALUES ('FIT-CM-ECA WEBSERVICES');

INSERT INTO PROJECT_DETAILS (project_name,group_id,project_desc,start_date,end_date,status) VALUES ('PBO',1,'Prime Broker Optimize platform allows the clients to interact with the broker','2013-12-21','2014-08-24',80);
INSERT INTO PROJECT_DETAILS (project_name,group_id,project_desc,start_date,end_date,status) VALUES ('PBO1',1,'Prime Broker Optimize platform allows the clients to interact with the broker','2013-12-24','2014-09-24',60);
INSERT INTO PROJECT_DETAILS (project_name,group_id,project_desc,start_date,end_date,status) VALUES ('PBO2',1,'Prime Broker Optimize platform allows the clients to interact with the broker','2014-05-24','2014-09-24',10);
INSERT INTO PROJECT_DETAILS (project_name,group_id,project_desc,start_date,end_date,status) VALUES ('API - RCDMoneyMovement',3,'API is used by Black Hawk client to find the check deposit amount','2014-03-25','2014-07-14',10);
INSERT INTO PROJECT_DETAILS (project_name,group_id,project_desc,start_date,end_date,status) VALUES ('API - RetirementAcctContibutions',3,'API is used by PNC team for finding the retirement contribution based on age','2014-04-10','2014-07-14',30);
INSERT INTO PROJECT_DETAILS (project_name,group_id,project_desc,start_date,end_date,status) VALUES ('API - MoneyMovementACH',3,'PI is used by Black Hawk client','2014-04-10','2014-07-14',30);
INSERT INTO PROJECT_DETAILS (project_name,group_id,project_desc,start_date,end_date,status) VALUES ('CAT-P Build Out',2,'PI is used by Black Hawk client','2013-09-10','2014-09-11',40);
INSERT INTO PROJECT_DETAILS (project_name,group_id,project_desc,start_date,end_date,status) VALUES ('Splunk',2,'Splunk tool used for checking logs','2013-09-10','2014-09-11',20);

drop table PROJECT_DETAILS
drop table GROUPS

select * from task_details;
insert into GROUPS values(3,'prime');

insert into PROJECT_DETAILS values ('Splunk',2,'Splunk tool used for checking logs','2013-09-10','2014-09-11',20)

Alter table PROJECT_DETAILS ALTER COLUMN project_name varchar(50)

ALTER table GROUPS ALTER COLUMN group_id varchar(1)
update groups set group_name='FIT-CM-ECA WEBSERVICES' where group_id=3
ALTER table resources ALTER COLUMN contact_no varchar(15)
DELETE from PROJECT_DETAILS where project_id=26
select * from groups

select * from PROJECT_DETAILS;

select * from TASK_DETAILS;
select r.corp_id,r.resource_name,r.contact_no,r.designaton,r.reporting_manager,r.skill_set from resources r,groups g where r.group_id=g.group_id and r.group_id=8
delete from resources where corp_id='a484282'

select * from resources
drop table resources
sp_help PROJECT_DETAILS
drop table ASSIGNTASK

select p.project_id,p.project_name,p.project_desc,p.start_date,p.end_date,p.status from PROJECT_DETAILS p,groups g where p.group_id=g.group_id and p.group_id=1
