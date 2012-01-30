function Map() {
	$$ = this;	
	$$.body = $("body");
	$$.mapdiv = $("#map_div");	
		
	this.init(20,20,25,25);	
	this.reload();
	$("#button_reload").on("click", function() { $$.reload(); });
}

Map.prototype = {
	init: function (w, h, room_w, room_h) {
		this.width = w;
		this.height = h;
		$$.mapdiv.empty();
		
		this.rooms = [w];
		for (var i=0; i<w; i++) { this.rooms[i] = [h]; }
		
		for (var j=0; j<h; j++) {			
			for (var i=0; i<w; i++) {
				this.rooms[i][j] = new Room(i,j, this);								
				if (i+1 === w) this.rooms[i][j].jq.addClass("right_edge");
				if (j+1 === h) this.rooms[i][j].jq.addClass("bottom_edge");
				this.rooms[i][j].jq.appendTo($$.mapdiv);							
			}
			$$.mapdiv.append("<br />");
		}
		
		this.rooms_jq = $(".room");		
		this.set_room_size(room_w, room_h);		
	},
	
	reload: function() {		
		for (var i=0; i<this.width; i++) {
			for (var j=0; j<this.height; j++) {
				this.rooms[i][j]._down = Math.random() < 0.5;				
				this.rooms[i][j]._right = Math.random() < 0.5;			
			}
		}
		this.update_css();
	},
	
	set_room_size: function (width, height) {
		this.room_dim = {w: width, h: height};
		this.rooms_jq.width(width);
		this.rooms_jq.height(height);		
	},
	
	update_css: function() {
		for (var i=0; i<this.width; i++)
			for (var j=0; j<this.height; j++)
				this.rooms[i][j].set_borders();
	}	
}