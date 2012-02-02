function RoomSet() {
	this._size = 0;
	this._rooms = {};
}

RoomSet.prototype = {
	has: function(room) {
		return ( (room.pos.x + "/" + room.pos.y) in this._rooms);
	},
	
	// Returns true if the room was really added, false if it was already in the set.
	add: function(room) {
		if (this.has(room)) return false;		
		this._rooms[room.pos.x + "/" + room.pos.y] = room; 
		this._size++;
		return true;
	},
	
	// Returns true if the room was really removed, false if it wasn't there to begin with.
	remove: function(room) {
		if (!this.has(room)) return false;		
		delete this._rooms[room.pos.x + "/" + room.pos.y];
		this._size--;
		return true;		
	},
	
	num_rooms: function() { return this._size; },
	
	intersection: function(roomset) {
		var new_roomset = new RoomSet();
		for (var key in this._rooms) {		
			if (key in roomset._rooms) {
				new_roomset._rooms[key] = this._rooms[key];
				new_roomset._size++;
			}			
		}
		return new_roomset;
	},
	
	union: function(roomset) {
		var new_roomset = new RoomSet();
		for (var key in this._rooms) {		
			new_roomset._rooms[key] = this._rooms[key];
			new_roomset._size++;		
		}
		for (var key in roomset._rooms) {				
			if (!(key in this._rooms)) { // make sure it wasn't counted already			
				new_roomset._rooms[key] = roomset._rooms[key];
				new_roomset._size++;	
			}			
		}		
		return new_roomset;
	},
	
	// Set subtraction: Returns a new set containing the elements of this set, 
	// minus any elements shared with the argument.
	subtract: function(roomset) {
		var new_roomset = new RoomSet();
		for (var key in this._rooms) {		
			if (!(key in roomset._rooms)) {
				new_roomset._rooms[key] = this._rooms[key];
				new_roomset._size++;
			}			
		}
		return new_roomset;
	},
	
	enumerable: function() { return this._rooms; }
	
	
}