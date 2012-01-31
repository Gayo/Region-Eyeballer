dir = [{x:-1,y:0,name:"left"}, {x:0,y:-1,name:"up"}, {x:1,y:0,name:"right"}, {x:0,y:1,name:"down"}];

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
		if (this.pos.x + x_ofs < 0 || this.pos.x + x_ofs >= this.map.width) return null;
		if (this.pos.y + y_ofs < 0 || this.pos.y + y_ofs >= this.map.height) return null;
		else return this.map.rooms[this.pos.x + x_ofs][this.pos.y + y_ofs];
	},
	
	// resets css to accomodate any changes in adjacency
	set_borders: function() {
		this.jq.toggleClass("no_way_down", !this._down);
		this.jq.toggleClass("no_way_right", !this._right);
	},
	
	// Returns the absolute distance between this and the given room, ignoring boundaries/adjacency
	distance_from: function(destination) {
		return Math.abs(this.pos.x - destination.pos.x) + Math.abs(this.pos.y - destination.pos.y);
	},
	
	// Generates and returns a throwaway list of the room's neighbours.
	// Maybe edit this to cache results if it turns out to matter?
	neighbours: function() {
		var cur;
		var set = {};
		for (var i=0; i<dir.length; i++) {
			cur = this.step(dir[i].x, dir[i].y);
			if (cur !== null) set[dir[i].name] = cur;
		}
		return set;
	},
	
	color: function(col) {
		this.jq.css({"background-color": col});
	}
}