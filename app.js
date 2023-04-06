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
  _id : Number,
  name:  String
});
 
const Item = mongoose.model('Item', itemsSchema);
const item1 = new Item({
  _id : 1,
  name:"Welcome to your ToDo List!"});
const item2 = new Item({
  _id : 2,
  name:"Hit the + button to add new item."});
const item3 = new Item({
  _id :3,
  name:"<-- Hit this to delete an item."});
 
const defaultItems = [item1, item2, item3];

// comment out so doesn't repeat posts 
//Item.insertMany(defaultItems).then(function () {
//    console.log("Successfully saved defult items to DB");
//  }).catch(function (err) {
//    console.log(err);
//  });
 
 
 
const workItems = [];
 
app.get("/", function(req, res) {
  res.render("list", {listTitle: "Today", newListItems: items});
 
});
 
app.post("/", function(req, res){
 
  const item = req.body.newItem;
 
  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
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
