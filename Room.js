function Room(xc, yc, parent_map) {
	this.pos = {x: xc, y: yc};
	this.map = parent_map;
	
	this.jq = $("<div></div>");
	this.jq.addClass("room");
	this.element = this.jq[0];
	this._down = false;
	this._right = false;
	this.set_borders();
}

Room.prototype = {
	adj: function() {
		var adjacencies = {down: this._down, right: this._right };
		var neighbour;
		
		neighbour = this.step(-1,0);		
		if (neighbour === null) adjacencies.left = false;
		else adjacencies.left = neighbour._right;
		
		neighbour = this.step(0,-1);		
		if (neighbour === null) adjacencies.up = false;
		else adjacencies.up = neighbour._down;	

		return adjacencies;
	},
	
	// Returns the room offset from this one by the given amount, or null if that leads outside the map.
	step: function(x_ofs, y_ofs) {
		if (this.pos.x + x_ofs < 0 || this.pos.x + x_ofs >= this.map.dim.w) return null;
		if (this.pos.y + y_ofs < 0 || this.pos.y + y_ofs >= this.map.dim.h) return null;
		else return this.map.rooms[this.pos.x + x_ofs][this.pos.y + y_ofs];
	},
	
	// resets css to accomodate any changes in adjacency
	set_borders: function() {
		this.jq.toggleClass("no_way_down", !this._down);
		this.jq.toggleClass("no_way_right", !this._right);
	}
}