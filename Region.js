function Region(num) {	
	this.number = num;
	this.set = new RoomSet();
	this.mass = {x: 0, y: 0}; // Summed x and y coordinates of all the rooms in this region (used in Region.center())
}

Region.prototype = {
	// Returns the region's center of mass, in (fractional) map room coordinates.
	add: function(room) {
		this.set.add(room);
		this.mass.x += room.pos.x;
		this.mass.y += room.pos.y;
	},
	center: function() {
		return {x: this.mass.x/this.set.num_rooms(), y: this.mass.y/this.set.num_rooms()} ;
	}
}