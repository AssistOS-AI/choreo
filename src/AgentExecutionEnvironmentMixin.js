


function Work(choregraphyId){
    this.tasks = [];
}
function executionCoordinator(){
    let currentInstances = {};
    
    
    this.createSerialWork = function(choregraphyId){
        currentInstances = new Work(choregraphyId);
    }

    this.createParallelWork = function(){
        currentInstances = new Work(choregraphyId);
    }
    
    
}

function AgentExecutionEnvironmentMixin(__user, __spaceURI){
    this.getSpaceURI = function(){
        return __spaceURI;
    }

    this.generateUniqueIdentity = function(){
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    this.getCurrentUser = function(){
        return __user;
    }
    
}


module.export = {
    AgentExecutionEnvironmentMixin: AgentExecutionEnvironmentMixin

}