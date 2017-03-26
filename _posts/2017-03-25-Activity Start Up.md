---
layout: post
title: "Activiti Start Up"
date: 2017-03-25
---
Recently, I've been going through Activiti framework for accelerating an planed business work flow project.
Even though, I've pushed an simple example repo into Github about integration spring-boot with Activiti.
To be honest, Activiti's API is not quite appealing to me after reading through its official quick start tutorial.
Mainly because of the lack of concept of BPMN (Business Process Model and Notation), which is a buzzword in OA&ERP

Here I will post the Acitivit official quick start guide, and try to explain the crucial API by my understanding.

In this example, a simple business flow can be described as 

![Overall flow chart](https://www.activiti.org/sites/default/files/Picture1_0.png)

1. Begin the process with entering data
2. If the years of experience are above 3, a task for a manually input onboarding welcome will be issued.
3. otherwise, years less than 3, a system message will be generated automatically instead.

## BPMN2.0.xml can be described as below

``` xml

    <process id="onboarding" name="Onboarding" isExecutable="true">
        <startEvent id="startOnboarding" name="Start" activiti:initiator="initiator"></startEvent>
        <userTask id="enterOnboardingData" name="Enter Data" activiti:assignee="${initiator}" activiti:candidateGroups="managers">
            <extensionElements>
                <activiti:formProperty id="fullName" name="Full Name" type="string"></activiti:formProperty>
                <activiti:formProperty id="yearsOfExperience" name="Years of Experience" type="long" required="true"></activiti:formProperty>
            </extensionElements>
        </userTask>
        <sequenceFlow id="sid-1337EA98-7364-4198-B5D9-30F5341D6918" sourceRef="startOnboarding" targetRef="enterOnboardingData"></sequenceFlow>
        <exclusiveGateway id="decision" name="Years of Experience" default="automatedIntroPath"></exclusiveGateway>
        <sequenceFlow id="sid-42BE5661-C3D5-4DE6-96F5-73D34822727A" sourceRef="enterOnboardingData" targetRef="decision"></sequenceFlow>
        <userTask id="personalizedIntro" name="Personalized Introduction and Data Entry" activiti:assignee="${initiator}" activiti:candidateGroups="managers">
            <extensionElements>
                <activiti:formProperty id="personalWelcomeTime" name="Personal Welcome Time" type="date" datePattern="MM-dd-yyyy hh:mm"></activiti:formProperty>
            </extensionElements>
        </userTask>
        <endEvent id="endOnboarding" name="End"></endEvent>
        <sequenceFlow id="sid-37A73ACA-2E23-400B-96F3-71F77738DAFA" sourceRef="automatedIntro" targetRef="endOnboarding"></sequenceFlow>
        <serviceTask id="automatedIntro" name="Generic and Automated Data Entry" activiti:class="com.example.AutomatedDataDelegate"></serviceTask>
        <sequenceFlow id="automatedIntroPath" sourceRef="decision" targetRef="automatedIntro"></sequenceFlow>
        <sequenceFlow id="personalizedIntroPath" name="&gt;3" sourceRef="decision" targetRef="personalizedIntro">
            <conditionExpression xsi:type="tFormalExpression"></conditionExpression>
        </sequenceFlow>
        <sequenceFlow id="sid-BA6F061B-47B6-428B-8CE6-739244B14BD6" sourceRef="personalizedIntro" targetRef="endOnboarding"></sequenceFlow>
    </process>

```


## A quick snapshot to the code

<pre class="prettyprint lang-java">
public class OnboardingRequest {

    public static void main(String[] args) throws ParseException {
        ProcessEngineConfiguration cfg = new StandaloneProcessEngineConfiguration()
                .setJdbcUrl("jdbc:h2:mem:activiti;DB_CLOSE_DELAY=1000")
                .setJdbcUsername("sa")
                .setJdbcPassword("")
                .setJdbcDriver("org.h2.Driver")
                .setDatabaseSchemaUpdate(ProcessEngineConfiguration.DB_SCHEMA_UPDATE_TRUE);
//        Creates the Process Engine using a memory-based h2 embedded database.
        ProcessEngine processEngine = cfg.buildProcessEngine();
        String pName = processEngine.getName();
        String ver = ProcessEngine.VERSION;
        System.out.println("ProcessEngine |" + pName + "|Version|" + ver + "|");
//        Loads the supplied BPMN model and deploys it to Activiti Process Engine.
        RepositoryService repositoryService = processEngine.getRepositoryService();
        Deployment deployment = repositoryService.createDeployment().addClasspathResource("onboarding.bpmn20.xml").deploy();
//        Retrieves the deployed model, proving that it is in the Activiti repository.
        ProcessDefinition processDefinition = repositoryService.createProcessDefinitionQuery()
                .deploymentId(deployment.getId()).singleResult();


        System.out.println("Found process definition[" + processDefinition.getName() + "] with id [" + processDefinition.getId() + "]");


        RuntimeService runtimeService = processEngine.getRuntimeService();
        ProcessInstance processInstance = runtimeService
                .startProcessInstanceByKey("onboarding");
        System.out.println("Onboarding process started with process instance id ["
                + processInstance.getProcessInstanceId()
                + "] key [" + processInstance.getProcessDefinitionKey() + "]");

        TaskService taskService = processEngine.getTaskService();
        FormService formService = processEngine.getFormService();
        HistoryService historyService = processEngine.getHistoryService();

        Scanner scanner = new Scanner(System.in);
        while (processInstance != null && !processInstance.isEnded()) {
            List<Task> tasks = taskService.createTaskQuery()
                    .taskCandidateGroup("managers").list();
            System.out.println("Active outstanding tasks: [" + tasks.size() + "]");
            for (int i = 0; i < tasks.size(); i++) {
                Task task = tasks.get(i);
                System.out.println("Processing Task [" + task.getName() + "]");
                Map<String, Object> variables = new HashMap<String, Object>();
                FormData formData = formService.getTaskFormData(task.getId());
                for (FormProperty formProperty : formData.getFormProperties()) {
                    if (StringFormType.class.isInstance(formProperty.getType())) {
                        System.out.println(formProperty.getName() + "?");
                        String value = scanner.nextLine();
                        variables.put(formProperty.getId(), value);
                    } else if (LongFormType.class.isInstance(formProperty.getType())) {
                        System.out.println(formProperty.getName() + "? (Must be a whole number)");
                        Long value = Long.valueOf(scanner.nextLine());
                        variables.put(formProperty.getId(), value);
                    } else if (DateFormType.class.isInstance(formProperty.getType())) {
                        System.out.println(formProperty.getName() + "? (Must be a date m/d/yy)");
                        DateFormat dateFormat = new SimpleDateFormat("m/d/yy");
                        Date value = dateFormat.parse(scanner.nextLine());
                        variables.put(formProperty.getId(), value);
                    } else {
                        System.out.println("<form type not supported>");
                    }
                }
                taskService.complete(task.getId(), variables);

                HistoricActivityInstance endActivity = null;
                List<HistoricActivityInstance> activities =
                        historyService.createHistoricActivityInstanceQuery()
                                .processInstanceId(processInstance.getId()).finished()
                                .orderByHistoricActivityInstanceEndTime().asc()
                                .list();
                for (HistoricActivityInstance activity : activities) {
                    if (activity.getActivityType() == "startEvent") {
                        System.out.println("BEGIN " + processDefinition.getName()
                                + " [" + processInstance.getProcessDefinitionKey()
                                + "] " + activity.getStartTime());
                    }
                    if (activity.getActivityType() == "endEvent") {
                        // Handle edge case where end step happens so fast that the end step
                        // and previous step(s) are sorted the same. So, cache the end step
                        //and display it last to represent the logical sequence.
                        endActivity = activity;
                    } else {
                        System.out.println("-- " + activity.getActivityName()
                                + " [" + activity.getActivityId() + "] "
                                + activity.getDurationInMillis() + " ms");
                    }
                }
                if (endActivity != null) {
                    System.out.println("-- " + endActivity.getActivityName()
                            + " [" + endActivity.getActivityId() + "] "
                            + endActivity.getDurationInMillis() + " ms");
                    System.out.println("COMPLETE " + processDefinition.getName() + " ["
                            + processInstance.getProcessDefinitionKey() + "] "
                            + endActivity.getEndTime());
                }
            }
            // Re-query the process instance, making sure the latest state is available
            processInstance = runtimeService.createProcessInstanceQuery()
                    .processInstanceId(processInstance.getId()).singleResult();
        }
        scanner.close();
    }
}

</pre>

It's a pretty basic all-in-one example to show activiti's critical APIs, from setting up DB, reading procedure XML file to handling a task lifecycle
The while-loop always take the next task to process when it's NOT end, then read user's CLI input to change task's form data.
