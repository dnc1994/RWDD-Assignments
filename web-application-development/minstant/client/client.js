Meteor.subscribe('chats');
Meteor.subscribe('users');

Router.configure({
    layoutTemplate: 'ApplicationLayout'
});
// specify the top level route, the page users see when they arrive at the site
Router.route('/', function () {
    console.log("rendering root /");
    this.render("navbar", {to:"header"});
    this.render("lobby_page", {to:"main"});
});

// specify a route that allows the current user to chat to another users
Router.route('/chat/:_id', function () {
    // the user they want to chat to has id equal to 
    // the id sent in after /chat/... 
    var otherUserId = this.params._id;
    // find a chat that has two users that match current user id
    // and the requested user id
    var filter = {
        $or: [
            {user1Id: Meteor.userId(), user2Id: otherUserId},
            {user2Id: Meteor.userId(), user1Id: otherUserId}
        ]
    };
    var chat = Chats.findOne(filter);
    if (!chat) {// no chat matching the filter - need to insert a new one
        console.log('No chat history found');
        chatId = Chats.insert({user1Id: Meteor.userId(), user2Id: otherUserId});
    }
    else {// there is a chat going already - use that. 
        chatId = chat._id;
    }
    if (chatId) {// looking good, save the id to the session
        Session.set("chatId",chatId);
    }
    this.render("navbar", {to:"header"});
    this.render("chat_page", {to:"main"});
});

///
// helper functions
///

Template.available_user_list.helpers({
    users:function(){
        return Meteor.users.find();
    }
});

Template.available_user.helpers({
    getUsername:function(userId){
        user = Meteor.users.findOne({_id: userId});
        return user.profile.username;
    },
    isMyUser:function(userId){
        if (userId == Meteor.userId()) {
            return true;
        }
        else {
            return false;
        }
    }
});

Template.chat_message.helpers({
    getUsername: function(userId){
        user = Meteor.users.findOne({_id: userId});
        return user.profile.username;
    },
    getAvatar: function(userId){
        user = Meteor.users.findOne({_id: userId});
        return user.profile.avatar;
    }
});

Template.chat_page.helpers({
    messages:function(){
        return Chats.findOne({_id:Session.get("chatId")}).messages;
    },
    other_user:function(){
        return ""
    }
});

Template.chat_page.events({
    // this event fires when the user sends a message on the chat page
    'submit .js-send-chat':function(event){
        // stop the form from triggering a page reload
        event.preventDefault();
        // see if we can find a chat object in the database
        // to which we'll add the message
        var chat = Chats.findOne({_id:Session.get("chatId")});
        if (chat) {// ok - we have a chat to use
            var msgs = chat.messages; // pull the messages property
            if (!msgs) {// no messages yet, create a new array
                msgs = [];
            }
            // is a good idea to insert data straight from the form
            // (i.e. the user) into the database?? certainly not.
            // push adds the message to the end of the array
            msgs.push({text: event.target.chat.value, sender_id: Meteor.userId()});
            // reset the form
            event.target.chat.value = "";
            // put the messages array onto the chat object
            // update the chat object in the database.
            Chats.update({"_id": chat._id}, {$set: {"messages": msgs}});
        }
    }
});
