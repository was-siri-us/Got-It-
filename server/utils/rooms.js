export const rooms = {};

// refers to creators socketId
export function createRoom(socketId,username,roomId){
    if(rooms[roomId])return false;

    rooms[roomId] = {
        creator:{name:username,socketId:socketId},
        students:{},
        currentPoll : null,
        pollResults: {},
        history: [],
        timeout:null,
    };
    return true;
}


export function getRoom(roomId){
    return rooms[roomId] || null;
}

export function createPoll(roomId,question,options,duration){
    const room = rooms[roomId];
    if(!room)throw new Error("Room not found");
    room.currentPoll = {
        question: question,
        options: options,
        createdAt: Date.now(),
        duration: duration
    }

    room.pollResults = {};
    room.timeout = null;


    for(const option of options){
        room.pollResults[option] = 0;
    }


    for(const studentId in room.students){
        room.students[studentId].hasAnswered = false;
    }
}

export function getPollResults(roomId){
    const room = rooms[roomId];
    return room?.pollResults || {};
}


export function endPoll(roomId){
    const room = rooms[roomId];
    if(!room || !room.currentPoll)return;

    const results = getPollResults(roomId);
    room.history.push({...room.currentPoll,results,endedAt:Date.now()});
    console.log(`Poll ended in room ${roomId}:`, results);
    room.currentPoll = null;
    room.pollResults = {};
    clearTimeout(room.timeout);
    room.timeout = null;
}