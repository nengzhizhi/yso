var Room = require('../../plugins/room/room.js');

describe("Room", function(){
	// describe("#emptyState", function(){
	// 	it("OK", function(){
	// 		var room = new Room('xxxx-xxxx', 'laoshi', 'xuesheng');
	// 	})
	// })

	// describe("#teacherReadyState", function(){
	// 	it("OK", function(){
	// 		var room = new Room('xxxx-xxxx', 'laoshi', 'xuesheng');
	// 		room.addUser({role: 'teacher', username: 'laoshi'});
	// 	})
	// })

	// describe("#studentReadyState", function(){
	// 	it("OK", function(){
	// 		var room = new Room('xxxx-xxxx', 'laoshi', 'xuesheng');
	// 		room.addUser({role: 'student', username: 'xuesheng'});
	// 	})
	// })

	describe("#answeringState", function(){
		it("OK", function(){
			var room = new Room('xxxx-xxxx', 'laoshi', 'xuesheng');
			room.addUser({role: 'teacher', username: 'laoshi'});
			room.addUser({role: 'student', username: 'xuesheng'});
		})
	})	
})