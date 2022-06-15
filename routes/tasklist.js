var axios = require('axios');

const TaskDao = require("../models/TaskDao");
let totalTasks = 0;

 class TaskList {
   /**
    * Handles the various APIs for displaying and managing tasks
    * @param {TaskDao} taskDao
    */
   constructor(taskDao) {
     this.taskDao = taskDao;
   }
   async showTasks(req, res) {
     const querySpec = {
       query: "SELECT * FROM root r WHERE r.completed=@completed",
       parameters: [
         {
           name: "@completed",
           value: false
         }
       ]
     };
    
    const items = await this.taskDao.find(querySpec);

    totalTasks = items.length
    console.log("Items:" + totalTasks)

    res.render("index", {
       title: "My sustainable tasks",
       tasks: items
     });

   }

   async addTask(req, res) {
     const item = req.body;
     await this.taskDao.addItem(item);
     await this.checkBigList(totalTasks);
     res.redirect("/");
   }

   async completeTask(req, res) {
     const completedTasks = Object.keys(req.body);
     const tasks = [];

     completedTasks.forEach(task => {
       tasks.push(this.taskDao.updateItem(task));
     });

     await Promise.all(tasks);

     res.redirect("/");
   }

   async checkBigList(uncompletedItems){
     if (uncompletedItems > 5) {
        console.log("Too many Uncompleted tasks : " + uncompletedItems)
        var dataToPost = {
          uncompleted: uncompletedItems
        }
        let azureLAURL = "https://prod-27.centralus.logic.azure.com:443/workflows/1c0305dba69c42d5888f975b9af4dc2f/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=-Rzw-A4inbyoav9YnvBClABxT8JHFeSBIP8YKEqyjkY"
        axios.post(azureLAURL, dataToPost )
        .then((res) => {
            console.log(`Status: ${res.status}`);
        }).catch((err) => {
            console.error(err);
        });
      }
      else{
        console.log("item list is not long..." + uncompletedItems)
      }
    
   }
 }

 module.exports = TaskList;