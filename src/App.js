import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import _ from 'lodash';
class App extends React.Component {
  constructor() {
    super();

  }

  render() {
    return(
    <div>
        <Board></Board>
    </div>


    )
  }

}

class Board extends React.Component {



  constructor() {
    super();
    this.state = {
      board: [],
      floors: [],
      b: {height: 100, width: 100},
      player: {
        health: 10,
        attack : 5,
        items : [],
        coords: []
      },
      textbox: []

    }

    this.state.board = this._generateEmptyBoard();
    this._attemptMove = this._attemptMove.bind(this);
    this._move = this._move.bind(this);
    this._getCellContents = this._getCellContents.bind(this);
    this._setCellContents = this._setCellContents.bind(this);
    this._attack = this._attack.bind(this);
   // this._generateMap = this._generateMap.bind(this);
    this._pickUpItem = this._pickUpItem.bind(this);
    this._setItemProperties = this._setItemProperties.bind(this);
  //this._handleKeyPress = this._handleKeyPress.bind(this);

  }

  componentDidMount() {

    this._generateMap();
  }


  _generateMap() {

    function cell(type, isOccupied, cellContents){
      this.type = type,
      this.isOccupied = isOccupied,
      this.cellContents = cellContents

    }

    //generate random room height and width


    var rooms = [];

    var generateRoom = () => {
      var height = _.random(10, 30);
      var width = _.random(10, 30);

      return {height: height, width: width}
    }

    var placeRoom = (board, newRoom, pos) => {

      var posX = pos[0];
      var posY = pos[1];


      var height = newRoom.height;
      var width = newRoom.width;

      for(var i = posX; i < width + posX; i ++ ){
        for(var j = posY; j < height + posY; j++){
          board[i][j] = new cell('floor', false, []);
        }

      }

      return board;

    }

    var findValidStartingPosition = (dimensions) => {
      var height = dimensions.height;
      var width = dimensions.width;

     var  generateStartingPos = () => {
        var posX = _.random(0, 100);
        var posY = _.random(0, 100);
        return [posX, posY];
      }



      var testStartingPos = (startingPos, height, width) => {

        var posX = startingPos[0];
        var posY = startingPos[1];
        var valid = true;

        if (posX + width > 100){
          valid = false
        }
        if (posY + height > 100){
          valid = false
        }

        if(valid){
          return startingPos;
        }
        else {
          return findValidStartingPosition(dimensions);
        }



      }
      var startingPos = generateStartingPos();

      //startingPos = testStartingPos(startingPos, height, width)

      var startingPos = testStartingPos(startingPos, height, width)
      return startingPos;

    }

    var generateHall = (boardIn, room1, room2) => {
      var grid = boardIn

      for (var i = 0; i < 100; i++){
        for (var j = 0; j < 100; j++){
          grid[i][j] = "Empty";
        }
      }
      var startPos = room1.startingPosition;
      var endPos = room2.startingPosition;

      grid[startPos[0]][startPos[1]] = "Start";
      grid[endPos[0]][endPos[1]] = "End";

      var findShortestPath = function(startCoordinates, grid){
        var distanceFromTop = startCoordinates[0];
        var distanceFromLeft = startCoordinates[1];

        var location = {
          distanceFromTop: distanceFromTop,
          distanceFromLeft: distanceFromLeft,
          path: [],
          status: 'Start'

        }

        var queue = [location];

        while(queue.length > 0){
          var currentLocation = queue.shift();

          var newLocation = exploreInDirection(currentLocation, 'North', grid)
          if(newLocation.status === 'End'){
            return newLocation.path;

          }else if (newLocation.status === 'Valid'){
            queue.push(newLocation);
          }
          var newLocation = exploreInDirection(currentLocation, 'South', grid)
          if(newLocation.status === 'End'){
            return newLocation.path;

          }else if (newLocation.status === 'Valid'){
            queue.push(newLocation);
          }
          var newLocation = exploreInDirection(currentLocation, 'East', grid)
          if(newLocation.status === 'End'){
            return newLocation.path;

          }else if (newLocation.status === 'Valid'){
            queue.push(newLocation);
          }
          var newLocation = exploreInDirection(currentLocation, 'West', grid)
          if(newLocation.status === 'End'){
            return newLocation.path;

          }else if (newLocation.status === 'Valid'){
            queue.push(newLocation);
          }



        }

        return false;


      //findshortest
      }

      var locationStatus = (location, grid) => {
        var gridSize = grid.length;
        var dft = location.distanceFromTop;
        var dfl = location.distanceFromLeft;

        if(location.distanceFromLeft < 0 || location.distanceFromLeft >= gridSize || location.distanceFromTop < 0 || location.distanceFromTop >= gridSize){

          return 'Invalid';
        }else if (grid[dft][dfl] === "End"){
          return "End";
        } else if (grid[dft][dfl] !== "Empty"){
          return "Blocked";
        }
        else {
          return 'Valid';
        }

      }

      var exploreInDirection = function(currentLocation, direction, grid){
        var newPath = currentLocation.path.slice();




        var dft = currentLocation.distanceFromTop;
        var dfl = currentLocation.distanceFromLeft;
        newPath.push([dft,dfl]);
        if (direction === "North"){
          dft -= 1;
        }
        else if (direction === "East"){
          dfl += 1;
        }
        else if (direction === "South"){
          dft += 1;
        }else if (direction === "West"){
          dfl -= 1;
        }

        var newLocation = {
          distanceFromTop: dft,
          distanceFromLeft: dfl,
          path: newPath,
          status: 'Unknown'
        }

        newLocation.status = locationStatus(newLocation, grid);

        if(newLocation.status === "Valid"){
          grid[newLocation.distanceFromTop][newLocation.distanceFromLeft] = 'Visited';
        }

        return newLocation;
      }

      return findShortestPath(room1.startingPosition, grid);


    }

    //TODO: this needs to be moved so it occurs after the board is set in state.
    //generates random amount of rooms.
    for(var i = 0; i < _.random(6,10); i ++){
      var roomDimensions = generateRoom();
      var startingPosition = findValidStartingPosition(roomDimensions);
      rooms.push({startingPosition: startingPosition, height: roomDimensions.height, width: roomDimensions.width})
      placeRoom(this.state.board, roomDimensions, startingPosition)

    }


    // these lines build two simple test rooms for debugging.
    // var room1 = {startingPosition: [0,0], height: 10, width: 10};
    // var room2 = {startingPosition: [20,10], height: 10, width: 10};
    // rooms.push(room1);
    // rooms.push(room2);
    // placeRoom(board, room1, room1.startingPosition);
    // placeRoom(board, room2, room2.startingPosition);

    var boardCopy = this.state.board.slice().map( function(row){ return row.slice(); });
    //generates an array with a path from starting pos to starting pos pathing algorithm credit: http://gregtrowbridge.com/a-basic-pathfinding-algorithm/

    //var hall = generateHall(boardCopy, room1, room2)
    //console.log(hall);

    //generates halls.
    var generateHalls = (rooms) => {
      for(var i = 0; i < rooms.length - 1; i++){
         var hall = generateHall(boardCopy, rooms[i], rooms[i+1])

        placeHall(hall);
      }

    }

    //draws a hall on the board.
    var placeHall = (hall) => {
      var board = this.state.board
      for(var i = 0; i < hall.length; i++){
        var x = hall[i][0]
        var y = hall[i][1]
        board[x][y] = new cell('floor', false, [])

      }
      this.setState({board: board});

    }

    //places something randomly on a floor.
    var placeRandomly = (floors, thing, type) => {
    //provides deep copy of our board.
    var newboard = this.state.board.slice().map( function(row){ return row.slice(); });


    //an array is passed to place randomly for items and enemies.
    if(Array.isArray(thing)){

      for(var i = 0; i < thing.length; i++){
        //pick a cell
        var randomFloorCell = floors[_.random(0, floors.length)]



        //cell.cellContents.push(thing);
        var cell = newboard[randomFloorCell[0]][randomFloorCell[1]]
        //push the enemy into the cell contents array
        //console.log(thing[i]);
        //make this object agnostic so it can randomly place items as well.
        if(type == "enemy"){
          cell.cellContents.push({enemy: thing[i]});
          cell.isOccupied = true;
        }
        if(type == "item"){
         cell.cellContents.push({item: thing[i]});
        }

      }


      }
      else {
        var randomFloorCell = floors[_.random(0, floors.length)]

        var cell = newboard[randomFloorCell[0]][randomFloorCell[1]]

        cell.cellContents.push(thing);

        console.log(thing);
        if(thing.hasOwnProperty('player')){
        //this stores the players coords in the state so we don't have to go looking for it elsewhere.
        var player = this.state.player;
        player.coords = [randomFloorCell[0], randomFloorCell[1]]
        this.setState({player: player});

        }


}

//picks a random floor tile
//
//

}

//returns an array of floors
var findFloors = () => {
var floors = [];
var board = this.state.board;
for (var i = 0; i < board.length; i++){
  for (var j = 0; j < board.length; j++){
    if (board[i][j].type == "floor"){
      floors.push([i, j]);
    }

  }
}

 return floors;
}


var generateItems = () =>{
   var items = [];

   function item(health, attack){
       this.health = health,
       this.attack = attack
   }
   //generate 1-4 potions
   for(var i = 0; i < _.random(1, 5); i++){
     items.push(new item(10, 0));

   }
   //generate 1-5 weapon upgrades
   for(var i = 0; i < _.random(1, 4); i++){
    items.push(new item(0, 5));

   }

  return items;
}


var generateEnemies = () =>{
   var enemies = [];

   function enemy(health, attack, items, coords){
       this.health = health,
       this.attack = attack,
       this.items = items,
       this.coords = coords
   }

   //could randomly generate an enemy based on player stats.
   //generate 5-15 enemies
   for(var i = 0; i < _.random(5, 15); i++){
     enemies.push(new enemy(10, 3, [], []))

   }

  return enemies;
}


generateHalls(rooms);

var floors = findFloors();
//places a player object randomly
placeRandomly(floors, {player: this.state.player})

var enemies = generateEnemies();

placeRandomly(floors, enemies, 'enemy');

var items = generateItems();

placeRandomly(floors, items, 'item');


var text = 'You awake in a dark dungeon. The walls are damp and wet. You can hear the sound of talons scratching against bare rock.'

 this._printText(text, 100);
}



_generateEmptyBoard() {

//board paramerters
function cell(type, isOccupied, cellContents){
this.type = type,
this.isOccupied = isOccupied,
this.cellContents = cellContents

}

var board = [];
for (var i = 0; i < this.state.b.height; i++){
board.push([]);
for (var j = 0; j < this.state.b.width; j++){
 board[i].push(new cell("wall", true, []))

};

};

return board;
}



_handleKeyPress(e){
  //clear text box on move

  e.preventDefault();
 if(this.state.textbox.length > 0){
  this.setState({textbox: []});
 }
var playerCoords = this.state.player.coords
var playerCoordsAttempt = playerCoords.slice();
switch (e.key) {
case 'ArrowUp':
  playerCoordsAttempt[0] -= 1;
  break;
case 'ArrowDown':
  playerCoordsAttempt[0] += 1;
  break;
case 'ArrowLeft':
  playerCoordsAttempt[1] -= 1;
  break;
case 'ArrowRight':
  playerCoordsAttempt[1] += 1;
  break;

}

this._attemptMove(playerCoords, playerCoordsAttempt);

}



_attack(cell){
//attacks will always be trades so you just need cell to cell info.
var enemy = this._getCellContents(cell, 'enemy')
var player = this.state.player;

enemy.health -= player.attack
player.health -= enemy.attack;

if(enemy.health <= 0){
this._setCellContents(cell, 'enemy', "delete")
cell.isOccupied= false;
}
if(player.health <= 0){
 this._printText("You fall to the floor, lifeless.");
 this._setCellContents(this.state.board[this.state.player.coords[0]][this.state.player.coords[1]], 'player', 'delete');

}

this.setState({player: player});


}
 //change 'who' so that it's object agnostic.
_attemptMove(who, where){
var board = this.state.board;
var cell = board[where[0]][where[1]];
if(cell.isOccupied == false){
this._move(who, where)
for(var i=0; i < cell.cellContents.length;i++) {
 if(cell.cellContents[i].hasOwnProperty('item')){
  this._pickUpItem(cell)

 }


}
}
else {
var cell = board[where[0]][where[1]];
var enemy = this._getCellContents(cell, 'enemy');
var player = this._getCellContents(cell, 'player');
if(enemy || player){

  this._attack(cell);

}

}




}
//TODO: disable arrow navigation or move from arrow keys to 'WASD'
_move(who, where){
var board = this.state.board;
var from = board[who[0]][who[1]];
from.isOccupied = false;
var to = board[where[0]][where[1]];
for(var i = 0; i < from.cellContents.length; i++){
//change hasOwnProperty so it's object agnostic.
if(from.cellContents[i].hasOwnProperty('player')){
  var whatToMove = from.cellContents.splice(i, 1)

}

}

to.cellContents.push(whatToMove[0]);
to.isOccupied = true;
var player = this.state.player

player.coords = [where[0], where[1]]

this.setState({board: board, player: player })
}

_pickUpItem(cell){

  var item =this._getCellContents(cell, "item");
  var player = this.state.player
  player.items.push(item);

  this.setState({player: player});
  this._setItemProperties(item);
 //this deletes the item after picking it up.
  this._setCellContents(cell, "item", "delete");
}

_setItemProperties(item){
  if(item.health > 0){
   this._printText("You picked up a health potion!");
  }
  else {
   this._printText("You picked up a better weapon!");

  }

  var player = this.state.player;

  player.health += item.health;
  player.attack += item.attack;

  this.setState({player: player});




}
_getCellContents(cell, propertyToGet){
for(var i = 0; i < cell.cellContents.length; i++){
if(cell.cellContents[i].hasOwnProperty(propertyToGet)){
  return cell.cellContents[i][propertyToGet]
}
}
}

_setCellContents(cell, propertyToSet, properties){
for(var i = 0; i < cell.cellContents.length; i++){
if(cell.cellContents[i].hasOwnProperty(propertyToSet)){
  if(properties == "delete"){
     cell.cellContents.splice(i, 1);
     }
  else {
    cell.cellContents[i] = properties;
  }

}
}
}

_printText(text){

var newText = [];

this.setState({textbox: []});

var textArray = text.split('');

for(var i = 0; i < textArray.length; i++){
     newText.push(textArray[i]);
  this.setState({textbox: newText});
}
}

render() {

return (<div><div className='statusBar'>Health: {this.state.player.health} Attack: {this.state.player.attack} </div>

  {this.state.textbox.length > 0 ? (<div className='textOverlay'>{this.state.textbox.map(c => {

      return (c)

    })}</div>): ('')}

  <div className="boardContainer" tabIndex="-1" onKeyDown={(e) => this._handleKeyPress(e)}>
  {this.state.board.map((c, index) => {
    return(<div key={index.toString()} className="boardRow">{
        c.map((d, index2) => {

      if (d.cellContents.length > 0){
        //loop through and render cell contents.
        for (var i = 0; i < d.cellContents.length; i++){
           if(d.cellContents[i].hasOwnProperty('enemy')){
          return (<span key={[index,index2].toString()} className={'cell enemy'} ></span>)
        }
          if(d.cellContents[i].hasOwnProperty('player')){
          return (<span key={[index,index2].toString()}  className={'cell player'} ></span>)
        }
            if(d.cellContents[i].hasOwnProperty('item')){
          return (<span key={[index,index2].toString()}  className={'cell item'} ></span>)
        }
          else {
            return (<span key={[index,index2].toString()} className={'cell'+ ' '+ d.type} ></span>)
          }


        }

      }else {
        //if nothing is in the cell, just render walls and floors
        //this is also where I'll handle conditional rendering of different                 cell types.
        return (<span key={[index,index2].toString()} className={'cell'+ ' '+ d.type} ></span>)
      }


      })


        }</div>)



  })}



</div></div>)


}

}


export default App;
