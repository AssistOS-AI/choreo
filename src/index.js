
let descriptionsRepo= {};

let currentEnvironment = undefined;

function ChoreographyInstance( identity, taskName, personality, context, user, spaceURI){
    let __identity = identity;

    if(undefined == __identity){
        __identity = "agi://default:default";
    }
    let __personality = personality;
    let __task = taskName;
    let __context = context;
    let __user = user;
    let __spaceURI = spaceURI;

    //identity is a  string of the form "agi://choreographyName:uniqueIdentity"
    function parseIdentity(identity){
        let [protocol, rest] = identity.split("://");
        // Split the rest into choreography name and unique identity
        let [choreographyName, uniqueIdentity] = rest.split(":");
        // Check if the protocol is "agi"
        if (protocol !== "agi") {
            throw new Error("Invalid protocol. Expected 'agi', got '" + protocol + "'");
        }
        // Return the choreography name and unique identity
        return { choreographyName, uniqueIdentity };
    }

    let { __choreographyName, __uniqueIdentity } = parseIdentity(identity);

    this.run = function(){
        let choreography = descriptionsRepo[__identity];
        let currentTask = choreography[__choreographyName];
        let taskFunc = currentTask.bind(this);
        try{
            taskFunc(__context, __personality, __user, __spaceURI);
        } catch(err){
            console.log("Unknown error" + err);
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

    start: function(name, context, personality, user, system){
        return new ChoreographyInstance(undefined, name, "start", context, personality, user, system).run();
    },

}