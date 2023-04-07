const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const { Schema } = mongoose;
 
 
const app = express();
 
app.set('view engine', 'ejs');
 
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
 
mongoose.connect('mongodb://127.0.0.1:27017/todolistDB', {useNewUrlParser : true});
 
const itemsSchema = new Schema({
  //_id : Number,
  name:  String
});
 
const Item = mongoose.model('Item', itemsSchema);
const item1 = new Item({
  name:"Welcome to your ToDo List!"});
const item2 = new Item({
  name:"Hit the + button to add new item."});
const item3 = new Item({
  name:"<-- Hit this to delete an item."});
 
const defaultItems = [item1, item2, item3];

// comment out so doesn't repeat posts 
//Item.insertMany(defaultItems).then(function () {
//    console.log("Successfully saved defult items to DB");
//  }).catch(function (err) {
//    console.log(err);
//  });
 
 
 
//const workItems = [];
 
app.get("/", function(req, res) {
    Item.find({})
    .then(foundItem => {
      if (foundItem.length === 0) {
        return Item.insertMany(defaultItems);
      } else { 
        return foundItem;
      }
    })
    .then(savedItem => {
      res.render("list", {
        listTitle: "Today",
        newListItems: savedItem
      });
    })
    .catch(err => console.log(err));   
}); 
 
app.post("/", function(req, res){
 
  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName
  });
  
  item.save(); 
  res.redirect("/");
});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox.trim(); 
  Item.findByIdAndDelete(checkedItemId)
  .then(() => {
        console.log("Succesfully deleted checked item from the database");
        res.redirect("/");
    })
    .catch((err) => {
        console.log(err);
    })
});
 
app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});
 
app.get("/about", function(req, res){
  res.render("about");
});
 
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
