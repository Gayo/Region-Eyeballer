gen_garbage = function(map) {
	for (var i=0; i<map.width; i++) {
		for (var j=0; j<map.height; j++) {
			map.rooms[i][j]._down = Math.random() < 0.5;				
			map.rooms[i][j]._right = Math.random() < 0.5;			
		}
	}
};

on_perimeter = function(room) {
	for each (var adj_room in room.neighbours()) {
		if (adj_room.region !== room.region) return true;
	}
	return false;
};

// Randomly chooses a room from the given set with probability proportional to weight.
// Returns null if the set is empty or has no rooms of nonzero weight.
select_by_weight = function(roomset) {	
	var total_weight = 0;
	
	for each (var room in roomset.enumerable()) {
		total_weight += room.weight;
	}	
	if (total_weight <= 0) return null;
	
	var rand = total_weight*Math.random();	
	total_weight = 0;
	
	for each (var room in roomset.enumerable()) {
		total_weight += room.weight;
		if (rand <= total_weight) return room;
	}
	
	return null;
};
