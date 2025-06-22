const pollState = {
    currentPoll: null,
    answers: {},
    timeout:null,
    history:[]
}



function createPoll(question,options,duration){
    pollState.currentPoll = {
        question: question,
        options: options,
        createdAt: Date.now(),
        duration: duration
    };
    pollState.answers = {};
}



function submitAnswer(userId, answer) {
    if (!pollState.currentPoll) {
        throw new Error("No active poll");
    }
    if (!pollState.answers[userId]) {
        pollState.answers[userId] = [];
    }
    pollState.answers[userId].push(answer);
}


function getPollResults(){
    const results = {}
    const poll = pollState.currentPoll;
    if(!poll)return results;


    for(const option of poll.options){
        results[option] = 0;
    }

    for(const answer of Object.values(pollState.answers)){
        for(const option of answer){
            if(results[option] !== undefined){
                results[option]++;
            }
        }
    }


    return results;
}




function resetPoll(){
    const results = getPollResults();
    if(pollState.currentPoll){
        pollState.history.push({
            ...pollState.currentPoll,
            results: results,
            endedAt: Date.now(),
        })
    }

    pollState.currentPoll = null;
    pollState.answers = {};
    clearTimeout(pollState.timeout);
    pollState.timeout = null;
}


function getHistory() {
    return pollState.history;
}



export {
    pollState,
    createPoll,
    submitAnswer,
    getPollResults,
    resetPoll,
    getHistory
}