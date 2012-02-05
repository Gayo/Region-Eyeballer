region_colours = ["paleGreen", "indianRed", "gold", "lightSkyBlue", "mediumPurple", "paleGoldenrod", "greenYellow", "orangeRed", "dodgerBlue", "violet", 
	"seaGreen", "yellow", "thistle", "burlyWood", "aquamarine", "slateGrey", "forestGreen"];

function Map() {
	$$ = this;		
	
	$$.body = $("body");
	$$.mapdiv = $("#map_div");			
		
	this.init(16,16,25,25);	
	
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
		gen_blob_spread(this);
		this.colour_regions();
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
	},

	isolate_regions: function() {
		for (var i=0; i<this.width; i++) {
			for (var j=0; j<this.height; j++) {
				if (i < this.width-1) this.rooms[i][j]._right = (this.rooms[i][j].region === this.rooms[i+1][j].region);
				if (j < this.height-1) this.rooms[i][j]._down = (this.rooms[i][j].region === this.rooms[i][j+1].region);
			}
		}
	},

	colour_regions: function() {
		for (var i=0; i<this.width; i++) {
			for (var j=0; j<this.height; j++) {
				if (this.rooms[i][j].region < 0) this.rooms[i][j].color("white");				
				else this.rooms[i][j].color(region_colours[this.rooms[i][j].region % region_colours.length]);
				
				if (this.rooms[i][j].source) this.rooms[i][j].jq.html("S");
				else this.rooms[i][j].jq.html("");
			}
		}		
	}
	
}