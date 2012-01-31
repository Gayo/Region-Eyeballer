
gen_blob_spread = function(map) {
	var new_room, source;
	var steps_left;
	var perimeter, candidates;
	var num_blobs = 12;
	var blob_size = Math.floor(map.width*map.height / num_blobs);
	
	// initialize map
	for (var i=0; i<map.width; i++) {
		for (var j=0; j<map.height; j++) {
			map.rooms[i][j].region = -1;				
			map.rooms[i][j]._down = true;
			map.rooms[i][j]._right = true;		
			map.rooms[i][j].color("white");
		}
	}
	
	
	
	for (var i=0; i<map.width; i++) {
		for (var j=0; j<map.height; j++) {
			map.rooms[i][j].sides = 0;
			map.rooms[i][j].dist = 0;			
		}
	}
	
	steps_left = blob_size - 1;
	perimeter = new RoomSet();
	candidates = new RoomSet();
	
	source = map.rooms[ Math.round( (1 + Math.random())/3 * map.width  ) ]
	                        [ Math.round( (1 + Math.random())/3 * map.height ) ];
							
	source.color("lightGreen");
	new_room = source;	
	new_room.region = 0;
	perimeter.add(new_room);
	
	while (steps_left > 0) {		
		candidates.remove(new_room);
		for each (var room in new_room.neighbours()) {		
			if (room.region === new_room.region) {
				if (!on_perimeter(room)) perimeter.remove(room);
			}
			else if (room.region === -1) { // unused neighbour found				
				room.sides++;
				if (candidates.add(room)) { 					
					room.dist = room.distance_from(source);					
				}
				_bsgen_calc_weight(room, Math.sqrt(blob_size-steps_left), 1);
			}			
		}		
		
		new_room = select_by_weight(candidates);		
		if (new_room === null) { steps_left = 0; } // out of options, might as well quit
		else {			
			steps_left--;
			new_room.region = 0;
			perimeter.add(new_room);
		}
	}
	
	map.isolate_regions();
};

_bsgen_calc_weight = function(room, convexity, gravity) {
	room.weight = Math.pow(convexity+1,room.sides)/Math.pow(room.dist,gravity);		
}