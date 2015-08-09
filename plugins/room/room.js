
//---------------------------------------------------------------------------
function emptyState(room){
	var self = this;
	self.room = room;
	self.name = 'emptyState';

	self.addUser = function(user){
		if (user.role == 'teacher' && user.username == self.room.teacher) {
			self.room.setState(self.room.teacherReadyState);
			return true;
		} else if (user.role == 'student' && user.username == self.room.student) {
			self.room.setState(self.room.studentReadyState);
			return true;
		}
		return false;
	}

	self.removeUser = function(user){
		return false;
	}
}


//---------------------------------------------------------------------------
function teacherReadyState(room){
	var self = this;
	self.room = room;
	self.name = 'teacherReadyState';

	self.addUser = function(user){
		if (user.role == 'student' && user.username == self.room.student) {
			self.room.setState(self.room.answeringState);
			return true;
		}
		return false;
	}

	self.removeUser = function(user){
		return false;
	}
}


//----------------------------------------------------------------------------
function studentReadyState(room){
	var self = this;	
	self.room = room;
	self.name = 'studentReadyState';

	self.addUser = function(user){
		if (user.role == 'teacher' && user.username == self.room.teacher) {
			self.room.setState(self.room.answeringState);
			return true;
		}
		return false;
	}

	self.removeUser = function(user){
		return false;
	}
}

//---------------------------------------------------------------------------
function answeringState(room){
	var self = this;	
	self.room = room;
	self.name = 'answeringState';

	self.addUser = function(user){
		return false;
	}

	self.removeUser = function(user){
		return false;
	}
}
//---------------------------------------------------------------------------

function Room(roomID, teacher, student){
	var self = this;
	self.roomID = roomID;
	self.teacher = teacher;
	self.student = student;
	self.users = [];

	self.addUser = function(user){
		if (self.state.addUser(user)){
			self.users.push(user);
			return true;
		}
		return false;
	}

	self.removeUser = function(user){
		if (self.state.removeUser(user)){
			self.users.splice(user, 1);
			return true;
		}
		return false;
	}

	self.interrupt = function(token){
		return false;
	}

	self.setState = function(state){
		self.state = state;
	}

	self.getState = function(){
		return self.state;
	}

	self.emptyState = new emptyState(self);
	self.teacherReadyState = new teacherReadyState(self);
	self.studentReadyState = new studentReadyState(self);
	self.answeringState = new answeringState(self);

	self.state = self.emptyState;	
}

module.exports = Room;