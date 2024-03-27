
let descriptionsRepo= {};

let currentEnvironment = undefined;

/*
    ICP (Intelligent Choreography Protocol) is a protocol that defines how choreographies are executed.
 */
function TaskInstance( __identity, __taskName, __personality, __context, __user, __spaceURI){

    if(__spaceURI == undefined){
        __spaceURI = currentEnvironment.getSpaceURI();
    }

    if(__user == undefined){
        __user = currentEnvironment.getCurrentUser();
    }

    //identity is a  string of the form "icp://spaceURI:choreographyName:uniqueIdentity"
    function parseIdentity(identity){
        let [protocol, rest] = identity.split("://");
        let spaceURI = __spaceURI;
        let choreographyName;
        let choreographyIdentity;
        let taskIdentity;

        if(undefined === rest){
            choreographyIdentity = currentEnvironment.generateUniqueIdentity()
            choreographyName = protocol;
            __identity = 'icp://${spaceURI}}:${choreographyName}:${choreographyIdentity}:${taskIdentity}';
        } else {
            // Split the rest into choreography name and unique identity
            // Check if the protocol is "icp"
            if (protocol !== "icp") {
                throw new Error("Invalid protocol. Expected 'icp', got '" + protocol + "'");
            }
           [spaceURI, choreographyName, choreographyIdentity, taskIdentity] = rest.split(":");
        }
        return { spaceURI, choreographyName, uniqueIdentity: choreographyIdentity };
    }

    let { _spaceURI, _choreographyName, _uniqueIdentity, _taskIdentity } = parseIdentity(__identity);

    this.run = function(){
        let choreography = descriptionsRepo[__choreographyName];
        let currentTask = choreography[__taskName];
        if(typeof currentTask !== "function"){
            throw new Error("Task name " + __taskName + " not found in choreography " + __choreographyName);
        }
        let taskFunc = currentTask.bind(this);
        try{
            taskFunc(__context, __personality, __user, __spaceURI);
            currentEnvironment.taskExecutionSucceeded(__identity);
        } catch(err){
            currentEnvironment.taskExecutionFailed(__identity, err);
        }
    }
}

exports = {
    initialise: function(environment){
        currentEnvironment = environment;
    },
    define: function(name, choreographyDescription){
        descriptionsRepo[name] = choreographyDescription;
    },

    //__identity, __taskName, __personality, __context, __user, __spaceURI
    getTaskInstance: function(identity, context, personality, user, system){
        return new TaskInstance(name, "start", context, personality, user, system);
    },

}