var axios = require('axios');
const config = require('../config')

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

    res.render("index", {
       title: "My sustainable tasks",
       tasks: items
     });

   }

   async addTask(req, res) {
     const item = req.body;
     await this.taskDao.addItem(item);
     await this.checkBigList();
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

   async checkBigList(){

    const query = {
      query: "SELECT * FROM root r WHERE r.completed=@completed",
      parameters: [
        {
          name: "@completed",
          value: false
        }
      ]
    };

    const items = await this.taskDao.find(query);

     if (items.length >= 5) {
        console.log("Too many Uncompleted tasks : " + items.length)
        var dataToPost = {
          uncompleted: items.length
        }
        console.log(config.logicappurl);
        axios.post(config.logicappurl, dataToPost )
        .then((res) => {
            console.log(`Status: ${res.status}`);
        }).catch((err) => {
            console.error(err);
        });
      }
      else{
        console.log("item list is not long..." + items.length)
      }
    
   }
 }

 module.exports = TaskList;