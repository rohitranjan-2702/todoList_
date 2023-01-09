const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash")

const app = express();


app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://rohit2702:mongo1234@todolist.cp1kiwm.mongodb.net/?retryWrites=true&w=majority", {useNewUrlParser: true});

const itemSchema = new mongoose.Schema({
     name: String
})

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item ({
    name: "Welcome !"
})
const item2 = new Item ({
    name: "Click the + button to add a new tasks"
})
const item3 = new Item ({
    name: "Click on the task to delete it"
})

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function(req,res){

    
    Item.find({}, function(err, results){
        // console.log(results);

        if(results.length === 0){
            Item.insertMany(defaultItems, function(err){
                if(err){
                    console.log(err);
                } else {
                    console.log("default items saved  to DB");
                }
            })
            res.redirect("/");
        } else {
            res.render("list", {listTitle: "Today", newListItems: results });
        }
        // sending the variable to be rendered  in ejs file
   

    })

var today = new Date();
var day ="";

// sexy method to add date to the  site
var options = {
    weekday: "long",
    day: "numeric",
    month: "long",
};
    var day = today.toLocaleDateString('en-US', options);
});

app.get("/:customListName", function(req, res){
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName}, function(err, foundList){
        if(!err){
         if(!foundList){
        //  Create a new list
        const list = new List({
            name: customListName,
            items: defaultItems
        });
    
         list.save();
         res.redirect("/" + customListName);
        } else {
        // Show an existing list
        res.render("list", {listTitle: foundList.name, newListItems: foundList.items})
        
        }}
    });

});

app.post("/", function(req, res){

    const itemName = req.body.newTask;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    if(listName === "Today"){
        item.save();
        res.redirect("/");
    } else {
        List.findOne({name: listName}, function(err, foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }


    // without using DB
    // var newTask = req.body.newTask;
    // // adding task items to the array 
    // items.push(newTask);

    // console.log(newTask);

    // is function me newtask ka value set hua and then redirect hua home route parr -> app.get me wo value render hogya 
   

    // first time render ke wqt newListItem defined nhinhai jo error derha
    // res.render("list", {newListItem: newTask})
     
})

app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
  
    if (listName === "Today") {
      Item.findByIdAndRemove(checkedItemId, function(err){
        if (!err) {
          console.log("Successfully deleted checked item.");
          res.redirect("/");
        }
      });
    } else {
      List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
        if (!err){
          res.redirect("/" + listName);
        }
      });
    }
  
  
  });


app.listen(3000, function(){
    console.log("Server hs started on port 3000");
})


// if(today.getDay() === 6 || today.getDay() === 0){
// //     res.send("<h1>Less go it's a weekend!</h1>")
// // }
// day = "Weekend";
// }
// else{
//     // res.sendFile(__dirname + "/index.html")
//     // res.send("Offo, i have to work.")
//     day = "Weekday";
// }

// db.products.insert(
//     {
//         _id: 3,
//         name: "Rubber",
//         price: 2.50,
//         stock: 20,
//         reviews: [
//             {
//                 authorName: "Rohit",
//                 rating: 5,
//                 reviews: "op op!"
//             },
//             {
//                 authorName: "Raju",
//                 rating: 5,
//                 reviews: "cool!"
//             },

//         ]
//     }
// )