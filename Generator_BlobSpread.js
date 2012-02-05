
gen_blob_spread = function(map) {
	var new_room, source;
	var steps_left, cur_region, rand;
	var perimeter, candidates, total_outer_perimeter;	
	var blob_size = Math.floor(map.width*map.height / 12);
	
	// initialize map
	for (var i=0; i<map.width; i++) {
		for (var j=0; j<map.height; j++) {
			map.rooms[i][j].region = -1;				
			map.rooms[i][j]._down = true;
			map.rooms[i][j]._right = true;
			map.rooms[i][j].source = false;
			map.rooms[i][j].h_dist = Math.abs(i*2/(map.width-1) - 1);
			map.rooms[i][j].v_dist = Math.abs(j*2/(map.height-1) - 1);
		}
	}
	
	// initialize generator stuff
	var done = false;
	var regions = [];
	cur_region = 0;
	total_outer_perimeter = new RoomSet();
	
	while (!done) {
		
		for (var i=0; i<map.width; i++) {
			for (var j=0; j<map.height; j++) {
				map.rooms[i][j].sides = 0;		
			}
		}
		
		regions.push(new Region(cur_region))
		
		steps_left = blob_size;
		perimeter = new RoomSet();
		candidates = new RoomSet();
		
		if (cur_region === 0) {
			source = map.rooms[ Math.round( (1 + Math.random())/3 * map.width  ) ]
			                  [ Math.round( (1 + Math.random())/3 * map.height ) ]; 
		}
		else { // select a random perimeter room
			rand = Math.floor(Math.random()*(total_outer_perimeter.num_rooms()-1));
			for each (var room in total_outer_perimeter.enumerable()) {
				rand--;
				if (rand < 0) {
					source = room;
					break;
				}
			}
		}
		source.source = true;
		candidates.add(source);			
		source.weight = 1;
		
		while (steps_left > 0) {			
			new_room = select_by_weight(candidates);		
			if (new_room === null) { steps_left = 0; } // out of options, might as well quit
			else {			
				steps_left--;
				new_room.region = cur_region;				
				regions[cur_region].add(new_room);
				candidates.remove(new_room);				
				if (on_perimeter(new_room)) perimeter.add(new_room);					
				
				for each (var room in new_room.neighbours()) {		
					if (room.region === new_room.region) {
						if (!on_perimeter(room)) perimeter.remove(room);
					}
					else if (room.region === -1) { // unused neighbour found				
						room.sides++;
						if (candidates.add(room)) { 					
							// something here?
						}

						_bsgen_calc_weight(room, regions[cur_region], blob_size-steps_left, room.h_dist*2, room.v_dist*2);
						//_bsgen_calc_weight(room, 12, 0);
					}			
				}			
			}
		}
				
		adopt_orphaned_rooms(candidates, cur_region);
		total_outer_perimeter = total_outer_perimeter.union(candidates).subtract(regions[cur_region].set);						
		cur_region++;
	
		
		if (total_outer_perimeter.num_rooms() <= 0 || cur_region === 100) done = true;
	}	
	map.isolate_regions();
};

_bsgen_calc_weight = function(room, region, convexity, h_gravity, v_gravity) {
	var center = region.center();	
	room.weight = Math.pow(convexity+1,room.sides) / 
	     ( Math.pow(1 + Math.abs(room.pos.x - center.x), h_gravity) *
		 Math.pow(1 + Math.abs(room.pos.y - center.y), v_gravity) );
}

